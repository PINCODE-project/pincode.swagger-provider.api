import { IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export enum ProviderEnum {
    YANDEX = "yandex",
    GITHUB = "github",
}

export class ConnectToProviderDto {
    @ApiProperty({
        type: "enum",
        enum: ProviderEnum,
        description: "Провайдер авторизации",
        example: ProviderEnum.YANDEX,
    })
    @IsEnum(ProviderEnum)
    provider: ProviderEnum;
}

export class ConnectToProviderResponseDto {
    @ApiProperty({
        description: "Ссылка для редиректа",
        example:
            "https://oauth.yandex.ru/authorize?response_type=code&client_id=6fa1e6565936416d91d4d151d5a1778a&redirect_uri=http%3A%2F%2Flocalhost%3A9001%2Fapi%2Fauth%2Foauth%2Fcallback%2Fyandex&scope=login%3Aemail+login%3Aavatar+login%3Ainfo&access_type=offline&prompt=select_account",
    })
    url: string;
}
