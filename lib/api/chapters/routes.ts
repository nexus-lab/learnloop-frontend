import { APIResponse } from "../response";

export interface Chapter {
  chapter_title: string;
  start_page: number;
  end_page: number;
}
export interface ChaptersInput {
  textbook_id: number;
  chapters: Array<Chapter>[];
}

export const createChapters = async (
  access_token: string,
  chapters: ChaptersInput
): Promise<APIResponse> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/api/v1/quiz/chapters`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(chapters),
    }
  );

  return response.json();
};
