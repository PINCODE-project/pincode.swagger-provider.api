import { Module } from "@nestjs/common";

import { MicroserviceService } from "./microservice.service";
import { MicroserviceController } from "./microservice.controller";
import { UserService } from "@/api/v1/user/user.service";


@Module({
    controllers: [MicroserviceController],
    providers: [MicroserviceService, UserService],
})
export class MicroserviceModule {}
