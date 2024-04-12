import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Response } from 'express';

type ResultCallHandler = Record<string, unknown>;

@Injectable()
export class CookieInterceptor implements NestInterceptor<ResultCallHandler, ResultCallHandler> {
    intercept(context: ExecutionContext, next: CallHandler<ResultCallHandler>): Observable<ResultCallHandler> {
        const response = context.switchToHttp().getResponse<Response>();
        const handler = next.handle();

        return handler.pipe(
            tap(({ refreshToken }) => {
                if (typeof refreshToken === 'string' && refreshToken.length) {
                    response.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        maxAge: 2592000000,
                    });
                }
            }),
        );
    }
}
