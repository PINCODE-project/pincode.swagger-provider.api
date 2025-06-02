import { ApiProperty, PickType } from "@nestjs/swagger";
import { Project } from "@/api/v1/project/entities/project.entity";

export class CreateProjectDto extends PickType(Project, ["name", "icon", "description", "workspaceId"]) {}

export class CreateProjectResponseDto {
    @ApiProperty({ type: () => Project })
    project: Project;
}
