import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class SigninUserDto {
    @IsString()
    @IsNotEmpty({ message: 'Login cannot be empty' })
    login: string;

    @IsString()
    @MinLength(6, { message: 'Minimum password length is 6 characters' })
    password: string;
}
