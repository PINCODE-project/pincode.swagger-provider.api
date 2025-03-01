import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "@prisma/__generated__";

/**
 * Декоратор, который помогает получить информацию об авторизованном пользователе из токена (ID и email)
 * Пример использования:
 *     @Authorized("id") userId: string - получение ID
 */
export const Authorized = createParamDecorator((data: keyof User, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user[data] : user;
});
