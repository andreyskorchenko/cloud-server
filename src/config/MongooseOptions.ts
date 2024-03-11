import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

export const MongooseOptions: MongooseModuleAsyncOptions = {
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
};
