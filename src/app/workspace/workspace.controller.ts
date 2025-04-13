import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { WorkspaceService } from "./workspace.service";
import { CreateWorkspaceDto, CreateWorkspaceResponseDto } from "./dto/create-workspace.dto";
import { AddMemberToWorkspaceDto } from "./dto/add-member-to-workspace.dto";

import { Authorization } from "@/auth/decorators/auth.decorator";
import { FindWorkspaceDto, FindWorkspaceResponseDto } from "@/workspace/dto/find-workspace.dto";
import { Authorized } from "@/auth/decorators/authorized.decorator";
import { ApiBaseResponse } from "@/libs/common/utils/base-response";
import { FindAllWorkspaceResponseDto } from "@/workspace/dto/find-all-workspace.dto";

@ApiTags("workspace")
@Controller("workspace")
export class WorkspaceController {
    constructor(private readonly workspaceService: WorkspaceService) {}

    @ApiOperation({ summary: "Создание рабочего пространства" })
    @ApiBaseResponse(CreateWorkspaceResponseDto, "Созданное пространство")
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
    @ApiBaseResponse(FindAllWorkspaceResponseDto, "Список пространств")
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Get()
    findAll(@Authorized("id") userId: string) {
        return this.workspaceService.findAll(userId);
    }

    @ApiOperation({ summary: "Получение пространства" })
    @ApiBaseResponse(FindWorkspaceResponseDto, "Пространство")
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Get(":id")
    findOne(@Authorized("id") userId: string, @Param() dto: FindWorkspaceDto) {
        return this.workspaceService.findOne(dto, userId);
    }
}
