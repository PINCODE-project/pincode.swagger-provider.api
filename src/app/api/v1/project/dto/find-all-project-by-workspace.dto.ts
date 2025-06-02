import { ApiProperty, PickType } from "@nestjs/swagger";
import { IsUUID } from "class-validator";
import { MicroserviceType } from "@prisma";
import { Project } from "@/api/v1/project/entities/project.entity";

export class FindAllProjectByWorkspaceDto extends PickType(Project, ["workspaceId"]) {
}

export class FindAllProjectByWorkspaceResponseMicroserviceDto {
    @ApiProperty({ type: "string", format: "uuid" })
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    type: MicroserviceType;
}

export class FindAllProjectByWorkspaceResponseProjectDto extends Project {
    @ApiProperty({ type: () => FindAllProjectByWorkspaceResponseMicroserviceDto, isArray: true })
    microservices: FindAllProjectByWorkspaceResponseMicroserviceDto[];
}

export class FindAllProjectByWorkspaceResponseDto {
    @ApiProperty({ type: () => FindAllProjectByWorkspaceResponseProjectDto, isArray: true })
    projects: FindAllProjectByWorkspaceResponseProjectDto[];
}
