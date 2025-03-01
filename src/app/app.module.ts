import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "./auth/auth.module";
import { ProviderModule } from "./auth/provider/provider.module";
import { IS_DEV_ENV } from "./libs/common/utils/is-dev.util";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./user/user.module";
import { WorkspaceModule } from "./workspace/workspace.module";
import { ProjectModule } from "./project/project.module";
import { MicroserviceModule } from "./microservice/microservice.module";

@Module({
    imports: [
        ConfigModule.forRoot({
            ignoreEnvFile: !IS_DEV_ENV,
            isGlobal: true,
        }),
        PrismaModule,
        AuthModule,
        UserModule,
        ProviderModule,
        WorkspaceModule,
        ProjectModule,
        MicroserviceModule,
    ],
})
export class AppModule {}
