import { NestjsGrammyModule } from "@grammyjs/nestjs";
import { DynamicModule, forwardRef, Logger, Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { BotController } from "@/bot/bot.controller";
import { BotService } from "@/bot/bot.service";
import { BotDisabledService } from "@/bot/bot-disabled.service";
import { TelegramAccountModule } from "@/api/v1/telegram-account/telegram-account.module";
import { IS_TELEGRAM_BOT_ENABLED } from "@/common/utils/is-telegram-bot-enabled.util";

@Module({})
export class BotModule {
    private static readonly logger = new Logger(BotModule.name);

    static register(): DynamicModule {
        if (!IS_TELEGRAM_BOT_ENABLED) {
            BotModule.logger.warn("Telegram bot is disabled (set TELEGRAM_BOT_ENABLED=true to enable)");

            return {
                module: BotModule,
                global: true,
                providers: [{ provide: BotService, useClass: BotDisabledService }],
                exports: [BotService],
            };
        }

        return {
            module: BotModule,
            global: true,
            imports: [
                ConfigModule,
                NestjsGrammyModule.forRootAsync({
                    imports: [ConfigModule],
                    inject: [ConfigService],
                    useFactory: async (configService: ConfigService) => ({
                        token: configService.getOrThrow<string>("TELEGRAM_BOT_TOKEN"),
                    }),
                }),
                forwardRef(() => TelegramAccountModule),
            ],
            providers: [BotService, BotController],
            exports: [BotService],
        };
    }
}
