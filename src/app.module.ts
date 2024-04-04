import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseOptions } from 'src/config';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';

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
