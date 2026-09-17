import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";

import { getAuthenticatedAdminClient } from "@/lib/admin-pocketbase";

export const requireAdminSession = cache(async () => {
  const admin = await getAuthenticatedAdminClient();

  if (!admin) {
    redirect("/mahalaxmi-control?next=%2Fadmin");
  }

  return {
    isAuthenticated: true,
    user: admin.user,
  };
});