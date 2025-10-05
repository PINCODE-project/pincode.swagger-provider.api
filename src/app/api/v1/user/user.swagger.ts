import { applyDecorators } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ApiBaseResponse, ApiErrorResponse } from "@/common/utils/base-response";
import { GetProfileResponseDto } from "./dto/get-profile.dto";
import { UpdateUserResponseDto } from "./dto/update-user.dto";

export const ApiGetProfile = () =>
    applyDecorators(
        ApiOperation({ summary: "Получение профиля пользователя" }),
        ApiBaseResponse(200, GetProfileResponseDto, "Профиль пользователя"),
        ApiErrorResponse(404, "FindProfileUserNotFound", "User not found!", "Пользователь не найден"),
    );

export const ApiUpdateProfile = () =>
    applyDecorators(
        ApiOperation({ summary: "Обновление профиля пользователя" }),
        ApiBaseResponse(200, UpdateUserResponseDto, "Обновлённый профиль пользователя"),
        ApiErrorResponse(404, "UpdateProfileUserNotFound", "User not found!", "Пользователь не найден"),
    );
