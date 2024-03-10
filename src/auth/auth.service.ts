import { genSalt, hash } from 'bcrypt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/CreateUserDto';

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    async create(userDto: CreateUserDto) {
        const isUserExists = await this.usersService.findOne({
            nickname: userDto.nickname,
            email: userDto.email,
        });

        if (isUserExists) {
            throw new HttpException('User exists with same username or email', HttpStatus.BAD_REQUEST);
        }

        const salt = await genSalt(10);
        const password = await hash(userDto.password, salt);
        return await this.usersService.create({ ...userDto, password });
    }
}
