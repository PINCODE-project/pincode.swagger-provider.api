import { applyDecorators } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ApiBaseResponse, ApiErrorResponse } from "@/common/utils/base-response";
import { CreateProjectResponseDto } from "./dto/create-project.dto";
import { FindAllProjectByWorkspaceResponseDto } from "./dto/find-all-project-by-workspace.dto";

export const ApiCreateProject = () =>
    applyDecorators(
        ApiOperation({ summary: "Создание проекта" }),
        ApiBaseResponse(201, CreateProjectResponseDto, "Созданный проект"),
        ApiErrorResponse(400, "CreateProjectWorkspaceNotFound", "Workspace not found!", "Пространство не найдено"),
        ApiErrorResponse(
            403,
            "CreateProjectForbidden",
            "The user is not a member of this workspace!",
            "Пользователь не состоит в пространстве",
        ),
        ApiErrorResponse(409, "CreateProjectConflict", "The project already exists!", "Проект уже существует"),
    );

export const ApiFindAllProjectByWorkspace = () =>
    applyDecorators(
        ApiOperation({ summary: "Получение всех проектов в пространстве" }),
        ApiBaseResponse(200, FindAllProjectByWorkspaceResponseDto, "Список проектов"),
        ApiErrorResponse(
            403,
            "FindAllProjectsByWorkspaceForbidden",
            "The user is not a member of this workspace!",
            "Пользователь не состоит в пространстве",
        ),
    );
