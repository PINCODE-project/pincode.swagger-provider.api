import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { ProjectService } from "./project.service";
import { CreateProjectDto, CreateProjectResponseDto } from "./dto/create-project.dto";
import { ApiBaseResponse, ApiErrorResponse } from "@/common/utils/base-response";
import { Authorization } from "@/modules/auth/decorators/auth.decorator";
import { Authorized } from "@/modules/auth/decorators/authorized.decorator";
import {
    FindAllProjectByWorkspaceDto,
    FindAllProjectByWorkspaceResponseDto,
} from "./dto/find-all-project-by-workspace.dto";

@ApiTags("project")
@Controller("/v1/project")
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @ApiOperation({ summary: "Создание проекта" })
    @ApiBaseResponse(201, CreateProjectResponseDto, "Созданный проект")
    @ApiErrorResponse(404, "CreateProjectWorkspaceNotFound", "Workspace not found!", "Пространство не найдено")
    @ApiErrorResponse(
        403,
        "CreateProjectForbidden",
        "The user is not a member of this workspace!",
        "Пользователь не состоит в пространстве",
    )
    @ApiErrorResponse(409, "CreateProjectConflict", "The project already exists!", "Проект уже существует")
    @Authorization()
    @HttpCode(HttpStatus.CREATED)
    @Post()
    create(@Authorized("id") userId: string, @Body() createProjectDto: CreateProjectDto) {
        return this.projectService.create(createProjectDto, userId);
    }

    @ApiOperation({ summary: "Получение всех проектов в пространстве" })
    @ApiBaseResponse(200, FindAllProjectByWorkspaceResponseDto, "Список проектов")
    @ApiErrorResponse(
        403,
        "FindAllProjectsByWorkspaceForbidden",
        "The user is not a member of this workspace!",
        "Пользователь не состоит в пространстве",
    )
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Get("by-workspace/:workspaceId")
    findAllByWorkspace(@Authorized("id") userId: string, @Param() dto: FindAllProjectByWorkspaceDto) {
        return this.projectService.findAllByWorkspace(dto, userId);
    }
}
