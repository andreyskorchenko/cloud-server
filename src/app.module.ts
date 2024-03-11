import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from '@/users/users.module';
import { AuthModule } from './auth/auth.module';
import { MongooseOptions } from './config/MongooseOptions';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync(MongooseOptions),
        AuthModule,
        UsersModule,
    ],
})
export class AppModule {}
