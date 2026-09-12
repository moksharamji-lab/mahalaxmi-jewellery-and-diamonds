"use client";

import { useEffect, useState } from "react";

import type { Brand } from "@/types/brand";
import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

import pb from "@/lib/pocketbase";
import { sendAdminMutation } from "@/lib/admin-api";

type Props = {
  initialData?: Product;
};

type ProductFormState = {
  name: string;
  slug: string;
  collection: string;
  category: string;
  brand: string;
  purity: string;
  weight: string;
  makingCharges: string;
  description: string;
  featured: boolean;
  active: boolean;
};

export default function ProductForm({
  initialData,
}: Props) {
  const [form, setForm] =
    useState<ProductFormState>({
      name: initialData?.name ?? "",
      slug: initialData?.slug ?? "",
      collection:
        initialData?.collection ?? "Gold",
      category:
        initialData?.category ?? "",
      brand:
        initialData?.brand ?? "",
      purity:
        initialData?.purity ?? "",
      weight:
        initialData?.weight?.toString() ?? "",
      makingCharges:
        initialData?.makingCharges?.toString() ?? "",
      description:
        initialData?.description ?? "",
      featured:
        initialData?.featured ?? false,
      active:
        initialData?.active ?? true,
    });

  const [images, setImages] =
    useState<File[]>([]);

  const [video, setVideo] =
    useState<File | null>(null);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [brands, setBrands] =
    useState<Brand[]>([]);

  /* =====================================================
     LOAD CATEGORIES
  ===================================================== */

  useEffect(() => {
    async function loadCategories() {
      try {
        const records = await pb
          .collection("Categories")
          .getFullList({
            sort: "name",
            requestKey: null,
          });

        setCategories(
          records.map((item) => ({
            id: item.id,

            name: String(
              item.name ?? ""
            ),

            slug: String(
              item.slug ?? ""
            ),

            collection:
              String(
                item.collection ?? ""
              )
                .replace("☑", "")
                .trim()
                .toLowerCase() ===
              "diamond"
                ? "Diamond"
                : "Gold",

            image: String(
              item.image ?? ""
            ),

            description: String(
              item.description ?? ""
            ),

            active: Boolean(
              item.active
            ),

            created: String(
              item.created ?? ""
            ),

            updated: String(
              item.updated ?? ""
            ),
          }))
        );
      } catch (error) {
        console.error(
          "Failed to load categories:",
          error
        );
      }
    }

    loadCategories();
  }, []);

  /* =====================================================
     LOAD BRANDS
  ===================================================== */

  useEffect(() => {
    async function loadBrands() {
      try {
        const records = await pb
          .collection("Brands")
          .getFullList({
            sort: "name",
            requestKey: null,
          });

        setBrands(
          records.map((record) => ({
            id: record.id,

            name: String(
              record.name ?? ""
            ),

            slug: String(
              record.slug ?? ""
            ),

            logo: String(
              record.logo ?? ""
            ),

            active: Boolean(
              record.active
            ),

            created: String(
              record.created ?? ""
            ),

            updated: String(
              record.updated ?? ""
            ),
          }))
        );
      } catch (error) {
        console.error(
          "Failed to load brands:",
          error
        );
      }
    }

    loadBrands();
  }, []);

  /* =====================================================
     HANDLE PRODUCT SUBMIT
  ===================================================== */

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      const formData =
        new FormData();

      /* =================================================
         BASIC INFORMATION
      ================================================= */

      formData.append(
        "name",
        form.name
      );

      formData.append(
        "slug",
        form.slug
      );

      formData.append(
        "collection",
        form.collection
      );

      formData.append(
        "category",
        form.category
      );

      formData.append(
        "brand",
        form.brand
      );

      formData.append(
        "purity",
        form.purity
      );

      formData.append(
        "weight",
        form.weight
      );

      formData.append(
        "makingCharges",
        form.makingCharges
      );

      formData.append(
        "description",
        form.description
      );

      formData.append(
        "featured",
        String(form.featured)
      );

      formData.append(
        "active",
        String(form.active)
      );

      /* =================================================
         PRODUCT IMAGES
      ================================================= */

      images.forEach((image) => {
        formData.append(
          "images",
          image
        );
      });

      /* =================================================
         PRODUCT VIDEO
      ================================================= */

      if (video) {
        formData.append(
          "video",
          video
        );
      }

      /* =================================================
         UPDATE EXISTING PRODUCT
      ================================================= */

      if (initialData) {
        await sendAdminMutation(
          `products/${initialData.id}`,
          "PATCH",
          formData
        );

        alert(
          "✅ Product Updated Successfully!"
        );
      }

      /* =================================================
         CREATE NEW PRODUCT
      ================================================= */

      else {
        await sendAdminMutation(
          "products",
          "POST",
          formData
        );

        alert(
          "✅ Product Added Successfully!"
        );
      }

      /* =================================================
         RESET FORM
      ================================================= */

      setForm({
        name: "",
        slug: "",
        collection: "Gold",
        category: "",
        brand: "",
        purity: "",
        weight: "",
        makingCharges: "",
        description: "",
        featured: false,
        active: true,
      });

      setImages([]);
      setVideo(null);
    } catch (error: unknown) {
      if (
        error instanceof Error
      ) {
        alert(error.message);
      } else {
        alert(String(error));
      }
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-6 shadow-[0_4px_18px_rgba(80,60,30,0.04)] md:p-8"
    >
      {/* =====================================================
          BASIC PRODUCT INFORMATION
      ===================================================== */}

      <div>
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A47C3A]">
            Product Information
          </p>

          <h2 className="mt-1 text-xl font-semibold text-[#302A23]">
            Basic Details
          </h2>

          <p className="mt-1 text-sm text-[#6F665B]">
            Enter the main information for this jewellery
            product.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Product Name */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#40382F]">
              Product Name
            </label>

            <input
              type="text"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
              placeholder="Enter product name"
              required
            />
          </div>

          {/* Slug */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#40382F]">
              Slug
            </label>

            <input
              type="text"
              value={form.slug}
              onChange={(e) =>
                setForm({
                  ...form,
                  slug: e.target.value,
                })
              }
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
              placeholder="product-slug"
            />
          </div>

          {/* Collection */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#40382F]">
              Collection
            </label>

            <select
              value={form.collection}
              onChange={(e) =>
                setForm({
                  ...form,
                  collection:
                    e.target.value,
                  category: "",
                })
              }
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23] outline-none transition focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
            >
              <option value="Gold">
                Gold
              </option>

              <option value="Diamond">
                Diamond
              </option>
            </select>
          </div>

          {/* Category */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#40382F]">
              Category
            </label>

            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category:
                    e.target.value,
                })
              }
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23] outline-none transition focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
            >
              <option value="">
                Select Category
              </option>

              {categories
                .filter(
                  (category) =>
                    category.active &&
                    category.collection ===
                      form.collection
                )
                .map((category) => (
                  <option
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Brand */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#40382F]">
              Brand
            </label>

            <select
              value={form.brand}
              onChange={(e) =>
                setForm({
                  ...form,
                  brand:
                    e.target.value,
                })
              }
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23] outline-none transition focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
            >
              <option value="">
                Select Brand
              </option>

              {brands
                .filter(
                  (brand) =>
                    brand.active
                )
                .map((brand) => (
                  <option
                    key={brand.id}
                    value={brand.id}
                  >
                    {brand.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Purity */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#40382F]">
              Purity
            </label>

            <input
              type="text"
              value={form.purity}
              onChange={(e) =>
                setForm({
                  ...form,
                  purity:
                    e.target.value,
                })
              }
              placeholder="e.g. 22K"
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
            />
          </div>

          {/* Weight */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#40382F]">
              Weight (g)
            </label>

            <input
              type="number"
              step="0.01"
              value={form.weight}
              onChange={(e) =>
                setForm({
                  ...form,
                  weight:
                    e.target.value,
                })
              }
              placeholder="0.00"
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
            />
          </div>

          {/* Making Charges */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#40382F]">
              Making Charges
            </label>

            <input
              type="number"
              step="0.01"
              value={form.makingCharges}
              onChange={(e) =>
                setForm({
                  ...form,
                  makingCharges:
                    e.target.value,
                })
              }
              placeholder="0.00"
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
            />
          </div>
        </div>
      </div>

      {/* =====================================================
          DESCRIPTION
      ===================================================== */}

      <div className="border-t border-[#E3D7C5] pt-8">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A47C3A]">
            Product Details
          </p>

          <h2 className="mt-1 text-xl font-semibold text-[#302A23]">
            Description
          </h2>
        </div>

        <textarea
          rows={6}
          value={form.description}
          onChange={(e) =>
            setForm({
              ...form,
              description:
                e.target.value,
            })
          }
          className="w-full resize-none rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
          placeholder="Enter product description"
        />
      </div>

      {/* =====================================================
          PRODUCT IMAGES
      ===================================================== */}

      <div className="border-t border-[#E3D7C5] pt-8">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A47C3A]">
            Media
          </p>

          <h2 className="mt-1 text-xl font-semibold text-[#302A23]">
            Product Images
          </h2>

          <p className="mt-1 text-sm text-[#6F665B]">
            Upload multiple images for this product.
          </p>
        </div>

        {/* Existing Images */}

        {initialData &&
          initialData.images.length > 0 && (
            <div className="mb-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#817668]">
                Existing Images
              </p>

              <div className="flex flex-wrap gap-4">
                {initialData.images.map(
                  (image, index) => {
                    const imageUrl =
                      initialData.imageUrls?.[
                        index
                      ] ||
                      initialData.imageUrl ||
                      "";

                    return (
                      <div
                        key={`${image}-${index}`}
                        className="overflow-hidden rounded-xl border border-[#D8C9B5] bg-[#F8F2E8]"
                      >
                        {imageUrl ? (
                          <img
                            src={imageUrl}
                            alt={`Product ${
                              index + 1
                            }`}
                            className="h-24 w-24 object-cover"
                          />
                        ) : (
                          <div className="flex h-24 w-24 items-center justify-center text-xs font-medium text-[#817668]">
                            No Image
                          </div>
                        )}
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          )}

        {/* Upload */}

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => {
            if (e.target.files) {
              setImages(
                Array.from(
                  e.target.files
                )
              );
            }
          }}
          className="block w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-sm text-[#554C42] file:mr-4 file:rounded-lg file:border-0 file:bg-[#B08D57] file:px-4 file:py-2 file:font-semibold file:text-[#FFF9EF] hover:file:bg-[#8F6F3F]"
        />

        <p className="mt-2 text-sm font-medium text-[#6F665B]">
          {images.length} image(s) selected
        </p>

        {/* New Image Preview */}

        {images.length > 0 && (
          <div className="mt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#817668]">
              New Images
            </p>

            <div className="flex flex-wrap gap-4">
              {images.map(
                (image, index) => (
                  <div
                    key={`${image.name}-${index}`}
                    className="overflow-hidden rounded-xl border border-[#D8C9B5] bg-[#F8F2E8]"
                  >
                    <img
                      src={URL.createObjectURL(
                        image
                      )}
                      alt={`Preview ${
                        index + 1
                      }`}
                      className="h-24 w-24 object-cover"
                    />
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          PRODUCT VIDEO
      ===================================================== */}

      <div className="border-t border-[#E3D7C5] pt-8">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A47C3A]">
            Media
          </p>

          <h2 className="mt-1 text-xl font-semibold text-[#302A23]">
            Product Video
          </h2>

          <p className="mt-1 text-sm text-[#6F665B]">
            Upload one product video. Maximum file size:
            100 MB.
          </p>
        </div>

        {/* Existing Video */}

        {initialData?.video &&
          !video && (
            <div className="mb-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#817668]">
                Existing Video
              </p>

              <div className="max-w-md overflow-hidden rounded-2xl border border-[#D8C9B5] bg-[#EDE3D3]">
                <video
                  src={initialData.video}
                  controls
                  playsInline
                  className="aspect-video w-full object-contain"
                />
              </div>
            </div>
          )}

        {/* Video Upload */}

        <input
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={(e) => {
            const selectedFile =
              e.target.files?.[0] ??
              null;

            setVideo(selectedFile);
          }}
          className="block w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-sm text-[#554C42] file:mr-4 file:rounded-lg file:border-0 file:bg-[#B08D57] file:px-4 file:py-2 file:font-semibold file:text-[#FFF9EF] hover:file:bg-[#8F6F3F]"
        />

        {/* Selected Video Information */}

        {video && (
          <div className="mt-4 rounded-xl border border-[#D8C9B5] bg-[#F8F2E8] p-4">
            <p className="text-sm font-semibold text-[#302A23]">
              Selected Video
            </p>

            <p className="mt-1 break-all text-sm text-[#554C42]">
              {video.name}
            </p>

            <p className="mt-1 text-xs text-[#817668]">
              {(
                video.size /
                (1024 * 1024)
              ).toFixed(2)}{" "}
              MB
            </p>
          </div>
        )}

        {/* New Video Preview */}

        {video && (
          <div className="mt-5">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#817668]">
              Video Preview
            </p>

            <div className="max-w-md overflow-hidden rounded-2xl border border-[#D8C9B5] bg-[#EDE3D3]">
              <video
                src={URL.createObjectURL(
                  video
                )}
                controls
                playsInline
                className="aspect-video w-full object-contain"
              />
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          STATUS
      ===================================================== */}

      <div className="border-t border-[#E3D7C5] pt-8">
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Featured */}

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#D8C9B5] bg-[#F8F2E8] p-4 text-[#302A23] transition hover:border-[#B08D57]">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) =>
                setForm({
                  ...form,
                  featured:
                    e.target.checked,
                })
              }
              className="h-4 w-4 accent-[#B08D57]"
            />

            <div>
              <p className="font-semibold">
                Featured
              </p>

              <p className="mt-1 text-xs text-[#817668]">
                Show this product as featured.
              </p>
            </div>
          </label>

          {/* Active */}

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#D8C9B5] bg-[#F8F2E8] p-4 text-[#302A23] transition hover:border-[#B08D57]">
            <input
              type="checkbox"
              checked={form.active}
              onChange={(e) =>
                setForm({
                  ...form,
                  active:
                    e.target.checked,
                })
              }
              className="h-4 w-4 accent-[#B08D57]"
            />

            <div>
              <p className="font-semibold">
                Active
              </p>

              <p className="mt-1 text-xs text-[#817668]">
                Make this product visible.
              </p>
            </div>
          </label>
        </div>
      </div>

      {/* =====================================================
          SUBMIT
      ===================================================== */}

      <div className="border-t border-[#E3D7C5] pt-8">
        <button
          type="submit"
          className="w-full rounded-xl border border-[#B08D57] bg-[#B08D57] px-8 py-3.5 font-semibold text-[#FFF9EF] shadow-sm transition-all duration-200 hover:border-[#8F6F3F] hover:bg-[#8F6F3F] hover:shadow-md sm:w-auto"
        >
          {initialData
            ? "Update Product"
            : "Save Product"}
        </button>
      </div>
    </form>
  );
}