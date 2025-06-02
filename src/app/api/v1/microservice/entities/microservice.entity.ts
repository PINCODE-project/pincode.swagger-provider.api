import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsEnum, IsNotEmpty, IsString, IsUUID } from "class-validator";
import { MicroserviceType } from "@prisma";

export class Microservice {
    @ApiProperty({ type: "string", format: "uuid", description: "ID микросервиса", example: "4dbee41b-de92-497c-84ba-9f4530ad8101" })
    @IsUUID()
    id: string;

    @ApiProperty()
    @IsString({ message: "Название должно быть строкой" })
    @IsNotEmpty({ message: "Название обязательно для заполнения" })
    name: string;

    @ApiProperty({enum: MicroserviceType, example: MicroserviceType.URL})
    @IsEnum(MicroserviceType)
    type: MicroserviceType;

    @ApiProperty({ description: "Должна ли обновляться схема при её получении", example: true })
    @IsBoolean({ message: "IsUpdateByGetScheme должен быть строкой" })
    isUpdateByGetScheme: boolean;

    @ApiProperty({ type: "string", format: "date-time", example: "2025-05-31T05:47:11.275Z" })
    createdAt: string;

    @ApiProperty({ type: "string", format: "date-time", example: "2025-05-31T05:47:11.275Z" })
    updatedAt: string;

    @ApiProperty({ type: "string", format: "uuid", description: "ID проекта", example: "f0b18ded-0e02-45af-903e-4f3fe30a66f0" })
    @IsUUID()
    projectId: string;

    @ApiProperty({example: "https://backend-swagger.pincode-infra.ru/core/docs-json"})
    @IsString({ message: "Контент должен быть строкой" })
    content: string;
}

