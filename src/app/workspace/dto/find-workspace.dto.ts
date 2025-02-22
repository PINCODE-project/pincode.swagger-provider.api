import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class FindWorkspaceDto {
    @ApiProperty({ type: "string", format: "uuid" })
    @IsUUID()
    id: string;
}
