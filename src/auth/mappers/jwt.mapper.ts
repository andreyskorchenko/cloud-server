import { JwtPayload } from '@/auth/interfaces';

export class JwtMapper {
    static toUI({ uid, nickname }: JwtPayload): JwtPayload {
        return { uid, nickname };
    }
}
