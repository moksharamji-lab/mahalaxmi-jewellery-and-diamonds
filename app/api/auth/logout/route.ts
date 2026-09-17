import { NextResponse } from "next/server";
import { Account, Client } from "node-appwrite";
import { cookies } from "next/headers";

import {
  ADMIN_AUTH_COOKIE,
  ADMIN_AUTH_COOKIE_OPTIONS,
} from "@/lib/auth-config";

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is missing`);
  }

  return value;
}

const endpoint = getRequiredEnv(
  "NEXT_PUBLIC_APPWRITE_ENDPOINT"
);

const projectId = getRequiredEnv(
  "NEXT_PUBLIC_APPWRITE_PROJECT_ID"
);

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_AUTH_COOKIE)?.value;

  /*
   * Invalidate the active Appwrite session when possible.
   * The browser cookie is cleared regardless of whether
   * Appwrite session deletion succeeds.
   */
  if (token) {
    try {
      const client = new Client()
        .setEndpoint(endpoint)
        .setProject(projectId)
        .setSession(token);

      const account = new Account(client);

      await account.deleteSession("current");
    } catch (error) {
      /*
       * Logout should remain successful from the browser's
       * perspective even if the Appwrite session has already
       * expired or cannot be deleted.
       */
      console.error(
        "Failed to invalidate Appwrite session during logout:",
        error
      );
    }
  }

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