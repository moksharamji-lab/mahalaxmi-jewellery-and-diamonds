import { NextRequest, NextResponse } from "next/server";

import { ADMIN_AUTH_COOKIE } from "@/lib/auth-config";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute =
    pathname === "/admin" || pathname.startsWith("/admin/");

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get(ADMIN_AUTH_COOKIE)?.value;

  if (token) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();

  loginUrl.pathname = "/mahalaxmi-control";
  loginUrl.search = "";
  loginUrl.searchParams.set("next", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*"],
};