import { Controller, Get, UsePipes, ValidationPipe, Param } from '@nestjs/common';
import { EmailConfirmationDto } from '@/users/dto';
import { UsersService } from '@/users/users.service';

@Controller('users')
export class UsersController {
    constructor(private usersService: UsersService) {}

    @Get('email-confirmation/:token')
    @UsePipes(new ValidationPipe())
    async emailConfirmation(@Param() { token }: EmailConfirmationDto) {
        return await this.usersService.emailConfirmation(token);
    }
}
