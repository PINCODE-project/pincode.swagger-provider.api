import { ApiProperty } from "@nestjs/swagger";

import { FindWorkspaceResponsePartDto } from "./find-workspace.dto";

export class FindAllWorkspaceResponseDto {
    @ApiProperty({ type: () => FindWorkspaceResponsePartDto, isArray: true })
    workspaces: FindWorkspaceResponsePartDto[];
}
