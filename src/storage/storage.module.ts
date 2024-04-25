import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StorageSchema } from '@/storage/schemas';
import { StorageController } from '@/storage/storage.controller';
import { StorageService } from '@/storage/storage.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: 'storages',
                schema: StorageSchema,
            },
        ]),
    ],
    controllers: [StorageController],
    providers: [StorageService],
    exports: [StorageService],
})
export class StorageModule {}
