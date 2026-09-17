import { NextResponse } from "next/server";
import { google } from "googleapis";

export const runtime = "nodejs";

export async function GET() {
  try {
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

    const authorizationUrl = oauth2Client.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: ["https://www.googleapis.com/auth/drive"],
    });

    return NextResponse.redirect(authorizationUrl);
  } catch (error) {
    console.error("Google Drive authorization error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Could not start Google Drive authorization.",
      },
      { status: 500 }
    );
  }
}