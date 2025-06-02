import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { WorkspaceService } from "./workspace.service";
import { CreateWorkspaceDto, CreateWorkspaceResponseDto } from "./dto/create-workspace.dto";
import { AddMemberToWorkspaceDto, AddMemberToWorkspaceResponseDto } from "./dto/add-member-to-workspace.dto";
import { ApiBaseResponse, ApiErrorResponse } from "@/common/utils/base-response";
import { Authorization } from "@/modules/auth/decorators/auth.decorator";
import { Authorized } from "@/modules/auth/decorators/authorized.decorator";
import { FindAllWorkspaceResponseDto } from "./dto/find-all-workspace.dto";
import { FindWorkspaceDto, FindWorkspaceResponseDto } from "./dto/find-workspace.dto";

@ApiTags("workspace")
@Controller("/v1/workspace")
export class WorkspaceController {
    constructor(private readonly workspaceService: WorkspaceService) {}

    @ApiOperation({ summary: "Создание рабочего пространства" })
    @ApiBaseResponse(201, CreateWorkspaceResponseDto, "Созданное пространство")
    @ApiErrorResponse(
        400,
        "CreateWorkspaceAlreadyExist",
        "Workspace with this name already exists!",
        "Пространство уже существует",
    )
    @Authorization()
    @HttpCode(HttpStatus.CREATED)
    @Post()
    create(@Authorized("id") userId: string, @Body() dto: CreateWorkspaceDto) {
        return this.workspaceService.create(dto, userId);
    }

    @ApiOperation({ summary: "Добавить пользователя в пространство" })
    @ApiBaseResponse(200, AddMemberToWorkspaceResponseDto, "Добавленный участник пространства")
    @ApiErrorResponse(
        409,
        "AddMemberToWorkspaceConflict",
        "The user is already a member of this workspace!",
        "Пользователь уже состоит",
    )
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Post("add-member")
    addMemberToWorkspace(@Body() dto: AddMemberToWorkspaceDto) {
        return this.workspaceService.addMemberToWorkspace(dto);
    }

    @ApiOperation({ summary: "Получение пространств пользователя" })
    @ApiBaseResponse(200, FindAllWorkspaceResponseDto, "Список пространств текущего пользователя")
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Get()
    findAll(@Authorized("id") userId: string) {
        return this.workspaceService.findAll(userId);
    }

    @ApiOperation({ summary: "Получение пространства" })
    @ApiBaseResponse(200, FindWorkspaceResponseDto, "Пространство")
    @ApiErrorResponse(404, "FindOneWorkspaceNotFound", "Workspace not found!", "Пространство не найдено")
    @ApiErrorResponse(
        403,
        "FindOneWorkspaceForbidden",
        "The user is not a member of this workspace!",
        "Пользователь не состоит в этом пространстве",
    )
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Get(":id")
    findOne(@Authorized("id") userId: string, @Param() dto: FindWorkspaceDto) {
        return this.workspaceService.findOne(dto, userId);
    }
}
