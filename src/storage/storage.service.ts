import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { StorageDocument } from 'src/storage/schemas';

@Injectable()
export class StorageService {
    constructor(@InjectModel('storages') private readonly storageModel: Model<StorageDocument>) {}

    async create(userId: string) {
        const model = new this.storageModel({
            userId,
            storage: [],
        });

        console.log(model);
    }
}
