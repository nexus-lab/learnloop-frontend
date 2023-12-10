// utils/auth.js
import cookie from "cookie";
import { CognitoJwtVerifier } from "aws-jwt-verify";

export function parseCookies(req: any) {
  return cookie.parse(req ? req.headers.get("cookie") || "" : document.cookie);
}

export async function isAuthenticated(token: string) {
  // Create a verifier for your Cognito User Pool
  const verifier = CognitoJwtVerifier.create({
    userPoolId: process.env.COGNITO_USER_POOL_ID as string,
    tokenUse: "access", // 'access' or 'id'
    clientId: process.env.COGNITO_CLIENT_ID as string, // Optionally verify the client id
    region: process.env.COGNITO_REGION as string,
  });


  if (!token) {
    return false;
  }

  try {
    // This will throw an error if the token is invalid
    await verifier.verify(token);
    return true;
  } catch (error) {
    // console.error("Token validation error:", error);
    return false;
  }
}
