/**
 * Константы для модуля авторизации
 */

// Название куки для хранения JWT токена
export const JWT_COOKIE_NAME = process.env.JWT_COOKIE_NAME || "accessToken";

// Настройки куки
export const COOKIE_OPTIONS = {
    httpOnly: true, // Защита от XSS атак
    secure: true, // HTTPS в production
    sameSite: "none" as const, // CSRF защита
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней (как в JWT)
};

// Настройки куки для очистки
export const CLEAR_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
};

