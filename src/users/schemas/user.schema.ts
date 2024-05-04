import mongoose from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Roles } from '@/auth/constants';
import { EmailConfirmation, UserDevice } from '@/users/interfaces';
import { generateEmailConfirmation } from '@/users/helpers';
import { Otp } from '@/types';

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

    @Prop({ type: mongoose.Schema.Types.Mixed, default: generateEmailConfirmation })
    emailConfirmation: EmailConfirmation;

    @Prop({ default: () => [Roles.ADMIN] })
    roles: Roles[];

    @Prop({ default: () => [] })
    devices: UserDevice[];

    @Prop({ required: true, unique: true, ref: 'storage' })
    storage: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.Mixed, default: null })
    otp: Otp | null;

    @Prop({ required: true })
    password: string;

    @Prop({ default: () => new Date() })
    createdAt: Date;
}

export type UserDocument = mongoose.HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
