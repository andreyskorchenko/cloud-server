import { NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

type ResponseType = Record<string, unknown>;

export class ExcludeResponseInterceptor<Exclude extends string> implements NestInterceptor {
    constructor(private readonly exclude: Exclude[] = []) {}

    intercept(_: ExecutionContext, next: CallHandler<ResponseType>): Observable<ResponseType> {
        const handler = next.handle();
        if (!this.exclude.length) {
            return handler;
        }

        return handler.pipe(
            map((data) => {
                return Object.entries(data).reduce((acc, [key, value]) => {
                    const isContains = this.exclude.some((k) => k === key);
                    return isContains ? acc : { ...acc, [key]: value };
                }, {});
            }),
        );
    }
}
