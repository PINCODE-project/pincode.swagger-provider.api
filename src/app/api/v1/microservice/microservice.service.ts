import {
    BadRequestException,
    ConflictException,
    forwardRef,
    Inject,
    Injectable,
    NotFoundException,
} from "@nestjs/common";
import { MicroserviceType, SchemeUpdateType } from "@prisma";
import axios from "axios";

import { CreateMicroserviceDto } from "./dto/create-microservice.dto";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { isExistById } from "@/common/utils/check-exist";
import { GetMicroserviceDto } from "@/api/v1/microservice/dto/get-microservice.dto";
import { UpdateMicroserviceDto } from "@/api/v1/microservice/dto/update-microservice.dto";
import { RefreshMicroserviceDto } from "@/api/v1/microservice/dto/refresh-microservice.dto";
import { OpenApiDiff } from "@/common/utils/openapi-diff.util";
import { ChangelogFormatter } from "@/common/utils/changelog-formatter.util";
import { BotService } from "@/bot/bot.service";

@Injectable()
export class MicroserviceService {
    public constructor(
        private readonly prismaService: PrismaService,
        @Inject(forwardRef(() => BotService))
        private readonly botService: BotService,
    ) {}

    async create(dto: CreateMicroserviceDto) {
        if (!(await isExistById(this.prismaService.project, dto.projectId))) {
            throw new BadRequestException("Project not found!");
        }

        const microserviceExist = await this.prismaService.microservice.findFirst({
            where: {
                projectId: dto.projectId,
                name: dto.name,
            },
        });

        if (microserviceExist) {
            throw new ConflictException("The microservice already exists!");
        }

        const microservice = await this.prismaService.microservice.create({
            data: {
                name: dto.name,
                type: dto.type,
                projectId: dto.projectId ?? null,
                url: dto.type === MicroserviceType.URL ? dto.content : undefined,
                isUpdateByGetScheme: dto.isUpdateByGetScheme,
            },
        });

        let cache: string | undefined;

        // Если это URL микросервис и передан content (URL), получаем схему
        if (dto.type === MicroserviceType.URL && dto.content) {
            try {
                // Получаем схему БЕЗ добавления серверов - сохраняем оригинал
                cache = await this.fetchSchemaFromUrl(dto.content);
            } catch (error) {
                console.error("Error fetching schema during creation:", error);
                // Продолжаем без cache если не удалось получить схему
            }
        }

        const scheme = await this.createSchemeVersion(
            microservice.id,
            SchemeUpdateType.INIT,
            dto.content ?? "",
            cache,
            -1, // version будет 0
        );

        return { ...microservice, content: scheme.content };
    }

    async findOne(dto: GetMicroserviceDto, userId: string) {
        const result = {};

        const microservice = await this.prismaService.microservice.findUnique({
            where: { id: dto.id },
            include: {
                project: true,
                servers: true,
                schemes: {
                    orderBy: {
                        version: "desc",
                    },
                    take: 1,
                },
            },
        });

        if (!microservice) {
            throw new BadRequestException("Microservice not found!");
        }

        const schemeEntity = microservice["schemes"][0];

        const project = await this.prismaService.project.findUnique({
            where: { id: microservice.projectId },
        });

        const workspace = await this.prismaService.workspace.findUnique({
            where: { id: project!.workspaceId },
        });

        const workspaceMember = await this.prismaService.workspaceMember.findFirst({
            where: { workspaceId: workspace!.id, userId: userId },
        });

        if (!workspaceMember) {
            throw new BadRequestException("The user is not a member of this workspace!");
        }

        const servers = microservice.servers.map((server) => ({ url: server.url, description: server.description }));

        result["id"] = microservice.id;
        result["name"] = microservice.name;
        result["type"] = microservice.type;
        result["url"] = schemeEntity.content;
        result["createdAt"] = microservice.createdAt;
        result["updatedAt"] = microservice.updatedAt;
        result["projectId"] = microservice.projectId;
        result["servers"] = microservice.servers;
        result["version"] = schemeEntity.version;

        if (microservice.type === MicroserviceType.URL) {
            try {
                // Получаем оригинальную схему БЕЗ добавления серверов из БД
                const originalScheme = await this.fetchSchemaFromUrl(schemeEntity.content!);

                result["status"] = "ONLINE";

                // Определяем какую схему использовать (оригинальную или из кэша)
                let schemeToUse = microservice.isUpdateByGetScheme ? originalScheme : schemeEntity.cache;

                // Проверяем, изменилась ли схема
                if (microservice.isUpdateByGetScheme && schemeEntity.cache !== originalScheme) {
                    const newVersion = await this.createSchemeVersion(
                        microservice.id,
                        SchemeUpdateType.GET_REQUEST,
                        schemeEntity.content ?? "",
                        originalScheme,
                        schemeEntity.version,
                    );
                    result["version"] = newVersion.version;

                    // Отправляем уведомление в Telegram
                    if (schemeEntity.cache) {
                        const telegramAccount = await this.prismaService.userTelegramAccounts.findFirst({
                            where: { userId: userId },
                        });

                        if (telegramAccount) {
                            await this.generateAndSendChangelog(
                                schemeEntity.cache,
                                originalScheme,
                                microservice.name,
                                newVersion.version,
                                telegramAccount.telegramId,
                            );
                        }
                    }

                    schemeToUse = originalScheme;
                }

                // Добавляем серверы из БД к оригинальной схеме только при отдаче клиенту
                result["content"] = this.addServersToSchema(schemeToUse!, servers);
            } catch (error) {
                result["status"] = "OFFLINE";
                if (schemeEntity.cache) {
                    // Даже для кэша добавляем серверы из БД
                    result["content"] = this.addServersToSchema(schemeEntity.cache, servers);
                } else {
                    result["content"] = error.message;
                }
            }
        } else if (microservice.type === MicroserviceType.TEXT) {
            let content: any = { servers: [] };
            try {
                content = JSON.parse(schemeEntity.content!);
                // Сохраняем оригинальные серверы и добавляем серверы из БД
                const originalServers = content.servers || [];
                content.servers = [...originalServers, ...servers];
            } catch (error) {
                content = error.message;
            }

            result["url"] = "";
            result["content"] = JSON.stringify(content);
            result["status"] = "UNKNOWN";
        }

        return { microservice: result };
    }

    async update(id: string, dto: UpdateMicroserviceDto, userId: string) {
        // Проверяем доступ пользователя к микросервису
        await this.checkWorkspaceAccess(id, userId);

        const microservice = await this.prismaService.microservice.findUnique({
            where: { id },
        });

        if (!microservice) {
            throw new NotFoundException("Microservice not found!");
        }

        // Проверяем, что новое имя не конфликтует с другими микросервисами в проекте
        if (dto.name && dto.name !== microservice.name) {
            const existingMicroservice = await this.prismaService.microservice.findFirst({
                where: {
                    projectId: microservice.projectId,
                    name: dto.name,
                    id: { not: id },
                },
            });

            if (existingMicroservice) {
                throw new ConflictException("A microservice with this name already exists in the project!");
            }
        }

        // Обновляем микросервис
        const updatedMicroservice = await this.prismaService.microservice.update({
            where: { id },
            data: {
                ...(dto.name && { name: dto.name }),
                ...(dto.type && { type: dto.type }),
                ...(dto.isUpdateByGetScheme !== undefined && { isUpdateByGetScheme: dto.isUpdateByGetScheme }),
            },
        });

        // Если обновляется content, создаём новую схему
        if (dto.content) {
            const lastScheme = await this.getLatestScheme(id);

            let cache: string | undefined;

            // Если это URL микросервис, получаем схему по URL
            if (updatedMicroservice.type === MicroserviceType.URL) {
                try {
                    // Получаем оригинальную схему БЕЗ добавления серверов из БД
                    cache = await this.fetchSchemaFromUrl(dto.content);
                } catch (error) {
                    console.error("Error fetching schema during update:", error);
                    // Продолжаем без cache если не удалось получить схему
                }
            }

            await this.createSchemeVersion(id, SchemeUpdateType.MANUAL, dto.content, cache, lastScheme?.version ?? -1);
        }

        // Получаем последнюю схему для ответа
        const latestScheme = await this.getLatestScheme(id);

        return {
            microservice: {
                ...updatedMicroservice,
                content: latestScheme?.content,
            },
        };
    }

    async remove(id: string, userId: string) {
        // Проверяем доступ пользователя к микросервису
        await this.checkWorkspaceAccess(id, userId);

        // Удаляем микросервис (каскадно удалятся связанные schemes и servers)
        await this.prismaService.microservice.delete({
            where: { id },
        });

        return {
            success: true,
            message: "Microservice deleted successfully",
        };
    }

    async refresh(dto: RefreshMicroserviceDto) {
        // Проверяем существование микросервиса
        const microservice = await this.prismaService.microservice.findUnique({
            where: { id: dto.id },
        });

        if (!microservice) {
            throw new NotFoundException("Microservice not found!");
        }

        // Проверяем тип микросервиса - для TEXT нельзя обновить схему
        if (microservice.type === MicroserviceType.TEXT) {
            throw new BadRequestException("Cannot refresh schema for TEXT type microservice!");
        }

        // Получаем последнюю версию схемы
        const lastScheme = await this.getLatestScheme(dto.id);

        if (!lastScheme || !lastScheme.content) {
            throw new BadRequestException("No schema URL found for this microservice!");
        }

        // Делаем запрос к URL микросервиса для получения оригинальной схемы
        try {
            // Получаем оригинальную схему БЕЗ добавления серверов из БД
            const newScheme = await this.fetchSchemaFromUrl(lastScheme.content);

            // Сравниваем с кешем последней схемы (оригинальные схемы)
            if (lastScheme.cache === newScheme) {
                return {
                    success: true,
                    message: "Schema has not changed",
                    version: lastScheme.version,
                    updated: false,
                };
            }

            // Схема изменилась - сравниваем и генерируем changelog
            const { changelog, summary } = this.generateChangelog(
                lastScheme.cache,
                newScheme,
                microservice.name,
                lastScheme.version + 1,
            );

            // Создаём новую версию
            const newVersion = await this.createSchemeVersion(
                microservice.id,
                SchemeUpdateType.WEBHOOK,
                lastScheme.content,
                newScheme,
                lastScheme.version,
            );

            // Отправляем уведомления всем участникам workspace
            if (changelog) {
                await this.notifyWorkspaceMembers(microservice.projectId, changelog);
            }

            return {
                success: true,
                message: "Schema updated successfully",
                version: newVersion.version,
                updated: true,
                changelog,
                summary,
            };
        } catch (error) {
            throw new BadRequestException(`Failed to fetch schema: ${error.message}`);
        }
    }

    /**
     * Получает оригинальную схему по URL БЕЗ добавления серверов из БД
     */
    private async fetchSchemaFromUrl(url: string): Promise<string> {
        const response = await axios(url, {
            auth: {
                username: "Admin",
                password: "P@ssw0rd",
            },
        });

        // Возвращаем оригинальную схему как есть
        return JSON.stringify(response.data);
    }

    /**
     * Добавляет серверы из БД к схеме (только для отдачи клиенту)
     */
    private addServersToSchema(
        schemaJson: string,
        dbServers: Array<{ url: string; description: string | null }>,
    ): string {
        try {
            const schema = JSON.parse(schemaJson);
            const originalServers = schema.servers || [];
            // Объединяем оригинальные серверы и серверы из БД
            schema.servers = [...originalServers, ...dbServers];
            return JSON.stringify(schema);
        } catch (error) {
            console.error("Error adding servers to schema:", error);
            return schemaJson;
        }
    }

    /**
     * Получает серверы микросервиса
     */
    private async getMicroserviceServers(microserviceId: string) {
        return this.prismaService.server.findMany({
            where: { microserviceId },
            select: { url: true, description: true },
        });
    }

    /**
     * Проверяет доступ пользователя к микросервису через workspace
     */
    private async checkWorkspaceAccess(microserviceId: string, userId: string): Promise<void> {
        const microservice = await this.prismaService.microservice.findUnique({
            where: { id: microserviceId },
            include: {
                project: {
                    include: {
                        workspace: true,
                    },
                },
            },
        });

        if (!microservice) {
            throw new NotFoundException("Microservice not found!");
        }

        const workspaceMember = await this.prismaService.workspaceMember.findFirst({
            where: {
                workspaceId: microservice.project.workspace.id,
                userId: userId,
            },
        });

        if (!workspaceMember) {
            throw new BadRequestException("The user is not a member of this workspace!");
        }
    }

    /**
     * Получает последнюю схему микросервиса
     */
    private async getLatestScheme(microserviceId: string) {
        return this.prismaService.scheme.findFirst({
            where: { microserviceId },
            orderBy: { version: "desc" },
        });
    }

    /**
     * Генерирует changelog и отправляет уведомление в Telegram
     */
    private async generateAndSendChangelog(
        oldCache: string | null,
        newScheme: string,
        microserviceName: string,
        newVersion: number,
        telegramId: number,
    ): Promise<string | undefined> {
        if (!oldCache) return undefined;

        try {
            const diff = OpenApiDiff.compare(oldCache, newScheme);
            if (diff.hasChanges) {
                const changelog = ChangelogFormatter.formatForTelegram(diff, microserviceName, newVersion);
                await this.botService.sendSchemaUpdateNotification(telegramId, changelog);
                return changelog;
            }
        } catch (error) {
            console.error("Error generating changelog:", error);
        }

        return undefined;
    }

    /**
     * Генерирует changelog без отправки уведомления
     */
    private generateChangelog(
        oldCache: string | null,
        newScheme: string,
        microserviceName: string,
        newVersion: number,
    ): { changelog?: string; summary?: { added: number; removed: number; modified: number } } {
        if (!oldCache) return {};

        try {
            const diff = OpenApiDiff.compare(oldCache, newScheme);
            if (diff.hasChanges) {
                const changelog = ChangelogFormatter.formatForTelegram(diff, microserviceName, newVersion);
                return { changelog, summary: diff.summary };
            }
        } catch (error) {
            console.error("Error generating changelog:", error);
        }

        return {};
    }

    /**
     * Отправляет уведомления всем участникам workspace
     */
    private async notifyWorkspaceMembers(projectId: string, changelog: string): Promise<void> {
        const project = await this.prismaService.project.findUnique({
            where: { id: projectId },
        });

        if (!project) return;

        const workspaceMembers = await this.prismaService.workspaceMember.findMany({
            where: { workspaceId: project.workspaceId },
            include: {
                user: {
                    include: {
                        telegram_accounts: true,
                    },
                },
            },
        });

        const telegramIds: number[] = [];

        workspaceMembers.forEach((member) => {
            if (member.user?.telegram_accounts) {
                member.user.telegram_accounts.forEach((account) => {
                    telegramIds.push(account.telegramId);
                });
            }
        });

        if (telegramIds.length > 0) {
            await this.botService.sendSchemaUpdateNotificationToMultiple(telegramIds, changelog);
        }
    }

    /**
     * Создает новую версию схемы с кешем
     */
    private async createSchemeVersion(
        microserviceId: string,
        updateType: SchemeUpdateType,
        content: string,
        cache: string | undefined,
        currentVersion: number,
    ) {
        return this.prismaService.scheme.create({
            data: {
                updateType,
                content,
                cache,
                version: currentVersion + 1,
                microserviceId,
            },
        });
    }
}
