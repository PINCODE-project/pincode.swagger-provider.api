import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { UserRole } from "@prisma/__generated__";

import { ROLES_KEY } from "../decorators/roles.decorator";

/**
 * Системный гвард для проверки ролей, не используется напрямую
 *
 * Для установки роли в авторизованный гвард используйте @Authorization(UserRole.ADMIN) декоратор
 */
@Injectable()
export class RolesGuard implements CanActivate {
    public constructor(private readonly reflector: Reflector) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const roles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const request = context.switchToHttp().getRequest();

        if (!roles) return true;

        if (!roles.includes(request.user.role)) {
            throw new ForbiddenException("Недостаточно прав. У вас нет прав доступа к этому ресурсу.");
        }

        return true;
    }
}
