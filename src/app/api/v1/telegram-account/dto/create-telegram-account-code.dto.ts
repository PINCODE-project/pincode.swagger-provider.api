import { PickType } from "@nestjs/swagger";
import { TelegramAccount } from "@/api/v1/telegram-account/entities/telegram-account.entity";

export class CreateTelegramAccountCodeDto extends PickType(TelegramAccount, ["telegramId", "firstName", "lastName", "username"]) {
}
