import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { MongooseOptions } from '@/config';
import { UsersModule } from '@/users';
import { AuthModule } from '@/auth';

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
