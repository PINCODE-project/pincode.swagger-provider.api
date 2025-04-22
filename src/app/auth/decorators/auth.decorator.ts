import { applyDecorators, UseGuards } from "@nestjs/common";
import { UserRole } from "@prisma/__generated__";
import { ApiBearerAuth, ApiResponse } from "@nestjs/swagger";

import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "./roles.decorator";

import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";
import { getUnauthorizedError } from "@/libs/common/utils/get-errors";

/**
 * Декоратор, который отмечает запрос под авторизацией
 * Примеры использования:
 *     @Authorization() - запрос доступен всем авторизованным пользователям
 *     @Authorization(UserRole.ADMIN) - запрос доступен только админам
 */
export function Authorization(...roles: UserRole[]) {
    if (roles.length > 0) {
        return applyDecorators(
            Roles(...roles),
            UseGuards(JwtAuthGuard, RolesGuard),
            ApiBearerAuth("accessToken"),
            ApiResponse(getUnauthorizedError()),
        );
    }

    return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth("accessToken"), ApiResponse(getUnauthorizedError()));
}
