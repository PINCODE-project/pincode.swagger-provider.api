import { ApiProperty } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { MicroserviceType } from "@prisma/__generated__";

export class FindAllProjectByWorkspaceDto {
    @ApiProperty({ type: "string", format: "uuid" })
    @IsUUID()
    workspaceId: string;
}

export class FindAllProjectByWorkspaceResponseMicroserviceDto {
    @ApiProperty({ type: "string", format: "uuid" })
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty({ type: "enum", enum: MicroserviceType })
    type: MicroserviceType;
}

export class FindAllProjectByWorkspaceResponseProjectDto {
    @ApiProperty({ type: "string", format: "uuid" })
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    emoji?: string;

    @ApiProperty()
    description?: string;

    @ApiProperty({ type: "string", format: "date-time" })
    createdAt: Date;

    @ApiProperty({ type: "string", format: "date-time" })
    updatedAt: Date;

    @ApiProperty({ type: "string", format: "uuid" })
    workspaceId: string;

    @ApiProperty({ type: () => FindAllProjectByWorkspaceResponseMicroserviceDto, isArray: true })
    microservices: FindAllProjectByWorkspaceResponseMicroserviceDto[];
}

export class FindAllProjectByWorkspaceResponseDto {
    @ApiProperty({ type: () => FindAllProjectByWorkspaceResponseProjectDto, isArray: true })
    projects: FindAllProjectByWorkspaceResponseProjectDto[];
}
