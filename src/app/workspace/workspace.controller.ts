import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { WorkspaceService } from "./workspace.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { AddMemberToWorkspaceDto } from "./dto/add-member-to-workspace.dto";

import { Authorization } from "@/auth/decorators/auth.decorator";
import { FindWorkspaceDto } from "@/workspace/dto/find-workspace.dto";

@ApiTags("workspace")
@Controller("workspace")
export class WorkspaceController {
    constructor(private readonly workspaceService: WorkspaceService) {}

    @ApiOperation({ summary: "Создание рабочего пространства" })
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Post()
    create(@Req() req: Request, @Body() dto: CreateWorkspaceDto) {
        return this.workspaceService.create(dto, req.session.userId);
    }

    @ApiOperation({ summary: "Добавить пользователя в пространство" })
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Post("add-member")
    addMemberToWorkspace(@Body() dto: AddMemberToWorkspaceDto) {
        return this.workspaceService.addMemberToWorkspace(dto);
    }

    @ApiOperation({ summary: "Получение пространств пользователя" })
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Get()
    findAll(@Req() req: Request) {
        return this.workspaceService.findAll(req.session.userId);
    }

    @ApiOperation({ summary: "Получение пространства" })
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Get(":id")
    findOne(@Req() req: Request, @Param() dto: FindWorkspaceDto) {
        return this.workspaceService.findOne(dto, req.session.userId);
    }
    //
    // @Patch(":id")
    // update(
    //     @Param("id") id: string,
    //     @Body() updateWorkspaceDto: UpdateWorkspaceDto,
    // ) {
    //     return this.workspaceService.update(+id, updateWorkspaceDto);
    // }
    //
    // @Delete(":id")
    // remove(@Param("id") id: string) {
    //     return this.workspaceService.remove(+id);
    // }
}
