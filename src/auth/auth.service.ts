import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { genSalt, hash, compare } from 'bcrypt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto/CreateUserDto';
import { SigninUserDto } from '@/auth/dto/SigninUserDto';
import { JwtPayload } from '@/auth/interfaces';

@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private usersService: UsersService,
        private configService: ConfigService,
    ) {}

    async signin({ login, password }: SigninUserDto) {
        const candidate = await this.usersService.findOneByNicknameOrEmail({
            nickname: login,
            email: login,
        });

        if (!candidate) {
            throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
        }

        const isComparePasswords = await compare(password, candidate.password);
        if (!isComparePasswords) {
            throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
        }

        const jwtPayload: JwtPayload = {
            uid: candidate._id.toString(),
            nickname: candidate.nickname,
            roles: candidate.roles,
        };

        const accessToken = await this.jwtService.signAsync(jwtPayload);
        const refreshToken = await this.jwtService.signAsync(jwtPayload, {
            expiresIn: this.configService.get('JWT_EXPIRESIN_REFRESH'),
        });

        return { accessToken, refreshToken };
    }

    async signup(userDto: CreateUserDto) {
        const isUserExists = await this.usersService.findOneByNicknameOrEmail({
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
