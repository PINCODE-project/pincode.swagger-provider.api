import { ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthMethod, User } from "@prisma/__generated__";
import { verify } from "argon2";
import { JwtService } from "@nestjs/jwt";

import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { EmailConfirmationService } from "./email-confirmation/email-confirmation.service";
import { ProviderService } from "./provider/provider.service";
import { TwoFactorAuthService } from "./two-factor-auth/two-factor-auth.service";
import { UserService } from "@/user/user.service";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
        private readonly configService: ConfigService,
        private readonly providerService: ProviderService,
        private readonly emailConfirmationService: EmailConfirmationService,
        private readonly twoFactorAuthService: TwoFactorAuthService,
        private readonly jwtService: JwtService,
    ) {}

    private generateToken(user: User) {
        const payload = { sub: user.id, email: user.email };
        return {
            accessToken: this.jwtService.sign(payload, {
                secret: this.configService.getOrThrow<string>("JWT_SECRET"),
                expiresIn: "1h",
            }),
            refreshToken: this.jwtService.sign(payload, {
                secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
                expiresIn: "7d",
            }),
        };
    }

    public async register(dto: RegisterDto) {
        const isExists = await this.userService.findByEmail(dto.email);

        if (isExists) {
            throw new ConflictException("Пользователь с таким email уже существует.");
        }

        const newUser = await this.userService.create(
            dto.email,
            dto.password,
            dto.name,
            "",
            AuthMethod.CREDENTIALS,
            false,
        );

        await this.emailConfirmationService.sendVerificationToken(newUser.email);

        return { message: "Подтвердите ваш email." };
    }

    public async login(dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email);
        if (!user || !user.password) {
            throw new NotFoundException("Пользователь не найден.");
        }

        const isValidPassword = await verify(user.password, dto.password);
        if (!isValidPassword) {
            throw new UnauthorizedException("Неверный пароль.");
        }

        if (!user.isVerified) {
            await this.emailConfirmationService.sendVerificationToken(user.email);
            throw new UnauthorizedException("Email не подтвержден.");
        }

        if (user.isTwoFactorEnabled) {
            if (!dto.code) {
                await this.twoFactorAuthService.sendTwoFactorToken(user.email);
                return { message: "Введите код 2FA." };
            }
            await this.twoFactorAuthService.validateTwoFactorToken(user.email, dto.code);
        }

        return this.generateToken(user);
    }

    public async extractProfileFromCode(provider: string, code: string) {
        const providerInstance = this.providerService.findByService(provider);
        const profile = await providerInstance.findUserByCode(code);

        let user = await this.prismaService.user.findFirst({ where: { email: profile.email } });

        if (!user) {
            user = await this.userService.create(
                profile.email,
                "",
                profile.name,
                profile.picture,
                AuthMethod[profile.provider.toUpperCase()],
                true,
            );

            await this.prismaService.account.create({
                data: {
                    userId: user.id,
                    type: "oauth",
                    provider: profile.provider,
                    accessToken: profile.access_token,
                    refreshToken: profile.refresh_token,
                    expiresAt: profile.expires_at,
                },
            });
        }

        return this.generateToken(user);
    }

    public async refreshToken(token: string) {
        try {
            const payload = this.jwtService.verify(token, {
                secret: this.configService.getOrThrow<string>("JWT_REFRESH_SECRET"),
            });
            const user = await this.userService.findById(payload.sub);
            if (!user) {
                throw new UnauthorizedException("Пользователь не найден.");
            }
            return this.generateToken(user);
        } catch {
            throw new UnauthorizedException("Недействительный refresh token.");
        }
    }
}
