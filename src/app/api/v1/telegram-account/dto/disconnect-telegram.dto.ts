import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class DisconnectTelegramDto {
    @ApiProperty({
        type: "string",
        format: "uuid",
        description: "ID телеграм-аккаунта для отвязки",
        example: "4dbee41b-de92-497c-84ba-9f4530ad8101",
    })
    @IsUUID(4, { message: "ID должен быть валидным UUID" })
    id: string;
}

export class DisconnectTelegramResponseDto {
    @ApiProperty({
        description: "Сообщение об успешной отвязке",
        example: "Telegram account disconnected successfully",
    })
    message: string;
}
