import { MiddlewareConsumer, Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { TerminusModule } from "@nestjs/terminus";
import { PrismaModule } from "@/modules/prisma/prisma.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { IS_DEV_ENV } from "@/common/utils/is-dev.util";
import { LoggingMiddleware } from "@/common/middlewares/logging.middleware";
import { AuthModule } from "@/api/v1/auth/auth.module";
import { UserModule } from "@/api/v1/user/user.module";
import { ProviderModule } from "@/modules/auth/provider/provider.module";
import { BotModule } from "@/bot/bot.module";
import { TelegramAccountModule } from "./api/v1/telegram-account/telegram-account.module";
import { WorkspaceModule } from "@/api/v1/workspace/workspace.module";
import { ProjectModule } from "@/api/v1/project/project.module";
import { YookassaModule } from "nestjs-yookassa";
import { PaymentModule } from './api/v1/payment/payment.module';
import { MicroserviceModule } from "@/api/v1/microservice/microservice.module";

@Module({
    controllers: [AppController],
    imports: [
        ConfigModule.forRoot({
            ignoreEnvFile: !IS_DEV_ENV,
            isGlobal: true,
        }),
        YookassaModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                shopId: configService.getOrThrow("YOOKASSA_SHOP_ID"),
                apiKey: configService.getOrThrow("YOOKASSA_SECRET_KEY"),
            }),
        }),
        TerminusModule,
        PrismaModule,
        BotModule,
        AuthModule,
        UserModule,
        ProviderModule,
        WorkspaceModule,
        ProjectModule,
        MicroserviceModule,
        // AdminUserModule,
        TelegramAccountModule,
        PaymentModule,
    ],
})
export class AppModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(LoggingMiddleware).forRoutes("/*path");
    }
}
