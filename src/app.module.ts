import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                uri: 'mongodb://localhost:27027',
                dbName: configService.get('DB_NAME'),
                auth: {
                    username: configService.get('DB_USERNAME'),
                    password: configService.get('DB_PASSWORD'),
                },
            }),
        }),
        AuthModule,
        UsersModule,
    ],
})
export class AppModule {}
