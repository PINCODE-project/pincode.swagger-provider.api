import { ApiProperty, PickType } from "@nestjs/swagger";
import { Workspace } from "@/api/v1/workspace/entities/workspace.entity";

export class CreateWorkspaceDto extends PickType(Workspace, ["name", "icon", "description"]) {}

export class CreateWorkspaceResponseDto {
    @ApiProperty({ type: () => Workspace })
    workspace: Workspace;
}
