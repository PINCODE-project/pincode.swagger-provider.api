import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { MicroserviceType } from "@prisma/__generated__";

export class GetMicroserviceDto {
    @ApiProperty({ type: "string", format: "uuid" })
    @IsUUID()
    id: string;
}

export class GetMicroserviceResponseDto {
    @ApiProperty({ type: "string", format: "uuid", example: "b1982528-ea25-4598-ae19-b14976c6fbc3" })
    id: string;

    @ApiProperty({ example: "Обучение (Темы, разделы, уровни)" })
    name: string;

    @ApiProperty({ type: "enum", enum: MicroserviceType, example: "URL" })
    type: MicroserviceType;

    @ApiProperty({ example: "https://backend-swagger.pincode-infra.ru/core/docs-json" })
    url: string;

    @ApiProperty({ type: "string", format: "date-time", example: "2025-04-13T18:08:45.639Z" })
    createdAt: string;

    @ApiProperty({ type: "string", format: "date-time", example: "2025-04-13T18:08:45.639Z" })
    updatedAt: string;

    @ApiProperty({ example: "0a999230-b5ba-4c63-a501-224bc20d1712" })
    projectId: string;

    servers: any[];

    @ApiProperty({ example: 0 })
    version: number;

    @ApiProperty({ example: "OFFLINE" })
    status: string;

    @ApiProperty({ example: "0a999230-b5ba-4c63-a501-224bc20d1712" })
    content: string;
}
