import { IsHash } from 'class-validator';

export class EmailConfirmationDto {
    @IsHash('sha256', { message: 'Invalid email confirmation token' })
    token: string;
}
