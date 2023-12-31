import { verifyUser } from "@/lib/api/auth/routes";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        // Confirm user
        const response = await verifyUser({
            email: req.body.email,
            confirmation_code: req.body.confirmation_code,
        });

        // Handle errors
        if (response.error) {
            return res.status(403).json({ error: response.error });
        }

        res.status(200).json({ message: "Successful confirmed user" });
    } else {
        res.status(405).end(); // Method Not Allowed
    }
}