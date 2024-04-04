import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModuleAsyncOptions } from '@nestjs/mongoose';

export const MongooseOptions: MongooseModuleAsyncOptions = {
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
        uri: configService.get('DB_URL'),
        dbName: configService.get('DB_NAME'),
        auth: {
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
        },
    }),
};
