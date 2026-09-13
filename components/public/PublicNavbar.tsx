"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Home,
  CircleDollarSign,
  Gem,
  FolderOpen,
  Heart,
  Phone,
  Menu,
  X,
} from "lucide-react";

const navItems = [
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
    <header className="sticky top-0 z-50 border-b border-[#4a4135] bg-[#211e1a]">
      <div className="mx-auto flex h-21.5 max-w-375 items-center justify-between px-5 sm:px-8 lg:px-12">
        {/* BRAND */}
        <Link
          href="/"
          onClick={() => setMobileOpen(false)}
          className="group flex flex-col"
        >
          <span className="font-display text-[24px] font-normal tracking-[0.18em] text-[#d6b878] transition-colors duration-300 group-hover:text-[#e0c58a] sm:text-[27px]">
            MAHALAXMI
          </span>

          <span className="mt-1 text-[8px] font-medium uppercase tracking-[0.22em] text-[#c8bba7] sm:text-[9px]">
            JEWELLERS AND DIAMONDS (SINCE - 1996)
          </span>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <nav className="hidden items-center gap-8 lg:flex xl:gap-10">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-2.5 text-[13px] font-semibold uppercase tracking-[0.13em] text-[#f1ece3] transition-colors duration-300 hover:text-[#d6b878]"
              >
                <Icon
                  size={17}
                  strokeWidth={1.5}
                  className="text-[#d6b878] transition-transform duration-300 group-hover:scale-110 group-hover:text-[#e0c58a]"
                />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* MOBILE MENU BUTTON */}
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          onClick={() => setMobileOpen((value) => !value)}
          className="flex h-10 w-10 items-center justify-center border border-[#5a4e3e] text-[#d6b878] transition-colors hover:border-[#d6b878] hover:text-[#e0c58a] lg:hidden"
        >
          {mobileOpen ? (
            <X size={21} strokeWidth={1.5} />
          ) : (
            <Menu size={21} strokeWidth={1.5} />
          )}
        </button>
      </div>

      {/* MOBILE NAVIGATION */}
      {mobileOpen && (
        <div className="border-t border-[#4a4135] bg-[#29251f] lg:hidden">
          <nav className="mx-auto max-w-375 px-5 py-4 sm:px-8">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-4 border-b border-[#40382f] py-4 text-[13px] font-semibold uppercase tracking-[0.16em] text-[#f1ece3] transition-colors last:border-b-0 hover:text-[#d6b878]"
                >
                  <Icon
                    size={18}
                    strokeWidth={1.5}
                    className="text-[#d6b878]"
                  />

                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
}