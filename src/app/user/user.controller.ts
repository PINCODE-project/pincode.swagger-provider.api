import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch } from "@nestjs/common";
import { UserRole } from "@prisma/__generated__";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { UpdateUserDto } from "./dto/update-user.dto";
import { UserService } from "./user.service";

import { Authorization } from "@/auth/decorators/auth.decorator";
import { Authorized } from "@/auth/decorators/authorized.decorator";
import { GetProfileResponseDto } from "@/user/dto/get-profile.dto";
import { ApiBaseResponse } from "@/libs/common/utils/base-response";

@ApiTags("user")
@Controller("user")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: "Получение профиля пользователя" })
    @ApiBaseResponse(GetProfileResponseDto, "Профиль пользователя")
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Get("profile")
    findProfile(@Authorized("id") userId: string) {
        return this.userService.findById(userId);
    }

    @ApiOperation({ summary: "Получение пользователя по ID" })
    @Authorization(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    @Get("by-id/:id")
    findById(@Param("id") id: string) {
        return this.userService.findById(id);
    }

    @ApiOperation({ summary: "Обновление профиля пользователя" })
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Patch("profile")
    updateProfile(@Authorized("id") userId: string, @Body() dto: UpdateUserDto) {
        return this.userService.update(userId, dto);
    }
}
