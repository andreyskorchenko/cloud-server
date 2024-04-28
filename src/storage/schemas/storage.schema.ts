import mongoose, { HydratedDocument } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { DirectoryStorage } from '@/storage/types';

@Schema()
class Storage {
    @Prop({ required: true })
    storage: DirectoryStorage[];

    @Prop({ required: true, unique: true, ref: 'users' })
    owner: mongoose.Schema.Types.ObjectId;
}

export type StorageDocument = HydratedDocument<Storage>;
export const StorageSchema = SchemaFactory.createForClass(Storage);
