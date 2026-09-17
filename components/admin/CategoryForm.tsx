"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { Category } from "@/types/category";

type Props = {
  category?: Category;
};

export default function CategoryForm({
  category,
}: Props) {
  const router = useRouter();

  const isEditing =
    category !== undefined;

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

  const [image, setImage] = useState(
    category?.image ?? ""
  );

  const [active, setActive] =
    useState(
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
     SLUG GENERATOR
  ========================================================= */

  function generateSlug(
    value: string
  ) {
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

    /*
     * Automatically generate the slug
     * only while creating a new category.
     */
    if (!isEditing) {
      setSlug(
        generateSlug(value)
      );
    }
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

    /* -------------------------------------------------------
       VALIDATION
    ------------------------------------------------------- */

    const cleanName =
      name.trim();

    const cleanSlug =
      slug.trim();

    const cleanImage =
      image.trim();

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
      /* -----------------------------------------------------
         API URL
      ----------------------------------------------------- */

      const url = category
        ? `/api/admin/categories/${category.id}`
        : "/api/admin/categories";

      /*
       * IMPORTANT:
       *
       * CREATE  → POST
       * UPDATE  → PATCH
       *
       * The API route at:
       * /api/admin/[resource]/[id]
       * exports PATCH, not PUT.
       */
      const method = category
        ? "PATCH"
        : "POST";

      /* -----------------------------------------------------
         FORM DATA
      ----------------------------------------------------- */

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
       * Keep the existing image field
       * in the request.
       *
       * The current category architecture
       * uses driveImage separately when a
       * Drive file is uploaded.
       */
      formData.append(
        "image",
        cleanImage
      );

      formData.append(
        "active",
        String(active)
      );

      /* -----------------------------------------------------
         REQUEST
      ----------------------------------------------------- */

      const response =
        await fetch(url, {
          method,
          body: formData,
        });

      /* -----------------------------------------------------
         RESPONSE
      ----------------------------------------------------- */

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

      /* -----------------------------------------------------
         HANDLE ERROR
      ----------------------------------------------------- */

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

      /* -----------------------------------------------------
         SUCCESS
      ----------------------------------------------------- */

      setSuccess(
        category
          ? "Category updated successfully."
          : "Category created successfully."
      );

      /*
       * Give the user a moment to see
       * the success message before redirecting.
       */
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

        {/* ---------------------------------------------------
            HEADER
        --------------------------------------------------- */}

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

        {/* ---------------------------------------------------
            FIELDS
        --------------------------------------------------- */}

        <div className="space-y-5">

          {/* =================================================
              CATEGORY NAME
          ================================================= */}

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

          {/* =================================================
              SLUG
          ================================================= */}

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

          {/* =================================================
              COLLECTION
          ================================================= */}

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
              IMAGE URL
          ================================================= */}

          <div>

            <label
              htmlFor="image"
              className="mb-2 block text-sm font-semibold text-[#40382F]"
            >
              Image URL
            </label>

            <input
              id="image"
              name="image"
              type="url"
              value={image}
              onChange={(event) =>
                setImage(
                  event.target.value
                )
              }
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-sm text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
              disabled={isSaving}
            />

            <p className="mt-2 text-xs text-[#817668]">
              Optional category image URL.
            </p>

          </div>

          {/* =================================================
              ACTIVE
          ================================================= */}

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

      {/* =====================================================
          ERROR MESSAGE
      ===================================================== */}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-[#D5A3A0] bg-[#F7E9E7] px-4 py-3 text-sm font-medium text-[#9A4F49]"
        >
          {error}
        </div>
      )}

      {/* =====================================================
          SUCCESS MESSAGE
      ===================================================== */}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-[#8EAF8F] bg-[#E8F1E6] px-4 py-3 text-sm font-medium text-[#47704A]"
        >
          {success}
        </div>
      )}

      {/* =====================================================
          BUTTONS
      ===================================================== */}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">

        {/* CANCEL */}

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

        {/* SAVE */}

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