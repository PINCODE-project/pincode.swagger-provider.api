import { Injectable, Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
    private logger = new Logger("HTTP");

    use(req: Request, res: Response, next: NextFunction): void {
        const { method, originalUrl, ip, headers, body } = req;
        const userAgent = headers["user-agent"] || "unknown";
        const requestId = headers["x-request-id"] || this.generateRequestId();
        const startTime = Date.now();

        this.logger.log(`[${requestId}] --> ${method} ${originalUrl} | IP: ${ip} | User-Agent: ${userAgent}`);
        if (body && Object.keys(body).length > 0) {
            this.logger.log(`[${requestId}] REQUEST BODY: ${JSON.stringify(body)}`);
        }

        res.setHeader("x-request-id", requestId);

        // Сохраняем оригинальный метод res.send
        const originalSend = res.send;
        let responseBody: any;

        // Перехватываем метод res.send для логирования ответа
        res.send = function (body) {
            responseBody = body;
            return originalSend.call(this, body);
        };

        res.on("finish", () => {
            const { statusCode } = res;
            const contentLength = res.get("content-length");
            const responseTime = Date.now() - startTime;

            const logFn = this.getLoggerByStatusCode(statusCode);

            const logMessage = `[${requestId}] <-- ${method} ${originalUrl} | ${statusCode} | ${contentLength || 0}b | ${responseTime}ms`;
            logFn.call(this.logger, logMessage);

            // Логируем тело ответа
            if (responseBody) {
                try {
                    const bodyStr =
                        typeof responseBody === "object" ? JSON.stringify(responseBody) : responseBody.toString();
                    logFn.call(this.logger, `[${requestId}] RESPONSE BODY: ${bodyStr}`);
                } catch (error) {
                    this.logger.warn(`[${requestId}] Не удалось сериализовать тело ответа: ${error.message}`);
                }
            }
        });

        next();
    }

    /**
     * Генерирует уникальный идентификатор запроса
     */
    private generateRequestId(): string {
        return `req-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    }

    /**
     * Возвращает метод логгера в зависимости от кода ответа
     */
    private getLoggerByStatusCode(statusCode: number): Function {
        if (statusCode >= 500) {
            return this.logger.error;
        }
        if (statusCode >= 400) {
            return this.logger.warn;
        }
        if (statusCode >= 300) {
            return this.logger.verbose;
        }
        return this.logger.log;
    }
}
