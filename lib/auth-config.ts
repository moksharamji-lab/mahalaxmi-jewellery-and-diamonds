export const ADMIN_AUTH_COOKIE = "mahalaxmi_admin_token";

export const ADMIN_AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  maxAge: 60 * 60 * 24 * 7,
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export function getSafeAdminPath(path: string | null) {
  if (path?.startsWith("/admin") && !path.startsWith("//")) {
    return path;
  }

  return "/admin";
}