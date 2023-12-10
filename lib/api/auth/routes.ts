import { APIResponse } from "../response";
import { ForgotResetParams, LoginParams, SignupParams, VerifyParams } from "./types";

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

export const getUser = async (access_token: string): Promise<APIResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/v1/auth/user`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
        },
    });

    return response.json();
}

export const refreshToken = async (refresh_token: string, sub: string): Promise<APIResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/v1/auth/refresh?sub=${sub}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${refresh_token}`
        },
    });

    return response.json();
}

export const sendForgotPassword = async (email: string): Promise<APIResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/v1/auth/forgot?email=${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });

    return response.json();
}

export const resetPassword = async (reset_params: ForgotResetParams): Promise<APIResponse> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/v1/auth/forgot/confirm`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(reset_params)
    });

    return response.json();
}