import { BadRequestException, Injectable } from "@nestjs/common";
import { WorkspaceMemberRole } from "@prisma/__generated__";

import { CreateWorkspaceDto } from "./dto/create-workspace.dto";

import { PrismaService } from "@/prisma/prisma.service";
import { AddMemberToWorkspaceDto } from "@/workspace/dto/add-member-to-workspace.dto";
import { isExistById } from "@/libs/common/utils/check-exist";
import { FindWorkspaceDto } from "@/workspace/dto/find-workspace.dto";

@Injectable()
export class WorkspaceService {
    public constructor(private readonly prismaService: PrismaService) {}

    async create(dto: CreateWorkspaceDto, ownerId: string) {
        const workspace = await this.prismaService.workspace.create({
            data: {
                name: dto.name,
                emoji: dto.emoji ?? "",
                description: dto.description ?? "",
            },
        });

        await this.addMemberToWorkspace({
            userId: ownerId,
            workspaceId: workspace.id,
            role: WorkspaceMemberRole.SUPERADMIN,
        });

        return { workspace };
    }

    async addMemberToWorkspace(dto: AddMemberToWorkspaceDto) {
        if (!(await isExistById(this.prismaService.user, dto.userId))) {
            throw new BadRequestException("Пользователь не найден");
        }

        if (!(await isExistById(this.prismaService.workspace, dto.workspaceId))) {
            throw new BadRequestException("Рабочее пространство не найдено");
        }

        const hasWorkspaceMember = await this.prismaService.workspaceMember.findMany({
            where: {
                userId: dto.userId,
                workspaceId: dto.workspaceId,
            },
        });

        if (hasWorkspaceMember.length > 0) {
            new BadRequestException("Пользователь уже состоит в этом рабочем пространстве");
        }

        const workspaceMember = await this.prismaService.workspaceMember.create({
            data: {
                userId: dto.userId,
                workspaceId: dto.workspaceId,
                role: dto.role,
            },
        });

        return workspaceMember;
    }

    async findAll(userId: string) {
        const workspaces = await this.prismaService.workspace.findMany({
            where: {
                members: {
                    some: {
                        userId: userId,
                    },
                },
            },
            include: {
                members: {
                    select: {
                        userId: true,
                        role: true,
                    },
                },
            },
        });

        return { workspaces };
    }

    async findOne(dto: FindWorkspaceDto, userId: string) {
        const workspace = await this.prismaService.workspace.findFirst({
            where: {
                id: dto.id,
            },
            include: {
                members: {
                    select: {
                        userId: true,
                        role: true,
                    },
                },
            },
        });

        if (!workspace) {
            throw new BadRequestException("Рабочее пространство не найдено");
        }

        const workspaceMember = await this.prismaService.workspaceMember.findFirst({
            where: {
                userId: userId,
                workspaceId: dto.id,
            },
        });

        if (!workspaceMember) {
            throw new BadRequestException("Пользователь не состоит в пространстве");
        }

        return { workspace };
    }
}
