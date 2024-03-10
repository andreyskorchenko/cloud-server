import { IsString, IsNotEmpty, IsEmail, IsStrongPassword } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty({ message: 'First name cannot be empty' })
    firstname: string;

    @IsString()
    @IsNotEmpty({ message: 'Last name cannot be empty' })
    lastname: string;

    @IsString()
    @IsNotEmpty({ message: 'Nickname cannot be empty' })
    nickname: string;

    @IsEmail({}, { message: 'Invalid email' })
    email: string;

    @IsStrongPassword(
        {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0,
        },
        {
            message: 'Minimum password length is 6 characters, one number, a lowercase and an uppercase letter',
        },
    )
    password: string;
}
