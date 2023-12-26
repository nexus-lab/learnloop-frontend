// Create Textbook

import { APIResponse } from "../response";

export const createTextbook = async (access_token: string, form: FormData): Promise<APIResponse> => {
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/v1/quiz/textbooks`, {
        method: 'POST',
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${access_token}`
        },
        body: form
    });

    return response.json();
}

// Delete Textbook
// Update Textbook
// Get Textbook
// Get All Textbooks