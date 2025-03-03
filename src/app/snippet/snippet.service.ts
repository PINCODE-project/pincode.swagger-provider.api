import { BadRequestException, Injectable } from "@nestjs/common";
import { CreateSnippetDto } from "./dto/create-snippet.dto";
import { UpdateSnippetDto } from "./dto/update-snippet.dto";
import { PrismaService } from "@/prisma/prisma.service";

@Injectable()
export class SnippetService {
    public constructor(private readonly prismaService: PrismaService) {}

    async create(dto: CreateSnippetDto, userId: string) {
        const snippetNameExist = await this.prismaService.snippet.findFirst({
            where: {
                name: dto.name,
                userId: userId,
            },
        });

        if (snippetNameExist) {
            throw new BadRequestException("Сниппет с таким названием уже существует.");
        }

        const snippet = await this.prismaService.snippet.create({
            data: {
                name: dto.name,
                snippet: dto.snippet,
                userId: userId,
            },
        });

        return snippet;
    }

    async findAll(userId: string) {
        const snippets = await this.prismaService.snippet.findMany({
            where: {
                userId: userId,
            },
        });
        return snippets;
    }

    async update(dto: UpdateSnippetDto, snippetId: string, userId: string) {
        const snippetExist = await this.prismaService.snippet.findFirst({ where: { id: snippetId, userId } });

        if (!snippetExist) {
            throw new BadRequestException("Сниппет не найден.");
        }

        const snippet = await this.prismaService.snippet.update({
            where: { id: snippetId, userId },
            data: dto,
        });

        return snippet;
    }

    async remove(id: string, userId: string) {
        const snippetExist = await this.prismaService.snippet.findFirst({ where: { id, userId } });

        if (!snippetExist) {
            throw new BadRequestException("Сниппет не найден.");
        }

        await this.prismaService.snippet.delete({
            where: { id, userId },
        });

        return { message: "Сниппет успешно удалён." };
    }
}
