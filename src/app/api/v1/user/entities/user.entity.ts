import { ApiProperty } from "@nestjs/swagger";
import { AuthMethod, UserRole } from "@prisma";
import { IsBoolean, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { Subscription } from "./subscription.entity";
import { TelegramAccount } from "@/api/v1/telegram-account/entities/telegram-account.entity";

export class User {
    @ApiProperty({
        type: "string",
        format: "uuid",
        description: "Уникальный идентификатор пользователя",
        example: "e26ad02b-c96c-44ec-b6ee-633c3dab3c4f",
    })
    @IsUUID()
    id: string;

    @ApiProperty({
        description: "Электронная почта пользователя",
        example: "test@mail.ru",
    })
    @IsEmail({}, { message: "Некорректный формат email" })
    @IsNotEmpty({ message: "Email обязателен для заполнения" })
    email: string;

    @ApiProperty({
        description: "Отображаемое имя пользователя",
        example: "Test",
    })
    @IsString({ message: "Имя должно быть строкой" })
    @IsNotEmpty({ message: "Имя обязательно для заполнения" })
    displayName: string;

    @ApiProperty({
        description: "URL аватара пользователя",
        example: "",
        required: false,
    })
    @IsString({ message: "URL аватара должен быть строкой" })
    picture: string;

    @ApiProperty({
        enum: UserRole,
        description: "Роль пользователя в системе",
        example: UserRole.REGULAR,
    })
    @IsEnum(UserRole)
    role: UserRole;

    @ApiProperty({
        description: "Подтвержден ли пользователь",
        example: true,
    })
    @IsBoolean({ message: "isVerified должно быть булевым значением" })
    isVerified: boolean;

    @ApiProperty({
        description: "Включена ли двухфакторная аутентификация",
        example: false,
    })
    @IsBoolean({ message: "isTwoFactorEnabled должно быть булевым значением" })
    isTwoFactorEnabled: boolean;

    @ApiProperty({
        enum: AuthMethod,
        description: "Метод аутентификации пользователя",
        example: AuthMethod.CREDENTIALS,
    })
    @IsEnum(AuthMethod)
    method: AuthMethod;

    @ApiProperty({
        type: () => Subscription,
        description: "Подписка пользователя",
        required: false,
    })
    @IsOptional()
    subscription?: Subscription | null;

    @ApiProperty({
        type: () => TelegramAccount,
        description: "Подключенные телеграм-аккаунты",
        required: false,
        isArray: true,
    })
    @IsOptional()
    telegramAccounts?: TelegramAccount[];

    @ApiProperty({
        type: "string",
        format: "date-time",
        description: "Дата и время создания профиля",
        example: "2025-04-13T18:08:45.639Z",
    })
    createdAt: string;

    @ApiProperty({
        type: "string",
        format: "date-time",
        description: "Дата и время последнего обновления профиля",
        example: "2025-04-13T18:08:45.639Z",
    })
    updatedAt: string;
}
