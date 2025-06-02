import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class Workspace {
    @ApiProperty({ type: "string", format: "uuid", example: "bdc9e27e-d669-4672-b435-c3b34fc28fcc" })
    @IsUUID()
    id: string;

    @ApiProperty({ example: "ПИН-КОД" })
    @IsString({ message: "Название должно быть строкой" })
    @IsNotEmpty({ message: "Название обязательно для заполнения" })
    name: string;

    @ApiPropertyOptional({ example: "🤝" })
    @IsString({ message: "Иконка должна быть строкой" })
    @IsOptional()
    icon?: string;

    @ApiPropertyOptional({ example: "Студенческая команда, которая уже 4 год создаёт крутые сервисы!" })
    @IsString({ message: "Описание должно быть строкой" })
    @IsOptional()
    description?: string;

    @ApiProperty({ type: "string", format: "date-time", example: "2025-05-31T05:47:11.275Z" })
    createdAt: Date;

    @ApiProperty({ type: "string", format: "date-time", example: "2025-05-31T05:47:11.275Z" })
    updatedAt: string;
}
