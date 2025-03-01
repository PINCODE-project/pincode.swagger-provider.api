import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, Req } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Request } from "express";

import { WorkspaceService } from "./workspace.service";
import { CreateWorkspaceDto } from "./dto/create-workspace.dto";
import { AddMemberToWorkspaceDto } from "./dto/add-member-to-workspace.dto";

import { Authorization } from "@/auth/decorators/auth.decorator";
import { FindWorkspaceDto } from "@/workspace/dto/find-workspace.dto";
import { Authorized } from "@/auth/decorators/authorized.decorator";

@ApiTags("workspace")
@Controller("workspace")
export class WorkspaceController {
    constructor(private readonly workspaceService: WorkspaceService) {}

    @ApiOperation({ summary: "Создание рабочего пространства" })
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Post()
    create(@Authorized("id") userId: string, @Body() dto: CreateWorkspaceDto) {
        return this.workspaceService.create(dto, userId);
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
    findAll(@Authorized("id") userId: string) {
        return this.workspaceService.findAll(userId);
    }

    @ApiOperation({ summary: "Получение пространства" })
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Get(":id")
    findOne(@Authorized("id") userId: string, @Param() dto: FindWorkspaceDto) {
        return this.workspaceService.findOne(dto, userId);
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
