import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@/users';
import { AuthController, AuthService } from '@/auth';
import { JwtStrategy } from '@/auth/strategies';
import { JwtOptions } from '@/auth/config';

@Module({
    imports: [JwtModule.registerAsync(JwtOptions), UsersModule, PassportModule],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
