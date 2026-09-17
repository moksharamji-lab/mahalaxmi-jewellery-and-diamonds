import { NextResponse } from "next/server";
import { ID } from "node-appwrite";
import { z } from "zod";

import {
  APPWRITE_DATABASE_ID,
  tablesDB,
} from "@/lib/appwrite";

/* =========================================================
   VALIDATION
========================================================= */

const enquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is required.")
    .max(100, "Name is too long."),

  phone: z
    .string()
    .trim()
    .regex(
      /^[+0-9()\-\s]{7,20}$/,
      "Enter a valid phone number."
    ),

  email: z
    .string()
    .trim()
    .max(150, "Email is too long.")
    .optional()
    .or(z.literal("")),

  product: z
    .string()
    .trim()
    .max(150, "Product name is too long.")
    .optional()
    .or(z.literal("")),

  productSlug: z
    .string()
    .trim()
    .max(200, "Product slug is too long.")
    .optional()
    .or(z.literal("")),

  collection: z
    .string()
    .trim()
    .max(50, "Collection is too long.")
    .optional()
    .or(z.literal("")),

  message: z
    .string()
    .trim()
    .max(
      2000,
      "Message is too long."
    )
    .optional()
    .or(z.literal("")),
});

/* =========================================================
   POST
========================================================= */

export async function POST(
  request: Request
) {
  try {
    const body =
      await request
        .json()
        .catch(() => null);

    const result =
      enquirySchema.safeParse(
        body
      );

    if (!result.success) {
      return NextResponse.json(
        {
          error:
            "Please enter valid enquiry details.",
        },
        {
          status: 400,
        }
      );
    }

    const enquiry =
      result.data;

    /* =====================================================
       CREATE ENQUIRY
    ===================================================== */

    await tablesDB.createRow({
      databaseId:
        APPWRITE_DATABASE_ID,

      tableId:
        "enquiries",

      rowId:
        ID.unique(),

      data: {
        name:
          enquiry.name,

        phone:
          enquiry.phone,

        email:
          enquiry.email ?? "",

        product:
          enquiry.product ?? "",

        productSlug:
          enquiry.productSlug ?? "",

        collection:
          enquiry.collection ?? "",

        message:
          enquiry.message ?? "",

        status:
          "New",
      },
    });

    return NextResponse.json(
      {
        success: true,

        message:
          "Enquiry submitted successfully.",
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Enquiry submission error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to submit enquiry. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}