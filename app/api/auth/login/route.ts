import PocketBase from "pocketbase";
import { NextResponse } from "next/server";
import { z } from "zod";

import {
  ADMIN_AUTH_COOKIE,
  ADMIN_AUTH_COOKIE_OPTIONS,
  POCKETBASE_URL,
} from "@/lib/auth-config";

import { lockCmsWriteRules } from "@/lib/lock-cms-write-rules";

const credentialsSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);

  const credentials = credentialsSchema.safeParse(body);

  if (!credentials.success) {
    return NextResponse.json(
      { message: "Enter a valid email and password." },
      { status: 400 }
    );
  }

  const pb = new PocketBase(POCKETBASE_URL);

  try {
    const authData = await pb
      .collection("_superusers")
      .authWithPassword(
        credentials.data.email,
        credentials.data.password,
        {
          requestKey: null,
        }
      );

    try {
      await lockCmsWriteRules(pb);
    } catch (error) {
      console.error(
        "Unable to lock PocketBase write rules:",
        error
      );

      return NextResponse.json(
        {
          message:
            "Unable to secure the CMS write rules. Please try again.",
        },
        { status: 500 }
      );
    }

    const response = NextResponse.json({
      email: authData.record.email ?? "",
    });

    response.cookies.set(
      ADMIN_AUTH_COOKIE,
      pb.authStore.token,
      ADMIN_AUTH_COOKIE_OPTIONS
    );

    return response;
  } catch {
    return NextResponse.json(
      { message: "Invalid email or password." },
      { status: 401 }
    );
  }
}