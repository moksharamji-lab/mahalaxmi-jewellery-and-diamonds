import { NextResponse } from "next/server";
import { google } from "googleapis";

export const runtime = "nodejs";

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
        "Content-Type": "text/html; charset=utf-8",
        "X-Content-Type-Options": "nosniff",
      },
    }
  );
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);

    const code = url.searchParams.get("code");
    const oauthError = url.searchParams.get("error");

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
      return NextResponse.json(
        {
          success: false,
          message: "Authorization code was not provided.",
        },
        { status: 400 }
      );
    }

    const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;

    if (!clientId) {
      throw new Error("GOOGLE_OAUTH_CLIENT_ID is missing");
    }

    if (!clientSecret) {
      throw new Error("GOOGLE_OAUTH_CLIENT_SECRET is missing");
    }

    if (!redirectUri) {
      throw new Error("GOOGLE_OAUTH_REDIRECT_URI is missing");
    }

    const oauth2Client = new google.auth.OAuth2(
      clientId,
      clientSecret,
      redirectUri
    );

    const { tokens } = await oauth2Client.getToken(code);

    const refreshToken = tokens.refresh_token;

    if (!refreshToken) {
      return htmlResponse(
        "Google Drive Authorization",
        "Authorization completed",
        "Google did not return a refresh token. Please run the authorization again.",
        400
      );
    }

    return new NextResponse(
      `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>Google Drive Authorization Successful</title>
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
      <h1 style="color: #22c55e;">
        Google Drive Authorization Successful
      </h1>

      <p>
        Your Google Drive account has been authorized successfully.
      </p>

      <p>
        Add the following value to your local
        <strong>.env.local</strong> file:
      </p>

      <div
        style="
          margin-top: 20px;
          padding: 20px;
          background: #000;
          border-radius: 8px;
          overflow-wrap: anywhere;
          font-family: monospace;
        "
      >
        GOOGLE_DRIVE_REFRESH_TOKEN=${refreshToken}
      </div>

      <p style="margin-top: 25px; color: #facc15;">
        IMPORTANT: This refresh token is private.
        Do not send it to anyone or commit it to GitHub.
      </p>

      <p style="color: #aaa;">
        After adding it to .env.local, restart the Next.js server.
      </p>
    </div>
  </body>
</html>`,
      {
        status: 200,
        headers: {
          "Content-Type": "text/html; charset=utf-8",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  } catch (error) {
    console.error("Google Drive OAuth callback error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Google Drive authorization failed.",
      },
      { status: 500 }
    );
  }
}