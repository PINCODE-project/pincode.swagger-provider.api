import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsUUID } from "class-validator";

export class Server {
    @ApiProperty({
        type: "string",
        format: "uuid",
        description: "ID микросервиса",
        example: "4dbee41b-de92-497c-84ba-9f4530ad8101"
    })
    @IsUUID()
    id: string;

    @ApiProperty({ description: "Ссылка на сервер", example: "http://localhost:9001/" })
    @IsString({ message: "Ссылка должна быть строкой" })
    @IsNotEmpty({ message: "Ссылка обязательна для заполнения" })
    url: string;

    @ApiProperty({description: "Описание сервера", example: "Локальная разработка"})
    @IsString({ message: "Описание должно быть строкой" })
    @IsNotEmpty({ message: "Описание обязательно для заполнения" })
    description: string;

    @ApiProperty({ type: "string", format: "date-time", example: "2025-05-31T05:47:11.275Z" })
    createdAt: string;

    @ApiProperty({ type: "string", format: "date-time", example: "2025-05-31T05:47:11.275Z" })
    updatedAt: string;

    @ApiProperty({
        type: "string",
        format: "uuid",
        description: "ID микросервиса",
        example: "4dbee41b-de92-497c-84ba-9f4530ad8101"
    })
    @IsUUID()
    microserviceId: string;
}

