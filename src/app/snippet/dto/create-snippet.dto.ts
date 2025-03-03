import { ApiProperty } from "@nestjs/swagger";
import { IsJSON, IsNotEmpty, IsString } from "class-validator";

export class CreateSnippetDto {
    @ApiProperty({ description: "Название сниппета", example: "Креды для SP" })
    @IsString({ message: "Название должно быть строкой" })
    @IsNotEmpty({ message: "Название обязательно для заполнения" })
    name: string;

    @ApiProperty({ description: "JSON сниппета", example: '{ "login": "Test", "password": "P@ssw0rd" }' })
    @IsJSON({ message: "Сниппет должен быть JSON" })
    @IsNotEmpty({ message: "Сниппет обязателен для заполнения" })
    snippet: string;
}
