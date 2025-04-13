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

export class CreateWorkspaceResponseWorkspaceDto {
    @ApiProperty({ type: "string", format: "uuid" })
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    emoji: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ type: "string", format: "date-time" })
    createdAt: Date;

    @ApiProperty({ type: "string", format: "date-time" })
    updatedAt: Date;
}

export class CreateWorkspaceResponseDto {
    @ApiProperty({ type: () => CreateWorkspaceResponseWorkspaceDto })
    workspace: CreateWorkspaceResponseWorkspaceDto;
}
