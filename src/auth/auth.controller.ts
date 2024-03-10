import { Controller, Post, HttpCode, UsePipes, ValidationPipe, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/CreateUserDto';
import { SigninUserDto } from './dto/SigninUserDto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signin')
    @HttpCode(200)
    @UsePipes(new ValidationPipe())
    async signIn(@Body() userDto: SigninUserDto) {
        return await this.authService.signIn(userDto);
    }

    @Post('signup')
    @UsePipes(new ValidationPipe())
    async signUp(@Body() userDto: CreateUserDto) {
        return await this.authService.signUp(userDto);
    }
}
