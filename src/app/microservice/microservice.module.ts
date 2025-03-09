import { Module } from "@nestjs/common";

import { MicroserviceService } from "./microservice.service";
import { MicroserviceController } from "./microservice.controller";

import { UserService } from "@/user/user.service";
import { OpenapiSchemeService } from "@/openapi-scheme/openapi-scheme.service";

@Module({
    controllers: [MicroserviceController],
    providers: [MicroserviceService, UserService, OpenapiSchemeService],
})
export class MicroserviceModule {}
