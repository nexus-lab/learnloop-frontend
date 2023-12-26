import { parse } from "cookie";
import { createTextbook } from "@/lib/api/textbooks/routes";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const cookies = parse(req.headers.cookie || "");
    const accessToken = cookies["access_token"];
    const body = req.body;
    // const formData = await req.body

    if (!accessToken) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const response = await createTextbook(accessToken, body); // Pass the token to your external API call

    console.log(response);

    // Handle errors
    // if (response.error) {
    //     return res.status(403).json({ error: response.error });
    // }

    res.status(200).json({ success: true });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};
