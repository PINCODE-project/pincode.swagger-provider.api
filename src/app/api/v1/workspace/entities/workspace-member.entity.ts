import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty, IsUUID } from "class-validator";
import { WorkspaceMemberRole } from "@prisma";

export class WorkspaceMember {
    @ApiProperty({ type: "string", format: "uuid", example: "bdc9e27e-d669-4672-b435-c3b34fc28fcc" })
    id: string;

    @ApiProperty({ example: WorkspaceMemberRole.SUPERADMIN })
    @IsEnum(WorkspaceMemberRole)
    @IsNotEmpty({ message: "Role is required!" })
    role: WorkspaceMemberRole;

    @ApiProperty({ type: "string", format: "uuid", example: "c0575c0a-fe61-43e4-add5-5f326bdaa7f0" })
    @IsUUID()
    @IsNotEmpty({ message: "WorkspaceId is required!" })
    workspaceId: string;

    @ApiProperty({ type: "string", format: "uuid", example: "f789c03a-df3d-49bc-9f0d-bb1d0a65a7e1" })
    @IsUUID()
    @IsNotEmpty({ message: "UserId is required!" })
    userId: string;

    @ApiProperty({ type: "string", format: "date-time", example: "2025-05-31T05:47:11.275Z" })
    createdAt: string;

    @ApiProperty({ type: "string", format: "date-time", example: "2025-05-31T05:47:11.275Z" })
    updatedAt: string;
}
