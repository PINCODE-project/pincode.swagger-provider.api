import { ApiProperty, PickType } from "@nestjs/swagger";
import { Microservice } from "@/api/v1/microservice/entities/microservice.entity";

export class DeleteMicroserviceDto extends PickType(Microservice, ["id"]) {
}

export class DeleteMicroserviceResponseDto {
    @ApiProperty({ example: true, description: "Успешность удаления" })
    success: boolean;

    @ApiProperty({ example: "Microservice deleted successfully", description: "Сообщение об успешном удалении" })
    message: string;
}
