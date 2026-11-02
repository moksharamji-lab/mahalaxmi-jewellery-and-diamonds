import { NextResponse } from "next/server";

import { Query } from "node-appwrite";

import { getAuthenticatedAdminClient } from "@/lib/admin-pocketbase";
import {
  APPWRITE_DATABASE_ID,
  tablesDB,
} from "@/lib/appwrite";
import {
  APPWRITE_PRODUCT_SETTINGS_TABLE_ID,
} from "@/lib/appwrite-tables";

export async function GET() {
  try {
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

    const result = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_PRODUCT_SETTINGS_TABLE_ID,
      queries: [Query.limit(1)],
    });

    const row = result.rows?.[0];

    if (!row) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Product Settings row was not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * Appwrite stores the row identifier as $id.
     * We explicitly return it as "id" so the
     * admin page can use it for PATCH.
     */
    return NextResponse.json({
      success: true,
      data: {
        id: row.$id,
        line1: row.line1 ?? "",
        line2: row.line2 ?? "",
        line3: row.line3 ?? "",
        line4: row.line4 ?? "",
      },
    });
  } catch (error) {
    console.error(
      "[Product Settings GET] Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to load Product Settings.",
      },
      {
        status: 500,
      }
    );
  }
}
