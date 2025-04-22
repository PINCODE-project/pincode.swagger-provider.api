import { Logger, ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "@nestjs/config";

import { setupSwagger } from "./swagger/swagger";

import { AppModule } from "@/app.module";

async function bootstrap() {
    const logger = new Logger();
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);

    const port: number = configService.getOrThrow<number>("APPLICATION_PORT");
    const host: string = configService.getOrThrow<string>("APPLICATION_HOST");
    const globalPrefix: string = "/api";

    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix(globalPrefix);
    app.enableCors({
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        origin: ["http://localhost:5001", "https://swagger-provider.com", /\.pincode-infra\.ru$/],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    });

    setupSwagger(app);
    await app.listen(port, host);

    logger.log(`🚀 ${configService.getOrThrow("APP_NAME")} service started successfully on port ${port}`);
}

bootstrap();
