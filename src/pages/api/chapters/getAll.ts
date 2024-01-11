import { getAllTextbooks } from "@/lib/api/textbooks/routes";
import type { NextApiRequest, NextApiResponse } from "next";
import { parse } from "cookie";
import { getAllChapters } from "@/lib/api/chapters/routes";

export const config = {
  api: {
  },
};

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    // Pull skip and limit as numbers from req.query
    const skip = Number(req.query.skip);
    const limit = Number(req.query.limit);
    const textbook_id = Number(req.query.textbook_id) || -1;
    const cookies = parse(req.headers.cookie || "");
    const accessToken = cookies["access_token"];

    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const r = await getAllChapters(accessToken, skip, limit, textbook_id); // Pass the token to your external API call
    
    if (r.error) {
        return res.status(403).json({ error: r.error });
    } 

    return res.status(200).json(r);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
