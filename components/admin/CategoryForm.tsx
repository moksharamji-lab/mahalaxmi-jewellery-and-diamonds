"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import type { Category } from "@/types/category";

type Props = {
  category?: Category;
};

export default function CategoryForm({
  category,
}: Props) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = category !== undefined;

  /* =========================================================
     FORM STATE
  ========================================================= */

  const [name, setName] = useState(
    category?.name ?? ""
  );

  const [slug, setSlug] = useState(
    category?.slug ?? ""
  );

  const [collection, setCollection] =
    useState<"Gold" | "Diamond">(
      category?.collection ?? "Gold"
    );

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [previewUrl, setPreviewUrl] =
    useState<string>(
      category?.image ?? ""
    );

  const [active, setActive] = useState(
    category?.active ?? true
  );

  /* =========================================================
     UI STATE
  ========================================================= */

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* =========================================================
     CLEANUP PREVIEW URL
  ========================================================= */

  useEffect(() => {
    return () => {
      if (
        previewUrl &&
        previewUrl.startsWith("blob:")
      ) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  /* =========================================================
     SLUG GENERATOR
  ========================================================= */

  function generateSlug(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(
        /[^a-z0-9]+/g,
        "-"
      )
      .replace(
        /^-+|-+$/g,
        ""
      );
  }

  /* =========================================================
     NAME CHANGE
  ========================================================= */

  function handleNameChange(
    value: string
  ) {
    setName(value);

    if (!isEditing) {
      setSlug(
        generateSlug(value)
      );
    }
  }

  /* =========================================================
     IMAGE SELECT
  ========================================================= */

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] ?? null;

    setError("");

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        "Please select a JPG, PNG, or WEBP image."
      );

      event.target.value = "";
      return;
    }

    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      setError(
        "Image size must be 10 MB or less."
      );

      event.target.value = "";
      return;
    }

    setSelectedImage(file);

    const newPreviewUrl =
      URL.createObjectURL(file);

    setPreviewUrl(
      newPreviewUrl
    );
  }

  /* =========================================================
     REMOVE SELECTED IMAGE
  ========================================================= */

  function handleRemoveSelectedImage() {
    setSelectedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setPreviewUrl(
      category?.image ?? ""
    );
  }

  /* =========================================================
     SUBMIT
  ========================================================= */

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    const cleanName =
      name.trim();

    const cleanSlug =
      slug.trim();

    const cleanCollection =
      collection.trim();

    if (!cleanName) {
      setError(
        "Category name is required."
      );
      return;
    }

    if (!cleanSlug) {
      setError(
        "Slug is required."
      );
      return;
    }

    if (!cleanCollection) {
      setError(
        "Collection is required."
      );
      return;
    }

    setIsSaving(true);

    try {
      const url = category
        ? `/api/admin/categories/${category.id}`
        : "/api/admin/categories";

      const method = category
        ? "PATCH"
        : "POST";

      const formData =
        new FormData();

      formData.append(
        "name",
        cleanName
      );

      formData.append(
        "slug",
        cleanSlug
      );

      formData.append(
        "collection",
        cleanCollection
      );

      /*
       * IMPORTANT:
       *
       * If a new image is selected,
       * send the actual File.
       *
       * The existing admin API already
       * accepts "image" uploads and sends
       * category images to the Categories
       * Google Drive folder.
       */
      if (selectedImage) {
        formData.append(
          "image",
          selectedImage
        );
      }

      formData.append(
        "active",
        String(active)
      );

      const response =
        await fetch(url, {
          method,
          body: formData,
        });

      const contentType =
        response.headers.get(
          "content-type"
        ) || "";

      let data:
        | {
            message?: string;
            error?: string;
            [key: string]: unknown;
          }
        | null = null;

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        data =
          await response
            .json()
            .catch(
              () => null
            );
      } else {
        const text =
          await response
            .text()
            .catch(
              () => ""
            );

        if (text) {
          data = {
            message: text,
          };
        }
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Failed to ${
              category
                ? "update"
                : "create"
            } category.`
        );
      }

      setSuccess(
        category
          ? "Category updated successfully."
          : "Category created successfully."
      );

      window.setTimeout(() => {
        router.push(
          "/admin/categories"
        );

        router.refresh();
      }, 700);
    } catch (error) {
      console.error(
        "CATEGORY SAVE ERROR:",
        error
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the category."
      );

      setIsSaving(false);
    }
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl space-y-6"
    >
      {/* =====================================================
          CATEGORY INFORMATION
      ===================================================== */}

      <div className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-6 shadow-[0_4px_18px_rgba(80,60,30,0.04)]">

        {/* HEADER */}

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

          {/* CATEGORY NAME */}

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-[#40382F]"
            >
              Category Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={name}
              onChange={(event) =>
                handleNameChange(
                  event.target.value
                )
              }
              placeholder="e.g. Rings"
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-sm text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
              required
              disabled={isSaving}
            />
          </div>

          {/* SLUG */}

          <div>
            <label
              htmlFor="slug"
              className="mb-2 block text-sm font-semibold text-[#40382F]"
            >
              Slug
            </label>

            <input
              id="slug"
              name="slug"
              type="text"
              value={slug}
              onChange={(event) =>
                setSlug(
                  event.target.value
                )
              }
              placeholder="rings"
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-sm text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
              required
              disabled={isSaving}
            />

            <p className="mt-2 text-xs text-[#817668]">
              Used in the category URL.
            </p>
          </div>

          {/* COLLECTION */}

          <div>
            <label
              htmlFor="collection"
              className="mb-2 block text-sm font-semibold text-[#40382F]"
            >
              Collection
            </label>

            <select
              id="collection"
              name="collection"
              value={collection}
              onChange={(event) =>
                setCollection(
                  event.target.value as
                    | "Gold"
                    | "Diamond"
                )
              }
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-sm text-[#302A23] outline-none transition focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
              disabled={isSaving}
            >
              <option value="Gold">
                Gold
              </option>

              <option value="Diamond">
                Diamond
              </option>
            </select>
          </div>

          {/* =================================================
              CATEGORY IMAGE UPLOAD
          ================================================= */}

          <div className="rounded-2xl border border-[#D8C9B5] bg-[#F8F2E8] p-5">

            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#40382F]">
                Category Image
              </label>

              <p className="mt-1 text-xs text-[#817668]">
                Upload a JPG, PNG, or WEBP image. Maximum 10 MB.
              </p>
            </div>

            {/* PREVIEW */}

            {previewUrl && (
              <div className="mb-5 overflow-hidden rounded-xl border border-[#D0C1AC] bg-white">
                <div className="relative aspect-[16/9] w-full bg-[#F1EBE1]">
                  {/* Blob URLs are used while a local upload is pending. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={previewUrl}
                    alt="Category preview"
                    className="h-full w-full object-cover"
                  />
                </div>

                {selectedImage && (
                  <div className="flex items-center justify-between border-t border-[#E3D7C5] px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#302A23]">
                        {selectedImage.name}
                      </p>

                      <p className="mt-1 text-xs text-[#817668]">
                        {(
                          selectedImage.size /
                          (1024 * 1024)
                        ).toFixed(2)}{" "}
                        MB
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        handleRemoveSelectedImage
                      }
                      disabled={isSaving}
                      className="ml-4 rounded-lg border border-[#D5A3A0] bg-[#F7E9E7] px-3 py-2 text-xs font-semibold text-[#9A4F49] transition hover:bg-[#F2DDDA] disabled:opacity-50"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* FILE INPUT */}

            <input
              ref={fileInputRef}
              id="category-image"
              name="category-image"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={
                handleImageChange
              }
              disabled={isSaving}
              className="block w-full cursor-pointer rounded-xl border border-[#D0C1AC] bg-[#FAF6EE] text-sm text-[#40382F] file:mr-4 file:cursor-pointer file:border-0 file:border-r file:border-[#D0C1AC] file:bg-[#EDE3D3] file:px-5 file:py-3 file:font-semibold file:text-[#5A4B3A] hover:file:bg-[#E4D7C5]"
            />

            <p className="mt-2 text-xs text-[#817668]">
              Select an image from your computer.
            </p>
          </div>

          {/* ACTIVE */}

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E3D7C5] bg-[#F8F2E8] p-4 transition hover:border-[#B08D57]/50">

            <input
              type="checkbox"
              checked={active}
              onChange={(event) =>
                setActive(
                  event.target.checked
                )
              }
              className="mt-0.5 h-4 w-4 rounded border-[#CDBDA8] bg-[#F8F2E8] text-[#B08D57] accent-[#B08D57] focus:ring-[#B08D57]"
              disabled={isSaving}
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

      {/* ERROR */}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-[#D5A3A0] bg-[#F7E9E7] px-4 py-3 text-sm font-medium text-[#9A4F49]"
        >
          {error}
        </div>
      )}

      {/* SUCCESS */}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-[#8EAF8F] bg-[#E8F1E6] px-4 py-3 text-sm font-medium text-[#47704A]"
        >
          {success}
        </div>
      )}

      {/* BUTTONS */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

        <button
          type="button"
          onClick={() =>
            router.push(
              "/admin/categories"
            )
          }
          disabled={isSaving}
          className="rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-5 py-3 text-sm font-semibold text-[#554C42] transition-all duration-200 hover:border-[#B08D57] hover:bg-[#FDF9F1] hover:text-[#302A23] disabled:cursor-not-allowed disabled:opacity-50"
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
