"use client";

import Image from "next/image";
import {
  ChangeEvent,
  FormEvent,
  useState,
} from "react";

import {
  Trash2,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

import type { GalleryImage } from "@/types/gallery";

type GalleryAdminProps = {
  initialImages: GalleryImage[];
};

export default function GalleryAdmin({
  initialImages,
}: GalleryAdminProps) {
  const [images, setImages] =
    useState<GalleryImage[]>(
      initialImages
    );

  const [selectedFiles, setSelectedFiles] =
    useState<File[]>([]);

  const [order, setOrder] =
    useState("0");

  const [active, setActive] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(
      event.target.files ?? []
    );

    setSelectedFiles(files);
    setMessage("");
    setError("");
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setMessage("");
    setError("");

    if (selectedFiles.length === 0) {
      setError(
        "Please select at least one image."
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      for (const file of selectedFiles) {
        formData.append(
          "images",
          file
        );
      }

      formData.append(
        "order",
        order
      );

      formData.append(
        "active",
        String(active)
      );

      const response = await fetch(
        "/api/admin/gallery",
        {
          method: "POST",
          body: formData,
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to upload gallery image."
        );
      }

      setMessage(
        "Gallery image uploaded successfully."
      );

      setSelectedFiles([]);
      setOrder("0");
      setActive(true);

      const input =
        document.getElementById(
          "gallery-images"
        ) as HTMLInputElement | null;

      if (input) {
        input.value = "";
      }

      window.location.reload();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(
    image: GalleryImage
  ) {
    setMessage("");
    setError("");

    const confirmed =
      window.confirm(
        "Delete this gallery image?\n\nThis will remove the image from the public gallery and Google Drive."
      );

    if (!confirmed) {
      return;
    }

    setDeletingId(image.id);

    try {
      const response =
        await fetch(
          `/api/admin/gallery/${encodeURIComponent(
            image.id
          )}`,
          {
            method: "DELETE",
          }
        );

      let result: {
        message?: string;
      } | null = null;

      const contentType =
        response.headers.get(
          "content-type"
        );

      if (
        contentType?.includes(
          "application/json"
        )
      ) {
        result =
          await response.json();
      }

      if (!response.ok) {
        throw new Error(
          result?.message ||
            "Failed to delete gallery image."
        );
      }

      setImages((current) =>
        current.filter(
          (item) =>
            item.id !== image.id
        )
      );

      setMessage(
        "Gallery image deleted successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while deleting the image."
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f6f1] px-4 py-8 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-[#a17a35]">
                Admin Panel
              </p>

              <h1 className="text-3xl font-semibold tracking-tight text-[#1f1b16] sm:text-4xl">
                Gallery
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#6f685f]">
                Upload and manage the images displayed
                on the public gallery page.
              </p>
            </div>

            <div className="rounded-full border border-[#d8c7a7] bg-white px-4 py-2 text-sm text-[#5e554a]">
              {images.length}{" "}
              {images.length === 1
                ? "image"
                : "images"}
            </div>

          </div>
        </div>

        {/* UPLOAD CARD */}

        <section className="mb-10 rounded-2xl border border-[#e4ddd2] bg-white p-5 shadow-sm sm:p-7">

          <div className="mb-6">

            <h2 className="text-xl font-semibold text-[#27221c]">
              Add Gallery Images
            </h2>

            <p className="mt-1 text-sm text-[#777066]">
              Images will be uploaded to the
              Google Drive Gallery folder.
            </p>

          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* FILE INPUT */}

            <div>

              <label
                htmlFor="gallery-images"
                className="mb-2 block text-sm font-medium text-[#302a23]"
              >
                Gallery Images
              </label>

              <input
                id="gallery-images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="block w-full cursor-pointer rounded-xl border border-[#d9d1c5] bg-[#faf9f7] px-4 py-3 text-sm text-[#4e473f] file:mr-4 file:rounded-lg file:border-0 file:bg-[#2a241e] file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:bg-[#40372e]"
              />

              {selectedFiles.length > 0 && (
                <p className="mt-2 text-sm text-[#756d63]">
                  {selectedFiles.length}{" "}
                  {selectedFiles.length === 1
                    ? "image"
                    : "images"}{" "}
                  selected
                </p>
              )}

            </div>

            {/* ORDER + ACTIVE */}

            <div className="grid gap-5 sm:grid-cols-2">

              <div>

                <label
                  htmlFor="gallery-order"
                  className="mb-2 block text-sm font-medium text-[#302a23]"
                >
                  Display Order
                </label>

                <input
                  id="gallery-order"
                  type="number"
                  min="0"
                  value={order}
                  onChange={(event) =>
                    setOrder(
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-[#d9d1c5] bg-white px-4 py-3 text-sm text-[#302a23] outline-none transition focus:border-[#a17a35] focus:ring-2 focus:ring-[#a17a35]/10"
                />

              </div>

              <div className="flex items-end">

                <label className="flex w-full cursor-pointer items-center gap-3 rounded-xl border border-[#d9d1c5] bg-[#faf9f7] px-4 py-3">

                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(event) =>
                      setActive(
                        event.target.checked
                      )
                    }
                    className="h-4 w-4 accent-[#a17a35]"
                  />

                  <span>

                    <span className="block text-sm font-medium text-[#302a23]">
                      Active
                    </span>

                    <span className="block text-xs text-[#777066]">
                      Show this image on the
                      public gallery.
                    </span>

                  </span>

                </label>

              </div>

            </div>

            {/* MESSAGES */}

            {message && (
              <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                {message}
              </div>
            )}

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* UPLOAD BUTTON */}

            <button
              type="submit"
              disabled={
                loading ||
                selectedFiles.length === 0
              }
              className="inline-flex min-w-40 items-center justify-center rounded-xl bg-[#2a241e] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#40372e] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Uploading..."
                : "Upload Images"}
            </button>

          </form>

        </section>

        {/* CURRENT GALLERY */}

        <section>

          <div className="mb-5">

            <h2 className="text-xl font-semibold text-[#27221c]">
              Current Gallery
            </h2>

            <p className="mt-1 text-sm text-[#777066]">
              Images currently stored in the
              Gallery collection.
            </p>

          </div>

          {images.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-[#d8cfc2] bg-white px-6 py-16 text-center">

              <p className="text-sm font-medium text-[#5e554a]">
                No gallery images yet.
              </p>

              <p className="mt-1 text-sm text-[#8a8278]">
                Upload your first store image above.
              </p>

            </div>

          ) : (

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">

              {images.map((item) => {

                const deleting =
                  deletingId === item.id;

                return (

                  <div
                    key={item.id}
                    className="group overflow-hidden rounded-2xl border border-[#e1d9ce] bg-white shadow-sm"
                  >

                    <div className="relative aspect-square overflow-hidden bg-[#f3f0eb]">

                      {item.image ? (

                        <Image
                          src={item.image}
                          alt="Gallery"
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          unoptimized
                          className={`object-cover transition duration-500 group-hover:scale-105 ${
                            deleting
                              ? "opacity-40"
                              : ""
                          }`}
                        />

                      ) : (

                        <div className="flex h-full items-center justify-center text-xs text-[#8b8378]">
                          No image
                        </div>

                      )}

                      {/* DELETE BUTTON */}

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(item)
                        }
                        disabled={deleting}
                        aria-label="Delete gallery image"
                        title="Delete image"
                        className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full border border-red-200 bg-white/95 text-red-600 shadow-md backdrop-blur transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-70"
                      >

                        {deleting ? (

                          <Loader2 className="h-4 w-4 animate-spin" />

                        ) : (

                          <Trash2 className="h-4 w-4" />

                        )}

                      </button>

                      {!item.image && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-[#b2a89b]" />
                        </div>
                      )}

                    </div>

                    <div className="flex items-center justify-between gap-3 px-3 py-3">

                      <span className="text-xs text-[#746c62]">
                        Order {item.order}
                      </span>

                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${
                          item.active
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {item.active
                          ? "Active"
                          : "Hidden"}
                      </span>

                    </div>

                  </div>

                );
              })}

            </div>

          )}

        </section>

      </div>
    </main>
  );
}
