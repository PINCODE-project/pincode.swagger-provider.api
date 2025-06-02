import { Module } from "@nestjs/common";

import { WorkspaceService } from "./workspace.service";
import { WorkspaceController } from "./workspace.controller";
import { UserService } from "@/api/v1/user/user.service";

@Module({
    controllers: [WorkspaceController],
    providers: [WorkspaceService, UserService],
})
export class WorkspaceModule {}
