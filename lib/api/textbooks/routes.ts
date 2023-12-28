// Create Textbook
import { APIResponse } from "../response";

interface FileUpload {
    file: Blob,
    filename: string,
}

export const createTextbook = async (access_token: string, title: string, nickname: string, file: FileUpload, image_file: FileUpload): Promise<APIResponse> => {
    const form = new FormData();
    form.append('title', title);
    form.append('nickname', nickname);
    form.append('file', file.file, file.filename);
    form.append('image_file', image_file.file, image_file.filename);
    
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/v1/quiz/textbooks`, {
        method: 'POST',
        headers: {
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