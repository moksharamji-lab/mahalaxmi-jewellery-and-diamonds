import "server-only";

import { cache } from "react";
import { redirect } from "next/navigation";
import { getAuthenticatedAdminClient } from "@/lib/admin-pocketbase";

export const requireAdminSession = cache(async () => {
  if (!(await getAuthenticatedAdminClient())) {
    redirect("/login");
  }

  return { isAuthenticated: true };
});
