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
import { MailService } from '@/mail/mail.service';
import { TemplatesService } from '@/templates/templates.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly tokenService: TokenService,
        private readonly mailService: MailService,
        private readonly templatesService: TemplatesService,
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
        const html = await this.templatesService.compile('otp');
        void this.mailService.send({
            to: user.email,
            subject: 'OTP Confirmation',
            html: html({ code: otp.code }),
        });

        await this.usersService.setOtp(user.id, otp);
        return otp;
    }

    async signup(userDto: CreateUserDto, fingerprint: string | null) {
        const user = await this.usersService.find({ nickname: userDto.nickname, email: userDto.email }).one();

        if (user) {
            throw new HttpException('User exists with same username or email', HttpStatus.BAD_REQUEST);
        }

        const salt = await genSalt(10);
        const password = await hash(userDto.password, salt);
        const createdUser = await this.usersService.create({ ...userDto, password });
        const html = await this.templatesService.compile('email');
        await this.mailService.send({
            to: createdUser.email,
            subject: 'EMAIL Confirmation',
            html: html({
                url: `http://localhost:3000/users/email-confirmation/${createdUser.emailConfirmation.token}`,
            }),
        });

        const jwtPayload: JwtPayload = {
            id: createdUser.id,
            nickname: createdUser.nickname,
            roles: createdUser.roles,
        };

        const accessToken = await this.tokenService.generateAccess(jwtPayload);
        const refreshToken = await this.tokenService.generateRefresh(jwtPayload);
        await this.usersService.addDevice(createdUser, refreshToken, fingerprint);

        return {
            accessToken,
            refreshToken,
            nickname: createdUser.nickname,
            roles: createdUser.roles,
        };
    }

    async refresh(token: string | undefined, fingerprint: string | null) {
        if (!token || !fingerprint) {
            throw new UnauthorizedException();
        }

        const payload = await this.tokenService.verifyRefresh(token);
        if (!payload) {
            throw new UnauthorizedException();
        }

        const user = await this.usersService.findById(payload.id);
        if (!user) {
            throw new UnauthorizedException();
        }

        const device = user.devices.find((device) => device.token === token);
        if (!device) {
            throw new UnauthorizedException();
        }

        if (device.fingerprint !== fingerprint) {
            const devices = user.devices.filter((device) => device.token !== token);
            await this.usersService.updateDevices(user.id, devices);
            throw new UnauthorizedException();
        }

        const jwtPayload: JwtPayload = {
            id: user.id,
            nickname: user.nickname,
            roles: user.roles,
        };

        const accessToken = await this.tokenService.generateAccess(jwtPayload);
        const refreshToken = await this.tokenService.generateRefresh(jwtPayload);

        const devices = user.devices.map((device) => {
            if (device.token !== token) {
                return device;
            }

            return {
                ...device,
                token: refreshToken,
            };
        });

        await this.usersService.updateDevices(user.id, devices);

        return {
            accessToken,
            refreshToken,
        };
    }

    async otpConfirmation({ id, code }: OtpDto, fingerprint: string | null) {
        const user = await this.usersService.findByOtpId(id);

        if (!user?.otp) {
            throw new GoneException();
        }

        const isExpired = new Date(user.otp.createdAt).getTime() + user.otp.expires * 1000 < Date.now();
        if (isExpired || user.otp.attempts === 0) {
            throw new ForbiddenException();
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
                throw new UnauthorizedException();
            }

            throw new GoneException();
        }
    }
}
