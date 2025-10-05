import { ApiProperty, PickType } from "@nestjs/swagger";
import { User } from "@/api/v1/user/entities/user.entity";

export class UpdateUserDto extends PickType(User, ["email", "displayName", "isTwoFactorEnabled"]) {}

export class UpdateUserResponseDto {
    @ApiProperty({ type: () => User })
    user: User;
}
