import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";
import IORedis from "ioredis";
import RedisStore from "connect-redis";
import session from "express-session";

import { setupSwagger } from "./swagger/swagger";

import { AppModule } from "@/app.module";
import { ms, StringValue } from "@/libs/common/utils/ms.util";
import { parseBoolean } from "@/libs/common/utils/parse-boolean.util";
import helmet from "helmet";

async function bootstrap() {
    const logger = new Logger();
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const redis = new IORedis(configService.getOrThrow("REDIS_URI"), { keepAlive: 1000 });

    const port: number = configService.getOrThrow<number>("APPLICATION_PORT");
    const host: string = configService.getOrThrow<string>("APPLICATION_HOST");
    const globalPrefix: string = "/api";

    app.use(helmet());
    app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix(globalPrefix);
    app.enableCors({
        origin: ["http://localhost:5001", "https://swagger-provider.com"],
        credentials: true,
    });

    app.use(
        session({
            secret: configService.getOrThrow<string>("SESSION_SECRET"),
            name: configService.getOrThrow<string>("SESSION_NAME"),
            resave: true,
            saveUninitialized: false,
            cookie: {
                domain: configService.getOrThrow<string>("SESSION_DOMAIN"),
                maxAge: ms(configService.getOrThrow<StringValue>("SESSION_MAX_AGE")),
                httpOnly: parseBoolean(configService.getOrThrow<string>("SESSION_HTTP_ONLY")),
                secure: parseBoolean(configService.getOrThrow<string>("SESSION_SECURE")),
                sameSite: "lax",
            },
            store: new RedisStore({
                client: redis,
                prefix: configService.getOrThrow<string>("SESSION_FOLDER"),
            }),
        }),
    );

    setupSwagger(app);
    await app.listen(port, host);

    logger.log(`🚀 ${configService.getOrThrow("APP_NAME")} service started successfully on port ${port}`);
}

bootstrap();
