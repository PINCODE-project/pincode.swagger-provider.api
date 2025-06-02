import { forwardRef, Module } from "@nestjs/common";
import { TelegramAccountService } from "./telegram-account.service";
import { TelegramAccountController } from "./telegram-account.controller";
import { BotModule } from "@/bot/bot.module";

@Module({
    imports: [forwardRef(() => BotModule)],
    controllers: [TelegramAccountController],
    providers: [TelegramAccountService],
    exports: [TelegramAccountService],
})
export class TelegramAccountModule {}
