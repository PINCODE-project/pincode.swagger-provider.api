import { IsBoolean, IsEmail, IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class UpdateUserDto {
    @ApiProperty()
    @IsString({ message: "Имя должно быть строкой." })
    @IsNotEmpty({ message: "Имя обязательно для заполнения." })
    name: string;

    @ApiProperty()
    @IsString({ message: "Email должен быть строкой." })
    @IsEmail({}, { message: "Некорректный формат email." })
    @IsNotEmpty({ message: "Email обязателен для заполнения." })
    email: string;

    @ApiProperty()
    @IsBoolean({ message: "isTwoFactorEnabled должно быть булевым значением." })
    isTwoFactorEnabled: boolean;
}
