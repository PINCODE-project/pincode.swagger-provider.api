import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { ProviderModule } from "./provider/provider.module";
import { UserService } from "@/user/user.service";
import { getProvidersConfig } from "@/config/providers.config";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "@/auth/strategies/jwt.strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
    imports: [
        ProviderModule.registerAsync({
            imports: [ConfigModule],
            useFactory: getProvidersConfig,
            inject: [ConfigService],
        }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get("JWT_SECRET"),
                signOptions: {
                    expiresIn: "30d",
                },
            }),
            inject: [ConfigService],
        }),
        PassportModule,
    ],
    controllers: [AuthController],
    providers: [AuthService, UserService, JwtStrategy],
    exports: [AuthService],
})
export class AuthModule {}
