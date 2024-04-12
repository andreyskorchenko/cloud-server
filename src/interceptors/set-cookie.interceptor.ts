import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CookieOptions, Response } from 'express';

type ResponseType = Record<string, unknown>;

@Injectable()
export class SetCookieInterceptor implements NestInterceptor {
    constructor(
        private readonly name: string,
        private readonly options?: CookieOptions,
    ) {}

    intercept(context: ExecutionContext, next: CallHandler<ResponseType>): Observable<ResponseType> {
        const response = context.switchToHttp().getResponse<Response>();
        const handler = next.handle();

        return handler.pipe(
            tap((data) => {
                const value = data[this.name];
                if (value) {
                    response.cookie(this.name, value, { ...(Boolean(this.options) && this.options) });
                }
            }),
        );
    }
}
