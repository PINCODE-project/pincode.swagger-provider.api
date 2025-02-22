import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";

export class FindAllProjectByWorkspaceDto {
    @ApiProperty({ type: "string", format: "uuid" })
    @IsUUID()
    workspaceId: string;
}
