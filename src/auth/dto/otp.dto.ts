import { IsString, IsHash, Length } from 'class-validator';

export class OtpDto {
    @IsString()
    @IsHash('sha256', { message: 'Invalid ID' })
    id: string;

    @IsString()
    @Length(6, 6, { message: 'Invalid OTP code' })
    code: string;
}
