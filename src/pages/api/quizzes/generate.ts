import { generateQuiz } from "@/lib/api/quizzes/routes";
import { parse } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";
import { StreamingTextResponse } from "ai";
import { RequestCookies } from "next/dist/compiled/@edge-runtime/cookies";

export const config = {
  api: {},
};

const readStream = async (reader: any) => {
  const { done, value } = await reader.read();
  if (done) {
    console.log("Stream complete");
    return;
  }

  const text = new TextDecoder().decode(value);
  await readStream(reader); // Continue reading the next chunk

  return text;
};

export const runtime = "edge";

// Nextjs api route
export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const cookies = req.cookies as unknown as RequestCookies;
    const accessToken = cookies.get("access_token");

    if (!accessToken?.value) {
      return new Response("Unauthorized", { status: 401 });
    }

    const bodyStr = await readStream(req.body.getReader())

    const body = JSON.parse(bodyStr!);

    const quiz_params: GenerateQuizParams = {
      number_of_questions: body.numQuestions,
      difficulty: body.difficulty,
      form: "multiple-choice",
    };

    if (body.prompt) {
      quiz_params.prompt = body.prompt;
    } else {
      quiz_params.chapter_id = body.chapter_id;
    }

    const { body: resbody, headers } = await generateQuiz(quiz_params, accessToken.value);

    console.log(headers);
    console.log(headers.get("X-Quiz-Key"));

    // Add headers from response
    return new StreamingTextResponse(resbody, { headers: {
      "X-Quiz-Key": headers.get("X-Quiz-Key") || "",
    } });
  } else {
    return new Response("Method Not Allowed", { status: 405 });
  }
}
