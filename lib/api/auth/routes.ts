import { SignupParams } from "./types";

export const signupUser = async (signup_params: SignupParams) => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/v1/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(signup_params)
    });

    return response.json();
}