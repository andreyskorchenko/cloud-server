export enum TypesOtp {
    SMS = 'SMS',
    EMAIL = 'EMAIL',
}

export interface Otp {
    id: string | null;
    code: number | null;
    expires: number | null;
    attempts: number | null;
    type: keyof typeof TypesOtp | null;
    createdAt: Date | null;
}
