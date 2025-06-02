import { Injectable } from "@nestjs/common";
import { Start, Update } from "@grammyjs/nestjs";
import { Context } from "grammy";
import { BotService } from "@/bot/bot.service";

@Update()
@Injectable()
export class BotController {
    constructor(private readonly botService: BotService) {}

    @Start()
    async onStart(ctx: Context): Promise<void> {
        await this.botService.onStart(ctx);
    }
}
