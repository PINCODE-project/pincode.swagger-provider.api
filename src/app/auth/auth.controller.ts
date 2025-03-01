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
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { AuthProviderGuard } from "./guards/provider.guard";
import { ProviderService } from "./provider/provider.service";

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
    @Post("login")
    @HttpCode(HttpStatus.OK)
    public async login(@Body() dto: LoginDto) {
        return this.authService.login(dto);
    }

    @ApiOperation({ summary: "Авторизация через Oauth" })
    @UseGuards(AuthProviderGuard)
    @Get("/oauth/callback/:provider")
    public async callback(
        @Res({ passthrough: true }) res: Response,
        @Query("code") code: string,
        @Param("provider") provider: string,
    ) {
        if (!code) {
            throw new BadRequestException("Не был предоставлен код авторизации.");
        }

        const token = await this.authService.extractProfileFromCode(provider, code);

        return res.redirect(
            `${this.configService.getOrThrow<string>("ALLOWED_ORIGIN")}/auth/callback?accessToken=${token.accessToken}`,
        );
    }

    @ApiOperation({ summary: "Получение ссылки на Oauth авторизацию" })
    @UseGuards(AuthProviderGuard)
    @Get("/oauth/connect/:provider")
    public async connect(@Param("provider") provider: string) {
        const providerInstance = this.providerService.findByService(provider);

        return {
            url: providerInstance.getAuthUrl(),
        };
    }
}
