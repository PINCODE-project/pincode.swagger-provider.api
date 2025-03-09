import { MicroserviceType } from "@prisma/__generated__";
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMicroserviceDto {
    @ApiProperty()
    @IsString({ message: "Название должно быть строкой" })
    @IsNotEmpty({ message: "Название обязательно для заполнения" })
    name: string;

    @ApiProperty({ type: "enum", enum: MicroserviceType })
    @IsEnum(MicroserviceType)
    type: MicroserviceType;

    @ApiProperty()
    @IsString({ message: "Контент должен быть строкой" })
    content: string;

    @ApiProperty({ type: "string", format: "uuid" })
    @IsUUID()
    projectId?: string;

    @ApiProperty({ description: "Должна ли обновляться схема при её получении" })
    @IsBoolean({ message: "IsUpdateByGetScheme должен быть строкой" })
    isUpdateByGetScheme: boolean;
}
