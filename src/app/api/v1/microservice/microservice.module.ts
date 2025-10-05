import { forwardRef, Module } from "@nestjs/common";

import { MicroserviceService } from "./microservice.service";
import { MicroserviceController } from "./microservice.controller";
import { UserService } from "@/api/v1/user/user.service";
import { BotModule } from "@/bot/bot.module";

@Module({
    imports: [forwardRef(() => BotModule)],
    controllers: [MicroserviceController],
    providers: [MicroserviceService, UserService],
})
export class MicroserviceModule {}
