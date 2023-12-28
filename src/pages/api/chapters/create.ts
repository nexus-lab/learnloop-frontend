import fs from "fs";
import formidable from "formidable";
import { parse } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";
import { createTextbook } from "@/lib/api/textbooks/routes";
import { ChaptersInput, createChapters } from "@/lib/api/chapters/routes";

export const config = {
  api: {
    
  },
};

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const cookies = parse(req.headers.cookie || "");
    const accessToken = cookies["access_token"];

    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    let obj: ChaptersInput = JSON.parse(req.body);

    try {
      const response = await createChapters(
        accessToken,
        obj
      ); 

      console.log(response);
      console.log(obj)
      console.log(JSON.stringify(obj))
      res.status(200).json({ success: true, response });
    } catch (apiError) {
      console.error(apiError);
      res.status(500).json({ error: "Error calling createTextbook API" });
    }
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
