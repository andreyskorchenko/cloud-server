import { Roles } from '@/auth/constants';

export interface JwtPayload {
    uid: string;
    nickname: string;
    roles: Roles[];
}
