"use client";

import { useState } from "react";

import type { Category } from "@/types/category";
import type { Product } from "@/types/product";

import { sendAdminMutation } from "@/lib/admin-api";

type Props = {
  initialData?: Product;
  categories: Category[];
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

  hyd: string;
  hallmark: string;

  igi: string;
  sgl: string;

  featured: boolean;
  active: boolean;
};

export default function ProductForm({
  initialData,
  categories,
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

      hyd: initialData?.hyd ?? "",
      hallmark: initialData?.hallmark ?? "",

      igi: initialData?.igi ?? "",
      sgl: initialData?.sgl ?? "",

      featured:
        initialData?.featured ?? false,

      active:
        initialData?.active ?? true,
    });

  const [images, setImages] =
    useState<File[]>([]);

  const [video, setVideo] =
    useState<File | null>(null);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("slug", form.slug);
      formData.append("collection", form.collection);
      formData.append("category", form.category);
      formData.append("brand", form.brand);
      formData.append("purity", form.purity);
      formData.append("weight", form.weight);
      formData.append(
        "makingCharges",
        form.makingCharges
      );
      formData.append(
        "description",
        form.description
      );

      formData.append("hyd", form.hyd);
      formData.append(
        "hallmark",
        form.hallmark
      );

      formData.append("igi", form.igi);
      formData.append("sgl", form.sgl);

      formData.append(
        "featured",
        String(form.featured)
      );

      formData.append(
        "active",
        String(form.active)
      );

      images.forEach((image) => {
        formData.append("images", image);
      });

      if (video) {
        formData.append("video", video);
      }

      if (initialData) {
        await sendAdminMutation(
          `products/${initialData.id}`,
          "PATCH",
          formData
        );

        alert(
          "✅ Product Updated Successfully!"
        );
      } else {
        await sendAdminMutation(
          "products",
          "POST",
          formData
        );

        alert(
          "✅ Product Added Successfully!"
        );
      }

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
        hyd: "",
        hallmark: "",
        igi: "",
        sgl: "",
        featured: false,
        active: true,
      });

      setImages([]);
      setVideo(null);
    } catch (error: unknown) {
      if (error instanceof Error) {
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
      {/* BASIC INFORMATION */}

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
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23]"
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
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23]"
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
                  collection: e.target.value,
                  category: "",
                })
              }
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23]"
            >
              <option value="Gold">
                Gold
              </option>

              <option value="Diamond">
                Diamond
              </option>
            </select>
          </div>

          {/* CATEGORY */}

          <div>
            <label className="mb-2 block text-sm font-semibold text-[#40382F]">
              Category
            </label>

            <select
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23]"
            >
              <option value="">
                Select Category
              </option>

              {categories
                .filter(
                  (category) =>
                    category.active
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
                  purity: e.target.value,
                })
              }
              placeholder="e.g. 22K"
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23]"
            />
          </div>

          {/* Gold */}

          {form.collection === "Gold" && (
            <>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#40382F]">
                  HYD
                </label>

                <input
                  type="text"
                  value={form.hyd}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      hyd: e.target.value,
                    })
                  }
                  placeholder="Enter HYD"
                  className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#40382F]">
                  Hallmark
                </label>

                <input
                  type="text"
                  value={form.hallmark}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      hallmark: e.target.value,
                    })
                  }
                  placeholder="Enter Hallmark"
                  className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23]"
                />
              </div>
            </>
          )}

          {/* Diamond */}

          {form.collection === "Diamond" && (
            <>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#40382F]">
                  IGI
                </label>

                <input
                  type="text"
                  value={form.igi}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      igi: e.target.value,
                    })
                  }
                  placeholder="Enter IGI"
                  className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#40382F]">
                  SGL
                </label>

                <input
                  type="text"
                  value={form.sgl}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sgl: e.target.value,
                    })
                  }
                  placeholder="Enter SGL"
                  className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23]"
                />
              </div>
            </>
          )}

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
                  weight: e.target.value,
                })
              }
              placeholder="0.00"
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23]"
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
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23]"
            />
          </div>

        </div>
      </div>

      {/* DESCRIPTION */}

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
          className="w-full resize-none rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23]"
          placeholder="Enter product description"
        />

      </div>

      {/* PRODUCT IMAGES */}

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

        {initialData &&
          initialData.imageUrls?.length > 0 && (
            <div className="mb-6">

              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-[#817668]">
                Existing Images
              </p>

              <div className="flex flex-wrap gap-4">

                {initialData.imageUrls.map(
                  (imageUrl, index) => (
                    <div
                      key={`${imageUrl}-${index}`}
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
                  )
                )}

              </div>

            </div>
          )}

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
          className="block w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-sm text-[#554C42]"
        />

        <p className="mt-2 text-sm font-medium text-[#6F665B]">
          {images.length} image(s) selected
        </p>

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

      {/* PRODUCT VIDEO */}

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

        <input
          type="file"
          accept="video/mp4,video/webm,video/quicktime"
          onChange={(e) => {
            const selectedFile =
              e.target.files?.[0] ??
              null;

            setVideo(selectedFile);
          }}
          className="block w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-sm text-[#554C42]"
        />

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

      {/* STATUS */}

      <div className="border-t border-[#E3D7C5] pt-8">

        <div className="grid gap-4 sm:grid-cols-2">

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#D8C9B5] bg-[#F8F2E8] p-4 text-[#302A23]">

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

          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-[#D8C9B5] bg-[#F8F2E8] p-4 text-[#302A23]">

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

      {/* SUBMIT */}

      <div className="border-t border-[#E3D7C5] pt-8">

        <button
          type="submit"
          className="w-full rounded-xl border border-[#B08D57] bg-[#B08D57] px-8 py-3.5 font-semibold text-[#FFF9EF] text-[#FFF9EF] sm:w-auto"
        >
          {initialData
            ? "Update Product"
            : "Save Product"}
        </button>

      </div>

    </form>
  );
}