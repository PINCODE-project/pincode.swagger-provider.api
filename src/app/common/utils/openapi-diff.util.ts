/**
 * Типы изменений в OpenAPI схеме
 */
export enum ChangeType {
    ADDED = "ADDED",
    REMOVED = "REMOVED",
    MODIFIED = "MODIFIED",
}

/**
 * Тип изменённого элемента
 */
export enum ElementType {
    ENDPOINT = "ENDPOINT",
    PARAMETER = "PARAMETER",
    RESPONSE = "RESPONSE",
    SCHEMA = "SCHEMA",
    TAG = "TAG",
    SERVER = "SERVER",
    INFO = "INFO",
}

/**
 * Интерфейс для одного изменения
 */
export interface SchemaChange {
    type: ChangeType;
    elementType: ElementType;
    path: string;
    oldValue?: any;
    newValue?: any;
    description?: string;
}

/**
 * Результат сравнения схем
 */
export interface SchemaDiffResult {
    hasChanges: boolean;
    changes: SchemaChange[];
    summary: {
        added: number;
        removed: number;
        modified: number;
    };
}

/**
 * Утилита для сравнения двух OpenAPI схем
 */
export class OpenApiDiff {
    /**
     * Сравнивает две OpenAPI схемы и возвращает список изменений
     */
    static compare(oldSchemaJson: string, newSchemaJson: string): SchemaDiffResult {
        const oldSchema = JSON.parse(oldSchemaJson);
        const newSchema = JSON.parse(newSchemaJson);

        const changes: SchemaChange[] = [];

        // Сравниваем информацию о API
        this.compareInfo(oldSchema.info, newSchema.info, changes);

        // Сравниваем серверы
        this.compareServers(oldSchema.servers, newSchema.servers, changes);

        // Сравниваем теги
        this.compareTags(oldSchema.tags, newSchema.tags, changes);

        // Сравниваем эндпоинты
        this.comparePaths(oldSchema.paths, newSchema.paths, changes);

        // Сравниваем схемы компонентов
        this.compareSchemas(oldSchema.components?.schemas, newSchema.components?.schemas, changes);

        // Подсчитываем статистику
        const summary = {
            added: changes.filter((c) => c.type === ChangeType.ADDED).length,
            removed: changes.filter((c) => c.type === ChangeType.REMOVED).length,
            modified: changes.filter((c) => c.type === ChangeType.MODIFIED).length,
        };

        return {
            hasChanges: changes.length > 0,
            changes,
            summary,
        };
    }

    /**
     * Сравнивает информацию об API
     */
    private static compareInfo(oldInfo: any, newInfo: any, changes: SchemaChange[]): void {
        if (!oldInfo && !newInfo) return;

        if (!oldInfo && newInfo) {
            changes.push({
                type: ChangeType.ADDED,
                elementType: ElementType.INFO,
                path: "info",
                newValue: newInfo,
            });
            return;
        }

        if (oldInfo && !newInfo) {
            changes.push({
                type: ChangeType.REMOVED,
                elementType: ElementType.INFO,
                path: "info",
                oldValue: oldInfo,
            });
            return;
        }

        // Проверяем версию API
        if (oldInfo.version !== newInfo.version) {
            changes.push({
                type: ChangeType.MODIFIED,
                elementType: ElementType.INFO,
                path: "info.version",
                oldValue: oldInfo.version,
                newValue: newInfo.version,
                description: `Версия API изменена с ${oldInfo.version} на ${newInfo.version}`,
            });
        }

        // Проверяем название
        if (oldInfo.title !== newInfo.title) {
            changes.push({
                type: ChangeType.MODIFIED,
                elementType: ElementType.INFO,
                path: "info.title",
                oldValue: oldInfo.title,
                newValue: newInfo.title,
            });
        }

        // Проверяем описание
        if (oldInfo.description !== newInfo.description) {
            changes.push({
                type: ChangeType.MODIFIED,
                elementType: ElementType.INFO,
                path: "info.description",
                oldValue: oldInfo.description,
                newValue: newInfo.description,
            });
        }
    }

    /**
     * Сравнивает серверы
     */
    private static compareServers(oldServers: any[], newServers: any[], changes: SchemaChange[]): void {
        if (!oldServers && !newServers) return;

        const oldServerUrls = new Set((oldServers || []).map((s) => s.url));
        const newServerUrls = new Set((newServers || []).map((s) => s.url));

        // Новые серверы
        for (const server of newServers || []) {
            if (!oldServerUrls.has(server.url)) {
                changes.push({
                    type: ChangeType.ADDED,
                    elementType: ElementType.SERVER,
                    path: `servers[${server.url}]`,
                    newValue: server,
                    description: `Добавлен сервер ${server.url}`,
                });
            }
        }

        // Удалённые серверы
        for (const server of oldServers || []) {
            if (!newServerUrls.has(server.url)) {
                changes.push({
                    type: ChangeType.REMOVED,
                    elementType: ElementType.SERVER,
                    path: `servers[${server.url}]`,
                    oldValue: server,
                    description: `Удалён сервер ${server.url}`,
                });
            }
        }
    }

    /**
     * Сравнивает теги
     */
    private static compareTags(oldTags: any[], newTags: any[], changes: SchemaChange[]): void {
        if (!oldTags && !newTags) return;

        const oldTagNames = new Set((oldTags || []).map((t) => t.name));
        const newTagNames = new Set((newTags || []).map((t) => t.name));

        // Новые теги
        for (const tag of newTags || []) {
            if (!oldTagNames.has(tag.name)) {
                changes.push({
                    type: ChangeType.ADDED,
                    elementType: ElementType.TAG,
                    path: `tags[${tag.name}]`,
                    newValue: tag,
                    description: `Добавлен тег ${tag.name}`,
                });
            }
        }

        // Удалённые теги
        for (const tag of oldTags || []) {
            if (!newTagNames.has(tag.name)) {
                changes.push({
                    type: ChangeType.REMOVED,
                    elementType: ElementType.TAG,
                    path: `tags[${tag.name}]`,
                    oldValue: tag,
                    description: `Удалён тег ${tag.name}`,
                });
            }
        }
    }

    /**
     * Сравнивает пути (эндпоинты)
     */
    private static comparePaths(oldPaths: any, newPaths: any, changes: SchemaChange[]): void {
        if (!oldPaths && !newPaths) return;

        const oldPathKeys = Object.keys(oldPaths || {});
        const newPathKeys = Object.keys(newPaths || {});

        // Создаём карту эндпоинтов по operationId для отслеживания переименований
        const oldEndpointsByOpId = new Map<string, { path: string; method: string; endpoint: any }>();
        const newEndpointsByOpId = new Map<string, { path: string; method: string; endpoint: any }>();

        // Заполняем карты operationId
        for (const path of oldPathKeys) {
            const methods = Object.keys(oldPaths[path]).filter((k) => k !== "parameters" && k !== "servers");
            for (const method of methods) {
                const endpoint = oldPaths[path][method];
                if (endpoint.operationId) {
                    oldEndpointsByOpId.set(endpoint.operationId, { path, method, endpoint });
                }
            }
        }

        for (const path of newPathKeys) {
            const methods = Object.keys(newPaths[path]).filter((k) => k !== "parameters" && k !== "servers");
            for (const method of methods) {
                const endpoint = newPaths[path][method];
                if (endpoint.operationId) {
                    newEndpointsByOpId.set(endpoint.operationId, { path, method, endpoint });
                }
            }
        }

        // Множество уже обработанных эндпоинтов
        const processedOldEndpoints = new Set<string>();
        const processedNewEndpoints = new Set<string>();

        // Проверяем все новые пути
        for (const path of newPathKeys) {
            if (!oldPaths || !oldPaths[path]) {
                // Новый путь - проверяем методы
                const methods = Object.keys(newPaths[path]);
                for (const method of methods) {
                    if (method !== "parameters" && method !== "servers") {
                        const endpoint = newPaths[path][method];
                        const endpointKey = `${path}:${method}`;

                        // Проверяем, не переименован ли этот эндпоинт
                        if (endpoint.operationId && oldEndpointsByOpId.has(endpoint.operationId)) {
                            const oldEndpoint = oldEndpointsByOpId.get(endpoint.operationId)!;
                            const oldEndpointKey = `${oldEndpoint.path}:${oldEndpoint.method}`;

                            // Это переименование пути или метода
                            processedOldEndpoints.add(oldEndpointKey);
                            processedNewEndpoints.add(endpointKey);

                            changes.push({
                                type: ChangeType.MODIFIED,
                                elementType: ElementType.ENDPOINT,
                                path: `${method.toUpperCase()} ${path}`,
                                oldValue: { path: oldEndpoint.path, method: oldEndpoint.method },
                                newValue: { path, method },
                                description: `Эндпоинт ${oldEndpoint.method.toUpperCase()} ${oldEndpoint.path} переименован в ${method.toUpperCase()} ${path}`,
                            });

                            // Сравниваем детали эндпоинта (кроме пути)
                            this.compareEndpointDetails(path, method, oldEndpoint.endpoint, endpoint, changes);
                        } else {
                            // Действительно новый эндпоинт
                            processedNewEndpoints.add(endpointKey);
                            changes.push({
                                type: ChangeType.ADDED,
                                elementType: ElementType.ENDPOINT,
                                path: `${method.toUpperCase()} ${path}`,
                                newValue: endpoint,
                                description: `Добавлен эндпоинт ${method.toUpperCase()} ${path}`,
                            });
                        }
                    }
                }
            } else {
                // Путь существует, сравниваем методы
                this.comparePathMethods(
                    path,
                    oldPaths[path],
                    newPaths[path],
                    changes,
                    processedOldEndpoints,
                    processedNewEndpoints,
                );
            }
        }

        // Проверяем удалённые пути
        for (const path of oldPathKeys) {
            if (!newPaths || !newPaths[path]) {
                const methods = Object.keys(oldPaths[path]);
                for (const method of methods) {
                    if (method !== "parameters" && method !== "servers") {
                        const endpoint = oldPaths[path][method];
                        const endpointKey = `${path}:${method}`;

                        // Проверяем, не был ли этот эндпоинт переименован
                        if (!processedOldEndpoints.has(endpointKey)) {
                            // Проверяем по operationId
                            if (endpoint.operationId && newEndpointsByOpId.has(endpoint.operationId)) {
                                // Уже обработан как переименование
                                continue;
                            }

                            changes.push({
                                type: ChangeType.REMOVED,
                                elementType: ElementType.ENDPOINT,
                                path: `${method.toUpperCase()} ${path}`,
                                oldValue: endpoint,
                                description: `Удалён эндпоинт ${method.toUpperCase()} ${path}`,
                            });
                        }
                    }
                }
            }
        }
    }

    /**
     * Сравнивает методы для одного пути
     */
    private static comparePathMethods(
        path: string,
        oldMethods: any,
        newMethods: any,
        changes: SchemaChange[],
        processedOldEndpoints: Set<string>,
        processedNewEndpoints: Set<string>,
    ): void {
        const oldMethodKeys = Object.keys(oldMethods).filter((k) => k !== "parameters" && k !== "servers");
        const newMethodKeys = Object.keys(newMethods).filter((k) => k !== "parameters" && k !== "servers");

        // Новые методы
        for (const method of newMethodKeys) {
            const endpointKey = `${path}:${method}`;

            if (!oldMethods[method]) {
                // Проверяем, не был ли уже обработан как переименование
                if (!processedNewEndpoints.has(endpointKey)) {
                    changes.push({
                        type: ChangeType.ADDED,
                        elementType: ElementType.ENDPOINT,
                        path: `${method.toUpperCase()} ${path}`,
                        newValue: newMethods[method],
                        description: `Добавлен эндпоинт ${method.toUpperCase()} ${path}`,
                    });
                    processedNewEndpoints.add(endpointKey);
                }
            } else {
                // Метод существует, сравниваем детали
                processedOldEndpoints.add(endpointKey);
                processedNewEndpoints.add(endpointKey);
                this.compareEndpointDetails(path, method, oldMethods[method], newMethods[method], changes);
            }
        }

        // Удалённые методы
        for (const method of oldMethodKeys) {
            const endpointKey = `${path}:${method}`;

            if (!newMethods[method]) {
                // Проверяем, не был ли уже обработан как переименование
                if (!processedOldEndpoints.has(endpointKey)) {
                    changes.push({
                        type: ChangeType.REMOVED,
                        elementType: ElementType.ENDPOINT,
                        path: `${method.toUpperCase()} ${path}`,
                        oldValue: oldMethods[method],
                        description: `Удалён эндпоинт ${method.toUpperCase()} ${path}`,
                    });
                    processedOldEndpoints.add(endpointKey);
                }
            }
        }
    }

    /**
     * Сравнивает детали эндпоинта
     */
    private static compareEndpointDetails(
        path: string,
        method: string,
        oldEndpoint: any,
        newEndpoint: any,
        changes: SchemaChange[],
    ): void {
        const endpointPath = `${method.toUpperCase()} ${path}`;

        // Сравниваем описание
        if (oldEndpoint.summary !== newEndpoint.summary) {
            changes.push({
                type: ChangeType.MODIFIED,
                elementType: ElementType.ENDPOINT,
                path: `${endpointPath} (summary)`,
                oldValue: oldEndpoint.summary,
                newValue: newEndpoint.summary,
                description: `Изменено описание эндпоинта ${endpointPath}`,
            });
        }

        // Сравниваем параметры
        this.compareParameters(endpointPath, oldEndpoint.parameters, newEndpoint.parameters, changes);

        // Сравниваем requestBody
        this.compareRequestBody(endpointPath, oldEndpoint.requestBody, newEndpoint.requestBody, changes);

        // Сравниваем ответы
        this.compareResponses(endpointPath, oldEndpoint.responses, newEndpoint.responses, changes);
    }

    /**
     * Сравнивает параметры эндпоинта
     */
    private static compareParameters(
        endpointPath: string,
        oldParams: any[],
        newParams: any[],
        changes: SchemaChange[],
    ): void {
        if (!oldParams && !newParams) return;

        const oldParamMap = new Map((oldParams || []).map((p) => [`${p.in}-${p.name}`, p]));
        const newParamMap = new Map((newParams || []).map((p) => [`${p.in}-${p.name}`, p]));

        // Новые параметры
        for (const [key, param] of newParamMap) {
            if (!oldParamMap.has(key)) {
                changes.push({
                    type: ChangeType.ADDED,
                    elementType: ElementType.PARAMETER,
                    path: `${endpointPath} > ${param.in} > ${param.name}`,
                    newValue: param,
                    description: `Добавлен параметр ${param.name} (${param.in}) в ${endpointPath}`,
                });
            } else {
                // Параметр существует, проверяем изменения
                const oldParam = oldParamMap.get(key);
                if (oldParam.required !== param.required) {
                    changes.push({
                        type: ChangeType.MODIFIED,
                        elementType: ElementType.PARAMETER,
                        path: `${endpointPath} > ${param.in} > ${param.name}`,
                        oldValue: { required: oldParam.required },
                        newValue: { required: param.required },
                        description: `Параметр ${param.name} в ${endpointPath} стал ${param.required ? "обязательным" : "опциональным"}`,
                    });
                }
            }
        }

        // Удалённые параметры
        for (const [key, param] of oldParamMap) {
            if (!newParamMap.has(key)) {
                changes.push({
                    type: ChangeType.REMOVED,
                    elementType: ElementType.PARAMETER,
                    path: `${endpointPath} > ${param.in} > ${param.name}`,
                    oldValue: param,
                    description: `Удалён параметр ${param.name} (${param.in}) из ${endpointPath}`,
                });
            }
        }
    }

    /**
     * Сравнивает тело запроса
     */
    private static compareRequestBody(endpointPath: string, oldBody: any, newBody: any, changes: SchemaChange[]): void {
        if (!oldBody && newBody) {
            changes.push({
                type: ChangeType.ADDED,
                elementType: ElementType.PARAMETER,
                path: `${endpointPath} > requestBody`,
                newValue: newBody,
                description: `Добавлено тело запроса в ${endpointPath}`,
            });
        } else if (oldBody && !newBody) {
            changes.push({
                type: ChangeType.REMOVED,
                elementType: ElementType.PARAMETER,
                path: `${endpointPath} > requestBody`,
                oldValue: oldBody,
                description: `Удалено тело запроса из ${endpointPath}`,
            });
        } else if (oldBody && newBody) {
            // Проверяем изменение required
            if (oldBody.required !== newBody.required) {
                changes.push({
                    type: ChangeType.MODIFIED,
                    elementType: ElementType.PARAMETER,
                    path: `${endpointPath} > requestBody`,
                    oldValue: { required: oldBody.required },
                    newValue: { required: newBody.required },
                    description: `Тело запроса в ${endpointPath} стало ${newBody.required ? "обязательным" : "опциональным"}`,
                });
            }
        }
    }

    /**
     * Сравнивает ответы эндпоинта
     */
    private static compareResponses(
        endpointPath: string,
        oldResponses: any,
        newResponses: any,
        changes: SchemaChange[],
    ): void {
        if (!oldResponses && !newResponses) return;

        const oldStatusCodes = Object.keys(oldResponses || {});
        const newStatusCodes = Object.keys(newResponses || {});

        // Новые коды ответов
        for (const statusCode of newStatusCodes) {
            if (!oldResponses || !oldResponses[statusCode]) {
                changes.push({
                    type: ChangeType.ADDED,
                    elementType: ElementType.RESPONSE,
                    path: `${endpointPath} > response ${statusCode}`,
                    newValue: newResponses[statusCode],
                    description: `Добавлен ответ ${statusCode} в ${endpointPath}`,
                });
            }
        }

        // Удалённые коды ответов
        for (const statusCode of oldStatusCodes) {
            if (!newResponses || !newResponses[statusCode]) {
                changes.push({
                    type: ChangeType.REMOVED,
                    elementType: ElementType.RESPONSE,
                    path: `${endpointPath} > response ${statusCode}`,
                    oldValue: oldResponses[statusCode],
                    description: `Удалён ответ ${statusCode} из ${endpointPath}`,
                });
            }
        }
    }

    /**
     * Сравнивает схемы компонентов
     */
    private static compareSchemas(oldSchemas: any, newSchemas: any, changes: SchemaChange[]): void {
        if (!oldSchemas && !newSchemas) return;

        const oldSchemaNames = Object.keys(oldSchemas || {});
        const newSchemaNames = Object.keys(newSchemas || {});

        // Новые схемы
        for (const schemaName of newSchemaNames) {
            if (!oldSchemas || !oldSchemas[schemaName]) {
                changes.push({
                    type: ChangeType.ADDED,
                    elementType: ElementType.SCHEMA,
                    path: `components.schemas.${schemaName}`,
                    newValue: newSchemas[schemaName],
                    description: `Добавлена схема ${schemaName}`,
                });
            } else {
                // Схема существует, сравниваем свойства
                this.compareSchemaProperties(schemaName, oldSchemas[schemaName], newSchemas[schemaName], changes);
            }
        }

        // Удалённые схемы
        for (const schemaName of oldSchemaNames) {
            if (!newSchemas || !newSchemas[schemaName]) {
                changes.push({
                    type: ChangeType.REMOVED,
                    elementType: ElementType.SCHEMA,
                    path: `components.schemas.${schemaName}`,
                    oldValue: oldSchemas[schemaName],
                    description: `Удалена схема ${schemaName}`,
                });
            }
        }
    }

    /**
     * Сравнивает свойства схемы
     */
    private static compareSchemaProperties(
        schemaName: string,
        oldSchema: any,
        newSchema: any,
        changes: SchemaChange[],
    ): void {
        const oldProperties = Object.keys(oldSchema.properties || {});
        const newProperties = Object.keys(newSchema.properties || {});

        // Новые свойства
        for (const propName of newProperties) {
            if (!oldSchema.properties || !oldSchema.properties[propName]) {
                changes.push({
                    type: ChangeType.ADDED,
                    elementType: ElementType.SCHEMA,
                    path: `components.schemas.${schemaName}.${propName}`,
                    newValue: newSchema.properties[propName],
                    description: `Добавлено свойство ${propName} в схему ${schemaName}`,
                });
            }
        }

        // Удалённые свойства
        for (const propName of oldProperties) {
            if (!newSchema.properties || !newSchema.properties[propName]) {
                changes.push({
                    type: ChangeType.REMOVED,
                    elementType: ElementType.SCHEMA,
                    path: `components.schemas.${schemaName}.${propName}`,
                    oldValue: oldSchema.properties[propName],
                    description: `Удалено свойство ${propName} из схемы ${schemaName}`,
                });
            }
        }

        // Проверяем изменения в required
        const oldRequired = new Set(oldSchema.required || []);
        const newRequired = new Set(newSchema.required || []);

        for (const prop of newRequired) {
            if (!oldRequired.has(prop)) {
                changes.push({
                    type: ChangeType.MODIFIED,
                    elementType: ElementType.SCHEMA,
                    path: `components.schemas.${schemaName}.${prop}`,
                    oldValue: { required: false },
                    newValue: { required: true },
                    description: `Свойство ${prop} в схеме ${schemaName} стало обязательным`,
                });
            }
        }

        for (const prop of oldRequired) {
            if (!newRequired.has(prop)) {
                changes.push({
                    type: ChangeType.MODIFIED,
                    elementType: ElementType.SCHEMA,
                    path: `components.schemas.${schemaName}.${prop}`,
                    oldValue: { required: true },
                    newValue: { required: false },
                    description: `Свойство ${prop} в схеме ${schemaName} стало опциональным`,
                });
            }
        }
    }
}
