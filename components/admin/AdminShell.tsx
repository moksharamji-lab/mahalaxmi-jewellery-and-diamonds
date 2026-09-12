"use client";

import { useState } from "react";

import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

type Props = {
  children: React.ReactNode;
};

export default function AdminShell({
  children,
}: Props) {
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  return (
    <div className="flex min-h-screen bg-[#F3EDE2] text-[#302A23]">

      <Sidebar
        mobileMenuOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">

        <Header
          onMenuClick={() =>
            setMobileMenuOpen(true)
          }
        />

        <main className="min-w-0 flex-1 overflow-y-auto bg-[#F3EDE2] p-4 sm:p-6 lg:p-8">
          {children}
        </main>

      </div>
    </div>
  );
}