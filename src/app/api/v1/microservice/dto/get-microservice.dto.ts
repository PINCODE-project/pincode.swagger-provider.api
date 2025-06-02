import { ApiProperty, PickType } from "@nestjs/swagger";
import { Microservice } from "@/api/v1/microservice/entities/microservice.entity";
import { Server } from "@/api/v1/microservice/entities/server.entity";

export class GetMicroserviceDto extends PickType(Microservice, ["id"]) {
}

export class MicroserviceServer extends PickType(Server, ["url", "description"]) {
}

export class GetMicroserviceResponsePartDto extends Microservice {
    @ApiProperty({
        description: "Ссылка на микросервис",
        example: "https://backend-swagger.pincode-infra.ru/core/docs-json"
    })
    url: string;

    @ApiProperty({ type: () => MicroserviceServer, isArray: true })
    servers: MicroserviceServer[];

    @ApiProperty({ description: "Версия схемы", example: 0 })
    version: number;

    @ApiProperty({ description: "Статус микросервиса", example: "OFFLINE" })
    status: string;
}

export class GetMicroserviceResponseDto {
    @ApiProperty({ type: () => GetMicroserviceResponsePartDto })
    microservice: GetMicroserviceResponsePartDto
}
