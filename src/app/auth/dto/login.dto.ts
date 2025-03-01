import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class LoginDto {
    @ApiProperty()
    @IsString({ message: "Email должен быть строкой." })
    @IsEmail({}, { message: "Некорректный формат email." })
    @IsNotEmpty({ message: "Email обязателен для заполнения." })
    email: string;

    @ApiProperty()
    @IsString({ message: "Пароль должен быть строкой." })
    @IsNotEmpty({ message: "Поле пароль не может быть пустым." })
    @MinLength(6, { message: "Пароль должен содержать не менее 6 символов." })
    password: string;

    @ApiProperty()
    @IsOptional()
    @IsString()
    code?: string;
}
