import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController, UsersService } from '@/users';
import { UserSchema } from '@/users/schemas';
import { JwtOptions } from '@/auth/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        JwtModule.registerAsync(JwtOptions),
        MongooseModule.forFeature([
            {
                name: 'users',
                schema: UserSchema,
            },
        ]),
    ],
    controllers: [UsersController],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
