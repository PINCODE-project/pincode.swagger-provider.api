import { ApiProperty, PickType } from "@nestjs/swagger";
import { Microservice } from "@/api/v1/microservice/entities/microservice.entity";

// Входные параметры - ID микросервиса
export class RefreshMicroserviceDto extends PickType(Microservice, ["id"]) {}

// Выходные параметры - результат обновления
export class RefreshMicroserviceResponseDto {
    @ApiProperty({
        description: "Успешность операции",
        example: true,
    })
    success: boolean;

    @ApiProperty({
        description: "Сообщение о результате",
        example: "Schema updated successfully",
    })
    message: string;

    @ApiProperty({
        description: "Новая версия схемы (если была создана)",
        example: 5,
        required: false,
    })
    version?: number;

    @ApiProperty({
        description: "Был ли создан новый снапшот схемы",
        example: true,
    })
    updated: boolean;

    @ApiProperty({
        description: "Changelog в формате для Telegram (если были изменения)",
        example:
            "📋 *User Service* \\(v2\\)\n\n📊 *Сводка изменений:*\n• ➕ Добавлено: 2\n• ❌ Удалено: 0\n• 🔄 Изменено: 1",
        required: false,
    })
    changelog?: string;

    @ApiProperty({
        description: "Сводка изменений",
        example: { added: 2, removed: 0, modified: 1 },
        required: false,
    })
    summary?: {
        added: number;
        removed: number;
        modified: number;
    };
}
