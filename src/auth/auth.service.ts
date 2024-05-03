import { genSalt, hash, compare } from 'bcrypt';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto';
import { SigninUserDto } from '@/auth/dto';
import { TokenService } from '@/token/token.service';
import { generateOtp } from '@/auth/helpers';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly tokenService: TokenService,
    ) {}

    async signin({ login, password }: SigninUserDto) {
        const user = await this.usersService.find({ nickname: login, email: login }).one();

        if (!user) {
            throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
        }

        const isComparePasswords = await compare(password, user.password);
        if (!isComparePasswords) {
            throw new HttpException('UNAUTHORIZED', HttpStatus.UNAUTHORIZED);
        }

        const otp = generateOtp();
        return await this.usersService.setOtp(user.id, otp);
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
