import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { ProjectService } from "./project.service";
import { CreateProjectDto, CreateProjectResponseDto } from "./dto/create-project.dto";

import { Authorization } from "@/auth/decorators/auth.decorator";
import {
    FindAllProjectByWorkspaceDto,
    FindAllProjectByWorkspaceResponseDto,
} from "@/project/dto/find-all-project-by-workspace.dto";
import { Authorized } from "@/auth/decorators/authorized.decorator";
import { ApiBaseResponse } from "@/libs/common/utils/base-response";

@ApiTags("project")
@Controller("project")
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @ApiOperation({ summary: "Создание проекта" })
    @ApiBaseResponse(CreateProjectResponseDto, "Созданный проект")
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Post()
    create(@Authorized("id") userId: string, @Body() createProjectDto: CreateProjectDto) {
        return this.projectService.create(createProjectDto, userId);
    }

    @ApiOperation({ summary: "Получение всех проектов в пространстве" })
    @ApiBaseResponse(FindAllProjectByWorkspaceResponseDto, "Список проектов")
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Get("by-workspace/:workspaceId")
    findAllBuWorkspace(@Authorized("id") userId: string, @Param() dto: FindAllProjectByWorkspaceDto) {
        return this.projectService.findAllByWorkspace(dto, userId);
    }
}
