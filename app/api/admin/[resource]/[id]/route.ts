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
    id: string;
  }>;
};

function unauthorizedResponse() {
  return NextResponse.json(
    { message: "Unauthorized." },
    { status: 401 }
  );
}

function errorResponse(error: unknown) {
  console.error("Admin mutation error:", error);

  return NextResponse.json(
    {
      message: "PocketBase could not update this record.",
    },
    { status: 400 }
  );
}

/* =========================================================
   UPDATE
========================================================= */

export async function PATCH(
  request: Request,
  { params }: Props
) {
  const { resource, id } = await params;

  const collection = getAdminResource(resource);

  if (!collection) {
    return NextResponse.json(
      { message: "Unknown resource." },
      { status: 404 }
    );
  }

  const adminClient = await getAuthenticatedAdminClient();

  if (!adminClient) {
    return unauthorizedResponse();
  }

  try {
    const formData = await request.formData();

    const record = await adminClient.pb
      .collection(collection)
      .update(id, formData, {
        requestKey: null,
      });

    const response = NextResponse.json(record);

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

/* =========================================================
   DELETE
========================================================= */

export async function DELETE(
  _request: Request,
  { params }: Props
) {
  const { resource, id } = await params;

  const collection = getAdminResource(resource);

  if (!collection) {
    return NextResponse.json(
      { message: "Unknown resource." },
      { status: 404 }
    );
  }

  const adminClient = await getAuthenticatedAdminClient();

  if (!adminClient) {
    return unauthorizedResponse();
  }

  try {
    await adminClient.pb
      .collection(collection)
      .delete(id, {
        requestKey: null,
      });

    const response = new NextResponse(null, {
      status: 204,
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