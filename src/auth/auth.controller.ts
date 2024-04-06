import { Controller, Post, HttpCode, Body, ValidationPipe } from '@nestjs/common';
import { Fingerprint } from '@/auth/decorators';
import { AuthService } from '@/auth/auth.service';
import { CreateUserDto } from '@/users/dto';
import { SigninUserDto } from '@/auth/dto';
import { ClearBodyPipe } from '@/pipes';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signin')
    @HttpCode(200)
    async signin(
        @Body(new ClearBodyPipe(), new ValidationPipe()) userDto: SigninUserDto,
        @Fingerprint() fingerprint: null | string,
    ) {
        return await this.authService.signin(userDto, fingerprint);
    }

    @Post('signup')
    async signup(
        @Body(new ClearBodyPipe(), new ValidationPipe()) userDto: CreateUserDto,
        @Fingerprint() fingerprint: null | string,
    ) {
        return await this.authService.signup(userDto, fingerprint);
    }
}
