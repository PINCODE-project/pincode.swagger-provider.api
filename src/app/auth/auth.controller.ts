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
import { ApiOkResponse, ApiOperation, ApiResponse, ApiTags, ApiUnauthorizedResponse } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { LoginDto, LoginResponseDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthProviderGuard } from "./guards/provider.guard";
import { ProviderService } from "./provider/provider.service";

import { ConnectToProviderDto, ConnectToProviderResponseDto } from "@/auth/dto/connect-to-provider.dto";
import { CallbackProviderParamDto, CallbackProviderQueryDto } from "@/auth/dto/callback-provider.dto";
import { getBadRequestErrors } from "@/libs/common/utils/get-errors";
import { ApiBaseResponse } from "@/libs/common/utils/base-response";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
    public constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly providerService: ProviderService,
    ) {}

    @ApiOperation({ summary: "Регистрация пользователя" })
    @Post("register")
    @HttpCode(HttpStatus.OK)
    public async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @ApiOperation({ summary: "Авторизация пользователя" })
    @ApiBaseResponse(LoginResponseDto, "Пользователь успешно авторизовался")
    @ApiResponse(
        getBadRequestErrors("Неверные данные", [
            { error: "Пользователь не найден.", description: "Пользователь не найден" },
        ]),
    )
    @ApiUnauthorizedResponse({
        status: 400,
        description: "Пользователь существует, но введён неверный пароль",
        content: {
            "application/json": {
                examples: {
                    "Неверный пароль": {
                        value: {
                            meta: {
                                timestamp: "2025-03-03T15:50:57.083Z",
                                statusCode: 401,
                            },
                            data: {
                                message: "Неверный пароль.",
                            },
                        },
                    },
                },
            },
        },
    })
    @HttpCode(HttpStatus.OK)
    @Post("login")
    public async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @ApiOperation({
        summary: "Авторизация через Oauth",
        description: `Используется провайдерами\n
Перенаправляет на фронт по адресу вместе с токеном /auth/callback?accessToken=ТОКЕН`,
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
            url: providerInstance.getAuthUrl(),
        };
    }
}
