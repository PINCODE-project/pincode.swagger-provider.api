import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty({ description: "Почта пользователя", example: "test@mail.ru" })
    @IsString({ message: "Email должен быть строкой." })
    @IsEmail({}, { message: "Некорректный формат email." })
    @IsNotEmpty({ message: "Email обязателен для заполнения." })
    email: string;

    @ApiProperty({ description: "Пароль пользователя", example: "P@ssw0rd" })
    @IsString({ message: "Пароль должен быть строкой." })
    @IsNotEmpty({ message: "Поле пароль не может быть пустым." })
    @MinLength(6, { message: "Пароль должен содержать не менее 6 символов." })
    password: string;

    // @ApiProperty({description: "Код для 2-х факторной авторизации (Сейчас не используется)", required: false })
    @IsOptional()
    @IsString()
    code?: string;
}

export class LoginResponseDto {
    @ApiProperty({ description: "Токен авторизации" })
    accessToken: string;
}
