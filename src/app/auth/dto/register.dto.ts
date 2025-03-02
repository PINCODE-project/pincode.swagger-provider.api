import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class RegisterDto {
    @ApiProperty({ description: "Логин пользователя", example: "CatDev" })
    @IsString({ message: "Имя должно быть строкой." })
    @IsNotEmpty({ message: "Имя обязательно для заполнения." })
    name: string;

    @ApiProperty({ description: "Почта пользователя", example: "test@mail.ru" })
    @IsString({ message: "Email должен быть строкой." })
    @IsEmail({}, { message: "Некорректный формат email." })
    @IsNotEmpty({ message: "Email обязателен для заполнения." })
    email: string;

    @ApiProperty({ description: "Пароль пользователя", example: "P@ssw0rd" })
    @IsString({ message: "Пароль должен быть строкой." })
    @IsNotEmpty({ message: "Пароль обязателен для заполнения." })
    @MinLength(6, {
        message: "Пароль должен содержать минимум 6 символов.",
    })
    password: string;
}
