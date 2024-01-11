import { APIResponse } from "../response";

export const generateQuiz = async (quiz_params: GenerateQuizParams, token: string): Promise<{body: ReadableStream<Uint8Array>, headers: Headers}> => {
    const formData = new FormData();

    if (quiz_params.prompt) {
        formData.append('prompt', quiz_params.prompt.toString());
    }
    
    if (quiz_params.chapter_id) {
        formData.append('chapter_id', quiz_params.chapter_id.toString());
    }

    formData.append('number_of_questions', quiz_params.number_of_questions.toString());
    formData.append('difficulty', quiz_params.difficulty);
    formData.append('form', quiz_params.form);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/v1/quiz/quizzes`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    if (!response.body) {
        throw new Error("No response body");
    }

    return {
        body: response.body,
        headers: response.headers
    };
}


export const createAndSaveQuiz = async (quiz_key: string, token: string): Promise<APIResponse> => {
    const formData = new FormData();
    formData.append('quiz_key',quiz_key);

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/v1/quiz/quizzes`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        body: formData
    });

    return response.json();
}