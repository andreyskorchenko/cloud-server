import { Controller, Post, UsePipes, ValidationPipe, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../users/dto/CreateUserDto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signup')
    @UsePipes(new ValidationPipe())
    async signup(@Body() userDto: CreateUserDto) {
        return await this.authService.create(userDto);
    }
}
