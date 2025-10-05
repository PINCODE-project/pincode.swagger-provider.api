import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";

import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";
import { Authorized } from "@/modules/auth/decorators/authorized.decorator";
import { Authorization } from "@/modules/auth/decorators/auth.decorator";
import { ApiGetProfile, ApiUpdateProfile } from "./user.swagger";

@ApiTags("user")
@Controller("/v1/user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiGetProfile()
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Get("profile")
    findProfile(@Authorized("id") userId: string) {
        return this.userService.findById(userId);
    }

    @ApiUpdateProfile()
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Patch("profile")
    updateProfile(@Authorized("id") userId: string, @Body() dto: UpdateUserDto) {
        return this.userService.update(userId, dto);
    }
}
