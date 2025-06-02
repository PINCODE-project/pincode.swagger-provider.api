import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { getProvidersConfig } from "@/api/v1/auth/config/providers.config";
import { UserService } from "@/api/v1/user/user.service";
import { ProviderModule } from "@/modules/auth/provider/provider.module";
import { JwtStrategy } from "@/modules/auth/strategies/jwt.strategy";

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
