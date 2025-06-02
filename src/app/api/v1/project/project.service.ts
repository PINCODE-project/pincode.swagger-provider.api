import { BadRequestException, ConflictException, ForbiddenException, Injectable } from "@nestjs/common";

import { CreateProjectDto } from "./dto/create-project.dto";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { isExistById } from "@/common/utils/check-exist";
import { FindAllProjectByWorkspaceDto } from "./dto/find-all-project-by-workspace.dto";

@Injectable()
export class ProjectService {
    public constructor(private readonly prismaService: PrismaService) {}

    async create(dto: CreateProjectDto, ownerId: string) {
        if (!(await isExistById(this.prismaService.workspace, dto.workspaceId))) {
            throw new BadRequestException("Workspace not found!");
        }

        const workspaceMember = await this.prismaService.workspaceMember.findFirst({
            where: {
                workspaceId: dto.workspaceId,
                userId: ownerId,
            },
        });

        if (!workspaceMember) {
            throw new ForbiddenException("The user is not a member of this workspace!");
        }

        const projectExist = await this.prismaService.project.findFirst({
            where: {
                workspaceId: dto.workspaceId,
                name: dto.name,
            },
        });

        if (projectExist) {
            throw new ConflictException("The project already exists!");
        }

        const project = await this.prismaService.project.create({
            data: {
                name: dto.name,
                icon: dto.icon ?? "",
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
            throw new ForbiddenException("The user is not a member of this workspace!");
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
