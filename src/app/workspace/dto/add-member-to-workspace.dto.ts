import { IsUUID, IsEnum } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { WorkspaceMemberRole } from "@prisma/__generated__";

export class AddMemberToWorkspaceDto {
    @ApiProperty({ type: "string", format: "uuid" })
    @IsUUID()
    userId: string;

    @ApiProperty({ type: "string", format: "uuid" })
    @IsUUID()
    workspaceId?: string;

    @ApiProperty({ type: "enum", enum: WorkspaceMemberRole })
    @IsEnum(WorkspaceMemberRole)
    role: WorkspaceMemberRole;
}
