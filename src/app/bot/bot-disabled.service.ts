import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class BotDisabledService {
    private readonly logger = new Logger(BotDisabledService.name);

    async successConnect(telegramId: number): Promise<void> {
        this.logger.debug(`Telegram bot disabled, skip successConnect for ${telegramId}`);
    }

    async sendSchemaUpdateNotification(telegramId: number, changelog: string): Promise<void> {
        this.logger.debug(`Telegram bot disabled, skip notification for ${telegramId}`);
    }

    async sendSchemaUpdateNotificationToMultiple(telegramIds: number[], _changelog: string): Promise<void> {
        this.logger.debug(`Telegram bot disabled, skip notifications for ${telegramIds.length} users`);
    }
}
