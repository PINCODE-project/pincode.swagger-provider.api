import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { Authorization } from "@/modules/auth/decorators/auth.decorator";
import { Authorized } from "@/modules/auth/decorators/authorized.decorator";
import { FindAllProjectByWorkspaceDto } from "./dto/find-all-project-by-workspace.dto";
import { ApiCreateProject, ApiFindAllProjectByWorkspace } from "./project.swagger";

@ApiTags("project")
@Controller("/v1/project")
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @ApiCreateProject()
    @Authorization()
    @HttpCode(HttpStatus.CREATED)
    @Post()
    create(@Authorized("id") userId: string, @Body() createProjectDto: CreateProjectDto) {
        return this.projectService.create(createProjectDto, userId);
    }

    @ApiFindAllProjectByWorkspace()
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Get("by-workspace/:workspaceId")
    findAllByWorkspace(@Authorized("id") userId: string, @Param() dto: FindAllProjectByWorkspaceDto) {
        return this.projectService.findAllByWorkspace(dto, userId);
    }
}
