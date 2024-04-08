import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from '@/auth/interfaces';

@Injectable()
export class TokenService {
    private readonly accessSecret?: string;
    private readonly accessExpiresin?: string;
    private readonly refreshSecret?: string;
    private readonly refreshExpiresin?: string;

    constructor(
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {
        this.accessSecret = this.configService.get('JWT_ACCESS_SECRET');
        this.accessExpiresin = this.configService.get('JWT_ACCESS_EXPIRESIN');
        this.refreshSecret = this.configService.get('JWT_REFRESH_SECRET');
        this.refreshExpiresin = this.configService.get('JWT_REFRESH_EXPIRESIN');
    }

    async generateAccess(payload: JwtPayload) {
        try {
            return await this.jwtService.signAsync(payload, {
                secret: this.accessSecret,
                expiresIn: this.accessExpiresin,
            });
        } catch (err) {
            return null;
        }
    }

    async generateRefresh(payload: JwtPayload) {
        try {
            return await this.jwtService.signAsync(payload, {
                secret: this.refreshSecret,
                expiresIn: this.refreshExpiresin,
            });
        } catch (err) {
            return null;
        }
    }

    async verifyAccess(token: string) {
        try {
            return await this.jwtService.verifyAsync<JwtPayload>(token, {
                secret: this.accessSecret,
            });
        } catch (err) {
            return null;
        }
    }

    async verifyRefresh(token: string) {
        try {
            return await this.jwtService.verifyAsync<JwtPayload>(token, {
                secret: this.refreshSecret,
            });
        } catch (err) {
            return null;
        }
    }
}
