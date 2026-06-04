import { Module } from "@nestjs/common";
import { TelegramAccountService } from "./telegram-account.service";
import { TelegramAccountController } from "./telegram-account.controller";

@Module({
    controllers: [TelegramAccountController],
    providers: [TelegramAccountService],
    exports: [TelegramAccountService],
})
export class TelegramAccountModule {}
