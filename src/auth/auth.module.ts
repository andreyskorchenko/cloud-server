import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@/users/users.module';
import { AuthController } from '@/auth/auth.controller';
import { AuthService } from '@/auth/auth.service';
import { JwtStrategy } from '@/auth/strategies';
import { JwtOptions } from 'src/auth/config';

@Module({
    imports: [JwtModule.registerAsync(JwtOptions), UsersModule, PassportModule],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
})
export class AuthModule {}
