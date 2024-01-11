import { createAndSaveQuiz } from "@/lib/api/quizzes/routes";
import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";

export const config = {
  api: {},
};

// Nextjs api route
export default async function PUT(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "PUT") {
    const cookies = parse(req.headers.cookie || "");
    const accessToken = cookies["access_token"];

    if (!accessToken) {
      return res.status(400).json({ error: "Unauthorized" });
    }

    console.log(req.body.quiz_key)
    console.log(req.body)

    const response = await createAndSaveQuiz(req.body.quiz_key, accessToken); // Pass the token to your external API call

    return res.status(200).json(response);
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
}
