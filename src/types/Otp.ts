export enum TypesOtp {
    SMS = 'SMS',
    EMAIL = 'EMAIL',
}

export interface Otp {
    id: string;
    code: string;
    expires: number;
    attempts: number;
    type: keyof typeof TypesOtp;
    createdAt: Date;
}
