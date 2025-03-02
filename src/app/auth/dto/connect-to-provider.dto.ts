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
