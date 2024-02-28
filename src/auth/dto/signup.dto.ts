import { IsEmail } from 'class-validator';

export class SignupDto {
    firstname: string;
    lastname: string;
    nickname: string;

    @IsEmail({}, { message: 'Invalid email' })
    email: string;
    password: string;
}
