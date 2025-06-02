export function getUnauthorizedError() {
    return {
        status: 401,
        description: "Пользователь не авторизован",
        content: {
            "application/json": {
                examples: {
                    "Не авторизован": {
                        value: {
                            message: "Unauthorized",
                            statusCode: 401,
                        },
                    },
                },
            },
        },
    };
}
