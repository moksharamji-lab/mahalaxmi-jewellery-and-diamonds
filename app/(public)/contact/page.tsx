import Link from "next/link";
import { getStores } from "@/services/store.service";

export default async function ContactPage() {
  const stores = (await getStores()).filter(
    (store) => store.active
  );

  return (
    <main className="min-h-screen bg-[#f8f5ef] text-[#1c1a17]">

      {/* =========================
          HEADER
      ========================= */}

      <section className="mx-auto max-w-7xl px-6 py-16 text-center md:py-20">

        <p className="text-sm uppercase tracking-[0.3em] text-[#b08a3c]">
          Visit Us
        </p>

        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[#1c1a17] md:text-5xl">
          Contact Our Stores
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#6f685e]">
          Visit our Gold and Diamond stores or connect with us
          directly. Our team is here to help you discover the
          perfect piece of jewellery.
        </p>

      </section>

      {/* =========================
          STORES
      ========================= */}

      <section className="mx-auto grid max-w-7xl gap-8 px-6 pb-20 md:grid-cols-2">

        {stores.map((store) => {

          const whatsappMessage =
            `Hello, I would like to know more about your ${store.collection} Jewellery Collection.`;

          const whatsappUrl = store.whatsapp
            ? `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(
                whatsappMessage
              )}`
            : "";

          return (
            <div
              key={store.id}
              className="rounded-3xl border border-[#dfd5c4] bg-white p-8 shadow-[0_15px_50px_rgba(80,60,30,0.06)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(80,60,30,0.1)]"
            >

              {/* =========================
                  STORE LOGO
              ========================= */}

              <div className="flex justify-center">

                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border border-[#c8a96b]/40 bg-[#eee8dc] p-5 shadow-[0_8px_25px_rgba(80,60,30,0.06)]">

                  {store.logo ? (
                    <img
                      src={store.logo}
                      alt={`${store.name} logo`}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <span className="font-display text-4xl text-[#b08a3c]">
                      {store.collection === "Gold"
                        ? "G"
                        : "D"}
                    </span>
                  )}

                </div>

              </div>

              {/* =========================
                  STORE COLLECTION
              ========================= */}

              <p className="mt-7 text-center text-sm uppercase tracking-[0.25em] text-[#b08a3c]">
                {store.collection} Store
              </p>

              {/* =========================
                  STORE NAME
              ========================= */}

              <h2 className="mt-3 text-center text-3xl font-semibold tracking-tight text-[#1c1a17]">
                {store.name}
              </h2>

              {/* Description */}

              {store.description && (
                <p className="mt-4 text-center leading-7 text-[#6f685e]">
                  {store.description}
                </p>
              )}

              {/* Gold Divider */}

              <div className="my-7 h-px bg-gradient-to-r from-transparent via-[#c8a96b] to-transparent" />

              {/* =========================
                  STORE DETAILS
              ========================= */}

              <div className="space-y-6">

                {/* Address */}

                <div>

                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#9b917f]">
                    Address
                  </p>

                  <p className="mt-2 leading-6 text-[#39342e]">
                    {store.address}
                  </p>

                </div>

                {/* Phone */}

                <div>

                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#9b917f]">
                    Phone
                  </p>

                  {store.phone ? (
                    <a
                      href={`tel:${store.phone}`}
                      className="mt-2 inline-block text-[#39342e] transition hover:text-[#b08a3c]"
                    >
                      {store.phone}
                    </a>
                  ) : (
                    <p className="mt-2 text-[#6f685e]">
                      Phone number coming soon
                    </p>
                  )}

                </div>

                {/* Email */}

                {store.email && (
                  <div>

                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#9b917f]">
                      Email
                    </p>

                    <a
                      href={`mailto:${store.email}`}
                      className="mt-2 inline-block break-all text-[#39342e] transition hover:text-[#b08a3c]"
                    >
                      {store.email}
                    </a>

                  </div>
                )}

              </div>

              {/* =========================
                  BUTTONS
              ========================= */}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">

                {/* WhatsApp */}

                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-xl bg-[#b08a3c] px-5 py-4 text-center text-sm font-semibold text-white transition hover:bg-[#98742f]"
                  >
                    WhatsApp
                  </a>
                ) : (
                  <span className="flex-1 rounded-xl bg-[#eee8dc] px-5 py-4 text-center text-sm font-semibold text-[#9b917f]">
                    WhatsApp Unavailable
                  </span>
                )}

                {/* Location */}

                {store.googleMapsUrl ? (
                  <a
                    href={store.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 rounded-xl border border-[#b08a3c] px-5 py-4 text-center text-sm font-semibold text-[#9a762f] transition hover:bg-[#b08a3c] hover:text-white"
                  >
                    View Location
                  </a>
                ) : (
                  <span className="flex-1 rounded-xl border border-[#dfd5c4] px-5 py-4 text-center text-sm font-semibold text-[#9b917f]">
                    Location Unavailable
                  </span>
                )}

              </div>

            </div>
          );
        })}

      </section>

      {/* =========================
          BOTTOM CTA
      ========================= */}

      <section className="border-t border-[#dfd5c4] bg-[#eee8dc]">

        <div className="mx-auto max-w-4xl px-6 py-16 text-center">

          <p className="text-sm uppercase tracking-[0.25em] text-[#b08a3c]">
            Need Assistance?
          </p>

          <h2 className="mt-3 text-3xl font-semibold text-[#1c1a17] md:text-4xl">
            We&apos;d Love to Hear From You
          </h2>

          <p className="mx-auto mt-4 max-w-2xl leading-7 text-[#6f685e]">
            Have a question about our collections, products, or
            store availability? Get in touch with our team.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex items-center justify-center rounded-xl bg-[#b08a3c] px-8 py-4 font-semibold text-white transition hover:bg-[#98742f]"
          >
            Explore Our Collections
          </Link>

        </div>

      </section>

    </main>
  );
}