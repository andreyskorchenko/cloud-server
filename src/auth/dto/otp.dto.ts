import { IsString, IsHash, IsNumber } from 'class-validator';

export class OtpDto {
    @IsString()
    @IsHash('sha256', { message: 'Invalid ID' })
    id: string;

    @IsNumber({}, { message: 'Invalid OTP code' })
    code: number;
}
