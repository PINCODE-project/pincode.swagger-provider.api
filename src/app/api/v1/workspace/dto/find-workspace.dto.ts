import { ApiProperty, PickType } from "@nestjs/swagger";
import { WorkspaceMemberRole } from "@prisma";
import { Workspace } from "@/api/v1/workspace/entities/workspace.entity";

export class FindWorkspaceDto extends PickType(Workspace, ["id"]) {
}

export class FindWorkspaceResponseMemberDto {
    @ApiProperty({ type: "string", format: "uuid", example: "5a37f8a8-e966-462e-9e92-91c726053bc0" })
    userId: string;

    @ApiProperty({ enum: WorkspaceMemberRole, example: WorkspaceMemberRole.SUPERADMIN })
    role: WorkspaceMemberRole;
}

export class FindWorkspaceResponsePartDto extends Workspace {
    @ApiProperty({ type: () => FindWorkspaceResponseMemberDto, isArray: true })
    members: FindWorkspaceResponseMemberDto[];
}

export class FindWorkspaceResponseDto {
    @ApiProperty({ type: () => FindWorkspaceResponsePartDto })
    workspace: FindWorkspaceResponsePartDto;
}
