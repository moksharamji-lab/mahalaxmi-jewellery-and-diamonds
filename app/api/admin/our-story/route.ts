import { NextResponse } from "next/server";
import { z } from "zod";

import {
  ADMIN_AUTH_COOKIE,
  ADMIN_AUTH_COOKIE_OPTIONS,
} from "@/lib/auth-config";

import { getAuthenticatedAdminClient } from "@/lib/admin-pocketbase";

const updateOurStorySchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Our Story title is required."),

  paragraphOne: z
    .string()
    .trim()
    .min(1, "First paragraph is required."),

  paragraphTwo: z
    .string()
    .trim()
    .min(1, "Second paragraph is required."),

  buttonText: z
    .string()
    .trim()
    .min(1, "Button text is required."),

  buttonLink: z
    .string()
    .trim()
    .min(1, "Button link is required."),

  active: z.boolean(),
});

export async function PUT(request: Request) {
  try {
    const admin = await getAuthenticatedAdminClient();

    if (!admin) {
      return NextResponse.json(
        {
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const body = await request
      .json()
      .catch(() => null);

    const parsed =
      updateOurStorySchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message ??
        "Invalid Our Story information.";

      return NextResponse.json(
        {
          message: firstError,
        },
        {
          status: 400,
        }
      );
    }

    const records = await admin.pb
      .collection("OurStory")
      .getFullList({
        requestKey: null,
      });

    let updatedStory;

    if (records.length > 0) {
      updatedStory = await admin.pb
        .collection("OurStory")
        .update(
          records[0].id,
          parsed.data,
          {
            requestKey: null,
          }
        );
    } else {
      updatedStory = await admin.pb
        .collection("OurStory")
        .create(
          parsed.data,
          {
            requestKey: null,
          }
        );
    }

    const response = NextResponse.json({
      success: true,
      story: {
        id: updatedStory.id,
        title: updatedStory.title,
        active: updatedStory.active,
      },
    });

    response.cookies.set(
      ADMIN_AUTH_COOKIE,
      admin.refreshedToken,
      ADMIN_AUTH_COOKIE_OPTIONS
    );

    return response;
  } catch (error) {
    console.error(
      "Failed to update Our Story:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to update Our Story. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}