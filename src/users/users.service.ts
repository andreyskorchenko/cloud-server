import { createHash, randomUUID } from 'node:crypto';
import { Model } from 'mongoose';
import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from '@/users/schemas';
import { UserDevice } from '@/users/interfaces';
import { CreateUserDto } from '@/users/dto';
import { TokenService } from '@/token/token.service';
import { JwtPayload } from '@/auth/interfaces';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('users') private readonly userModel: Model<UserDocument>,
        private readonly configService: ConfigService,
        private readonly tokenService: TokenService,
    ) {}

    async create(createUserDto: CreateUserDto, fingerprint: string | null) {
        const model = new this.userModel(createUserDto);
        model.confirmationToken = createHash('sha256').update(randomUUID()).digest('hex');

        const jwtPayload: JwtPayload = {
            uid: model._id.toString(),
            nickname: model.nickname,
            roles: model.roles,
        };

        const accessToken = await this.tokenService.generateAccess(jwtPayload);
        const refreshToken = await this.tokenService.generateRefresh(jwtPayload);

        if (!accessToken || !refreshToken) {
            throw new InternalServerErrorException();
        }

        model.devices.push({
            fingerprint,
            token: refreshToken,
            lastUpdate: new Date(),
        });

        await model.save();

        return {
            accessToken,
            refreshToken,
            nickname: model.nickname,
            roles: model.roles,
        };
    }

    findOneByNicknameOrEmail({ nickname, email }: Record<keyof Pick<CreateUserDto, 'nickname' | 'email'>, string>) {
        return this.userModel.findOne().or([{ nickname }, { email }]).exec();
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

    async emailConfirmation(confirmationToken: string) {
        const user = await this.userModel.findOne({ confirmationToken });

        if (!user || user.confirmedEmail) {
            throw new BadRequestException();
        }

        const update = await this.userModel.updateOne(
            { _id: user.id },
            { confirmedEmail: true, confirmationToken: null },
        );

        if (!update.modifiedCount) {
            throw new InternalServerErrorException();
        }
    }
}
