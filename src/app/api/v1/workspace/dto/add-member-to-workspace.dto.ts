import { ApiProperty, PickType } from "@nestjs/swagger";
import { WorkspaceMember } from "@/api/v1/workspace/entities/workspace-member.entity";

export class AddMemberToWorkspaceDto extends PickType(WorkspaceMember, ["userId", "workspaceId", "role"]) {}

export class AddMemberToWorkspaceResponseDto {
    @ApiProperty({ type: () => WorkspaceMember })
    workspaceMember: WorkspaceMember;
}
