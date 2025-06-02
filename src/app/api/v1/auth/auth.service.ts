import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { AuthMethod, User } from "@prisma";
import { verify } from "argon2";
import { JwtService } from "@nestjs/jwt";

import { LoginDto } from "./dto/login.dto";
import { RegisterDto } from "./dto/register.dto";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { UserService } from "@/api/v1/user/user.service";
import { ProviderService } from "@/modules/auth/provider/provider.service";

@Injectable()
export class AuthService {
    public constructor(
        private readonly prismaService: PrismaService,
        private readonly userService: UserService,
        private readonly providerService: ProviderService,
        private readonly jwtService: JwtService,
    ) {}

    public async register(dto: RegisterDto) {
        const isExists = await this.userService.findByEmail(dto.email);

        if (isExists) {
            throw new ConflictException("The user with this email already exists!");
        }

        const newUser = await this.userService.create(
            dto.email,
            dto.password,
            dto.name,
            "",
            AuthMethod.CREDENTIALS,
            true,
        );

        if (newUser) {
            return { message: "You have successfully registered!" };
        }
    }

    public async login(dto: LoginDto) {
        const user = await this.userService.findByEmail(dto.email);

        if (!user || !user.password) {
            throw new BadRequestException("User not found!");
        }

        const isValidPassword = await verify(user.password, dto.password);

        if (!isValidPassword) {
            throw new UnauthorizedException("Wrong password!");
        }

        return this.generateToken(user, "");
    }

    public async extractProfileFromCode(provider: string, code: string) {
        const providerInstance = this.providerService.findByService(provider);
        const profile = await providerInstance!.findUserByCode(code);

        let user = await this.prismaService.user.findFirst({
            where: { email: profile.email },
        });
        if (!user) {
            user = await this.userService.create(
                profile.email,
                "",
                profile.name,
                profile.picture,
                AuthMethod[profile.provider.toUpperCase()],
                true,
            );
        }

        const account = await this.prismaService.account.findFirst({
            where: { userId: user.id, provider },
        });

        if (!account) {
            await this.prismaService.account.create({
                data: {
                    userId: user.id,
                    type: "oauth",
                    provider: profile.provider,
                    accessToken: profile.access_token,
                    refreshToken: profile.refresh_token,
                    expiresAt: profile.expires_at ?? 0,
                },
            });
        }

        return this.generateToken(user, provider);
    }

    public generateToken(user: User, provider: string) {
        const payload = { id: user.id, email: user.email, role: user.role, provider };
        const accessToken = this.jwtService.sign(payload);

        return { accessToken };
    }
}
