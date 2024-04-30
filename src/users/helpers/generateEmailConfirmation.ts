import { createHash, randomUUID } from 'node:crypto';
import { EmailConfirmation } from '@/users/interfaces';

export const generateEmailConfirmation = (): EmailConfirmation => {
    const token = createHash('sha256').update(randomUUID()).digest('hex');

    return {
        token,
        isConfirmed: false,
    };
};
