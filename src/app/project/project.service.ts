import { BadRequestException, Injectable } from "@nestjs/common";

import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

import { PrismaService } from "@/prisma/prisma.service";
import { FindAllProjectByWorkspaceDto } from "@/project/dto/find-all-project-by-workspace.dto";
import { isExistById } from "@/libs/common/utils/check-exist";

@Injectable()
export class ProjectService {
    public constructor(private readonly prismaService: PrismaService) {}

    async create(dto: CreateProjectDto, ownerId: string) {
        if (!(await isExistById(this.prismaService.workspace, dto.workspaceId))) {
            throw new BadRequestException("Пространство не найдено");
        }

        const workspaceMember = await this.prismaService.workspaceMember.findFirst({
            where: {
                workspaceId: dto.workspaceId,
                userId: ownerId,
            },
        });

        if (!workspaceMember) {
            throw new BadRequestException("Пользователь не состоит в пространстве");
        }

        const project = await this.prismaService.project.create({
            data: {
                name: dto.name,
                emoji: dto.emoji ?? "",
                description: dto.description ?? "",
                workspaceId: dto.workspaceId,
            },
        });

        return { project };
    }

    async findAllByWorkspace(dto: FindAllProjectByWorkspaceDto, userId: string) {
        const workspaceMember = await this.prismaService.workspaceMember.findFirst({
            where: {
                workspaceId: dto.workspaceId,
                userId: userId,
            },
        });

        if (!workspaceMember) {
            throw new BadRequestException("Пользователь не состоит в пространстве");
        }

        const projects = await this.prismaService.project.findMany({
            where: {
                workspaceId: dto.workspaceId,
            },
            include: {
                microservices: {
                    select: {
                        id: true,
                        name: true,
                        type: true,
                    },
                },
            },
        });

        return { projects };
    }
}
