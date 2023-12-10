import { parse } from 'cookie';
import { getUser } from "@/lib/api/auth/routes";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const cookies = parse(req.headers.cookie || '');
        const accessToken = cookies['access_token'];

        if (!accessToken) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Confirm user
        const response = await getUser(accessToken); // Pass the token to your external API call

        // console.log(response);

        // Handle errors
        if (response.error) {
            return res.status(403).json({ error: response.error });
        }

        res.status(200).json(response);
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
