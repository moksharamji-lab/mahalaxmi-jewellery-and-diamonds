"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.replace("/mahalaxmi-control");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);

      // Still send the user to the login page.
      router.replace("/mahalaxmi-control");
      router.refresh();
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="rounded-lg border border-[#D0C1AC] bg-[#EDE3D3] px-4 py-2 text-sm font-semibold text-[#554C42] transition-all duration-200 hover:border-[#B08D57] hover:bg-[#F3EDE2] hover:text-[#8F6F3F] disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLoggingOut ? "Signing out..." : "Sign Out"}
    </button>
  );
}