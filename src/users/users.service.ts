import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/CreateUserDto';

@Injectable()
export class UsersService {
    constructor(@InjectModel('users') private userModel: Model<UserDocument>) {}

    async create(createUserDto: CreateUserDto) {
        const model = new this.userModel(createUserDto);
        return model.save();
    }

    findByNicknameOrEmail({ nickname, email }: Record<keyof Pick<CreateUserDto, 'nickname' | 'email'>, string>) {
        return this.userModel.findOne().or([{ nickname }, { email }]);
    }
}
