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

export class CreateProjectResponseProjectDto {
    @ApiProperty({ type: "string", format: "uuid" })
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    emoji?: string;

    @ApiProperty()
    description?: string;

    @ApiProperty({ type: "string", format: "date-time" })
    createdAt: Date;

    @ApiProperty({ type: "string", format: "date-time" })
    updatedAt: Date;

    @ApiProperty({ type: "string", format: "uuid" })
    @IsUUID()
    workspaceId: string;
}

export class CreateProjectResponseDto {
    @ApiProperty({ type: () => CreateProjectResponseProjectDto })
    project: CreateProjectResponseProjectDto;
}
