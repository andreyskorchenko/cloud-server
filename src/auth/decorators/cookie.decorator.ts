import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Cookie = createParamDecorator((key: string | undefined, ctx: ExecutionContext) => {
    const { cookies } = ctx.switchToHttp().getRequest<Request>();
    return key ? cookies[key] : cookies;
});
