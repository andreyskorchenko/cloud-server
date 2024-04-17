import { Roles } from '@/auth/constants';

export interface JwtPayload {
    id: string;
    nickname: string;
    roles: Roles[];
}
