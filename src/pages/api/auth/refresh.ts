import { parse } from 'cookie';
import { refreshToken } from "@/lib/api/auth/routes";
import type { NextApiRequest, NextApiResponse } from "next";
import { jwtDecode } from 'jwt-decode';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        const cookies = parse(req.headers.cookie || '');
        const token = cookies['refresh_token'];
        const idToken = cookies['id_token'];
    
        // decode the id token
        const decodedIdToken = jwtDecode(idToken);

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        // Confirm user
        const response = await refreshToken(token, decodedIdToken.sub || ""); // Pass the token to your external API call
        // Handle errors
        if (response.error) {
            return res.status(403).json({ error: response.error });
        }

        res.status(200).json(response);
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}
