import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { ProjectService } from "./project.service";
import { CreateProjectDto } from "./dto/create-project.dto";
import { UpdateProjectDto } from "./dto/update-project.dto";

import { Authorization } from "@/auth/decorators/auth.decorator";
import { FindAllProjectByWorkspaceDto } from "@/project/dto/find-all-project-by-workspace.dto";
import { Request } from "express";

@ApiTags("project")
@Controller("project")
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @ApiOperation({ summary: "Создание проекта" })
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Post()
    create(@Req() req: Request, @Body() createProjectDto: CreateProjectDto) {
        return this.projectService.create(createProjectDto, req.session.userId);
    }

    @ApiOperation({ summary: "Получение всех проектов в пространстве" })
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Get("by-workspace/:workspaceId")
    findAllBuWorkspace(@Req() req: Request, @Param() dto: FindAllProjectByWorkspaceDto) {
        return this.projectService.findAllByWorkspace(dto, req.session.userId);
    }
    //
    // @Get(":id")
    // findOne(@Param("id") id: string) {
    //     return this.projectService.findOne(+id);
    // }
    //
    // @Patch(":id")
    // update(
    //     @Param("id") id: string,
    //     @Body() updateProjectDto: UpdateProjectDto,
    // ) {
    //     return this.projectService.update(+id, updateProjectDto);
    // }
    //
    // @Delete(":id")
    // remove(@Param("id") id: string) {
    //     return this.projectService.remove(+id);
    // }
}
