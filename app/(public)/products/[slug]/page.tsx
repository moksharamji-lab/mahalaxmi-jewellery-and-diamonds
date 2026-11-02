import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Query } from "node-appwrite";

import ProductGallery from "@/components/public/ProductGallery";
import WishlistButton from "@/components/public/WishlistButton";

import { APPWRITE_DATABASE_ID, tablesDB } from "@/lib/appwrite";
import {
  APPWRITE_PRODUCT_SETTINGS_TABLE_ID,
} from "@/lib/appwrite-tables";

import { getProductBySlug } from "@/services/product.service";
import { getStoreByCollection } from "@/services/store.service";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

type ProductSettings = {
  line1: string;
  line2: string;
  line3: string;
  line4: string;
};

async function getProductSettings(): Promise<ProductSettings> {
  const fallback: ProductSettings = {
    line1: "100% Certified Gold and Diamond Jewellery.",
    line2: "Handmade jewellery.",
    line3: "BIS Hallmark Jewellery.",
    line4: "Shipped all over India.",
  };

  try {
    const response = await tablesDB.listRows({
      databaseId: APPWRITE_DATABASE_ID,
      tableId: APPWRITE_PRODUCT_SETTINGS_TABLE_ID,
      queries: [Query.limit(1)],
    });

    const row = response.rows?.[0] as
      | {
          line1?: string;
          line2?: string;
          line3?: string;
          line4?: string;
        }
      | undefined;

    if (!row) {
      return fallback;
    }

    return {
      line1: row.line1?.trim() || fallback.line1,
      line2: row.line2?.trim() || fallback.line2,
      line3: row.line3?.trim() || fallback.line3,
      line4: row.line4?.trim() || fallback.line4,
    };
  } catch (error) {
    console.error("Failed to load product settings:", error);

    return fallback;
  }
}

export default async function ProductPage({
  params,
}: Props) {
  const { slug } = await params;


  let product;

  try {
    product = await getProductBySlug(slug);
  } catch (error) {
    console.error("Product page failed:", error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  const productSettings = await getProductSettings();

  const globalProductLines = [
    productSettings.line1,
    productSettings.line2,
    productSettings.line3,
    productSettings.line4,
  ].filter(Boolean);

  const rawCollection = String(product.collection ?? "")
    .trim()
    .toLowerCase();

  const collection = rawCollection.includes("diamond")
    ? "Diamond"
    : "Gold";



  let store = null;

  try {
    store = await getStoreByCollection(collection);
  } catch (error) {
    console.error(
      `Failed to load ${collection} store:`,
      error
    );
  }



  const whatsappMessage =
    `Hello, I'm interested in ${product.name} from the ${collection} Collection. I would like to know more about this product.`;

  const whatsappUrl = store?.whatsapp
    ? `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
        whatsappMessage
      )}`
    : "";

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1c1a17]">
      {/* =====================================================
          PRODUCT
      ===================================================== */}

      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 md:py-16">
        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <div className="mb-8 flex flex-wrap items-center gap-2 text-sm text-[#8a8174]">
          <Link
            href="/"
            className="transition hover:text-[#b08a3c]"
          >
            Home
          </Link>

          <span>→</span>

          <Link
            href={
              collection === "Gold"
                ? "/gold"
                : "/diamond"
            }
            className="transition hover:text-[#b08a3c]"
          >
            {collection}
          </Link>

          <span>→</span>

          <span className="text-[#6f685e]">
            {product.name}
          </span>
        </div>

        {/* =================================================
            PRODUCT LAYOUT
        ================================================= */}

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* =================================================
              IMAGE / VIDEO
          ================================================= */}

          <div>
            <ProductGallery
              images={product.imageUrls}
              video={product.video}
              productName={product.name}
            />
          </div>

          {/* =================================================
              PRODUCT DETAILS
          ================================================= */}

          <div className="flex flex-col justify-center">
            <div className="rounded-3xl border border-[#dfd5c4] bg-white p-6 shadow-[0_10px_35px_rgba(80,60,30,0.05)] sm:p-8 md:p-9">
              {/* =================================================
                  PRODUCT NAME
              ================================================= */}

              <div className="border-b border-[#eee5d7] pb-6">
                <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-[#1c1a17] sm:text-5xl md:text-6xl">
                  {product.name}
                </h1>
              </div>

              {/* =================================================
                  PURITY + TAG NUMBER
              ================================================= */}

              <div className="grid gap-6 border-b border-[#eee5d7] py-6 sm:grid-cols-2">
                {product.purity && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9b917f]">
                      Purity
                    </p>

                    <p className="mt-2 text-base font-semibold text-[#1c1a17]">
                      {product.purity}
                    </p>
                  </div>
                )}

                {product.tagNumber && (
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9b917f]">
                      Tag Number
                    </p>

                    <p className="mt-2 text-base font-semibold text-[#1c1a17]">
                      {product.tagNumber}
                    </p>
                  </div>
                )}
              </div>

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              {product.description && (
                <div className="border-b border-[#eee5d7] py-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#9b917f]">
                    Description
                  </p>

                  <p className="mt-3 whitespace-pre-line text-sm leading-7 text-[#6f685e] sm:text-base">
                    {product.description}
                  </p>
                </div>
              )}

              {/* =================================================
                  COMMON GLOBAL INFORMATION
              ================================================= */}

              <div className="space-y-4 pt-6">
                {globalProductLines.map((line, index) => (
                  <div
                    key={`${line}-${index}`}
                    className="flex items-start gap-3"
                  >
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#b08d57] text-[11px] font-bold text-white">
                      ✓
                    </span>

                    <p className="text-sm leading-6 text-[#4f4941]">
                      {line}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {whatsappUrl && (
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-xl bg-[#b08a3c] px-6 py-4 text-center font-semibold text-white transition hover:bg-[#98742f]"
                >
                  Enquire on WhatsApp
                </a>
              )}



              <div className="flex-1">
                <WishlistButton product={product} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          STORE INFORMATION
      ===================================================== */}

      <section className="border-t border-[#dfd5c4] bg-[#eee8dc]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 md:py-20">
          <div className="mx-auto max-w-4xl">


            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-[#b08a3c]">
                Available At
              </p>

              <h2 className="mt-3 text-3xl font-semibold text-[#1c1a17] md:text-4xl">
                Visit Our {collection} Store
              </h2>
            </div>



            <div className="mt-10 rounded-3xl border border-[#dfd5c4] bg-white p-7 shadow-[0_15px_50px_rgba(80,60,30,0.06)] sm:p-9 md:p-10">
              {store?.logo && (
                <div className="mb-8 flex justify-center">
                  <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border border-[#b08a3c]/30 bg-[#f8f5ef] p-4 shadow-sm sm:h-32 sm:w-32">
                    <Image
                      src={store.logo}
                      alt={`${store.name || collection} logo`}
                      width={128}
                      height={128}
                      unoptimized
                      className="h-full w-full object-contain"
                    />
                  </div>
                </div>
              )}

              <p className="text-sm uppercase tracking-[0.25em] text-[#b08a3c]">
                {collection} Store
              </p>

              <h3 className="mt-3 text-2xl font-semibold text-[#1c1a17] sm:text-3xl">
                {store?.name ||
                  `${collection} Jewellery Store`}
              </h3>

              {store?.description && (
                <p className="mt-4 leading-7 text-[#6f685e]">
                  {store.description}
                </p>
              )}



              <div className="mt-8 grid gap-6 sm:grid-cols-2">


                <div>
                  <p className="text-xs uppercase tracking-wider text-[#9b917f]">
                    Address
                  </p>

                  <p className="mt-2 leading-7 text-[#4f4941]">
                    {store?.address ||
                      "Store address coming soon"}
                  </p>
                </div>



                <div>
                  <p className="text-xs uppercase tracking-wider text-[#9b917f]">
                    Phone
                  </p>

                  {store?.phone ? (
                    <a
                      href={`tel:${store.phone}`}
                      className="mt-2 inline-block text-[#4f4941] transition hover:text-[#b08a3c]"
                    >
                      {store.phone}
                    </a>
                  ) : (
                    <p className="mt-2 text-[#8a8174]">
                      Phone number coming soon
                    </p>
                  )}
                </div>
              </div>



              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                {store?.whatsapp && (
                  <a
                    href={`https://wa.me/${store.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-xl bg-[#b08a3c] px-5 py-4 text-center text-sm font-semibold text-white transition hover:bg-[#98742f]"
                  >
                    WhatsApp Store
                  </a>
                )}

                {store?.googleMapsUrl && (
                  <a
                    href={store.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-xl border border-[#b08a3c] px-5 py-4 text-center text-sm font-semibold text-[#9a762f] transition hover:bg-[#b08a3c] hover:text-white"
                  >
                    View Store Location
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BACK TO COLLECTION
      ===================================================== */}

      <section className="border-t border-[#dfd5c4] bg-[#f8f5ef]">
        <div className="mx-auto max-w-7xl px-5 py-10 text-center">
          <Link
            href={
              collection === "Gold"
                ? "/gold"
                : "/diamond"
            }
            className="text-sm font-semibold text-[#b08a3c] transition hover:text-[#98742f]"
          >
            ← Back to {collection} Collection
          </Link>
        </div>
      </section>
    </main>
  );
}
