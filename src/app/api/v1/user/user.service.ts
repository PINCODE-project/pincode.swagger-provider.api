import { Injectable, NotFoundException } from "@nestjs/common";
import { AuthMethod } from "@prisma";
import { hash } from "argon2";

import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "@/modules/prisma/prisma.service";

@Injectable()
export class UserService {
    public constructor(private readonly prismaService: PrismaService) {}

    public async findById(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: { id },
            include: { accounts: true },
        });

        if (!user) {
            throw new NotFoundException("User not found!");
        }

        return { user };
    }

    public async getProfile(id: string) {
        const user = await this.prismaService.user.findUnique({
            where: { id },
            include: {
                accounts: true,
                subscription: true,
                telegram_accounts: true,
            },
        });

        if (!user) {
            throw new NotFoundException("User not found!");
        }

        // Преобразуем telegram_accounts в telegramAccounts для соответствия entity
        const { telegram_accounts, ...userData } = user;

        return {
            user: {
                ...userData,
                telegramAccounts: telegram_accounts,
            },
        };
    }

    public async findByEmail(email: string) {
        return this.prismaService.user.findUnique({
            where: {
                email,
            },
            include: {
                accounts: true,
            },
        });
    }

    public async create(
        email: string,
        password: string,
        displayName: string,
        picture: string,
        method: AuthMethod,
        isVerified: boolean,
    ) {
        const user = await this.prismaService.user.create({
            data: {
                email,
                password: password ? await hash(password) : "",
                displayName,
                picture,
                method,
                isVerified,
            },
            include: {
                accounts: true,
            },
        });

        return user;
    }

    public async update(userId: string, dto: UpdateUserDto) {
        const { user: foundUser } = await this.findById(userId);

        const user = await this.prismaService.user.update({
            where: {
                id: foundUser.id,
            },
            data: {
                email: dto.email,
                displayName: dto.displayName,
                isTwoFactorEnabled: dto.isTwoFactorEnabled,
            },
        });

        return { user };
    }
}
