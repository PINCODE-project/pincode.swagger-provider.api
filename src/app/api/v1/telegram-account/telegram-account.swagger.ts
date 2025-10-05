import { applyDecorators } from "@nestjs/common";
import { ApiOperation } from "@nestjs/swagger";
import { ApiBaseResponse, ApiErrorResponse } from "@/common/utils/base-response";
import { ConnectUserToTelegramResponseDto } from "./dto/connect-user-to-telegram.dto";

export const ApiConnectUserToTelegram = () =>
    applyDecorators(
        ApiOperation({ summary: "Привязка пользователя к телеграм аккаунту по коду" }),
        ApiBaseResponse(200, ConnectUserToTelegramResponseDto, "Пользователь успешно привязан"),
        ApiErrorResponse(400, "ConnectUserToTelegramInvalidCode", "Code invalid!", "Код не действителен"),
        ApiErrorResponse(409, "ConnectUserToTelegramConflict", "Account already connected!", "Аккаунт уже привязан"),
    );
