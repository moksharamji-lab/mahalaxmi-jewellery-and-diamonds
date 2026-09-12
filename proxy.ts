import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_AUTH_COOKIE,
  getSafeAdminPath,
} from "@/lib/auth-config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only protect admin routes
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Check admin authentication cookie
  const token = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;

  if (!token) {
    const loginUrl = new URL(
      "/mahalaxmi-control",
      request.url
    );

    loginUrl.searchParams.set(
      "next",
      getSafeAdminPath(pathname)
    );

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};