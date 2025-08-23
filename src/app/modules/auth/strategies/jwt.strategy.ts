import { ExtractJwt, Strategy } from "passport-jwt";
import { PassportStrategy } from "@nestjs/passport";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";
import { JWT_COOKIE_NAME } from "../auth.constants";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                // Пытаемся извлечь из куки в первую очередь
                (request: Request) => {
                    return request?.cookies?.[JWT_COOKIE_NAME];
                },
                // Fallback для случаев когда используется Authorization header (для тестов и API клиентов)
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: configService.getOrThrow("JWT_SECRET"),
        });
    }

    async validate(user: { id: string; login: string; role: string }) {
        return user;
    }
}
