import { NestFactory } from "@nestjs/core";
import { AppModule } from "@/app.module";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { setupSwagger } from "./swagger/swagger";

async function bootstrap() {
    const logger = new Logger();
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    const globalPrefix: string = "api";
    const appName: number = configService.getOrThrow<number>("APP_NAME");
    const port: number = configService.getOrThrow<number>("APPLICATION_PORT");
    const host: string = configService.getOrThrow<string>("APPLICATION_HOST");

    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix(globalPrefix);
    app.enableCors({
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        origin: [
            "http://localhost:5001",
            "https://swagger-provider.com",
            /\.pincode-infra\.ru$/,
            "http://51.250.91.179",
        ],
        credentials: true,
        allowedHeaders: ["Content-Type", "Authorization"],
    });
    setupSwagger(app);

    await app.listen(port, host);
    logger.log(`🚀 ${appName} service started successfully on port ${port}`);
}

bootstrap();
