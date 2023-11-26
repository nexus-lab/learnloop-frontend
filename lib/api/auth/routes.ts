import { APIResponse } from "../response";
import { LoginParams, SignupParams, VerifyParams } from "./types";

export const signupUser = async (signup_params: SignupParams): Promise<APIResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(signup_params)
    });

    return response.json();
}

export const loginUser = async (login_params: LoginParams): Promise<APIResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/v1/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(login_params)
    });

    return response.json();
}

export const resendVerificationEmail = async (email: string): Promise<APIResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/v1/auth/signup/confirm?email=${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    return response.json();
}

export const verifyUser = async (verify_params: VerifyParams): Promise<APIResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/v1/auth/signup/confirm/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(verify_params)
    });

    return response.json();
}