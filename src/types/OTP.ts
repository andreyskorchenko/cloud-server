export enum TypesOTP {
    SMS = 'SMS',
    EMAIL = 'EMAIL',
}

export interface OTP {
    code: number | null;
    expires: Date | null;
    attempts: number | null;
    type: keyof typeof TypesOTP | null;
}
