import mongoose, { HydratedDocument } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { RootStorage } from '@/storage/types';

@Schema()
class Storage {
    @Prop({ required: true })
    storage: RootStorage;

    @Prop({ required: true, unique: true, ref: 'user' })
    owner: mongoose.Schema.Types.ObjectId;
}

export type StorageDocument = HydratedDocument<Storage>;
export const StorageSchema = SchemaFactory.createForClass(Storage);
