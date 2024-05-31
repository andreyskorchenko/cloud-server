import { Controller, Post, Get, HttpCode, Body, UseInterceptors, ValidationPipe } from '@nestjs/common';
import { ExcludeResponseInterceptor, SetCookieInterceptor } from '@/interceptors';
import { Fingerprint, Cookie } from '@/auth/decorators';
import { AuthService } from '@/auth/auth.service';
import { CreateUserDto } from '@/users/dto';
import { SigninUserDto, OtpDto } from '@/auth/dto';
import { ClearBodyPipe } from '@/pipes';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signin')
    @HttpCode(200)
    @UseInterceptors(new ExcludeResponseInterceptor(['code', 'createdAt']))
    async signin(@Body(new ClearBodyPipe(), new ValidationPipe()) user: SigninUserDto) {
        return await this.authService.signin(user);
    }

    @Post('otp')
    @HttpCode(202)
    @UseInterceptors(
        new ExcludeResponseInterceptor(['refreshToken']),
        new SetCookieInterceptor('refreshToken', {
            httpOnly: true,
            maxAge: 2592000000,
        }),
    )
    async otp(@Body(new ValidationPipe()) otp: OtpDto, @Fingerprint() fingerprint: string | null) {
        return await this.authService.otpConfirmation(otp, fingerprint);
    }

    @Post('signup')
    @UseInterceptors(
        new ExcludeResponseInterceptor(['refreshToken']),
        new SetCookieInterceptor('refreshToken', {
            httpOnly: true,
            maxAge: 2592000000,
        }),
    )
    async signup(
        @Body(new ClearBodyPipe(), new ValidationPipe()) user: CreateUserDto,
        @Fingerprint() fingerprint: string | null,
    ) {
        return await this.authService.signup(user, fingerprint);
    }

    @Get('refresh')
    @UseInterceptors(
        new ExcludeResponseInterceptor(['refreshToken']),
        new SetCookieInterceptor('refreshToken', {
            httpOnly: true,
            maxAge: 2592000000,
        }),
    )
    async refresh(@Cookie('refreshToken') token: string | undefined, @Fingerprint() fingerprint: string | null) {
        return await this.authService.refresh(token, fingerprint);
    }
}
