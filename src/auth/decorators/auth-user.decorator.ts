import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '@/auth/interfaces';
import { JwtMapper } from '@/auth/mappers';

export const AuthUser = createParamDecorator((key: keyof JwtPayload, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest();
    return key ? user[key] : JwtMapper.toUI(user);
});
