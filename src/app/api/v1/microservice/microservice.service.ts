import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { MicroserviceType, SchemeUpdateType } from "@prisma";
import axios from "axios";

import { CreateMicroserviceDto } from "./dto/create-microservice.dto";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { isExistById } from "@/common/utils/check-exist";
import { GetMicroserviceDto } from "@/api/v1/microservice/dto/get-microservice.dto";


@Injectable()
export class MicroserviceService {
    public constructor(
        private readonly prismaService: PrismaService,
    ) {
    }

    async create(dto: CreateMicroserviceDto) {
        if (!(await isExistById(this.prismaService.project, dto.projectId))) {
            throw new BadRequestException("Project not found!");
        }

        const microserviceExist = await this.prismaService.microservice.findFirst({
            where: {
                projectId: dto.projectId,
                name: dto.name
            },
        });

        if(microserviceExist) {
            throw new ConflictException("The microservice already exists!");
        }

        const microservice = await this.prismaService.microservice.create({
            data: {
                name: dto.name,
                type: dto.type,
                projectId: dto.projectId ?? null,
                isUpdateByGetScheme: dto.isUpdateByGetScheme,
            },
        });

        const scheme = await this.prismaService.scheme.create({
            data: {
                updateType: SchemeUpdateType.INIT,
                content: dto.content ?? "",
                version: 0,
                microserviceId: microservice.id,
            },
        });

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

        if(!microservice) {
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
                const response = await axios(schemeEntity.content!, {
                    auth: {
                        username: "Admin",
                        password: "P@ssw0rd",
                    },
                });

                response.data.servers = servers;

                const scheme = JSON.stringify(response.data);

                result["status"] = "ONLINE";
                result["content"] = microservice.isUpdateByGetScheme ? scheme : schemeEntity.cache;

                if (microservice.isUpdateByGetScheme && schemeEntity.cache !== scheme) {
                    const newVersion = await this.prismaService.scheme.create({
                        data: {
                            updateType: SchemeUpdateType.GET_REQUEST,
                            content: schemeEntity.content ?? "",
                            cache: scheme,
                            version: schemeEntity.version + 1,
                            microserviceId: microservice.id,
                        },
                    });
                    result["version"] = newVersion.version;
                }
            } catch (error) {
                result["status"] = "OFFLINE";
                if (schemeEntity.cache) result["content"] = schemeEntity.cache;
                else result["content"] = error.message;
            }
        } else if (microservice.type === MicroserviceType.TEXT) {
            let content: any = { servers: [] };
            try {
                content = JSON.parse(schemeEntity.content!);
                content.servers = [...content.servers, servers];
            } catch (error) {
                content = error.message;
            }

            result["url"] = "";
            result["content"] = JSON.stringify(content);
            result["status"] = "UNKNOWN";
        }

        return { microservice: result };
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
