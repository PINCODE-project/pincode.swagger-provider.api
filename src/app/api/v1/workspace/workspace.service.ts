import { BadRequestException, ConflictException, ForbiddenException, Injectable } from "@nestjs/common";

import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { WorkspaceMemberRole } from "@prisma";
import { AddMemberToWorkspaceDto } from "./dto/add-member-to-workspace.dto";
import { isExistById } from "@/common/utils/check-exist";
import { FindWorkspaceDto } from "./dto/find-workspace.dto";

@Injectable()
export class WorkspaceService {
    public constructor(private readonly prismaService: PrismaService) {
    }

    async create(dto: CreateWorkspaceDto, ownerId: string) {
        const workspaceExist = await this.prismaService.workspace.findFirst({
            where: {
                name: dto.name,
                members: {
                    some: {
                        userId: ownerId,
                    },
                },
            },
        });

        if (workspaceExist) throw new BadRequestException("Workspace with this name already exists!");

        const workspace = await this.prismaService.workspace.create({
            data: {
                name: dto.name,
                icon: dto.icon ?? "",
                description: dto.description ?? "",
            },
        });

        await this.addMemberToWorkspace({
            userId: ownerId,
            workspaceId: workspace.id,
            role: WorkspaceMemberRole.SUPERADMIN,
        });

        return workspace;
    }

    async addMemberToWorkspace(dto: AddMemberToWorkspaceDto) {
        if (!(await isExistById(this.prismaService.user, dto.userId))) {
            throw new BadRequestException("User not found!");
        }

        if (!(await isExistById(this.prismaService.workspace, dto.workspaceId))) {
            throw new BadRequestException("Workspace not found!");
        }

        const hasWorkspaceMember = await this.prismaService.workspaceMember.findMany({
            where: {
                userId: dto.userId,
                workspaceId: dto.workspaceId,
            },
        });

        console.log(hasWorkspaceMember);

        if (hasWorkspaceMember.length > 0) {
            throw new ConflictException("The user is already a member of this workspace!");
        }

        const workspaceMember = await this.prismaService.workspaceMember.create({
            data: {
                userId: dto.userId,
                workspaceId: dto.workspaceId,
                role: dto.role,
            },
        });

        return { workspaceMember };
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
            where: { id: dto.id },
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
            throw new BadRequestException("Workspace not found!");
        }

        const workspaceMember = await this.prismaService.workspaceMember.findFirst({
            where: {
                userId: userId,
                workspaceId: dto.id,
            },
        });

        if (!workspaceMember) {
            throw new ForbiddenException("The user is not a member of this workspace!");
        }

        return { workspace };
    }
}
