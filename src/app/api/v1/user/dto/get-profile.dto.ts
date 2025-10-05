import { ApiProperty } from "@nestjs/swagger";
import { User } from "@/api/v1/user/entities/user.entity";

export class GetProfileResponseDto {
    @ApiProperty({ type: () => User })
    user: User;
}
