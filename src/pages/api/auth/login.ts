import { loginUser } from "@/lib/api/auth/routes";
import { LoginParams } from "@/lib/api/auth/types";
import { serialize } from "cookie";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const params: LoginParams = {email: req.body.email, password: req.body.password} 

    const response = await loginUser(params);

    // Check if the user is unverified
    if (response.error && response.error === "UserNotConfirmedException") {
      // Respond with a specific status or message indicating the user needs verification
      return res.status(403).json({ error: "UserNotConfirmedException" });
    }

    // Successful authentication: Set cookies
    if (response.status === 200) {
      res.setHeader("Set-Cookie", [
        serialize("access_token", response.data.access_token, {
          httpOnly: true,
          path: "/",
          maxAge: 3600,
        }), // 1 hour expiry
        serialize("refresh_token", response.data.refresh_token, {
          httpOnly: true,
          path: "/",
        }),
        serialize("id_token", response.data.id_token, {
          httpOnly: true,
          path: "/",
          maxAge: 3600,
        }),
      ]);

      // Respond with user data but not the tokens
      return res.status(200).json({ response });
    }

    // Handle other errors
    res
      .status(response.status || 500)
      .json({ error: response.error || "An error occurred" });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
