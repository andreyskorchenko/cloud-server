import { genSalt, hash, compare } from 'bcrypt';
import {
    Injectable,
    HttpException,
    HttpStatus,
    GoneException,
    ForbiddenException,
    UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '@/users/users.service';
import { CreateUserDto } from '@/users/dto';
import { OtpDto, SigninUserDto } from '@/auth/dto';
import { JwtPayload } from '@/auth/interfaces';
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

    async otpConfirmation({ id, code }: OtpDto, fingerprint: string | null) {
        const user = await this.usersService.findByIdOtp(id);

        if (!user?.otp) {
            throw new GoneException(1);
        }

        const isExpired = new Date(user.otp.createdAt).getTime() + user.otp.expires * 1000 < Date.now();
        if (isExpired || user.otp.attempts === 0) {
            throw new ForbiddenException(2);
        }

        if (user.otp.code === code) {
            await this.usersService.setOtp(user.id, null);

            const jwtPayload: JwtPayload = {
                id: user.id,
                nickname: user.nickname,
                roles: user.roles,
            };

            const accessToken = await this.tokenService.generateAccess(jwtPayload);
            const refreshToken = await this.tokenService.generateRefresh(jwtPayload);
            await this.usersService.addDevice(user, refreshToken, fingerprint);

            return {
                accessToken,
                refreshToken,
                nickname: user.nickname,
                roles: user.roles,
            };
        } else {
            const attempts = user.otp.attempts - 1;
            await this.usersService.setOtp(user.id, {
                ...user.otp,
                attempts,
            });

            if (attempts) {
                throw new UnauthorizedException(3);
            }

            throw new GoneException(4);
        }
    }
}
