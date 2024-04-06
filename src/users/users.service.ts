import { createHash, randomUUID } from 'node:crypto';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from '@/users/schemas';
import { JwtPayload } from '@/auth/interfaces';
import { CreateUserDto } from '@/users/dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel('users') private userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async create(createUserDto: CreateUserDto, fingerprint: null | string) {
        const model = new this.userModel(createUserDto);
        model.confirmationToken = createHash('sha256').update(randomUUID()).digest('hex');

        const jwtPayload: JwtPayload = {
            uid: model._id.toString(),
            nickname: model.nickname,
            roles: model.roles,
        };

        const token = await this.jwtService.signAsync(jwtPayload, {
            expiresIn: this.configService.get('JWT_EXPIRESIN_REFRESH'),
        });

        model.devices.push({
            token,
            fingerprint,
            lastUpdate: new Date(),
        });

        return model.save();
    }

    async findOneByNicknameOrEmail({
        nickname,
        email,
    }: Record<keyof Pick<CreateUserDto, 'nickname' | 'email'>, string>) {
        return this.userModel.findOne().or([{ nickname }, { email }]).exec();
    }
}
