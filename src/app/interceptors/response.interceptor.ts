import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { HttpArgumentsHost } from "@nestjs/common/interfaces";
import { firstValueFrom, Observable, of } from "rxjs";

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
        const ctx: HttpArgumentsHost = context.switchToHttp();
        const response = ctx.getResponse();
        const statusCode: number = response.statusCode;
        const responseBody = await firstValueFrom(next.handle());
        const message = response.message;

        return of({
            meta: {
                statusCode,
                timestamp: new Date().toISOString(),
            },
            data: {
                ...responseBody,
                message,
            },
        });
    }
}
