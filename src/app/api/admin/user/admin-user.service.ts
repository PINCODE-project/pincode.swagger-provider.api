import { Injectable, NotFoundException } from "@nestjs/common";
import { AuthMethod } from "@prisma";
import { hash } from "argon2";

import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "@/modules/prisma/prisma.service";

@Injectable()
export class AdminUserService {
    public constructor(private readonly prismaService: PrismaService) {}

    public async findById(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: {
                id,
            },
            include: {
                accounts: true,
            },
        });

        if (!user) {
            throw new NotFoundException("Пользователь не найден. Пожалуйста, проверьте введенные данные.");
        }

        return user;
    }

    public async update(userId: string, dto: UpdateUserDto) {
        const user = await this.findById(userId);

        const updatedUser = await this.prismaService.user.update({
            where: {
                id: user.id,
            },
            data: {
                email: dto.email,
                displayName: dto.name,
                isTwoFactorEnabled: dto.isTwoFactorEnabled,
            },
        });

        return updatedUser;
    }
}
