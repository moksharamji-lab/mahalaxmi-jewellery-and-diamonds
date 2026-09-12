"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  Package,
  Diamond,
  Folder,
  Image,
  BadgeIndianRupee,
  Store,
  X,
} from "lucide-react";

type Props = {
  mobileMenuOpen: boolean;
  onClose: () => void;
};

const menus = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Products",
    href: "/admin/products",
    icon: Package,
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: Folder,
  },
  {
    name: "Brands",
    href: "/admin/brands",
    icon: Diamond,
  },
  {
    name: "Hero Slides",
    href: "/admin/hero-slides",
    icon: Image,
  },
  {
    name: "Rates",
    href: "/admin/rates",
    icon: BadgeIndianRupee,
  },
  {
    name: "Stores",
    href: "/admin/stores",
    icon: Store,
  },
];

export default function Sidebar({
  mobileMenuOpen,
  onClose,
}: Props) {
  const pathname = usePathname();

  function handleNavigation() {
    onClose();
  }

  return (
    <>
      {/* Mobile overlay */}

      {mobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-[#302A23]/25 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar */}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-[#D8C9B5] bg-[#EDE3D3] shadow-[4px_0_24px_rgba(80,60,30,0.06)] transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0 ${
          mobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >

        {/* Logo */}

        <div className="flex h-20 shrink-0 items-center justify-between border-b border-[#D8C9B5] px-7">

          <Link
            href="/admin"
            onClick={handleNavigation}
            className="group"
          >
            <div className="text-2xl font-bold tracking-[0.12em] text-[#B08D57] transition-colors group-hover:text-[#8F6F3F]">
              MAHALAXMI
            </div>

            <div className="mt-0.5 text-[9px] uppercase tracking-[0.3em] text-[#756B5E]">
              Jewellery & Diamonds
            </div>
          </Link>

          {/* Mobile close */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-2 text-[#6F665B] transition hover:bg-[#F3EDE2] hover:text-[#B08D57] lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>

        </div>

        {/* Navigation */}

        <nav className="flex-1 space-y-1.5 overflow-y-auto p-5">

          <p className="mb-4 px-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#8B7F70]">
            Management
          </p>

          {menus.map((item) => {
            const Icon = item.icon;

            const active =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleNavigation}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition duration-200 ${
                  active
                    ? "bg-[#B08D57] text-[#FFF9EF] shadow-[0_8px_20px_rgba(176,141,87,0.18)]"
                    : "text-[#4F473D] hover:bg-[#F3EDE2] hover:text-[#302A23]"
                }`}
              >

                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    active
                      ? "text-[#FFF9EF]"
                      : "text-[#776D60] transition group-hover:text-[#B08D57]"
                  }`}
                />

                <span>
                  {item.name}
                </span>

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#FFF9EF]" />
                )}

              </Link>
            );
          })}

        </nav>

        {/* Sidebar footer */}

        <div className="border-t border-[#D8C9B5] p-5">

          <p className="text-[10px] uppercase tracking-[0.2em] text-[#8B7F70]">
            CMS
          </p>

          <p className="mt-2 text-xs text-[#6F665B]">
            Mahalaxmi Jewellery
          </p>

        </div>

      </aside>
    </>
  );
}