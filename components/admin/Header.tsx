"use client";

import { Menu } from "lucide-react";

import LogoutButton from "@/components/admin/LogoutButton";

type Props = {
  onMenuClick: () => void;
};

export default function Header({
  onMenuClick,
}: Props) {
  return (
    <header className="flex h-20 shrink-0 items-center justify-between border-b border-[#D8C9B5] bg-[#F7F1E7] px-4 shadow-[0_2px_12px_rgba(80,60,30,0.04)] sm:px-6 lg:px-8">
      {/* Left side */}
      <div className="flex min-w-0 items-center gap-3">
        {/* Mobile menu */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="rounded-lg border border-[#D8C9B5] bg-[#F3EDE2] p-2 text-[#6F665B] transition hover:border-[#B08D57] hover:text-[#B08D57] lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          {/* Admin label */}
          <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#B08D57]">
            Admin Panel
          </p>

          {/* CMS title */}
          <h1 className="mt-1 truncate text-lg font-bold text-[#302A23] sm:text-xl md:text-2xl">
            Mahalaxmi Jewellery CMS
          </h1>

          {/* Description */}
          <p className="mt-0.5 hidden text-xs text-[#756B5E] sm:block">
            Manage your jewellery website
          </p>
        </div>
      </div>

      {/* Right side */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        {/* Admin profile */}
        <div className="hidden items-center gap-3 md:flex">
          {/* Avatar */}
          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#B08D57]/50 bg-[#B08D57]/10 font-semibold text-[#B08D57]">
            A
          </div>

          {/* Admin information */}
          <div>
            <p className="text-sm font-medium text-[#40382F]">
              Administrator
            </p>

            <p className="text-xs text-[#8B7F70]">
              Super Admin
            </p>
          </div>
        </div>

        {/* Logout */}
        <LogoutButton />
      </div>
    </header>
  );
}