/**
 * Примеры использования утилит для работы с OpenAPI схемами
 */

import { OpenApiDiff } from "./openapi-diff.util";
import { ChangelogFormatter } from "./changelog-formatter.util";

// Пример 1: Сравнение двух схем
export function exampleCompareSchemas() {
    const oldSchema = JSON.stringify({
        openapi: "3.0.0",
        info: {
            title: "My API",
            version: "1.0.0",
        },
        paths: {
            "/users": {
                get: {
                    operationId: "getUsers",
                    summary: "Get users",
                    parameters: [],
                    responses: {
                        "200": {
                            description: "Success",
                        },
                    },
                },
            },
        },
    });

    const newSchema = JSON.stringify({
        openapi: "3.0.0",
        info: {
            title: "My API",
            version: "1.1.0",
        },
        paths: {
            "/users": {
                get: {
                    operationId: "getUsers",
                    summary: "Get all users",
                    parameters: [
                        {
                            name: "page",
                            in: "query",
                            required: false,
                        },
                    ],
                    responses: {
                        "200": {
                            description: "Success",
                        },
                    },
                },
                post: {
                    operationId: "createUser",
                    summary: "Create user",
                    responses: {
                        "201": {
                            description: "Created",
                        },
                    },
                },
            },
            "/users/{id}": {
                get: {
                    operationId: "getUserById",
                    summary: "Get user by ID",
                    responses: {
                        "200": {
                            description: "Success",
                        },
                    },
                },
            },
        },
    });

    const diff = OpenApiDiff.compare(oldSchema, newSchema);

    console.log("Has changes:", diff.hasChanges);
    console.log("Summary:", diff.summary);
    console.log("Changes:", diff.changes);

    return diff;
}

// Пример 1.1: Переименование эндпоинта (изменение пути, но тот же operationId)
export function exampleEndpointRename() {
    const oldSchema = JSON.stringify({
        openapi: "3.0.0",
        info: {
            title: "My API",
            version: "1.0.0",
        },
        paths: {
            "/api/v1/auth/register1": {
                post: {
                    operationId: "authRegister",
                    summary: "Регистрация пользователя",
                    responses: {
                        "200": {
                            description: "Success",
                        },
                    },
                },
            },
        },
    });

    const newSchema = JSON.stringify({
        openapi: "3.0.0",
        info: {
            title: "My API",
            version: "1.0.0",
        },
        paths: {
            "/api/v1/auth/register": {
                post: {
                    operationId: "authRegister",
                    summary: "Регистрация пользователя",
                    responses: {
                        "200": {
                            description: "Success",
                        },
                    },
                },
            },
        },
    });

    const diff = OpenApiDiff.compare(oldSchema, newSchema);

    console.log("Has changes:", diff.hasChanges);
    console.log("Summary:", diff.summary);
    console.log("Changes:", diff.changes);
    // Должен показать: переименование эндпоинта, а не удаление + добавление

    return diff;
}

// Пример 2: Генерация changelog для Telegram
export function exampleGenerateChangelog() {
    const diff = exampleCompareSchemas();

    // Полный формат
    const fullChangelog = ChangelogFormatter.formatForTelegram(diff, "User Service", 2);
    console.log("Full changelog:");
    console.log(fullChangelog);

    // Компактный формат
    const compactChangelog = ChangelogFormatter.formatCompact(diff, "User Service", 2);
    console.log("\nCompact changelog:");
    console.log(compactChangelog);

    return { fullChangelog, compactChangelog };
}

// Пример 3: Использование в сервисе
export function exampleServiceUsage(
    oldSchemaJson: string,
    newSchemaJson: string,
    microserviceName: string,
    version: number,
) {
    try {
        // Сравниваем схемы
        const diff = OpenApiDiff.compare(oldSchemaJson, newSchemaJson);

        if (!diff.hasChanges) {
            console.log("No changes detected");
            return null;
        }

        // Генерируем changelog
        const changelog = ChangelogFormatter.formatForTelegram(diff, microserviceName, version);

        // Отправляем в Telegram (пример)
        // await this.botService.sendMessage(telegramId, changelog, { parse_mode: "MarkdownV2" });

        return {
            hasChanges: true,
            changelog,
            summary: diff.summary,
        };
    } catch (error) {
        console.error("Error comparing schemas:", error);
        throw error;
    }
}
