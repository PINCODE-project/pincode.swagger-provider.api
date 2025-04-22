import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

import { CreateSnippetDto } from "./create-snippet.dto";

export class UpdateSnippetParamDto {
    @ApiProperty({ description: "ID сниппета", example: "8a518a8e-d9d1-4069-a4d4-d05ab376fc6d" })
    @IsString({ message: "Id должен быть строкой" })
    @IsNotEmpty({ message: "ID обязателен для заполнения" })
    id: string;
}

export class UpdateSnippetDto extends PartialType(CreateSnippetDto) {}
