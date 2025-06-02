import { ApiProperty } from "@nestjs/swagger";
import { AuthMethod, UserRole } from "@prisma";

export class GetProfileResponseDto {
    @ApiProperty({
        example: "e26ad02b-c96c-44ec-b6ee-633c3dab3c4f",
        description: "Уникальный идентификатор пользователя",
    })
    id: string;

    @ApiProperty({
        example: "test@mail.ru",
        description: "Электронная почта пользователя",
    })
    email: string;

    @ApiProperty({
        example: "Test",
        description: "Отображаемое имя пользователя",
    })
    displayName: string;

    @ApiProperty({ example: "", description: "URL аватара пользователя" })
    picture: string;

    @ApiProperty({
        enum: UserRole,
        example: "REGULAR",
        description: "Роль пользователя в системе",
    })
    role: UserRole;

    @ApiProperty({ example: true, description: "Подтвержден ли пользователь" })
    isVerified: boolean;

    @ApiProperty({
        example: false,
        description: "Включена ли двухфакторная аутентификация",
    })
    isTwoFactorEnabled: boolean;

    @ApiProperty({
        enum: AuthMethod,
        example: "CREDENTIALS",
        description: "Метод аутентификации пользователя",
    })
    method: AuthMethod;

    @ApiProperty({
        type: "string",
        format: "date-time",
        example: "2025-04-13T18:08:45.639Z",
        description: "Дата и время создания профиля",
    })
    createdAt: string;

    @ApiProperty({
        type: "string",
        format: "date-time",
        example: "2025-04-13T18:08:45.639Z",
        description: "Дата и время последнего обновления профиля",
    })
    updatedAt: string;
}
