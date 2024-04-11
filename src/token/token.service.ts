import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@/auth/interfaces';

@Injectable()
export class TokenService {
    private readonly secret?: string;
    private readonly accessExpiresin?: string;
    private readonly refreshExpiresin?: string;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        this.secret = this.configService.get('JWT_SECRET');
        this.accessExpiresin = this.configService.get('JWT_ACCESS_EXPIRESIN');
        this.refreshExpiresin = this.configService.get('JWT_REFRESH_EXPIRESIN');
    }

    async generateAccess(payload: JwtPayload) {
        try {
            return await this.jwtService.signAsync(payload, {
                secret: this.secret,
                expiresIn: this.accessExpiresin,
            });
        } catch (err) {
            return null;
        }
    }

    async generateRefresh(payload: JwtPayload) {
        try {
            return await this.jwtService.signAsync(payload, {
                secret: this.secret,
                expiresIn: this.refreshExpiresin,
            });
        } catch (err) {
            return null;
        }
    }

    async verifyAccess(token: string) {
        try {
            return await this.jwtService.verifyAsync<JwtPayload>(token, {
                secret: this.secret,
            });
        } catch (err) {
            return null;
        }
    }

    async verifyRefresh(token: string) {
        try {
            return await this.jwtService.verifyAsync<JwtPayload>(token, {
                secret: this.secret,
            });
        } catch (err) {
            return null;
        }
    }
}
