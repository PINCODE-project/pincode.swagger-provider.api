import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { ProviderModule } from "./auth/provider/provider.module";
import { IS_DEV_ENV } from "./libs/common/utils/is-dev.util";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./user/user.module";
import { WorkspaceModule } from "./workspace/workspace.module";
import { ProjectModule } from "./project/project.module";
import { MicroserviceModule } from "./microservice/microservice.module";
import { SnippetModule } from "./snippet/snippet.module";
import { APP_FILTER, APP_INTERCEPTOR } from "@nestjs/core";
import { ResponseInterceptor } from "@/interceptors/response.interceptor";
import { LoggingMiddleware } from "@/middlewares/logging.middleware";
import { AppController } from "@/app.controller";
import { TerminusModule } from "@nestjs/terminus";
import { ServeStaticModule } from "@nestjs/serve-static";
import { join } from "path";
import { HttpExceptionFilter } from "@/filters/http.exception.filter";

@Module({
    controllers: [AppController],
    providers: [
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        },
        {
            provide: APP_FILTER,
            useClass: HttpExceptionFilter,
        },
    ],
    imports: [
        ConfigModule.forRoot({
            ignoreEnvFile: !IS_DEV_ENV,
            isGlobal: true,
        }),
        // ServeStaticModule.forRoot({
        //     rootPath: join(__dirname, "..", "..", "static"),
        //     serveRoot: "/api/static",
        // }),
        PrismaModule,
        AuthModule,
        UserModule,
        ProviderModule,
        WorkspaceModule,
        ProjectModule,
        MicroserviceModule,
        SnippetModule,
        TerminusModule,
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer): void {
        consumer.apply(LoggingMiddleware).forRoutes("*");
    }
}
