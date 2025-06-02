import { ApiProperty } from "@nestjs/swagger";

export class TelegramAccount {
    @ApiProperty({ type: "string", format: "uuid", example: "bdc9e27e-d669-4672-b435-c3b34fc28fcc" })
    id: string;

    @ApiProperty({ description: "ID пользователя в Телеграм", example: 1026510341 })
    telegramId: number;

    @ApiProperty({ description: "Имя пользователя в Телеграм", example: "Макс" })
    firstName: string;

    @ApiProperty({ description: "Фамилия пользователя в Телеграм", example: "Рожков" })
    lastName: string;

    @ApiProperty({ description: "Ник пользователя в Телеграм", example: "CatDevelops" })
    username: string;

    @ApiProperty({ type: "string", format: "date-time", example: "2025-05-31T05:47:11.275Z" })
    createdAt: string;

    @ApiProperty({ type: "string", format: "date-time", example: "2025-05-31T05:47:11.275Z" })
    updatedAt: string;

    @ApiProperty({ description: "ID пользователя в системе", example: "5a37f8a8-e966-462e-9e92-91c726053bc0" })
    userId: string;
}
