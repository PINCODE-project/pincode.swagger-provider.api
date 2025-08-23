import { applyDecorators, UseGuards } from "@nestjs/common";
import { UserRole } from "@prisma";
import { ApiResponse, ApiCookieAuth } from "@nestjs/swagger";

import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "./roles.decorator";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { getUnauthorizedError } from "@/common/utils/get-errors";
import { JWT_COOKIE_NAME } from "../auth.constants";

/**
 * Декоратор, который отмечает запрос под авторизацией через куки
 * Примеры использования:
 *     @Authorization() - запрос доступен всем авторизованным пользователям
 *     @Authorization(UserRole.ADMIN) - запрос доступен только админам
 */
export function Authorization(...roles: UserRole[]) {
    if (roles.length > 0) {
        return applyDecorators(
            Roles(...roles),
            UseGuards(JwtAuthGuard, RolesGuard),
            ApiCookieAuth(JWT_COOKIE_NAME),
            ApiResponse(getUnauthorizedError()),
        );
    }

    return applyDecorators(
        UseGuards(JwtAuthGuard),
        ApiCookieAuth(JWT_COOKIE_NAME),
        ApiResponse(getUnauthorizedError()),
    );
}
