//middleware.ts
import { isAuthenticated } from "@/lib/api/auth/helper";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/settings"];

export default function middleware(req: NextRequest) {
  const auth = isAuthenticated(req);
  console.log("auth", auth);
  const allCookies = req.cookies.getAll()
  const head = req.headers.get('cookie')
  // console.log("allCookies", allCookies);
  // console.log("head", head);

//   if (!auth && protectedRoutes.includes(req.nextUrl.pathname)) {
//     const absoluteURL = new URL("/", req.nextUrl.origin);
//     return NextResponse.redirect(absoluteURL.toString());
//   }
}
