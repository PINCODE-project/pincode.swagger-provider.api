import { applyDecorators, UseGuards } from "@nestjs/common";
import { UserRole } from "@prisma/__generated__";
import { RolesGuard } from "../guards/roles.guard";
import { Roles } from "./roles.decorator";
import { ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "@/auth/guards/jwt-auth.guard";

/**
 * Декоратор, который отмечает запрос под авторизацией
 * Примеры использования:
 *     @Authorization() - запрос доступен всем авторизованным пользователям
 *     @Authorization(UserRole.ADMIN) - запрос доступен только админам
 */
export function Authorization(...roles: UserRole[]) {
    if (roles.length > 0) {
        return applyDecorators(Roles(...roles), UseGuards(JwtAuthGuard, RolesGuard), ApiBearerAuth("accessToken"));
    }

    return applyDecorators(UseGuards(JwtAuthGuard), ApiBearerAuth("accessToken"));
}
