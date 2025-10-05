import { ApiProperty, PartialType, PickType } from "@nestjs/swagger";
import { Microservice } from "@/api/v1/microservice/entities/microservice.entity";
import { IsUUID } from "class-validator";

// DTO для параметра в URL
export class UpdateMicroserviceParamsDto {
    @ApiProperty({
        type: "string",
        format: "uuid",
        description: "ID микросервиса",
        example: "4dbee41b-de92-497c-84ba-9f4530ad8101",
    })
    @IsUUID()
    id: string;
}

// DTO для тела запроса - все поля опциональны
export class UpdateMicroserviceDto extends PartialType(
    PickType(Microservice, ["name", "type", "content", "isUpdateByGetScheme"]),
) {}

export class UpdateMicroserviceResponseDto {
    @ApiProperty({ type: () => Microservice })
    microservice: Microservice;
}
