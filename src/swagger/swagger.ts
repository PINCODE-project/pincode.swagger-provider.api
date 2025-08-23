import { INestApplication, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from "@nestjs/swagger";

import { SWAGGER_SERVERS, SWAGGER_TAGS } from "./swagger-tags.constants";
import { styles } from "./swagger-styles";
import { JWT_COOKIE_NAME } from "@/modules/auth/auth.constants";

export const setupSwagger = (app: INestApplication) => {
    const configService = app.get(ConfigService);
    const logger = new Logger();

    const docName: string = `${configService.getOrThrow<string>("APP_NAME")} Documentation`;
    const docDesc: string = "Сервис для объединения Swagger схем в одном месте";
    const docVersion: string = "1.0";
    const docPrefix: string = "/api/core/docs";

    const documentBuild = new DocumentBuilder()
        .setTitle(docName)
        .setDescription(docDesc)
        .setVersion(docVersion)
        .addCookieAuth(JWT_COOKIE_NAME, {
            type: "apiKey",
            in: "cookie",
            name: JWT_COOKIE_NAME,
            description: "JWT токен в httpOnly куки для авторизации",
        })
        .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "accessToken-header");

    SWAGGER_TAGS.forEach((tag) => {
        documentBuild.addTag(tag.name, tag.description);
    });

    SWAGGER_SERVERS.forEach((server) => {
        documentBuild.addServer(server);
    });

    const documentBuilt = documentBuild.build();

    const document = SwaggerModule.createDocument(app, documentBuilt, {
        deepScanRoutes: true,
    });

    const customOptions: SwaggerCustomOptions = {
        swaggerOptions: {
            docExpansion: "list",
            persistAuthorization: true,
            displayOperationId: false,
            operationsSorter: "method",
            tryItOutEnabled: true,
            filter: false,
        },
        customCss: styles,
    };

    SwaggerModule.setup(docPrefix, app, document, {
        jsonDocumentUrl: `${docPrefix}-json`,
        explorer: false,
        customSiteTitle: docName,
        customSwaggerUiPath: "./node_modules/swagger-ui-dist",
        ...customOptions,
    });
    logger.log(`📄 Swagger will serve on ${docPrefix}`);
};
