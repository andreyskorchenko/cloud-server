import { createHash, randomUUID } from 'node:crypto';

export const randomHash = (algorithm: string) => {
    return createHash(algorithm).update(randomUUID()).digest('hex');
};
