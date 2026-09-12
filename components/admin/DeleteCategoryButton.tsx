"use client";

import { useRouter } from "next/navigation";
import { sendAdminMutation } from "@/lib/admin-api";

type Props = {
  id: string;
};

export default function DeleteCategoryButton({
  id,
}: Props) {
  const router = useRouter();

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?"
    );

    if (!confirmed) return;

    try {
      await sendAdminMutation(`categories/${id}`, "DELETE");

      alert("✅ Category deleted successfully!");

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to delete category.");
    }
  }

  return (
    <button
      onClick={handleDelete}
      className="rounded-lg border border-[#C58B84] bg-[#F7E9E7] px-4 py-2 text-sm font-semibold text-[#9A4F49] transition-colors duration-200 hover:border-[#A96760] hover:bg-[#F2DCD9] hover:text-[#813F39]"
    >
      🗑 Delete
    </button>
  );
}