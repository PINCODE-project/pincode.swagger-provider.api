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
import { ApiTags } from "@nestjs/swagger";

import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { CallbackProviderParamDto, CallbackProviderQueryDto } from "./dto/callback-provider.dto";
import { ConnectToProviderDto } from "./dto/connect-to-provider.dto";
import { ProviderService } from "@/modules/auth/provider/provider.service";
import { AuthProviderGuard } from "@/modules/auth/guards/provider.guard";
import { ApiRegister, ApiLogin, ApiOauthCallback, ApiOauthConnect, ApiLogout } from "./auth.swagger";

@ApiTags("auth")
@Controller("/v1/auth")
export class AuthController {
    public constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
        private readonly providerService: ProviderService,
    ) {}

    @ApiRegister()
    @Post("register")
    @HttpCode(HttpStatus.OK)
    public async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @ApiLogin()
    @HttpCode(HttpStatus.OK)
    @Post("login")
    public async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
        return this.authService.login(dto, res);
    }

    @ApiOauthCallback()
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

        await this.authService.extractProfileFromCode(paramDto.provider, queryDto.code, res);

        res.redirect(`${this.configService.getOrThrow<string>("ALLOWED_ORIGIN")}/auth/callback`);
    }

    @ApiOauthConnect()
    @UseGuards(AuthProviderGuard)
    @Get("/oauth/connect/:provider")
    public async connect(@Param() dto: ConnectToProviderDto) {
        const providerInstance = this.providerService.findByService(dto.provider);

        return {
            url: providerInstance!.getAuthUrl(),
        };
    }

    @ApiLogout()
    @Post("logout")
    @HttpCode(HttpStatus.OK)
    public async logout(@Res({ passthrough: true }) res: Response) {
        return this.authService.logout(res);
    }
}
