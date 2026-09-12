import { NextResponse } from "next/server";

import {
  ADMIN_AUTH_COOKIE,
  ADMIN_AUTH_COOKIE_OPTIONS,
} from "@/lib/auth-config";

export async function POST() {
  const response = NextResponse.json({
    success: true,
  });

  response.cookies.set({
    name: ADMIN_AUTH_COOKIE,
    value: "",
    ...ADMIN_AUTH_COOKIE_OPTIONS,
    maxAge: 0,
    expires: new Date(0),
  });

  return response;
}