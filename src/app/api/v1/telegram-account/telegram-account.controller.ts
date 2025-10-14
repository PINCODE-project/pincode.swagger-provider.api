import { Controller, Delete, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { TelegramAccountService } from "./telegram-account.service";
import { ApiTags } from "@nestjs/swagger";
import { ConnectUserToTelegramDto } from "@/api/v1/telegram-account/dto/connect-user-to-telegram.dto";
import { Authorized } from "@/modules/auth/decorators/authorized.decorator";
import { Authorization } from "@/modules/auth/decorators/auth.decorator";
import { ApiConnectUserToTelegram, ApiDisconnectTelegram } from "./telegram-account.swagger";
import { DisconnectTelegramDto } from "@/api/v1/telegram-account/dto/disconnect-telegram.dto";

@ApiTags("telegram")
@Controller("/v1/telegram-account")
export class TelegramAccountController {
    constructor(private readonly telegramAccountService: TelegramAccountService) {}

    @ApiConnectUserToTelegram()
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Post("connect/:code")
    connectToTelegram(@Authorized("id") userId: string, @Param() dto: ConnectUserToTelegramDto) {
        return this.telegramAccountService.connectUserToTelegram(userId, dto);
    }

    @ApiDisconnectTelegram()
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Delete("disconnect/:id")
    disconnectTelegram(@Authorized("id") userId: string, @Param() dto: DisconnectTelegramDto) {
        return this.telegramAccountService.disconnectTelegram(userId, dto);
    }
}
