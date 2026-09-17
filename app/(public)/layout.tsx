import type { ReactNode } from "react";
import Link from "next/link";

import RatesTicker from "@/components/public/RatesTicker";
import PublicNavbar from "@/components/public/PublicNavbar";

export default function PublicLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* =====================================================
          GOLD RATES TICKER
      ===================================================== */}

      <RatesTicker />

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <PublicNavbar />

      {/* =====================================================
          PAGE CONTENT
      ===================================================== */}

      <main>{children}</main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="border-t border-zinc-800 bg-black">
        <div className="mx-auto max-w-7xl px-6 py-14">

          {/* Footer Grid */}

          <div className="grid gap-10 md:grid-cols-3">

            {/* =================================================
                BRAND
            ================================================= */}

            <div>
              <Link
                href="/"
                className="inline-flex flex-col"
              >
                <span className="text-2xl font-semibold tracking-[0.18em] text-yellow-500">
                  MAHALAXMI
                </span>

                <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">
                  JEWELLERS AND DIAMONDS
                </span>
              </Link>

              <p className="mt-5 max-w-sm leading-7 text-zinc-500">
                A trusted destination for exquisite gold and
                diamond jewellery, bringing together two
                specialised stores under one name.
              </p>
            </div>

            {/* =================================================
                QUICK LINKS
            ================================================= */}

            <div>
              <h3 className="text-lg font-semibold text-white">
                Quick Links
              </h3>

              <div className="mt-5 flex flex-col gap-3 text-sm">

                <Link
                  href="/"
                  className="text-zinc-400 transition hover:text-yellow-500"
                >
                  Home
                </Link>

                <Link
                  href="/gold"
                  className="text-zinc-400 transition hover:text-yellow-500"
                >
                  Gold Jewellery
                </Link>

                <Link
                  href="/diamond"
                  className="text-zinc-400 transition hover:text-yellow-500"
                >
                  Diamond Jewellery
                </Link>

                <Link
                  href="/categories"
                  className="text-zinc-400 transition hover:text-yellow-500"
                >
                  Categories
                </Link>

                <Link
                  href="/wishlist"
                  className="text-zinc-400 transition hover:text-yellow-500"
                >
                  Wishlist
                </Link>

                <Link
                  href="/contact"
                  className="text-zinc-400 transition hover:text-yellow-500"
                >
                  Contact
                </Link>

              </div>
            </div>

            {/* =================================================
                STORES
            ================================================= */}

            <div>
              <h3 className="text-lg font-semibold text-white">
                Visit Our Stores
              </h3>

              <div className="mt-5 space-y-5 text-sm">

                <div>
                  <p className="font-semibold text-zinc-300">
                    Gold Store
                  </p>

                  <Link
                    href="/gold"
                    className="mt-1 inline-block text-zinc-500 transition hover:text-yellow-500"
                  >
                    Explore Gold Jewellery →
                  </Link>
                </div>

                <div>
                  <p className="font-semibold text-zinc-300">
                    Diamond Store
                  </p>

                  <Link
                    href="/diamond"
                    className="mt-1 inline-block text-zinc-500 transition hover:text-yellow-500"
                  >
                    Explore Diamond Jewellery →
                  </Link>
                </div>

              </div>

              <Link
                href="/contact"
                className="mt-6 inline-block text-sm font-medium text-yellow-500 transition hover:text-yellow-400"
              >
                Get Store Details →
              </Link>
            </div>

          </div>

          {/* =====================================================
              COPYRIGHT
          ===================================================== */}

          <div className="mt-12 border-t border-zinc-800 pt-6">

            <div className="flex flex-col gap-3 text-center text-sm sm:flex-row sm:items-center sm:justify-between sm:text-left">

              <p className="text-zinc-600">
                © {new Date().getFullYear()} MAHALAXMI JEWELLERS AND DIAMONDS. All rights reserved.
              </p>

              <p className="text-zinc-600">
                Website Designed & Developed by{" "}

                <a
                  href="https://adsparkcom.lovable.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-yellow-500 transition hover:text-yellow-400"
                >
                  AdSpark Technologies
                </a>
              </p>

            </div>

          </div>

        </div>
      </footer>
    </div>
  );
}