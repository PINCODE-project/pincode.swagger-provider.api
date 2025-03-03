import { Module } from "@nestjs/common";
import { SnippetService } from "./snippet.service";
import { SnippetController } from "./snippet.controller";
import { UserService } from "@/user/user.service";

@Module({
    controllers: [SnippetController],
    providers: [SnippetService, UserService],
})
export class SnippetModule {}
