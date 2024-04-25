import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseOptions } from 'src/config';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { StorageModule } from '@/storage/storage.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync(MongooseOptions),
        AuthModule,
        UsersModule,
        StorageModule,
    ],
})
export class AppModule {}
