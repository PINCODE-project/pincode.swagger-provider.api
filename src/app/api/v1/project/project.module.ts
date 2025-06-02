import { Module } from "@nestjs/common";

import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";
import { UserService } from "@/api/v1/user/user.service";

@Module({
    controllers: [ProjectController],
    providers: [ProjectService, UserService],
})
export class ProjectModule {}
