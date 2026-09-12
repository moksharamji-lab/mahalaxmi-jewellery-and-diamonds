import Link from "next/link";
import { notFound } from "next/navigation";

import ProductGallery from "@/components/public/ProductGallery";
import WishlistButton from "@/components/public/WishlistButton";

import { getProductBySlug } from "@/services/product.service";
import { getStoreByCollection } from "@/services/store.service";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProductPage({
  params,
}: Props) {
  const { slug } = await params;

  // =====================================================
  // GET PRODUCT
  // =====================================================

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

  // =====================================================
  // COLLECTION
  // =====================================================

  const collection =
    product.collection === "Diamond"
      ? "Diamond"
      : "Gold";

  // =====================================================
  // GET STORE
  // =====================================================

  let store = null;

  try {
    store = await getStoreByCollection(collection);
  } catch (error) {
    console.error(
      `Failed to load ${collection} store:`,
      error
    );
  }

  // =====================================================
  // WHATSAPP
  // =====================================================

  const whatsappMessage =
    `Hello, I'm interested in ${product.name} from the ${product.collection} Collection. I would like to know more about this product.`;

  const whatsappUrl = store?.whatsapp
    ? `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
        whatsappMessage
      )}`
    : "";

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1c1a17]">

      {/* =================================================
          PRODUCT
      ================================================= */}

      <section className="mx-auto max-w-7xl px-6 py-12 md:py-20">

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
            {collection} Jewellery
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
              IMAGE / VIDEO GALLERY
          ================================================= */}

          <div>
            <ProductGallery
              images={product.imageUrls}
              video={product.video}
              productName={product.name}
            />
          </div>

          {/* =================================================
              PRODUCT INFORMATION
          ================================================= */}

          <div className="flex flex-col justify-center">

            {/* Collection */}

            <p className="text-sm uppercase tracking-[0.3em] text-[#b08a3c]">
              {product.collection} Jewellery
            </p>

            {/* Product Name */}

            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#1c1a17] sm:text-5xl">
              {product.name}
            </h1>

            {/* Category */}

            {product.categoryName && (
              <p className="mt-4 text-[#8a8174]">
                {product.categoryName}
              </p>
            )}

            {/* =================================================
                PRODUCT DETAILS
            ================================================= */}

            <div className="mt-8 grid grid-cols-2 gap-4">

              {/* Purity */}

              {product.purity && (
                <div className="rounded-2xl border border-[#dfd5c4] bg-white p-5 shadow-[0_10px_35px_rgba(80,60,30,0.04)]">

                  <p className="text-xs uppercase tracking-wider text-[#9b917f]">
                    Purity
                  </p>

                  <p className="mt-2 font-semibold text-[#1c1a17]">
                    {product.purity}
                  </p>

                </div>
              )}

              {/* Weight */}

              {product.weight > 0 && (
                <div className="rounded-2xl border border-[#dfd5c4] bg-white p-5 shadow-[0_10px_35px_rgba(80,60,30,0.04)]">

                  <p className="text-xs uppercase tracking-wider text-[#9b917f]">
                    Weight
                  </p>

                  <p className="mt-2 font-semibold text-[#1c1a17]">
                    {product.weight} g
                  </p>

                </div>
              )}

              {/* Brand */}

              {product.brandName && (
                <div className="rounded-2xl border border-[#dfd5c4] bg-white p-5 shadow-[0_10px_35px_rgba(80,60,30,0.04)]">

                  <p className="text-xs uppercase tracking-wider text-[#9b917f]">
                    Brand
                  </p>

                  <p className="mt-2 font-semibold text-[#1c1a17]">
                    {product.brandName}
                  </p>

                </div>
              )}

              {/* Making Charges */}

              {product.makingCharges > 0 && (
                <div className="rounded-2xl border border-[#dfd5c4] bg-white p-5 shadow-[0_10px_35px_rgba(80,60,30,0.04)]">

                  <p className="text-xs uppercase tracking-wider text-[#9b917f]">
                    Making Charges
                  </p>

                  <p className="mt-2 font-semibold text-[#1c1a17]">
                    ₹
                    {product.makingCharges.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                </div>
              )}

            </div>

            {/* =================================================
                DESCRIPTION
            ================================================= */}

            {product.description && (
              <div className="mt-8">

                <h2 className="text-lg font-semibold text-[#1c1a17]">
                  Product Details
                </h2>

                <p className="mt-3 whitespace-pre-line leading-7 text-[#6f685e]">
                  {product.description}
                </p>

              </div>
            )}

            {/* =================================================
                ACTIONS
            ================================================= */}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">

              {/* WhatsApp */}

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

              {/* Wishlist */}

              <div className="flex-1">
                <WishlistButton
                  product={product}
                />
              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =====================================================
          STORE INFORMATION
      ===================================================== */}

      <section className="border-t border-[#dfd5c4] bg-[#eee8dc]">

        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">

          <div className="mx-auto max-w-4xl">

            {/* Heading */}

            <div className="text-center">

              <p className="text-sm uppercase tracking-[0.3em] text-[#b08a3c]">
                Available At
              </p>

              <h2 className="mt-3 text-3xl font-semibold text-[#1c1a17] md:text-4xl">
                Visit Our {collection} Store
              </h2>

            </div>

            {/* Store Card */}

            <div className="mt-10 rounded-3xl border border-[#dfd5c4] bg-white p-7 shadow-[0_15px_50px_rgba(80,60,30,0.06)] sm:p-9 md:p-10">

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

              {/* Store Details */}

              <div className="mt-8 grid gap-6 sm:grid-cols-2">

                {/* Address */}

                <div>

                  <p className="text-xs uppercase tracking-wider text-[#9b917f]">
                    Address
                  </p>

                  <p className="mt-2 leading-7 text-[#4f4941]">
                    {store?.address ||
                      "Store address coming soon"}
                  </p>

                </div>

                {/* Phone */}

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

              {/* Store Actions */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                {/* WhatsApp */}

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

                {/* Google Maps */}

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

        <div className="mx-auto max-w-7xl px-6 py-10 text-center">

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