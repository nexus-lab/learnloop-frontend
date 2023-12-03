// utils/auth.js
import cookie from "cookie";
import { jwtDecode } from "jwt-decode";

export function parseCookies(req: any) {
  return cookie.parse(req ? req.headers.get('cookie') || "" : document.cookie);
}

export function isAuthenticated(req: any) {
  let authenticated: boolean = false;
  const cookies = parseCookies(req);
  const token = cookies.access_token;



  // Verify token session
  if (token) {
    const decoded: any = jwtDecode(token);
    const expires = new Date(decoded.exp * 1000);
    const currentDate = new Date();

    authenticated = currentDate < expires;
  }

  return authenticated;
}
