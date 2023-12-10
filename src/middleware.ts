import { isAuthenticated } from "@/lib/api/auth/helper";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { parse } from "cookie";
import { refreshToken } from "@/lib/api/auth/routes";
import { serialize } from "v8";
import {jwtDecode} from 'jwt-decode'

const protectedRoutes = ["/dashboard"];

export default async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;
  if (path.startsWith('/_next/') || path.startsWith('/api/') || path.endsWith('.svg')) {
    return NextResponse.next();
  }

  const cookies = parse(
    req ? req.headers.get("cookie") || "" : document.cookie
  );
  const accessToken = cookies["access_token"];
  const refreshTokenCookie = cookies["refresh_token"];
  
  // Extract the email from the id token
  let decodedIdToken = null;
  try {
    console.log(req.nextUrl.pathname)
    decodedIdToken = jwtDecode(cookies["id_token"]);
  } catch (e) {
    console.log(e);
  }

  // Check if user is authenticated after trying to refresh the token
  let auth = await isAuthenticated(accessToken);

  // Try to refresh the token if the user is not authenticated (bad access token)
  if (decodedIdToken && !auth && decodedIdToken.sub && (req.nextUrl.pathname.includes("dashboard") || req.nextUrl.pathname === '/') ) {
    // Try refresh the token
    try {
      const response = await refreshToken(refreshTokenCookie, decodedIdToken.sub);
      const next = NextResponse.next()
      
      if (response.status === 200) {
        next.cookies.set("access_token", response.data.access_token, { httpOnly: true, path: '/', maxAge: 3600 });
        next.cookies.set("refresh_token", response.data.refresh_token, { httpOnly: true, path: '/' });
        next.cookies.set("id_token", response.data.id_token, { httpOnly: true, path: '/', maxAge: 3600 });
      
        auth = await isAuthenticated(response.data.access_token)
      }

    } catch (e) {
      console.log(e);
    }
  }

  // If the user is not authenticated and the route is protected, redirect to landing (authenticated meaning access token is valid)
  if (!auth && protectedRoutes.includes(req.nextUrl.pathname)) {
    // Redirect to the unprotected route if not authenticated
    const absoluteURL = new URL("/", req.nextUrl.origin);
    return NextResponse.redirect(absoluteURL.toString());
  }

  // If the user is authenticated and the route is unprotected, redirect to dashboard
  if (auth && req.nextUrl.pathname === "/") {
    // Redirect to dashboard if authenticated
    const dashboardURL = new URL("/dashboard", req.nextUrl.origin);
    return NextResponse.redirect(dashboardURL.toString());
  }

  return NextResponse.next();
}
