import { Controller, Post, HttpCode, UsePipes, ValidationPipe, Body } from '@nestjs/common';
import { BrowserFingerprint } from '@/auth/decorators';
import { AuthService } from '@/auth/auth.service';
import { CreateUserDto } from '@/users/dto';
import { SigninUserDto } from '@/auth/dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signin')
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    async signin(@Body() userDto: SigninUserDto, @BrowserFingerprint() fingerprint: null | string) {
        return await this.authService.signin(userDto, fingerprint);
    }

    @Post('signup')
    @UsePipes(new ValidationPipe())
    async signup(@Body() userDto: CreateUserDto, @BrowserFingerprint() fingerprint: null | string) {
        return await this.authService.signup(userDto, fingerprint);
    }
}
