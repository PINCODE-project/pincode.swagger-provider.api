import { INestApplication, Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { DocumentBuilder, SwaggerCustomOptions, SwaggerModule } from "@nestjs/swagger";

import { SwaggerUI } from "./swagger-ui.class";
import { _SWAGGER_TAGS } from "./swagger-tags.constants";

export const setupSwagger = (app: INestApplication) => {
    const configService = app.get(ConfigService);
    const logger = new Logger();

    const docName: string = `${configService.getOrThrow<string>("APP_NAME")} Documentation`;
    const docDesc: string = "123";
    const docVersion: string = "1.0";
    const docPrefix: string = "/core/docs";

    const documentBuild = new DocumentBuilder()
        .setTitle(docName)
        .setDescription(docDesc)
        .setVersion(docVersion)
        .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "accessToken")
        .addBearerAuth({ type: "http", scheme: "bearer", bearerFormat: "JWT" }, "refreshToken");

    _SWAGGER_TAGS.forEach((tag) => {
        documentBuild.addTag(tag.name, tag.description);
    });

    const documentBuilt = documentBuild.build();

    const document = SwaggerModule.createDocument(app, documentBuilt, {
        deepScanRoutes: true,
    });
    const customOptions: SwaggerCustomOptions = {
        swaggerOptions: {
            docExpansion: "none",
            persistAuthorization: true,
            displayOperationId: true,
            operationsSorter: "method",
            tryItOutEnabled: true,
            filter: true,
        },
    };

    const swaggerUI = new SwaggerUI(configService.get<string>("app.url"));

    SwaggerModule.setup(docPrefix, app, document, {
        jsonDocumentUrl: `${docPrefix}-json`,
        explorer: true,
        customSiteTitle: docName,
        ...customOptions,
        ...swaggerUI.customOptions,
    });
    logger.log(`📄 Swagger will serve on ${docPrefix}`);
};
