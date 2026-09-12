import { NextResponse } from "next/server";
import { z } from "zod";

import {
  ADMIN_AUTH_COOKIE,
  ADMIN_AUTH_COOKIE_OPTIONS,
} from "@/lib/auth-config";

import { getAuthenticatedAdminClient } from "@/lib/admin-pocketbase";

const updateStoreSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Store name is required."),

  address: z.string().trim(),

  phone: z.string().trim(),

  whatsapp: z.string().trim(),

  googleMapsUrl: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" || /^https?:\/\/.+/i.test(value),
      "Enter a valid Google Maps URL."
    ),

  email: z
    .string()
    .trim()
    .refine(
      (value) =>
        value === "" ||
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      "Enter a valid email address."
    ),

  description: z.string().trim(),

  active: z.boolean(),
});

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          message: "Store ID is required.",
        },
        {
          status: 400,
        }
      );
    }

    const admin =
      await getAuthenticatedAdminClient();

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
      updateStoreSchema.safeParse(body);

    if (!parsed.success) {
      const firstError =
        parsed.error.issues[0]?.message ??
        "Invalid store information.";

      return NextResponse.json(
        {
          message: firstError,
        },
        {
          status: 400,
        }
      );
    }

    const updatedStore = await admin.pb
      .collection("Stores")
      .update(id, parsed.data, {
        requestKey: null,
      });

    const response = NextResponse.json({
      success: true,
      store: {
        id: updatedStore.id,
        name: updatedStore.name,
        collection: updatedStore.collection,
        active: updatedStore.active,
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
      "Failed to update store:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to update the store. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}