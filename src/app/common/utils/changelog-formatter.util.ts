import { ChangeType, ElementType, SchemaChange, SchemaDiffResult } from "./openapi-diff.util";

/**
 * Утилита для форматирования changelog для отправки в Telegram
 */
export class ChangelogFormatter {
    /**
     * Генерирует красивый changelog в формате Telegram Markdown
     */
    static formatForTelegram(diff: SchemaDiffResult, microserviceName: string, version: number): string {
        if (!diff.hasChanges) {
            return `📋 *${this.escape(microserviceName)}* \\(v${version}\\)\n\n✅ Изменений не обнаружено`;
        }

        let message = `📋 *${this.escape(microserviceName)}* \\(v${version}\\)\n\n`;
        message += `📊 *Сводка изменений:*\n`;
        message += `• ➕ Добавлено: ${diff.summary.added}\n`;
        message += `• ❌ Удалено: ${diff.summary.removed}\n`;
        message += `• 🔄 Изменено: ${diff.summary.modified}\n\n`;

        // Группируем изменения по типам
        const groupedChanges = this.groupChangesByType(diff.changes);

        // Форматируем каждую группу
        if (groupedChanges.info.length > 0) {
            message += this.formatInfoChanges(groupedChanges.info);
        }

        if (groupedChanges.endpoints.length > 0) {
            message += this.formatEndpointChanges(groupedChanges.endpoints);
        }

        if (groupedChanges.parameters.length > 0) {
            message += this.formatParameterChanges(groupedChanges.parameters);
        }

        if (groupedChanges.responses.length > 0) {
            message += this.formatResponseChanges(groupedChanges.responses);
        }

        if (groupedChanges.schemas.length > 0) {
            message += this.formatSchemaChanges(groupedChanges.schemas);
        }

        if (groupedChanges.tags.length > 0) {
            message += this.formatTagChanges(groupedChanges.tags);
        }

        if (groupedChanges.servers.length > 0) {
            message += this.formatServerChanges(groupedChanges.servers);
        }

        message += `\n⏰ ${this.formatDate(new Date())}`;

        return message;
    }

    /**
     * Генерирует компактный changelog для коротких уведомлений
     */
    static formatCompact(diff: SchemaDiffResult, microserviceName: string, version: number): string {
        if (!diff.hasChanges) {
            return `📋 ${microserviceName} (v${version}) - без изменений`;
        }

        let message = `📋 ${microserviceName} (v${version})\n`;
        message += `➕ ${diff.summary.added} | ❌ ${diff.summary.removed} | 🔄 ${diff.summary.modified}\n\n`;

        // Показываем только основные изменения в эндпоинтах
        const endpoints = diff.changes.filter((c) => c.elementType === ElementType.ENDPOINT);
        const added = endpoints.filter((c) => c.type === ChangeType.ADDED);
        const removed = endpoints.filter((c) => c.type === ChangeType.REMOVED);

        if (added.length > 0) {
            message += `➕ Новые эндпоинты:\n`;
            added.slice(0, 3).forEach((change) => {
                message += `  • ${change.path}\n`;
            });
            if (added.length > 3) {
                message += `  ... и ещё ${added.length - 3}\n`;
            }
        }

        if (removed.length > 0) {
            message += `❌ Удалённые эндпоинты:\n`;
            removed.slice(0, 3).forEach((change) => {
                message += `  • ${change.path}\n`;
            });
            if (removed.length > 3) {
                message += `  ... и ещё ${removed.length - 3}\n`;
            }
        }

        return message;
    }

    /**
     * Группирует изменения по типам элементов
     */
    private static groupChangesByType(changes: SchemaChange[]): {
        info: SchemaChange[];
        endpoints: SchemaChange[];
        parameters: SchemaChange[];
        responses: SchemaChange[];
        schemas: SchemaChange[];
        tags: SchemaChange[];
        servers: SchemaChange[];
    } {
        return {
            info: changes.filter((c) => c.elementType === ElementType.INFO),
            endpoints: changes.filter((c) => c.elementType === ElementType.ENDPOINT),
            parameters: changes.filter((c) => c.elementType === ElementType.PARAMETER),
            responses: changes.filter((c) => c.elementType === ElementType.RESPONSE),
            schemas: changes.filter((c) => c.elementType === ElementType.SCHEMA),
            tags: changes.filter((c) => c.elementType === ElementType.TAG),
            servers: changes.filter((c) => c.elementType === ElementType.SERVER),
        };
    }

    /**
     * Форматирует изменения информации об API
     */
    private static formatInfoChanges(changes: SchemaChange[]): string {
        let section = `📝 *Информация об API:*\n`;

        for (const change of changes) {
            const icon = this.getChangeIcon(change.type);
            if (change.description) {
                section += `${icon} ${this.escape(change.description)}\n`;
            } else if (change.path.includes("version")) {
                section += `${icon} Версия: ${this.escape(String(change.oldValue))} → ${this.escape(String(change.newValue))}\n`;
            } else if (change.path.includes("title")) {
                section += `${icon} Название: ${this.escape(String(change.oldValue))} → ${this.escape(String(change.newValue))}\n`;
            }
        }

        return section + "\n";
    }

    /**
     * Форматирует изменения эндпоинтов
     */
    private static formatEndpointChanges(changes: SchemaChange[]): string {
        let section = `🔌 *Эндпоинты:*\n`;

        const added = changes.filter((c) => c.type === ChangeType.ADDED && !c.path.includes("summary"));
        const removed = changes.filter((c) => c.type === ChangeType.REMOVED && !c.path.includes("summary"));
        const modified = changes.filter((c) => c.type === ChangeType.MODIFIED);

        // Разделяем модификации на переименования и изменения описаний
        const renamed = modified.filter(
            (c) => c.description && c.description.includes("переименован") && c.oldValue?.path && c.newValue?.path,
        );
        const descriptionChanged = modified.filter(
            (c) => c.description && c.description.includes("описание") && !c.oldValue?.path,
        );

        if (added.length > 0) {
            section += `\n➕ *Добавлены:*\n`;
            added.forEach((change) => {
                const summary = change.newValue?.summary ? ` \\- _${this.escape(change.newValue.summary)}_` : "";
                section += `  • \`${this.escape(change.path)}\`${summary}\n`;
            });
        }

        if (removed.length > 0) {
            section += `\n❌ *Удалены:*\n`;
            removed.forEach((change) => {
                const summary = change.oldValue?.summary ? ` \\- _${this.escape(change.oldValue.summary)}_` : "";
                section += `  • \`${this.escape(change.path)}\`${summary}\n`;
            });
        }

        if (renamed.length > 0) {
            section += `\n🔄 *Переименованы:*\n`;
            renamed.forEach((change) => {
                const oldPath = `${change.oldValue.method.toUpperCase()} ${change.oldValue.path}`;
                const newPath = `${change.newValue.method.toUpperCase()} ${change.newValue.path}`;
                section += `  • \`${this.escape(oldPath)}\` → \`${this.escape(newPath)}\`\n`;
            });
        }

        if (descriptionChanged.length > 0) {
            section += `\n🔄 *Изменены описания:*\n`;
            descriptionChanged.forEach((change) => {
                if (change.description) {
                    section += `  • ${this.escape(change.description)}\n`;
                }
            });
        }

        return section + "\n";
    }

    /**
     * Форматирует изменения параметров
     */
    private static formatParameterChanges(changes: SchemaChange[]): string {
        let section = `⚙️ *Параметры:*\n`;

        const added = changes.filter((c) => c.type === ChangeType.ADDED && !c.path.includes("requestBody"));
        const removed = changes.filter((c) => c.type === ChangeType.REMOVED && !c.path.includes("requestBody"));
        const modified = changes.filter((c) => c.type === ChangeType.MODIFIED);

        if (added.length > 0) {
            section += `\n➕ *Добавлены:*\n`;
            added.forEach((change) => {
                if (change.description) {
                    section += `  • ${this.escape(change.description)}\n`;
                }
            });
        }

        if (removed.length > 0) {
            section += `\n❌ *Удалены:*\n`;
            removed.forEach((change) => {
                if (change.description) {
                    section += `  • ${this.escape(change.description)}\n`;
                }
            });
        }

        if (modified.length > 0) {
            section += `\n🔄 *Изменены:*\n`;
            modified.forEach((change) => {
                if (change.description) {
                    section += `  • ${this.escape(change.description)}\n`;
                }
            });
        }

        return section + "\n";
    }

    /**
     * Форматирует изменения ответов
     */
    private static formatResponseChanges(changes: SchemaChange[]): string {
        let section = `📤 *Ответы:*\n`;

        const added = changes.filter((c) => c.type === ChangeType.ADDED);
        const removed = changes.filter((c) => c.type === ChangeType.REMOVED);

        if (added.length > 0) {
            section += `\n➕ *Добавлены:*\n`;
            added.forEach((change) => {
                if (change.description) {
                    section += `  • ${this.escape(change.description)}\n`;
                }
            });
        }

        if (removed.length > 0) {
            section += `\n❌ *Удалены:*\n`;
            removed.forEach((change) => {
                if (change.description) {
                    section += `  • ${this.escape(change.description)}\n`;
                }
            });
        }

        return section + "\n";
    }

    /**
     * Форматирует изменения схем
     */
    private static formatSchemaChanges(changes: SchemaChange[]): string {
        let section = `📦 *Схемы данных:*\n`;

        const added = changes.filter((c) => c.type === ChangeType.ADDED);
        const removed = changes.filter((c) => c.type === ChangeType.REMOVED);
        const modified = changes.filter((c) => c.type === ChangeType.MODIFIED);

        if (added.length > 0) {
            section += `\n➕ *Добавлены:*\n`;
            // Группируем по схемам
            const schemaMap = new Map<string, SchemaChange[]>();
            added.forEach((change) => {
                const schemaName = change.path.split(".")[2];
                if (!schemaMap.has(schemaName)) {
                    schemaMap.set(schemaName, []);
                }
                schemaMap.get(schemaName)!.push(change);
            });

            schemaMap.forEach((schemaChanges, schemaName) => {
                if (schemaChanges.length === 1 && !schemaChanges[0].path.includes(".properties.")) {
                    section += `  • Схема \`${this.escape(schemaName)}\`\n`;
                } else {
                    section += `  • Схема \`${this.escape(schemaName)}\`:\n`;
                    schemaChanges.forEach((change) => {
                        if (change.description) {
                            section += `    \\- ${this.escape(change.description)}\n`;
                        }
                    });
                }
            });
        }

        if (removed.length > 0) {
            section += `\n❌ *Удалены:*\n`;
            const schemaMap = new Map<string, SchemaChange[]>();
            removed.forEach((change) => {
                const schemaName = change.path.split(".")[2];
                if (!schemaMap.has(schemaName)) {
                    schemaMap.set(schemaName, []);
                }
                schemaMap.get(schemaName)!.push(change);
            });

            schemaMap.forEach((schemaChanges, schemaName) => {
                if (schemaChanges.length === 1 && !schemaChanges[0].path.includes(".properties.")) {
                    section += `  • Схема \`${this.escape(schemaName)}\`\n`;
                } else {
                    section += `  • Схема \`${this.escape(schemaName)}\`:\n`;
                    schemaChanges.forEach((change) => {
                        if (change.description) {
                            section += `    \\- ${this.escape(change.description)}\n`;
                        }
                    });
                }
            });
        }

        if (modified.length > 0) {
            section += `\n🔄 *Изменены:*\n`;
            modified.forEach((change) => {
                if (change.description) {
                    section += `  • ${this.escape(change.description)}\n`;
                }
            });
        }

        return section + "\n";
    }

    /**
     * Форматирует изменения тегов
     */
    private static formatTagChanges(changes: SchemaChange[]): string {
        let section = `🏷 *Теги:*\n`;

        const added = changes.filter((c) => c.type === ChangeType.ADDED);
        const removed = changes.filter((c) => c.type === ChangeType.REMOVED);

        if (added.length > 0) {
            section += `➕ Добавлены: ${added.map((c) => `\`${this.escape(c.newValue.name)}\``).join(", ")}\n`;
        }

        if (removed.length > 0) {
            section += `❌ Удалены: ${removed.map((c) => `\`${this.escape(c.oldValue.name)}\``).join(", ")}\n`;
        }

        return section + "\n";
    }

    /**
     * Форматирует изменения серверов
     */
    private static formatServerChanges(changes: SchemaChange[]): string {
        let section = `🌐 *Серверы:*\n`;

        const added = changes.filter((c) => c.type === ChangeType.ADDED);
        const removed = changes.filter((c) => c.type === ChangeType.REMOVED);

        if (added.length > 0) {
            section += `\n➕ *Добавлены:*\n`;
            added.forEach((change) => {
                if (change.description) {
                    section += `  • ${this.escape(change.description)}\n`;
                }
            });
        }

        if (removed.length > 0) {
            section += `\n❌ *Удалены:*\n`;
            removed.forEach((change) => {
                if (change.description) {
                    section += `  • ${this.escape(change.description)}\n`;
                }
            });
        }

        return section + "\n";
    }

    /**
     * Возвращает иконку для типа изменения
     */
    private static getChangeIcon(type: ChangeType): string {
        switch (type) {
            case ChangeType.ADDED:
                return "➕";
            case ChangeType.REMOVED:
                return "❌";
            case ChangeType.MODIFIED:
                return "🔄";
            default:
                return "•";
        }
    }

    /**
     * Экранирует специальные символы для Telegram MarkdownV2
     */
    private static escape(text: string): string {
        if (!text) return "";
        return text.replace(/[_*\[\]()~`>#+\-=|{}.!\\]/g, "\\$&");
    }

    /**
     * Форматирует дату для отображения
     */
    private static formatDate(date: Date): string {
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${day}\\.${month}\\.${year} в ${hours}:${minutes}`;
    }
}
