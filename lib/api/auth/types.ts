// Auth Types

export interface SignupParams {
    email: string;
    password: string;
    name: string;
}

export interface LoginParams {
    email: string;
    password: string;
}

export interface VerifyParams {
    confirmation_code: number;
    email: string;
}