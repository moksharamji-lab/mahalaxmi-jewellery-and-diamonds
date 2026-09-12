"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { Category } from "@/types/category";

type Props = {
  category?: Category;
};

export default function CategoryForm({ category }: Props) {
  const router = useRouter();

  const isEditing = category !== undefined;

  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [collection, setCollection] = useState<"Gold" | "Diamond">(
    category?.collection ?? "Gold"
  );
  const [image, setImage] = useState(category?.image ?? "");
  const [active, setActive] = useState(category?.active ?? true);

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleNameChange(value: string) {
    setName(value);

    // Automatically generate slug only for new categories.
    if (!isEditing) {
      const generatedSlug = value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

      setSlug(generatedSlug);
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }

    if (!slug.trim()) {
      setError("Slug is required.");
      return;
    }

    setIsSaving(true);

    try {
      let url = "/api/admin/categories";
      let method = "POST";

      if (category) {
        url = `/api/admin/categories/${category.id}`;
        method = "PUT";
      }

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          slug: slug.trim(),
          collection,
          image: image.trim(),
          active,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to save category."
        );
      }

      setSuccess(
        category
          ? "Category updated successfully."
          : "Category created successfully."
      );

      setTimeout(() => {
        router.push("/admin/categories");
        router.refresh();
      }, 700);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl space-y-6"
    >
      {/* Category Information */}
      <div className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-6 shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
        {/* Section Header */}
        <div className="mb-6 border-b border-[#E3D7C5] pb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A47C3A]">
            Category Details
          </p>

          <h2 className="mt-1 text-xl font-semibold text-[#302A23]">
            Category Information
          </h2>

          <p className="mt-1 text-sm text-[#6F665B]">
            Add the details for this jewellery category.
          </p>
        </div>

        <div className="space-y-5">
          {/* Category Name */}
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-[#40382F]"
            >
              Category Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) =>
                handleNameChange(event.target.value)
              }
              placeholder="e.g. Rings"
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-sm text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
              required
            />
          </div>

          {/* Slug */}
          <div>
            <label
              htmlFor="slug"
              className="mb-2 block text-sm font-semibold text-[#40382F]"
            >
              Slug
            </label>

            <input
              id="slug"
              type="text"
              value={slug}
              onChange={(event) =>
                setSlug(event.target.value)
              }
              placeholder="rings"
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-sm text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
              required
            />

            <p className="mt-2 text-xs text-[#817668]">
              Used in the category URL.
            </p>
          </div>

          {/* Collection */}
          <div>
            <label
              htmlFor="collection"
              className="mb-2 block text-sm font-semibold text-[#40382F]"
            >
              Collection
            </label>

            <select
              id="collection"
              value={collection}
              onChange={(event) =>
                setCollection(
                  event.target.value as "Gold" | "Diamond"
                )
              }
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-sm text-[#302A23] outline-none transition focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
            >
              <option value="Gold">Gold</option>
              <option value="Diamond">Diamond</option>
            </select>
          </div>

          {/* Image */}
          <div>
            <label
              htmlFor="image"
              className="mb-2 block text-sm font-semibold text-[#40382F]"
            >
              Image URL
            </label>

            <input
              id="image"
              type="url"
              value={image}
              onChange={(event) =>
                setImage(event.target.value)
              }
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-sm text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
            />

            <p className="mt-2 text-xs text-[#817668]">
              Optional category image URL.
            </p>
          </div>

          {/* Active */}
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E3D7C5] bg-[#F8F2E8] p-4 transition hover:border-[#B08D57]/50">
            <input
              type="checkbox"
              checked={active}
              onChange={(event) =>
                setActive(event.target.checked)
              }
              className="mt-0.5 h-4 w-4 rounded border-[#CDBDA8] bg-[#F8F2E8] text-[#B08D57] accent-[#B08D57] focus:ring-[#B08D57]"
            />

            <span>
              <span className="block text-sm font-semibold text-[#40382F]">
                Active
              </span>

              <span className="mt-1 block text-xs text-[#817668]">
                Show this category on the public website.
              </span>
            </span>
          </label>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-[#D5A3A0] bg-[#F7E9E7] px-4 py-3 text-sm font-medium text-[#9A4F49]">
          {error}
        </div>
      )}

      {/* Success */}
      {success && (
        <div className="rounded-xl border border-[#8EAF8F] bg-[#E8F1E6] px-4 py-3 text-sm font-medium text-[#47704A]">
          {success}
        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() =>
            router.push("/admin/categories")
          }
          className="rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-5 py-3 text-sm font-semibold text-[#554C42] transition-all duration-200 hover:border-[#B08D57] hover:bg-[#FDF9F1] hover:text-[#302A23]"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl border border-[#B08D57] bg-[#B08D57] px-6 py-3 text-sm font-semibold text-[#FFF9EF] shadow-sm transition-all duration-200 hover:border-[#8F6F3F] hover:bg-[#8F6F3F] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving
            ? "Saving..."
            : isEditing
              ? "Update Category"
              : "Create Category"}
        </button>
      </div>
    </form>
  );
}