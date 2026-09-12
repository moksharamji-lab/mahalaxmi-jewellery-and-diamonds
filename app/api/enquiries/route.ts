import { NextResponse } from "next/server";
import PocketBase from "pocketbase";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      name,
      phone,
      email,
      product,
      productSlug,
      collection,
      message,
    } = body;

    // Basic validation
    if (!name || !phone) {
      return NextResponse.json(
        {
          error: "Name and phone number are required.",
        },
        { status: 400 }
      );
    }

    // Create a server-side PocketBase client
    const pb = new PocketBase(
      process.env.NEXT_PUBLIC_POCKETBASE_URL ||
        "http://127.0.0.1:8090"
    );

    // Create enquiry
    await pb.collection("Enquiries").create({
      name: String(name).trim(),
      phone: String(phone).trim(),
      email: email ? String(email).trim() : "",
      product: product ? String(product).trim() : "",
      productSlug: productSlug
        ? String(productSlug).trim()
        : "",
      collection: collection
        ? String(collection).trim()
        : "",
      message: message ? String(message).trim() : "",
      status: "New",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Enquiry submission error:", error);

    return NextResponse.json(
      {
        error: "Unable to submit enquiry. Please try again.",
      },
      { status: 500 }
    );
  }
}