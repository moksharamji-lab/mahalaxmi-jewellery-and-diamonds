import { NextResponse } from "next/server";
import { google } from "googleapis";
import { randomBytes } from "crypto";

import { getAuthenticatedAdminClient } from "@/lib/admin-pocketbase";

export const runtime = "nodejs";

const GOOGLE_OAUTH_STATE_COOKIE =
  "mahalaxmi_google_oauth_state";

const GOOGLE_OAUTH_STATE_MAX_AGE = 10 * 60;

function getRequiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is missing`);
  }

  return value;
}

export async function GET() {
  try {
    /*
     * Only an authenticated admin may start
     * the Google Drive authorization flow.
     */
    const admin =
      await getAuthenticatedAdminClient();

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        { status: 401 }
      );
    }

    const clientId = getRequiredEnv(
      "GOOGLE_OAUTH_CLIENT_ID"
    );

    const clientSecret = getRequiredEnv(
      "GOOGLE_OAUTH_CLIENT_SECRET"
    );

    const redirectUri = getRequiredEnv(
      "GOOGLE_OAUTH_REDIRECT_URI"
    );

    const oauth2Client =
      new google.auth.OAuth2(
        clientId,
        clientSecret,
        redirectUri
      );

    /*
     * Generate a cryptographically random OAuth state
     * value to protect the callback against CSRF.
     */
    const state = randomBytes(32).toString("hex");

    const authorizationUrl =
      oauth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: [
          "https://www.googleapis.com/auth/drive",
        ],
        state,
      });

    const response =
      NextResponse.redirect(
        authorizationUrl
      );

    /*
     * Keep the state only briefly and make it
     * inaccessible to JavaScript.
     */
    response.cookies.set({
      name: GOOGLE_OAUTH_STATE_COOKIE,
      value: state,
      httpOnly: true,
      secure:
        process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: GOOGLE_OAUTH_STATE_MAX_AGE,
    });

    return response;
  } catch (error) {
    console.error(
      "Google Drive authorization error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Could not start Google Drive authorization.",
      },
      { status: 500 }
    );
  }
}