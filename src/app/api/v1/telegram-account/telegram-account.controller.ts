import { Controller, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import { TelegramAccountService } from "./telegram-account.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import {
    ConnectUserToTelegramDto,
    ConnectUserToTelegramResponseDto,
} from "@/api/v1/telegram-account/dto/connect-user-to-telegram.dto";
import { Authorized } from "@/modules/auth/decorators/authorized.decorator";
import { Authorization } from "@/modules/auth/decorators/auth.decorator";
import { ApiBaseResponse, ApiErrorResponse } from "@/common/utils/base-response";

@ApiTags("telegram")
@Controller("/v1/telegram-account")
export class TelegramAccountController {
    constructor(private readonly telegramAccountService: TelegramAccountService) {}

    @ApiOperation({ summary: "Привязка пользователя к телеграм аккаунту по коду" })
    @ApiBaseResponse(200, ConnectUserToTelegramResponseDto, "Пользователь успешно привязан")
    @ApiErrorResponse(404, "ConnectUserToTelegram", "Code invalid!", "Код не действителен")
    @ApiErrorResponse(409, "ConnectUserToTelegramConflict", "Account already connected!", "Аккаунт уже привязан")
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Post("connect/:code")
    connectToTelegram(@Authorized("id") userId: string, @Param() dto: ConnectUserToTelegramDto) {
        return this.telegramAccountService.connectUserToTelegram(userId, dto);
    }
}
