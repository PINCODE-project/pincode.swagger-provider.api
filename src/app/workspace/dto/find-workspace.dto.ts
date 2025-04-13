import { IsUUID } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";
import { $Enums } from "@prisma/__generated__";
import UserRole = $Enums.UserRole;

export class FindWorkspaceDto {
    @ApiProperty({ type: "string", format: "uuid" })
    @IsUUID()
    id: string;
}

export class FindWorkspaceResponseMemberDto {
    @ApiProperty({ type: "string", format: "uuid" })
    userId: string;

    @ApiProperty({ type: "enum", enum: UserRole })
    role: UserRole;
}

export class FindWorkspaceResponsePartDto {
    @ApiProperty({ type: "string", format: "uuid" })
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    emoji: string;

    @ApiProperty()
    description: string;

    @ApiProperty({ type: "string", format: "datetime" })
    createdAt: Date

    @ApiProperty({ type: "string", format: "datetime" })
    updatedAt: Date

    @ApiProperty({ type: () => FindWorkspaceResponseMemberDto, isArray: true })
    members: FindWorkspaceResponseMemberDto[]
}

export class FindWorkspaceResponseDto {
    @ApiProperty({ type: () => FindWorkspaceResponsePartDto })
    workspace: FindWorkspaceResponsePartDto;
}