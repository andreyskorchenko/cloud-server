import { Model } from 'mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from '@/users/schemas';
import { UserDevice } from '@/users/interfaces';
import { CreateUserDto } from '@/users/dto';
import { TokenService } from '@/token/token.service';
import { JwtPayload } from '@/auth/interfaces';
import { StorageService } from '@/storage/storage.service';

type FindFilter = Partial<Record<keyof Omit<CreateUserDto, 'password'>, string>>;

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('user') private readonly userModel: Model<UserDocument>,
        private readonly configService: ConfigService,
        private readonly tokenService: TokenService,
        private readonly storageService: StorageService,
    ) {}

    find(filter: FindFilter) {
        const conditions = Object.entries(filter).reduce((acc, [key, value]) => {
            return [...acc, { [key]: value }];
        }, []);

        const one = () => {
            if (!conditions.length) {
                return null;
            }

            return this.userModel.findOne().or(conditions).exec();
        };

        const many = () => {
            if (!conditions.length) {
                return this.userModel.find();
            }

            return this.userModel.find().or(conditions).exec();
        };

        return {
            one,
            many,
        };
    }

    async create(createUserDto: CreateUserDto, fingerprint: string | null) {
        const userModel = new this.userModel(createUserDto);
        const storageModel = await this.storageService.create(userModel.id);

        const jwtPayload: JwtPayload = {
            id: userModel.id,
            nickname: userModel.nickname,
            roles: userModel.roles,
        };

        const accessToken = await this.tokenService.generateAccess(jwtPayload);
        const refreshToken = await this.tokenService.generateRefresh(jwtPayload);

        userModel.storage = storageModel.id;
        userModel.devices.push({
            fingerprint,
            token: refreshToken,
            lastUpdate: new Date(),
        });

        await userModel.save();

        return {
            accessToken,
            refreshToken,
            nickname: userModel.nickname,
            roles: userModel.roles,
        };
    }

    addDevice(user: UserDocument, token: string, fingerprint: string | null) {
        const devices = user.devices
            .reduce(
                ([nullabels, fingerprints], device) => {
                    if (device.fingerprint === null) {
                        nullabels.push(device);
                    } else {
                        fingerprints.push(device);
                    }

                    return [nullabels, fingerprints];
                },
                [[] as UserDevice[], [] as UserDevice[]],
            )
            .map((devices) => {
                return [...devices].sort((a, b) => {
                    return new Date(a.lastUpdate).getTime() - new Date(b.lastUpdate).getTime();
                });
            })
            .flat();

        const idxDevice = devices.findIndex((device) => device.fingerprint === fingerprint);
        if (idxDevice >= 0) {
            devices.splice(idxDevice, 1, {
                token,
                fingerprint,
                lastUpdate: new Date(),
            });
        } else {
            if (devices.length < this.configService.get('MAX_SIGNIN_DEVICES')) {
                devices.push({
                    token,
                    fingerprint,
                    lastUpdate: new Date(),
                });
            } else {
                devices.splice(0, 1, {
                    token,
                    fingerprint,
                    lastUpdate: new Date(),
                });
            }
        }

        return this.userModel.updateOne({ _id: user.id }, { devices });
    }

    async emailConfirmation(token: string) {
        const user = await this.userModel.findOne({ 'emailConfirmation.token': token });

        if (!user || user.emailConfirmation.isConfirmed) {
            throw new HttpException('Email already confirmed or invalid token', HttpStatus.BAD_REQUEST);
        }

        const update = await this.userModel.updateOne(
            { _id: user.id },
            {
                emailConfirmation: {
                    token: null,
                    isConfirmed: true,
                },
            },
        );

        if (!update.modifiedCount) {
            throw new HttpException('Failed verify email', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    findByIdOtp(id: string) {
        return this.userModel.findOne({ 'otp.id': id });
    }
}
