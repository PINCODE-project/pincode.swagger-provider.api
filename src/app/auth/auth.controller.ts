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
    Req,
    Res,
    UseGuards,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request, Response } from "express";
import { ApiTags } from "@nestjs/swagger";

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

    @Post("register")
    @HttpCode(HttpStatus.OK)
    public async register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    public async login(@Req() req: Request, @Body() dto: LoginDto) {
        return this.authService.login(req, dto);
    }

    @UseGuards(AuthProviderGuard)
    @Get("/oauth/callback/:provider")
    public async callback(
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
        @Query("code") code: string,
        @Param("provider") provider: string,
    ) {
        if (!code) {
            throw new BadRequestException("Не был предоставлен код авторизации.");
        }

        await this.authService.extractProfileFromCode(req, provider, code);

        console.log(`${this.configService.getOrThrow<string>("ALLOWED_ORIGIN")}/dashboard`);
        return res.redirect(`${this.configService.getOrThrow<string>("ALLOWED_ORIGIN")}/dashboard`);
    }

    @UseGuards(AuthProviderGuard)
    @Get("/oauth/connect/:provider")
    public async connect(@Param("provider") provider: string) {
        const providerInstance = this.providerService.findByService(provider);

        return {
            url: providerInstance.getAuthUrl(),
        };
    }

    @Post("logout")
    @HttpCode(HttpStatus.OK)
    public async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        return this.authService.logout(req, res);
    }
}
