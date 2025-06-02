import { BadRequestException, ConflictException, forwardRef, Inject, Injectable } from "@nestjs/common";
import { PrismaService } from "@/modules/prisma/prisma.service";
import { CreateTelegramAccountCodeDto } from "@/api/v1/telegram-account/dto/create-telegram-account-code.dto";
import * as crypto from "crypto";
import { ConnectUserToTelegramDto } from "@/api/v1/telegram-account/dto/connect-user-to-telegram.dto";
import { BotService } from "@/bot/bot.service";

@Injectable()
export class TelegramAccountService {
    constructor(
        private readonly prismaService: PrismaService,
        @Inject(forwardRef(() => BotService)) private readonly botService: BotService,
    ) {}

    async createCode(dto: CreateTelegramAccountCodeDto) {
        const firstPart = crypto.randomBytes(16).toString("hex");
        const secondPart = crypto.randomBytes(48).toString("hex");
        const randomCode = `${firstPart}:${secondPart}`;

        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 10);

        return this.prismaService.userTelegramCode.create({
            data: {
                telegramId: dto.telegramId,
                firstName: dto.firstName,
                lastName: dto.lastName,
                username: dto.username,
                code: randomCode,
                expiresAt: expiresAt,
            },
        });
    }

    async connectUserToTelegram(userId: string, dto: ConnectUserToTelegramDto) {
        // Очищаем просроченные коды
        await this.prismaService.userTelegramCode.deleteMany({
            where: {
                expiresAt: {
                    lt: new Date(),
                },
            },
        });

        const code = await this.prismaService.userTelegramCode.findFirst({
            where: {
                code: dto.code,
                expiresAt: {
                    gte: new Date(),
                },
            },
        });

        if (!code) {
            throw new BadRequestException("Code invalid!");
        }

        const accountExist = await this.prismaService.userTelegramAccounts.findFirst({
            where: {
                userId: userId,
                telegramId: code.telegramId,
            },
        });

        if (accountExist) {
            throw new ConflictException("Account already connected!");
        }

        const account = await this.prismaService.userTelegramAccounts.create({
            data: {
                userId: userId,
                telegramId: code.telegramId,
                firstName: code.firstName,
                lastName: code.lastName,
                username: code.username,
            },
        });

        await this.prismaService.userTelegramCode.delete({
            where: {
                id: code.id,
            },
        });

        await this.botService.successConnect(code.telegramId);

        return { account };
    }
}
