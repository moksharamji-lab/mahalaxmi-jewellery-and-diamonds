"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { sendAdminMutation } from "@/lib/admin-api";
import { Brand } from "@/types/brand";

type Props = {
  initialData?: Brand;
};

export default function BrandForm({ initialData }: Props) {
  const router = useRouter();

  const [name, setName] = useState(initialData?.name ?? "");
  const [slug, setSlug] = useState(initialData?.slug ?? "");
  const [active, setActive] = useState(
    initialData?.active ?? true
  );
  const [logo, setLogo] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter a brand name.");
      return;
    }

    if (!slug.trim()) {
      alert("Please enter a brand slug.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", name.trim());
      formData.append("slug", slug.trim());
      formData.append("active", String(active));

      if (logo) {
        formData.append("logo", logo);
      }

      if (initialData) {
        await sendAdminMutation(
          `brands/${initialData.id}`,
          "PATCH",
          formData
        );

        alert("Brand updated successfully!");
      } else {
        await sendAdminMutation(
          "brands",
          "POST",
          formData
        );

        alert("Brand created successfully!");
      }

      router.push("/admin/brands");
      router.refresh();
    } catch (error) {
      console.error("Brand error:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl space-y-6 rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-6 shadow-[0_4px_18px_rgba(80,60,30,0.04)]"
    >
      {/* Form Header */}
      <div className="border-b border-[#E3D7C5] pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A47C3A]">
          Brand Details
        </p>

        <h2 className="mt-1 text-xl font-semibold text-[#302A23]">
          Brand Information
        </h2>

        <p className="mt-1 text-sm text-[#6F665B]">
          Add the details and logo for this jewellery brand.
        </p>
      </div>

      {/* Brand Name */}
      <div>
        <label
          className="mb-2 block text-sm font-semibold text-[#40382F]"
          htmlFor="brand-name"
        >
          Brand Name
        </label>

        <input
          id="brand-name"
          type="text"
          value={name}
          onChange={(e) => {
            const value = e.target.value;

            setName(value);

            if (!initialData) {
              setSlug(
                value
                  .toLowerCase()
                  .trim()
                  .replace(/[^a-z0-9]+/g, "-")
                  .replace(/^-+|-+$/g, "")
              );
            }
          }}
          placeholder="Example: Tanishq"
          className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-sm text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
        />
      </div>

      {/* Slug */}
      <div>
        <label
          className="mb-2 block text-sm font-semibold text-[#40382F]"
          htmlFor="brand-slug"
        >
          Slug
        </label>

        <input
          id="brand-slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="tanishq"
          className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-sm text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
        />

        <p className="mt-2 text-xs text-[#817668]">
          Used in the brand URL and internal references.
        </p>
      </div>

      {/* Brand Logo */}
      <div>
        <label
          className="mb-2 block text-sm font-semibold text-[#40382F]"
          htmlFor="brand-logo"
        >
          Brand Logo
        </label>

        {/* Current Logo */}
        {initialData?.logoUrl && (
          <div className="mb-5 rounded-xl border border-[#E3D7C5] bg-[#F8F2E8] p-4">
            <p className="mb-3 text-sm font-medium text-[#554C42]">
              Current Logo
            </p>

            <div className="flex h-32 w-32 items-center justify-center rounded-xl border border-[#D8C9B5] bg-[#FAF6EE] p-3">
              <Image
                src={initialData.logoUrl}
                alt={initialData.name}
                width={128}
                height={128}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        )}

        {/* File Input */}
        <div className="rounded-xl border border-dashed border-[#CDBDA8] bg-[#F8F2E8] p-4 transition hover:border-[#B08D57]">
          <input
            id="brand-logo"
            type="file"
            accept="image/*"
            onChange={(e) =>
              setLogo(e.target.files?.[0] ?? null)
            }
            className="block w-full cursor-pointer text-sm text-[#6F665B] file:mr-4 file:rounded-lg file:border-0 file:bg-[#EDE3D3] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#554C42] hover:file:bg-[#E3D7C5]"
          />
        </div>

        {logo && (
          <p className="mt-2 text-xs font-medium text-[#A47C3A]">
            Selected: {logo.name}
          </p>
        )}

        {initialData && (
          <p className="mt-2 text-xs text-[#817668]">
            Leave empty to keep the existing logo.
          </p>
        )}
      </div>

      {/* Active Brand */}
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E3D7C5] bg-[#F8F2E8] p-4 transition hover:border-[#B08D57]/50">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) =>
            setActive(e.target.checked)
          }
          className="mt-0.5 h-5 w-5 rounded border-[#CDBDA8] bg-[#F8F2E8] text-[#B08D57] accent-[#B08D57] focus:ring-[#B08D57]"
        />

        <span>
          <span className="block text-sm font-semibold text-[#40382F]">
            Active Brand
          </span>

          <span className="mt-1 block text-xs text-[#817668]">
            Show this brand on the public website.
          </span>
        </span>
      </label>

      {/* Buttons */}
      <div className="flex flex-col-reverse gap-3 border-t border-[#E3D7C5] pt-5 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() =>
            router.push("/admin/brands")
          }
          disabled={loading}
          className="rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-5 py-3 text-sm font-semibold text-[#554C42] transition-all duration-200 hover:border-[#B08D57] hover:bg-[#FDF9F1] hover:text-[#302A23] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="rounded-xl border border-[#B08D57] bg-[#B08D57] px-6 py-3 text-sm font-semibold text-[#FFF9EF] shadow-sm transition-all duration-200 hover:border-[#8F6F3F] hover:bg-[#8F6F3F] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : initialData
              ? "Update Brand"
              : "Create Brand"}
        </button>
      </div>
    </form>
  );
}