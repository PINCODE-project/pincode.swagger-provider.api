import { ApiProperty, PickType } from "@nestjs/swagger";
import { Microservice } from "@/api/v1/microservice/entities/microservice.entity";

export class CreateMicroserviceDto extends PickType(Microservice, ["name", "type", "content", "projectId", "isUpdateByGetScheme"]) {
}

export class CreateMicroserviceResponseDto {
    @ApiProperty({ type: () => Microservice })
    microservice: Microservice
}