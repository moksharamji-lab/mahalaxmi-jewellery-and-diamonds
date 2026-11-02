"use client";

import Link from "next/link";
import {
  Home,
  CircleDollarSign,
  Gem,
  FolderOpen,
  Images,
  Heart,
  Phone,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";

const NAV_ITEMS = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Gold",
    href: "/gold",
    icon: CircleDollarSign,
  },
  {
    label: "Diamonds",
    href: "/diamond",
    icon: Gem,
  },
  {
    label: "Categories",
    href: "/categories",
    icon: FolderOpen,
  },
  {
    label: "Gallery",
    href: "/gallery",
    icon: Images,
  },
  {
    label: "Wishlist",
    href: "/wishlist",
    icon: Heart,
  },
  {
    label: "Contact",
    href: "/contact",
    icon: Phone,
  },
];

export default function PublicNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#3a342c] bg-[#211e1a] text-white shadow-[0_4px_20px_rgba(0,0,0,0.18)]">

      {/* =====================================================
          DESKTOP NAVBAR
      ===================================================== */}

      <div className="hidden lg:block">

        <div className="mx-auto flex min-h-[112px] w-full items-center px-6 xl:px-10">

          {/* =================================================
              BRAND
          ================================================= */}

          <Link
            href="/"
            className="group flex shrink-0 flex-col justify-center"
          >

            <span className="font-display text-[34px] font-normal leading-none tracking-[0.18em] text-[#d6b878] transition-colors duration-300 group-hover:text-[#e4c98b] xl:text-[38px]">
              MAHALAXMI
            </span>

            <span className="mt-3 text-[12px] font-semibold uppercase leading-none tracking-[0.32em] text-[#f5eee2] xl:text-[13px]">
              JEWELLERS AND DIAMONDS (SINCE - 1996)
            </span>

          </Link>

          {/* =================================================
              NAVIGATION
          ================================================= */}

          <nav className="ml-auto flex items-center gap-1 xl:gap-2">

            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex min-w-[78px] flex-col items-center justify-center gap-2 rounded-lg px-3 py-3 text-[#d8c9ad] transition-all duration-300 hover:bg-[#2b2722] hover:text-[#d6b878] xl:min-w-[92px] xl:px-4"
                >

                  <Icon
                    size={19}
                    strokeWidth={1.6}
                    className="transition-transform duration-300 group-hover:-translate-y-0.5"
                  />

                  <span className="whitespace-nowrap text-[12px] font-semibold tracking-[0.08em]">
                    {item.label}
                  </span>

                </Link>
              );
            })}

          </nav>

        </div>

      </div>

      {/* =====================================================
          MOBILE / TABLET NAVBAR
      ===================================================== */}

      <div className="lg:hidden">

        <div className="flex min-h-[88px] items-center justify-between px-5 sm:px-7">

          {/* =================================================
              BRAND
          ================================================= */}

          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            className="flex min-w-0 flex-col justify-center"
          >

            <span className="font-display text-[27px] font-normal leading-none tracking-[0.14em] text-[#d6b878] sm:text-[31px]">
              MAHALAXMI
            </span>

            <span className="mt-2 whitespace-nowrap text-[8px] font-semibold uppercase leading-none tracking-[0.24em] text-[#f5eee2] sm:text-[10px] sm:tracking-[0.28em]">
              JEWELLERS AND DIAMONDS (SINCE - 1996)
            </span>

          </Link>

          {/* =================================================
              MOBILE MENU BUTTON
          ================================================= */}

          <button
            type="button"
            aria-label={
              mobileOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
            className="ml-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-[#66583f] bg-[#29251f] text-[#d6b878] transition-all duration-300 hover:border-[#d6b878] hover:bg-[#332d24]"
          >
            {mobileOpen ? (
              <X size={22} strokeWidth={1.7} />
            ) : (
              <Menu size={22} strokeWidth={1.7} />
            )}
          </button>

        </div>

        {/* =================================================
            MOBILE MENU
        ================================================= */}

        {mobileOpen && (
          <div className="border-t border-[#3a342c] bg-[#211e1a] px-5 pb-5 pt-3 shadow-[0_12px_30px_rgba(0,0,0,0.25)] sm:px-7">

            <nav className="grid grid-cols-2 gap-2 sm:grid-cols-4">

              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex min-h-[58px] items-center gap-3 rounded-lg border border-[#3e382f] bg-[#28241f] px-4 text-[#ded4c3] transition-all duration-300 hover:border-[#8f733f] hover:bg-[#302a22] hover:text-[#d6b878]"
                  >

                    <Icon
                      size={18}
                      strokeWidth={1.6}
                      className="shrink-0"
                    />

                    <span className="text-[12px] font-semibold tracking-[0.06em]">
                      {item.label}
                    </span>

                  </Link>
                );
              })}

            </nav>

          </div>
        )}

      </div>

    </header>
  );
}