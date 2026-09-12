import "server-only";

import PocketBase from "pocketbase";
import { cookies } from "next/headers";

import {
  ADMIN_AUTH_COOKIE,
  POCKETBASE_URL,
} from "@/lib/auth-config";

import { refreshAdminToken } from "@/lib/pocketbase-auth";

export async function getAuthenticatedAdminClient() {
  const token = (await cookies()).get(ADMIN_AUTH_COOKIE)?.value;

  if (!token) {
    return null;
  }

  const refreshedToken = await refreshAdminToken(token);

  if (!refreshedToken) {
    return null;
  }

  const pb = new PocketBase(POCKETBASE_URL);

  pb.authStore.save(refreshedToken);

  return {
    pb,
    refreshedToken,
  };
}