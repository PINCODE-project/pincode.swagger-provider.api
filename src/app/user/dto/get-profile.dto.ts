import { ApiProperty } from "@nestjs/swagger";
import { AuthMethod, UserRole } from "@prisma/__generated__";

export class GetProfileResponseDto {
    @ApiProperty({ example: "e26ad02b-c96c-44ec-b6ee-633c3dab3c4f" })
    id: string;

    @ApiProperty({ example: "test@mail.ru" })
    email: string;

    @ApiProperty({ example: "Test" })
    displayName: string;

    @ApiProperty({ example: "" })
    picture: string;

    @ApiProperty({ type: "enum", enum: UserRole, example: "REGULAR" })
    role: UserRole;

    @ApiProperty({ example: true })
    isVerified: boolean;

    @ApiProperty({ example: false })
    isTwoFactorEnabled: boolean;

    @ApiProperty({ example: "CREDENTIALS" })
    method: AuthMethod;

    @ApiProperty({ type: "string", format: "date-time", example: "2025-04-13T18:08:45.639Z" })
    createdAt: string;

    @ApiProperty({ type: "string", format: "date-time", example: "2025-04-13T18:08:45.639Z" })
    updatedAt: string;
}
