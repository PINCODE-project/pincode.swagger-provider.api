import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch } from "@nestjs/common";
import { UserRole } from "@prisma";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";
import { ApiBaseResponse, ApiErrorResponse } from "@/common/utils/base-response";
import { GetProfileResponseDto } from "./dto/get-profile.dto";
import { Authorized } from "@/modules/auth/decorators/authorized.decorator";
import { Authorization } from "@/modules/auth/decorators/auth.decorator";

@ApiTags("user")
@Controller("/v1/user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: "Получение профиля пользователя" })
    @ApiBaseResponse(200, GetProfileResponseDto, "Профиль пользователя")
    @ApiErrorResponse(404, "FindProfileUserNotFound", "User not found!", "Пользователь не найден")
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Get("profile")
    findProfile(@Authorized("id") userId: string) {
        return this.userService.findById(userId);
    }

    @ApiOperation({ summary: "Обновление профиля пользователя" })
    @ApiBaseResponse(200, GetProfileResponseDto, "Обновлённый профиль пользователя")
    @ApiErrorResponse(404, "UpdateProfileUserNotFound", "User not found!", "Пользователь не найден")
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Patch("profile")
    updateProfile(@Authorized("id") userId: string, @Body() dto: UpdateUserDto) {
        return this.userService.update(userId, dto);
    }
}
