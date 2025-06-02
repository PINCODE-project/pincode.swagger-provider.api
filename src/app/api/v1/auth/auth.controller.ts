import {
    BadRequestException,
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    Res,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Response } from "express";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { RegisterDto, RegisterResponseDto } from "./dto/register.dto";
import { ApiBaseResponse, ApiErrorResponse } from "@/common/utils/base-response";
import { CallbackProviderParamDto, CallbackProviderQueryDto } from "./dto/callback-provider.dto";
import { ConnectToProviderDto, ConnectToProviderResponseDto } from "./dto/connect-to-provider.dto";
import { ProviderService } from "@/modules/auth/provider/provider.service";
import { AuthProviderGuard } from "@/modules/auth/guards/provider.guard";

@ApiTags("auth")
@Controller("/v1/auth")
export class AuthController {
    public constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly providerService: ProviderService,
    ) {}

    @ApiOperation({ summary: "Регистрация пользователя" })
    @Post("register")
    @ApiBaseResponse(200, RegisterResponseDto, "Пользователь успешно зарегистрировался")
    @ApiErrorResponse(
        409,
        "RegisterUserAlreadyExist",
        "The user with this email already exists!",
        "Пользователь уже существует",
    )
    @HttpCode(HttpStatus.OK)
    public async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @ApiOperation({ summary: "Авторизация пользователя" })
    @ApiBaseResponse(200, LoginResponseDto, "Пользователь успешно авторизовался")
    @ApiErrorResponse(400, "LoginUserNotFound", "User not found!", "Неверные данные")
    @ApiErrorResponse(
        401,
        "LoginWrongPassword",
        "Wrong password!",
        "Пользователь существует, но введён неверный пароль",
    )
    @HttpCode(HttpStatus.OK)
    @Post("login")
    public async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @ApiOperation({
        summary: "Авторизация через Oauth",
        description: `Используется провайдерами\n
Перенаправляет на фронт по адресу вместе с токеном /auth/callback?accessToken=ТОКЕН (Адрес фронта лежит в env - ALLOWED_ORIGIN)`,
    })
    @UseGuards(AuthProviderGuard)
    @Get("/oauth/callback/:provider")
    public async callback(
        @Res({ passthrough: true }) res: Response,
        @Query() queryDto: CallbackProviderQueryDto,
        @Param() paramDto: CallbackProviderParamDto,
    ) {
        if (!queryDto.code) {
            throw new BadRequestException("Не был предоставлен код авторизации.");
        }

        const token = await this.authService.extractProfileFromCode(paramDto.provider, queryDto.code);

        res.redirect(
            `${this.configService.getOrThrow<string>("ALLOWED_ORIGIN")}/auth/callback?accessToken=${token.accessToken}`,
        );
    }

    @ApiOperation({ summary: "Получение ссылки на Oauth авторизацию" })
    @UseGuards(AuthProviderGuard)
    @Get("/oauth/connect/:provider")
    @ApiOkResponse({ type: ConnectToProviderResponseDto })
    public async connect(@Param() dto: ConnectToProviderDto) {
        const providerInstance = this.providerService.findByService(dto.provider);

        return {
            url: providerInstance!.getAuthUrl(),
        };
    }
}
