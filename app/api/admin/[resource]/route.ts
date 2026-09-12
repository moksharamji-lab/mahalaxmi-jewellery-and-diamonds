import { NextResponse } from "next/server";

import {
  ADMIN_AUTH_COOKIE,
  ADMIN_AUTH_COOKIE_OPTIONS,
} from "@/lib/auth-config";

import { getAuthenticatedAdminClient } from "@/lib/admin-pocketbase";
import { getAdminResource } from "@/lib/admin-resources";

type Props = {
  params: Promise<{
    resource: string;
  }>;
};

function unauthorizedResponse() {
  return NextResponse.json(
    { message: "Unauthorized." },
    { status: 401 }
  );
}

function unknownResourceResponse() {
  return NextResponse.json(
    { message: "Unknown resource." },
    { status: 404 }
  );
}

function errorResponse(error: unknown) {
  console.error("Admin create error:", error);

  return NextResponse.json(
    {
      message: "PocketBase could not save this record.",
    },
    { status: 400 }
  );
}

export async function POST(
  request: Request,
  { params }: Props
) {
  const { resource } = await params;

  const collection = getAdminResource(resource);

  if (!collection) {
    return unknownResourceResponse();
  }

  const adminClient = await getAuthenticatedAdminClient();

  if (!adminClient) {
    return unauthorizedResponse();
  }

  try {
    const formData = await request.formData();

    const record = await adminClient.pb
      .collection(collection)
      .create(formData, {
        requestKey: null,
      });

    const response = NextResponse.json(record, {
      status: 201,
    });

    response.cookies.set(
      ADMIN_AUTH_COOKIE,
      adminClient.refreshedToken,
      ADMIN_AUTH_COOKIE_OPTIONS
    );

    return response;
  } catch (error) {
    return errorResponse(error);
  }
}