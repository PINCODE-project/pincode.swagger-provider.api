import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";
import { TelegramAccount } from "@/api/v1/telegram-account/entities/telegram-account.entity";

export class ConnectUserToTelegramDto {
    @ApiProperty({
        description: "Авторизационный код",
        example:
            "6c052c08200ad0f76726dc25e3bcdd46:255146de4a3640402aab46484fb73866968ddaa1d3fa4172cb1524731ef2bdb4e16a023f23020b42a42e7ed47752f4db",
    })
    @IsString()
    code: string;
}

export class ConnectUserToTelegramResponseDto {
    @ApiProperty({ type: () => TelegramAccount })
    account: TelegramAccount;
}
