import { genSalt, hash, compare } from 'bcrypt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto';
import { SigninUserDto } from '@/auth/dto';
import { JwtPayload } from '@/auth/interfaces';
import { TokenService } from '@/token/token.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly tokenService: TokenService,
    ) {}

    async signin({ login, password }: SigninUserDto, fingerprint: string | null) {
        const user = await this.usersService.findOneByNicknameOrEmail({
            nickname: login,
            email: login,
        });

        if (!user) {
            throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
        }

        const isComparePasswords = await compare(password, user.password);
        if (!isComparePasswords) {
            throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
        }

        const jwtPayload: JwtPayload = {
            uid: user._id.toString(),
            nickname: user.nickname,
            roles: user.roles,
        };

        const accessToken = await this.tokenService.generateAccess(jwtPayload);
        const refreshToken = await this.tokenService.generateRefresh(jwtPayload);

        if (!accessToken || !refreshToken) {
            throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        await this.usersService.addDevice(user, refreshToken, fingerprint);
        return { accessToken, refreshToken };
    }

    async signup(userDto: CreateUserDto, fingerprint: string | null) {
        const user = await this.usersService.findOneByNicknameOrEmail({
            nickname: userDto.nickname,
            email: userDto.email,
        });

        if (user) {
            throw new HttpException('User exists with same username or email', HttpStatus.BAD_REQUEST);
        }

        const salt = await genSalt(10);
        const password = await hash(userDto.password, salt);
        return await this.usersService.create({ ...userDto, password }, fingerprint);
    }
}
