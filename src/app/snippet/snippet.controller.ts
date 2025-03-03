import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from "@nestjs/common";
import { SnippetService } from "./snippet.service";
import { CreateSnippetDto } from "./dto/create-snippet.dto";
import { UpdateSnippetDto, UpdateSnippetParamDto } from "./dto/update-snippet.dto";
import { ApiBadRequestResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { Authorized } from "@/auth/decorators/authorized.decorator";
import { Authorization } from "@/auth/decorators/auth.decorator";
import { RemoveSnippetParamDto } from "@/snippet/dto/remove-snippet.dto";
import { getBadRequestErrors } from "@/libs/common/utils/get-errors";
import { Prisma } from "@prisma/__generated__";
import SnippetScalarFieldEnum = Prisma.SnippetScalarFieldEnum;

@ApiTags("snippet")
@Controller("snippet")
export class SnippetController {
    constructor(private readonly snippetService: SnippetService) {}

    @ApiOperation({ summary: "Создание сниппета" })
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Post()
    create(@Authorized("id") userId: string, @Body() dto: CreateSnippetDto) {
        return this.snippetService.create(dto, userId);
    }

    @ApiOperation({ summary: "Получение всех сниппетов пользователя" })
    @Authorization()
    @HttpCode(HttpStatus.OK)
    @Get()
    findAll(@Authorized("id") userId: string) {
        return this.snippetService.findAll(userId);
    }

    @ApiOperation({ summary: "Обновление сниппета" })
    @ApiResponse(
        getBadRequestErrors("Неверные данные", [{ error: "Сниппет не найден.", description: "Сниппет не найден" }]),
    )
    @HttpCode(HttpStatus.OK)
    @Authorization()
    @Patch(":id")
    update(
        @Authorized("id") userId: string,
        @Param() paramDto: UpdateSnippetParamDto,
        @Body() updateSnippetDto: UpdateSnippetDto,
    ) {
        return this.snippetService.update(updateSnippetDto, paramDto.id, userId);
    }

    @ApiOperation({ summary: "Удаление сниппета" })
    @ApiOkResponse({ description: "Сниппет успешно удалён" })
    @ApiResponse(
        getBadRequestErrors("Неверные данные", [{ error: "Сниппет не найден.", description: "Сниппет не найден" }]),
    )
    @HttpCode(HttpStatus.OK)
    @Authorization()
    @Delete(":id")
    remove(@Authorized("id") userId: string, @Param() paramDto: RemoveSnippetParamDto) {
        return this.snippetService.remove(paramDto.id, userId);
    }
}
