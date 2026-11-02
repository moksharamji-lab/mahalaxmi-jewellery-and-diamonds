import { NextResponse } from "next/server";

import { getAuthenticatedAdminClient } from "@/lib/admin-pocketbase";
import {
  APPWRITE_DATABASE_ID,
  tablesDB,
} from "@/lib/appwrite";
import {
  APPWRITE_PRODUCT_SETTINGS_TABLE_ID,
} from "@/lib/appwrite-tables";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function PATCH(
  request: Request,
  { params }: Props
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "Product Settings ID is required.",
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
          success: false,
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const formData = await request.formData();

    const data: Record<string, string> = {};

    const line1 = formData.get("line1");
    const line2 = formData.get("line2");
    const line3 = formData.get("line3");
    const line4 = formData.get("line4");

    if (typeof line1 === "string") {
      data.line1 = line1.trim();
    }

    if (typeof line2 === "string") {
      data.line2 = line2.trim();
    }

    if (typeof line3 === "string") {
      data.line3 = line3.trim();
    }

    if (typeof line4 === "string") {
      data.line4 = line4.trim();
    }

    const row = await tablesDB.updateRow({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_PRODUCT_SETTINGS_TABLE_ID,
      rowId: id,
      data,
    });

    return NextResponse.json({
      success: true,
      data: row,
    });
  } catch (error) {
    console.error(
      "[Product Settings PATCH] Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to save Product Settings.",
      },
      {
        status: 500,
      }
    );
  }
}
