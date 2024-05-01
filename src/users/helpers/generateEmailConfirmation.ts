import { EmailConfirmation } from '@/users/interfaces';
import { randomHash } from '@/helpers';

export const generateEmailConfirmation = (): EmailConfirmation => {
    return {
        token: randomHash('sha256'),
        isConfirmed: false,
    };
};
