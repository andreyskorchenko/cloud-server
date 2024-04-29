import { Model, Schema } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StorageDocument } from '@/storage/schemas';

@Injectable()
export class StorageService {
    constructor(@InjectModel('storage') private readonly storageModel: Model<StorageDocument>) {}

    async create(id: Schema.Types.ObjectId) {
        const model = new this.storageModel({
            storage: [],
            owner: id,
        });

        return await model.save();
    }
}
