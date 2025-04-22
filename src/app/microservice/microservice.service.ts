import { BadRequestException, Injectable } from "@nestjs/common";
import { MicroserviceType, OpenApiSchemeUpdateType } from "@prisma/__generated__";
import axios from "axios";

import { CreateMicroserviceDto } from "./dto/create-microservice.dto";

import { PrismaService } from "@/prisma/prisma.service";
import { isExistById } from "@/libs/common/utils/check-exist";
import { GetMicroserviceDto } from "@/microservice/dto/get-microservice.dto";
import { OpenapiSchemeService } from "@/openapi-scheme/openapi-scheme.service";

@Injectable()
export class MicroserviceService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly openapiSchemeService: OpenapiSchemeService,
    ) {}

    async create(dto: CreateMicroserviceDto) {
        if (!(await isExistById(this.prismaService.project, dto.projectId))) {
            throw new BadRequestException("Проект не найден");
        }

        const microservice = await this.prismaService.microservice.create({
            data: {
                name: dto.name,
                type: dto.type,
                projectId: dto.projectId ?? null,
                isUpdateByGetScheme: dto.isUpdateByGetScheme,
            },
        });

        const scheme = await this.prismaService.openApiScheme.create({
            data: {
                updateType: OpenApiSchemeUpdateType.INIT,
                content: dto.content ?? "",
                version: 0,
                microserviceId: microservice.id,
            },
        });

        return { ...microservice, content: scheme.content };
    }

    // findAll() {
    //     return `This action returns all microservice`;
    // }
    //

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
        const openapiScheme = microservice["schemes"][0];

        if (!microservice) {
            throw new BadRequestException("Микросервис не найден");
        }

        const project = await this.prismaService.project.findUnique({
            where: { id: microservice.projectId },
        });

        const workspace = await this.prismaService.workspace.findUnique({
            where: { id: project.workspaceId },
        });

        const workspaceMember = await this.prismaService.workspaceMember.findFirst({
            where: { workspaceId: workspace.id, userId: userId },
        });

        if (!workspaceMember) {
            throw new BadRequestException("Пользователь не состоит в пространстве");
        }

        const servers = microservice.servers.map((server) => ({ url: server.url, description: server.description }));

        result["id"] = microservice.id;
        result["name"] = microservice.name;
        result["type"] = microservice.type;
        result["url"] = openapiScheme.content;
        result["createdAt"] = microservice.createdAt;
        result["updatedAt"] = microservice.updatedAt;
        result["projectId"] = microservice.projectId;
        result["servers"] = microservice.servers;
        result["version"] = openapiScheme.version;

        if (microservice.type === MicroserviceType.URL) {
            try {
                const response = await axios(openapiScheme.content, {
                    auth: {
                        username: "Admin",
                        password: "P@ssw0rd",
                    },
                });

                response.data.servers = servers;

                const scheme = JSON.stringify(response.data);

                result["status"] = "ONLINE";
                result["content"] = microservice.isUpdateByGetScheme ? scheme : openapiScheme.cache;

                if (microservice.isUpdateByGetScheme && openapiScheme.cache !== scheme) {
                    const newVersion = await this.prismaService.openApiScheme.create({
                        data: {
                            updateType: OpenApiSchemeUpdateType.GET_REQUEST,
                            content: openapiScheme.content ?? "",
                            cache: scheme,
                            version: openapiScheme.version + 1,
                            microserviceId: microservice.id,
                        },
                    });
                    result["version"] = newVersion.version;
                }
            } catch (error) {
                result["status"] = "OFFLINE";
                if (openapiScheme.cache) result["content"] = openapiScheme.cache;
                else result["content"] = error.message;
            }
        } else if (microservice.type === MicroserviceType.TEXT) {
            let content = null;
            try {
                content = JSON.parse(openapiScheme.content);
                content.servers = [...content.servers, servers];
            } catch (error) {
                content = error.message;
            }

            result["url"] = "";
            result["content"] = JSON.stringify(content);
            result["status"] = "UNKNOWN";
        }

        return result;
    }

    //
    // update(id: number, updateMicroserviceDto: UpdateMicroserviceDto) {
    //     return `This action updates a #${id} microservice`;
    // }
    //
    // remove(id: number) {
    //     return `This action removes a #${id} microservice`;
    // }
}
