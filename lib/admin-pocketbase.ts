import "server-only";

import { cookies } from "next/headers";
import { Account, Client } from "node-appwrite";

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

export async function getAuthenticatedAdminClient() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    ADMIN_AUTH_COOKIE
  )?.value;

  if (!token) {
    return null;
  }

  try {
    const authClient = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setSession(token);

    const account = new Account(authClient);

    const user = await account.get();

    return {
      account,
      user,
      refreshedToken: token,
    };
  } catch {
    return null;
  }
}

export {
  ADMIN_AUTH_COOKIE,
  ADMIN_AUTH_COOKIE_OPTIONS,
};