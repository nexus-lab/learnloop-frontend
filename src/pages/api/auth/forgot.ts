import { resetPassword, sendForgotPassword } from "@/lib/api/auth/routes";
import { ForgotResetParams } from "@/lib/api/auth/types";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        // Confirm user
        const response = await sendForgotPassword(req.query.email as string);

        // Handle errors
        if (response.error) {
            return res.status(403).json({ error: response.error });
        }

        res.status(200).json(response);
    } else if (req.method === "POST") {
        console.log(req.body.confirmation_code)
        let params: ForgotResetParams = {
            confirmation_code: parseInt(req.body.confirmation_code as string),
            email: req.body.email as string,
            password: req.body.password as string
        };

        // Confirm user
        const response = await resetPassword(params);

        // Handle errors
        if (response.error) {
            return res.status(403).json({ error: response.error });
        }

        res.status(200).json(response);
    } else {
        res.status(405).end(); // Not Implemented
    }
}
