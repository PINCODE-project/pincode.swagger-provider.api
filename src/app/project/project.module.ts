import { Module } from "@nestjs/common";

import { ProjectService } from "./project.service";
import { ProjectController } from "./project.controller";

import { UserService } from "@/user/user.service";

@Module({
    controllers: [ProjectController],
    providers: [ProjectService, UserService],
})
export class ProjectModule {}
