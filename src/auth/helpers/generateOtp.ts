import { randomInt } from 'node:crypto';
import { TypesOTP, OTP } from '@/types';
import { randomHash } from '@/helpers';

export const generateOtp = (): OTP => {
    const id = randomHash('sha256');
    const code = parseInt(
        new Array(6)
            .fill(null)
            .map(() => randomInt(0, 9))
            .join(''),
    );

    return {
        id,
        code,
        expires: 300,
        attempts: 3,
        type: TypesOTP.EMAIL,
        createdAt: new Date(),
    };
};
