import { BadRequestException, Injectable } from "@nestjs/common";

import { CreateMicroserviceDto } from "./dto/create-microservice.dto";

import { PrismaService } from "@/prisma/prisma.service";
import { isExistById } from "@/libs/common/utils/check-exist";
import { GetMicroserviceDto } from "@/microservice/dto/get-microservice.dto";
import { MicroserviceType } from "@prisma/__generated__";
import axios from "axios";

@Injectable()
export class MicroserviceService {
    public constructor(private readonly prismaService: PrismaService) {}

    async create(dto: CreateMicroserviceDto) {
        if (!(await isExistById(this.prismaService.project, dto.projectId))) {
            throw new BadRequestException("Проект не найден");
        }

        const microservice = await this.prismaService.microservice.create({
            data: {
                name: dto.name,
                type: dto.type,
                content: dto.content ?? "",
                projectId: dto.projectId ?? null,
            },
        });

        return microservice;
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
            },
        });

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
        result["url"] = microservice.content;
        result["createdAt"] = microservice.createdAt;
        result["updatedAt"] = microservice.updatedAt;
        result["projectId"] = microservice.projectId;
        result["servers"] = microservice.servers;

        if (microservice.type === MicroserviceType.URL) {
            try {
                const response = await axios(microservice.content, {
                    auth: {
                        username: "Admin",
                        password: "P@ssw0rd",
                    },
                });

                response.data.servers = servers;

                const scheme = JSON.stringify(response.data);

                result["status"] = "ONLINE";
                result["content"] = scheme;

                await this.prismaService.microservice.update({
                    where: { id: microservice.id },
                    data: {
                        cache: scheme,
                    },
                });
            } catch (error) {
                result["status"] = "OFFLINE";
                if (microservice.cache) result["content"] = microservice.cache;
                else result["content"] = error.message;
            }
        } else if (microservice.type === MicroserviceType.TEXT) {
            let content = null;
            try {
                content = JSON.parse(microservice.content);
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
