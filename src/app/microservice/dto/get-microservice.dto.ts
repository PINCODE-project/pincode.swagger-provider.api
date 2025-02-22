import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";

export class GetMicroserviceDto {
    @ApiProperty({ type: "string", format: "uuid" })
    @IsUUID()
    id: string;
}
