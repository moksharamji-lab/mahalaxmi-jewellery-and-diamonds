import { NextResponse } from "next/server";
import { google } from "googleapis";

import { getAuthenticatedAdminClient } from "@/lib/admin-pocketbase";

export const runtime = "nodejs";

const GOOGLE_OAUTH_STATE_COOKIE =
  "mahalaxmi_google_oauth_state";

function htmlResponse(
  title: string,
  heading: string,
  message: string,
  status: number
) {
  return new NextResponse(
    `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta
      name="robots"
      content="noindex,nofollow,noarchive"
    />
    <meta
      name="referrer"
      content="no-referrer"
    />
    <title>${title}</title>
  </head>

  <body
    style="
      font-family: Arial, sans-serif;
      background: #111;
      color: white;
      padding: 40px;
    "
  >
    <div
      style="
        max-width: 800px;
        margin: 0 auto;
        padding: 30px;
        border: 1px solid #333;
        border-radius: 12px;
        background: #181818;
      "
    >
      <h1>${heading}</h1>
      <p>${message}</p>
    </div>
  </body>
</html>`,
    {
      status,
      headers: {
        "Content-Type":
          "text/html; charset=utf-8",
        "X-Content-Type-Options":
          "nosniff",
        "X-Frame-Options":
          "DENY",
        "Referrer-Policy":
          "no-referrer",
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

export async function GET(
  request: Request
) {
  const responseCookies =
    new Map<string, string>();

  try {
    /*
     * The callback must belong to an authenticated
     * admin session.
     */
    const admin =
      await getAuthenticatedAdminClient();

    if (!admin) {
      return htmlResponse(
        "Google Drive Authorization",
        "Unauthorized",
        "You must be logged in as an administrator to complete Google Drive authorization.",
        401
      );
    }

    const url = new URL(request.url);

    const code =
      url.searchParams.get("code");

    const oauthError =
      url.searchParams.get("error");

    const returnedState =
      url.searchParams.get("state");

    /*
     * Read the state cookie from the incoming request.
     */
    const cookieHeader =
      request.headers.get("cookie") ?? "";

    const stateCookieMatch =
      cookieHeader.match(
        /(?:^|;\s*)mahalaxmi_google_oauth_state=([^;]+)/
      );

    const storedState =
      stateCookieMatch
        ? decodeURIComponent(
            stateCookieMatch[1]
          )
        : "";

    /*
     * Always reject a missing or mismatched state.
     */
    if (
      !returnedState ||
      !storedState ||
      returnedState !== storedState
    ) {
      return htmlResponse(
        "Google Drive Authorization",
        "Authorization validation failed",
        "The Google Drive authorization request could not be verified. Please start the authorization process again.",
        400
      );
    }

    /*
     * Never display OAuth parameters,
     * authorization codes, access tokens,
     * refresh tokens, or credentials.
     */
    if (oauthError) {
      console.error(
        "Google Drive OAuth provider error:",
        oauthError
      );

      return htmlResponse(
        "Google Drive Authorization",
        "Google Drive authorization failed",
        "Google Drive authorization was not completed. Please try again.",
        400
      );
    }

    if (!code) {
      return htmlResponse(
        "Google Drive Authorization",
        "Authorization code missing",
        "No authorization code was provided by Google. Please start the authorization process again.",
        400
      );
    }

    const clientId =
      process.env.GOOGLE_OAUTH_CLIENT_ID;

    const clientSecret =
      process.env.GOOGLE_OAUTH_CLIENT_SECRET;

    const redirectUri =
      process.env.GOOGLE_OAUTH_REDIRECT_URI;

    if (!clientId) {
      throw new Error(
        "GOOGLE_OAUTH_CLIENT_ID is missing"
      );
    }

    if (!clientSecret) {
      throw new Error(
        "GOOGLE_OAUTH_CLIENT_SECRET is missing"
      );
    }

    if (!redirectUri) {
      throw new Error(
        "GOOGLE_OAUTH_REDIRECT_URI is missing"
      );
    }

    const oauth2Client =
      new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri
      );

    /*
     * Exchange the authorization code on the server.
     *
     * Returned credentials remain server-side and
     * are never included in the browser response.
     */
    const { tokens } =
      await oauth2Client.getToken(code);

    if (!tokens.refresh_token) {
      return htmlResponse(
        "Google Drive Authorization",
        "Authorization completed",
        "Google did not return a refresh token. Please run the Google Drive authorization again.",
        400
      );
    }

    const response =
      htmlResponse(
        "Google Drive Authorization",
        "Google Drive Authorization Successful",
        "Google Drive authorization completed successfully. You may close this window.",
        200
      );

    /*
     * OAuth state is single-use. Remove it immediately
     * after a successful validation/exchange.
     */
    response.cookies.set({
      name:
        GOOGLE_OAUTH_STATE_COOKIE,
      value: "",
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error(
      "Google Drive OAuth callback error:",
      error
    );

    return htmlResponse(
      "Google Drive Authorization",
      "Google Drive authorization failed",
      "Google Drive authorization could not be completed. Please try again.",
      500
    );
  }
}