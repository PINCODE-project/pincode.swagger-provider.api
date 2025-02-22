import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateProjectDto {
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

    @ApiProperty({ type: "string", format: "uuid" })
    @IsUUID()
    workspaceId: string;
}
