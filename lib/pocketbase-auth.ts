import { POCKETBASE_URL } from "@/lib/auth-config";

type AuthRefreshResponse = {
  token?: unknown;
};

export async function refreshAdminToken(token: string) {
  try {
    const response = await fetch(
      `${POCKETBASE_URL}/api/collections/_superusers/auth-refresh`,
      {
        method: "POST",
        headers: {
          Authorization: token,
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as AuthRefreshResponse;

    return typeof data.token === "string" ? data.token : null;
  } catch {
    return null;
  }
}