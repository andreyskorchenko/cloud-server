import { JwtPayload } from '@/auth/interfaces';

export class JwtMapper {
    static toUI({ id, nickname, roles }: JwtPayload): JwtPayload {
        return { id: id, nickname, roles };
    }
}
