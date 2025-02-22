import { IsNotEmpty, IsOptional, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateWorkspaceDto {
    @ApiProperty()
    @IsString({ message: "Название должно быть строкой" })
    @IsNotEmpty({ message: "Название обязательно для заполнения" })
    name: string;

    @ApiProperty()
    @IsString({ message: "Иконка должна быть строкой" })
    @IsOptional()
    emoji?: string;

    @ApiProperty()
    @IsString({ message: "Описание должно быть строкой" })
    @IsOptional()
    description?: string;
}
