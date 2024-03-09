import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class User {
    @Prop({ required: true })
    firstname: string;

    @Prop({ required: true })
    lastname: string;

    @Prop({ required: true })
    nickname: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true, default: false })
    confirmedEmail: boolean;

    @Prop({ required: true })
    password: string;

    @Prop({ required: true, default: () => new Date() })
    createdAt: Date;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
