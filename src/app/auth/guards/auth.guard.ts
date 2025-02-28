import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

import { UserService } from "@/user/user.service";

@Injectable()
export class AuthGuard implements CanActivate {
    public constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) {}

    public async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            throw new UnauthorizedException(
                "Пользователь не авторизован. Пожалуйста, войдите в систему, чтобы получить доступ.",
            );
        }

        const token = authHeader.split(" ")[1];

        try {
            const payload = this.jwtService.verify(token);
            const user = await this.userService.findById(payload.sub);
            if (!user) {
                throw new UnauthorizedException("Пользователь не найден.");
            }
            // @ts-ignore
            request.user = user;
            return true;
        } catch (error) {
            throw new UnauthorizedException("Неверный или просроченный токен.");
        }
    }
}
