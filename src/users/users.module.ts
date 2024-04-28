import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from '@/users/users.controller';
import { UsersService } from '@/users/users.service';
import { UserSchema } from '@/users/schemas';
import { JwtOptions } from 'src/auth/config';
import { JwtModule } from '@nestjs/jwt';
import { TokenService } from '@/token/token.service';
import { StorageModule } from '@/storage/storage.module';

@Module({
    imports: [
        JwtModule.registerAsync(JwtOptions),
        MongooseModule.forFeature([
            {
                name: 'users',
                schema: UserSchema,
            },
        ]),
        StorageModule,
    ],
    controllers: [UsersController],
    providers: [UsersService, TokenService],
    exports: [UsersService],
})
export class UsersModule {}
