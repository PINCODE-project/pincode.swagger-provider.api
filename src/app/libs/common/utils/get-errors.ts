interface Error {
    error: string;
    description: string;
}

export function getBadRequestErrors(description: string, errors: Error[]) {
    const parsedErrors = {};
    errors.forEach((error) => {
        parsedErrors[error.description] = {
            value: {
                meta: {
                    timestamp: "2025-03-03T15:50:57.083Z",
                    statusCode: 400,
                },
                data: {
                    message: error.error,
                },
            },
        };
    });
    return {
        status: 400,
        description: "Неверные данные",
        content: {
            "application/json": {
                examples: parsedErrors,
            },
        },
    };
}

export function getUnauthorizedError() {
    return {
        status: 401,
        description: "Не авторизован",
        content: {
            "application/json": {
                examples: {
                    "Не авторизован": {
                        value: {
                            meta: {
                                statusCode: 401,
                                timestamp: "2025-03-03T15:30:34.177Z",
                            },
                            data: {
                                message: "Unauthorized",
                            },
                        },
                    },
                },
            },
        },
    };
}
