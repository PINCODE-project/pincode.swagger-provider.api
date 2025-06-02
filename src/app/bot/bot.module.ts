import { NestjsGrammyModule } from "@grammyjs/nestjs";
import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BotController } from "@/bot/bot.controller";
import { BotService } from "@/bot/bot.service";
import { TelegramAccountModule } from "@/api/v1/telegram-account/telegram-account.module";

@Module({
    imports: [
        ConfigModule,
        NestjsGrammyModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({
                token: configService.getOrThrow<string>("TELEGRAM_BOT_TOKEN") ?? "",
            }),
        }),
        forwardRef(() => TelegramAccountModule),
    ],
    providers: [BotService, BotController],
    exports: [BotService],
})
export class BotModule {}
