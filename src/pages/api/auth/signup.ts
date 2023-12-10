import { signupUser } from "@/lib/api/auth/routes";
import { SignupParams } from "@/lib/api/auth/types";
import { serialize } from "cookie";
import { NextApiRequest, NextApiResponse } from "next/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const params: SignupParams = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    };

    const response = await signupUser(params);

    // Check if the user is unverified
    if (response.error) {
      // Respond with a specific status or message indicating the user needs verification
      return res.status(403).json({ error: response.error});
    }

    // Successful authentication: Set cookies
    if (response.status === 200) {
      // Respond with user data but not the tokens
      return res.status(200).json({ message: "Successful sign up." });
    }

    // Handle other errors
    res
      .status(response.status || 500)
      .json({ error: response.error || "An error occurred with sign up." });
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
