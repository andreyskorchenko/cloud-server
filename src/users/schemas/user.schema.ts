import mongoose from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Roles } from '@/auth/constants';
import { EmailConfirmation, UserDevice } from '@/users/interfaces';
import { generateEmailConfirmation } from '@/users/helpers';
import { defaultOTP } from '@/users/constants';
import { OTP } from '@/types';

@Schema()
export class User {
    @Prop({ required: true, trim: true, lowercase: true })
    firstname: string;

    @Prop({ required: true, trim: true, lowercase: true })
    lastname: string;

    @Prop({ required: true, trim: true, lowercase: true, unique: true })
    nickname: string;

    @Prop({ required: true, trim: true, lowercase: true, unique: true })
    email: string;

    @Prop({ required: false, type: mongoose.Schema.Types.Mixed, default: generateEmailConfirmation })
    emailConfirmation: EmailConfirmation;

    @Prop({ required: false, default: () => [Roles.ADMIN] })
    roles: Roles[];

    @Prop({ required: true })
    devices: UserDevice[];

    @Prop({ required: true, unique: true, ref: 'storage' })
    storage: mongoose.Schema.Types.ObjectId;

    @Prop({ required: false, type: mongoose.Schema.Types.Mixed, default: () => defaultOTP })
    otp: OTP;

    @Prop({ required: true })
    password: string;

    @Prop({ required: false, default: () => new Date() })
    createdAt: Date;
}

export type UserDocument = mongoose.HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
