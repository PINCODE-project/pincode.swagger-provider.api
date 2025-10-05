import { applyDecorators } from "@nestjs/common";
import { ApiOkResponse, ApiOperation } from "@nestjs/swagger";
import { ApiBaseResponse, ApiErrorResponse } from "@/common/utils/base-response";
import { RegisterResponseDto } from "./dto/register.dto";
import { LoginResponseDto } from "./dto/login.dto";
import { ConnectToProviderResponseDto } from "./dto/connect-to-provider.dto";

export const ApiRegister = () =>
    applyDecorators(
        ApiOperation({ summary: "Регистрация пользователя" }),
        ApiBaseResponse(200, RegisterResponseDto, "Пользователь успешно зарегистрировался"),
        ApiErrorResponse(
            409,
            "RegisterUserAlreadyExist",
            "The user with this email already exists!",
            "Пользователь с таким email уже существует",
        ),
    );

export const ApiLogin = () =>
    applyDecorators(
        ApiOperation({ summary: "Авторизация пользователя" }),
        ApiBaseResponse(200, LoginResponseDto, "Пользователь успешно авторизовался"),
        ApiErrorResponse(400, "LoginUserNotFound", "User not found!", "Неверные данные для входа"),
        ApiErrorResponse(
            401,
            "LoginWrongPassword",
            "Wrong password!",
            "Пользователь существует, но введён неверный пароль",
        ),
    );

export const ApiOauthCallback = () =>
    applyDecorators(
        ApiOperation({
            summary: "Авторизация через Oauth",
            description: `Используется провайдерами\n
Перенаправляет на фронт по адресу /auth/callback (Адрес фронта лежит в env - ALLOWED_ORIGIN). Токен устанавливается в куки.`,
        }),
        ApiBaseResponse(200, LoginResponseDto, "Успешная авторизация через провайдер"),
        ApiErrorResponse(
            400,
            "OauthCallbackNoCode",
            "Не был предоставлен код авторизации.",
            "Отсутствует код авторизации от провайдера",
        ),
    );

export const ApiOauthConnect = () =>
    applyDecorators(
        ApiOperation({ summary: "Получение ссылки на Oauth авторизацию" }),
        ApiOkResponse({ type: ConnectToProviderResponseDto, description: "Ссылка для OAuth авторизации" }),
    );

export const ApiLogout = () =>
    applyDecorators(
        ApiOperation({ summary: "Выход из системы (очистка куки)" }),
        ApiBaseResponse(200, RegisterResponseDto, "Пользователь успешно вышел из системы"),
    );
