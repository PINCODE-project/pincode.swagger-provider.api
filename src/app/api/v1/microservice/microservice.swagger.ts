import { applyDecorators } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ApiBaseResponse, ApiErrorResponse } from "@/common/utils/base-response";
import { CreateMicroserviceResponseDto } from "./dto/create-microservice.dto";
import { GetMicroserviceResponseDto } from "./dto/get-microservice.dto";
import { UpdateMicroserviceResponseDto } from "./dto/update-microservice.dto";
import { DeleteMicroserviceResponseDto } from "./dto/delete-microservice.dto";
import { RefreshMicroserviceResponseDto } from "./dto/refresh-microservice.dto";

export const ApiCreateMicroservice = () =>
    applyDecorators(
        ApiOperation({ summary: "Создание микросервиса" }),
        ApiBaseResponse(200, CreateMicroserviceResponseDto, "Созданный проект"),
        ApiErrorResponse(400, "CreateMicroserviceProjectNotFound", "Project not found!", "Проект не найден"),
        ApiErrorResponse(
            409,
            "CreateMicroserviceConflict",
            "The microservice already exists!",
            "Микросервис уже существует",
        ),
    );

export const ApiGetMicroservice = () =>
    applyDecorators(
        ApiOperation({ summary: "Получение микросервиса" }),
        ApiBaseResponse(200, GetMicroserviceResponseDto, "Объект микросервиса"),
        ApiErrorResponse(400, "GetMicroserviceBadRequest", "Microservice not found!", "Микросервис не найден"),
    );

export const ApiUpdateMicroservice = () =>
    applyDecorators(
        ApiOperation({ summary: "Обновление микросервиса" }),
        ApiBaseResponse(200, UpdateMicroserviceResponseDto, "Обновлённый микросервис"),
        ApiErrorResponse(404, "UpdateMicroserviceNotFound", "Microservice not found!", "Микросервис не найден"),
        ApiErrorResponse(
            400,
            "UpdateMicroserviceNotMember",
            "The user is not a member of this workspace!",
            "Пользователь не является членом этого workspace",
        ),
        ApiErrorResponse(
            409,
            "UpdateMicroserviceConflict",
            "A microservice with this name already exists in the project!",
            "Микросервис с таким именем уже существует в проекте",
        ),
    );

export const ApiDeleteMicroservice = () =>
    applyDecorators(
        ApiOperation({ summary: "Удаление микросервиса" }),
        ApiBaseResponse(200, DeleteMicroserviceResponseDto, "Микросервис успешно удалён"),
        ApiErrorResponse(404, "DeleteMicroserviceNotFound", "Microservice not found!", "Микросервис не найден"),
        ApiErrorResponse(
            400,
            "DeleteMicroserviceNotMember",
            "The user is not a member of this workspace!",
            "Пользователь не является членом этого workspace",
        ),
    );

export const ApiRefreshMicroservice = () =>
    applyDecorators(
        ApiOperation({ summary: "Обновление схемы микросервиса по webhook" }),
        ApiBaseResponse(200, RefreshMicroserviceResponseDto, "Результат обновления схемы"),
        ApiErrorResponse(404, "RefreshMicroserviceNotFound", "Microservice not found!", "Микросервис не найден"),
        ApiErrorResponse(
            400,
            "RefreshMicroserviceTextType",
            "Cannot refresh schema for TEXT type microservice!",
            "Невозможно обновить схему для микросервиса типа TEXT",
        ),
        ApiErrorResponse(
            400,
            "RefreshMicroserviceNoUrl",
            "No schema URL found for this microservice!",
            "URL схемы не найден для этого микросервиса",
        ),
        ApiErrorResponse(400, "RefreshMicroserviceFetchFailed", "Failed to fetch schema", "Не удалось получить схему"),
    );
