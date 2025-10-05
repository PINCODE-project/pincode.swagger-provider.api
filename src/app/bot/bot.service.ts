import { InjectBot } from "@grammyjs/nestjs";
import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { Bot, Context } from "grammy";
import { TelegramAccountService } from "@/api/v1/telegram-account/telegram-account.service";
import { PrismaService } from "@/modules/prisma/prisma.service";

@Injectable()
export class BotService {
    constructor(
        @InjectBot() private readonly bot: Bot<Context>,
        private readonly prismaService: PrismaService,
        @Inject(forwardRef(() => TelegramAccountService))
        private readonly telegramAccountService: TelegramAccountService,
    ) {}

    async onStart(ctx: Context) {
        const userExist = await this.prismaService.userTelegramAccounts.findFirst({
            where: {
                telegramId: ctx.from?.id,
            },
        });

        const codeExist = await this.prismaService.userTelegramCode.findFirst({
            where: {
                telegramId: ctx.from?.id,
            },
        });

        if (!userExist) {
            if (!codeExist) {
                await ctx.reply(
                    "👋 Привет! Это бот уведомлений сервиса Swagger-Provider.\nМы помогаем следить за изменениями в OpenAPI схемах ваших микросервисов. И автоматически уведомим вас, если в одной из схем произошли изменения",
                );
            }

            const code = await this.telegramAccountService.createCode({
                telegramId: ctx.from?.id ?? 0,
                firstName: ctx.from?.first_name ?? "",
                lastName: ctx.from?.last_name ?? "",
                username: ctx.from?.username ?? "",
            });

            await ctx.reply(
                `🔐 Ваш код авторизации: \n\`${code.code}\`\n\nВставьте код в форму привязки аккаунта\nКод действует в течение 10 минут`,
                { parse_mode: "MarkdownV2" },
            );
        } else {
            await ctx.reply("Вы уже авторизованы");
        }

        // Очищаем просроченные коды
        await this.prismaService.userTelegramCode.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });
    }

    async successConnect(telegramId: number) {
        await this.bot.api.sendMessage(telegramId, "🎉 Вы успешно привязали аккаунт!");
    }

    async sendSchemaUpdateNotification(telegramId: number, changelog: string) {
        try {
            await this.bot.api.sendMessage(telegramId, changelog, { parse_mode: "MarkdownV2" });
        } catch (error) {
            console.error(`Failed to send schema update notification to ${telegramId}:`, error);
        }
    }

    async sendSchemaUpdateNotificationToMultiple(telegramIds: number[], changelog: string) {
        const promises = telegramIds.map((telegramId) => this.sendSchemaUpdateNotification(telegramId, changelog));
        await Promise.allSettled(promises);
    }
}
