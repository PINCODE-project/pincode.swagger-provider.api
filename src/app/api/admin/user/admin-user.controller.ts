import { Body, Controller, Get, HttpCode, HttpStatus, Param, Patch, Res } from "@nestjs/common";
import { UserRole } from "@prisma";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { UpdateUserDto } from "./dto/update-user.dto";
import { AdminUserService } from "./admin-user.service";
import { Authorized } from "@/modules/auth/decorators/authorized.decorator";
import { Authorization } from "@/modules/auth/decorators/auth.decorator";
import { ApiErrorResponse } from "@/common/utils/base-response";
import { Response } from "express";

@ApiTags("admin-user")
@Controller("/v1/admin/user")
export class AdminUserController {
    constructor(private readonly adminUserService: AdminUserService) {}

    @ApiOperation({ summary: "Получение пользователя по ID WIP" })
    @ApiErrorResponse(
        409,
        "FindByIdAdminUserDoesntExist",
        "Пользователь не найден. Пожалуйста, проверьте введенные данные.",
        "Пользователь не найден",
    )
    @Authorization(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    @Get("by-id/:id")
    findById(@Param("id") id: string) {
        return this.adminUserService.findById(id);
    }

    @ApiOperation({ summary: "Обновление профиля пользователя WIP" })
    @ApiErrorResponse(
        409,
        "FindByIdAdminUserDoesntExist",
        "Пользователь не найден. Пожалуйста, проверьте введенные данные.",
        "Пользователь не найден",
    )
    @Authorization(UserRole.ADMIN)
    @HttpCode(HttpStatus.OK)
    @Patch("profile")
    updateProfile(@Authorized("id") userId: string, @Body() dto: UpdateUserDto) {
        return this.adminUserService.update(userId, dto);
    }
}
