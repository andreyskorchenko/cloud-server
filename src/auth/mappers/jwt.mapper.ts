import { JwtPayload } from '@/auth/interfaces';

export class JwtMapper {
    static toUI({ uid, nickname, roles }: JwtPayload): JwtPayload {
        return { uid, nickname, roles };
    }
}
