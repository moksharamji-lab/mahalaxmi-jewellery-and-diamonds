import { NextResponse } from "next/server";
import { Account, Client } from "node-appwrite";
import { z } from "zod";

import {
  ADMIN_AUTH_COOKIE,
  ADMIN_AUTH_COOKIE_OPTIONS,
} from "@/lib/auth-config";

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

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

const apiKey = getRequiredEnv(
  "APPWRITE_API_KEY"
);

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);

    const credentials = credentialsSchema.safeParse(body);

    if (!credentials.success) {
      return NextResponse.json(
        {
          message: "Enter a valid email and password.",
        },
        { status: 400 }
      );
    }

    const client = new Client()
      .setEndpoint(endpoint)
      .setProject(projectId)
      .setKey(apiKey);

    const account = new Account(client);

    const session =
      await account.createEmailPasswordSession(
        credentials.data.email,
        credentials.data.password
      );

    const sessionSecret = session.secret;

    if (!sessionSecret) {
      console.error(
        "Appwrite login succeeded but no session secret was returned."
      );

      return NextResponse.json(
        {
          message: "Unable to create admin session.",
        },
        { status: 500 }
      );
    }

    const response = NextResponse.json(
      {
        success: true,
        email: credentials.data.email,
      },
      { status: 200 }
    );

    response.cookies.set(
      ADMIN_AUTH_COOKIE,
      sessionSecret,
      ADMIN_AUTH_COOKIE_OPTIONS
    );

    return response;
  } catch (error) {
    console.error("Appwrite login failed:", error);

    return NextResponse.json(
      {
        message: "Invalid email or password.",
      },
      { status: 401 }
    );
  }
}