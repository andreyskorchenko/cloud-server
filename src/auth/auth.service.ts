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
        const user = await this.usersService.find({ nickname: login, email: login }).one();

        if (!user) {
            throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
        }

        const isComparePasswords = await compare(password, user.password);
        if (!isComparePasswords) {
            throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
        }

        const jwtPayload: JwtPayload = {
            id: user._id.toString(),
            nickname: user.nickname,
            roles: user.roles,
        };

        const accessToken = await this.tokenService.generateAccess(jwtPayload);
        const refreshToken = await this.tokenService.generateRefresh(jwtPayload);

        if (!accessToken || !refreshToken) {
            throw new HttpException('', HttpStatus.INTERNAL_SERVER_ERROR);
        }

        await this.usersService.addDevice(user, refreshToken, fingerprint);

        return {
            accessToken,
            refreshToken,
            nickname: user.nickname,
            roles: user.roles,
        };
    }

    async signup(userDto: CreateUserDto, fingerprint: string | null) {
        const user = await this.usersService.find({ nickname: userDto.nickname, email: userDto.email }).one();

        if (user) {
            throw new HttpException('User exists with same username or email', HttpStatus.BAD_REQUEST);
        }

        const salt = await genSalt(10);
        const password = await hash(userDto.password, salt);
        return await this.usersService.create({ ...userDto, password }, fingerprint);
    }

    async refresh(token: string | undefined, fingerprint: string | null) {
        if (!token?.length) {
            throw new HttpException('', HttpStatus.BAD_REQUEST);
        }

        const payload = await this.tokenService.verifyRefresh(token);
        console.log(fingerprint);
        console.log(payload);
        // if (!payload) {
        //     throw new HttpException('', HttpStatus.BAD_REQUEST);
        // }
        //
        // const user = await this.usersService.find({ nickname: payload.id }).one();
        // if (!user) {
        //     throw new HttpException('', HttpStatus.BAD_REQUEST);
        // }
        //
        // const device = user.devices.find((device) => device.token === token);
        // if (device?.fingerprint !== fingerprint) {
        //     throw new HttpException('', HttpStatus.BAD_REQUEST);
        // }

        // const accessToken = await this.tokenService.generateAccess();
        // const refreshToken = await this.tokenService.generateRefresh();
    }
}
