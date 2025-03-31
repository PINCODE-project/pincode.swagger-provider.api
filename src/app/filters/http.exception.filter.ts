import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    async catch(exception: unknown, host: ArgumentsHost) {
        const context = host.switchToHttp();
        const response = context.getResponse<Response>();

        if (response.headersSent) {
            this.logger.error("Headers already sent. Cannot send error response.");
            return;
        }

        const statusCode =
            exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

        const message =
            exception instanceof HttpException && exception.message ? exception.message : "Internal Server Error";

        const errorResponse = {
            meta: {
                statusCode,
                timestamp: new Date().toISOString(),
            },
            data: {
                message,
            },
        };

        if (statusCode === HttpStatus.INTERNAL_SERVER_ERROR) {
            const errorDetails = {
                ...errorResponse,
                stack: exception instanceof Error ? exception.stack : undefined,
            };
            this.logger.error(JSON.stringify(errorDetails));
        }

        response.status(statusCode).json(errorResponse);
    }
}
