import { IsEnum, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

import { ProviderEnum } from "./connect-to-provider.dto";

export class CallbackProviderParamDto {
    @ApiProperty({
        type: "enum",
        enum: ProviderEnum,
        description: "Провайдер авторизации",
        example: ProviderEnum.YANDEX,
    })
    @IsEnum(ProviderEnum)
    provider: ProviderEnum;
}

export class CallbackProviderQueryDto {
    @ApiProperty({ description: "Код авторизации" })
    @IsString()
    code: string;
}
