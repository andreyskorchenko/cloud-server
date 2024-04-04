import { HydratedDocument } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Roles } from '@/auth/constants';
import { UserDevice } from '@/users/interfaces';

@Schema()
export class User {
    @Prop({ required: true })
    firstname: string;

    @Prop({ required: true })
    lastname: string;

    @Prop({ required: true, unique: true })
    nickname: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ required: true, default: false })
    confirmedEmail: boolean;

    @Prop({ required: true, default: [Roles.ADMIN] })
    roles: Roles[];

    @Prop({ required: true })
    devices: UserDevice[];

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, default: () => new Date() })
    createdAt: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
