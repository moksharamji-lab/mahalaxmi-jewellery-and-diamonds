"use client";

import { useState } from "react";
import { HeroSlide } from "@/types/hero-slide";
import { sendAdminMutation } from "@/lib/admin-api";

type Props = {
  initialData?: HeroSlide;
};

export default function HeroForm({
  initialData,
}: Props) {
  const [form, setForm] = useState({
    title: initialData?.title ?? "",
    subtitle: initialData?.subtitle ?? "",
    buttonText: initialData?.buttonText ?? "",
    buttonLink: initialData?.buttonLink ?? "",
    order: initialData?.order?.toString() ?? "1",
    active: initialData?.active ?? true,
  });

  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("title", form.title);
      formData.append("subtitle", form.subtitle);
      formData.append("buttonText", form.buttonText);
      formData.append("buttonLink", form.buttonLink);
      formData.append("order", form.order);
      formData.append("active", String(form.active));

      if (image) {
        formData.append("image", image);
      }

      if (video) {
        formData.append("video", video);
      }

      if (initialData) {
        await sendAdminMutation(
          `hero-slides/${initialData.id}`,
          "PATCH",
          formData
        );

        alert("✅ Hero Slide Updated Successfully!");
      } else {
        await sendAdminMutation(
          "hero-slides",
          "POST",
          formData
        );

        alert("✅ Hero Slide Added Successfully!");

        setForm({
          title: "",
          subtitle: "",
          buttonText: "",
          buttonLink: "",
          order: "1",
          active: true,
        });

        setImage(null);
        setVideo(null);
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-4xl space-y-6 rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-6 shadow-[0_4px_18px_rgba(80,60,30,0.04)] sm:p-8"
    >
      {/* Header */}
      <div className="border-b border-[#E3D7C5] pb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#A47C3A]">
          Homepage Banner
        </p>

        <h2 className="mt-1 text-xl font-semibold text-[#302A23]">
          Hero Slide Information
        </h2>

        <p className="mt-1 text-sm text-[#6F665B]">
          Create and manage the content displayed in your homepage hero banner.
        </p>
      </div>

      {/* Title */}
      <div>
        <label
          className="mb-2 block text-sm font-semibold text-[#40382F]"
          htmlFor="hero-title"
        >
          Title
        </label>

        <input
          id="hero-title"
          type="text"
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title: e.target.value,
            })
          }
          placeholder="Example: Timeless Jewellery"
          className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-sm text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
          required
        />
      </div>

      {/* Subtitle */}
      <div>
        <label
          className="mb-2 block text-sm font-semibold text-[#40382F]"
          htmlFor="hero-subtitle"
        >
          Subtitle
        </label>

        <input
          id="hero-subtitle"
          type="text"
          value={form.subtitle}
          onChange={(e) =>
            setForm({
              ...form,
              subtitle: e.target.value,
            })
          }
          placeholder="Example: Discover our latest collection"
          className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-sm text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
        />
      </div>

      {/* Button Text */}
      <div>
        <label
          className="mb-2 block text-sm font-semibold text-[#40382F]"
          htmlFor="hero-button-text"
        >
          Button Text
        </label>

        <input
          id="hero-button-text"
          type="text"
          value={form.buttonText}
          onChange={(e) =>
            setForm({
              ...form,
              buttonText: e.target.value,
            })
          }
          placeholder="Example: Explore Collection"
          className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-sm text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
        />
      </div>

      {/* Button Link */}
      <div>
        <label
          className="mb-2 block text-sm font-semibold text-[#40382F]"
          htmlFor="hero-button-link"
        >
          Button Link
        </label>

        <input
          id="hero-button-link"
          type="text"
          value={form.buttonLink}
          onChange={(e) =>
            setForm({
              ...form,
              buttonLink: e.target.value,
            })
          }
          placeholder="/gold"
          className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-sm text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
        />

        <p className="mt-2 text-xs text-[#817668]">
          Example: /gold, /diamond, or /categories
        </p>
      </div>

      {/* Display Order */}
      <div>
        <label
          className="mb-2 block text-sm font-semibold text-[#40382F]"
          htmlFor="hero-order"
        >
          Display Order
        </label>

        <input
          id="hero-order"
          type="number"
          min="1"
          value={form.order}
          onChange={(e) =>
            setForm({
              ...form,
              order: e.target.value,
            })
          }
          className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-sm text-[#302A23] outline-none transition focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
        />

        <p className="mt-2 text-xs text-[#817668]">
          Lower numbers appear first on the homepage.
        </p>
      </div>

      {/* Current Image */}
      {initialData?.imageUrl && (
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#40382F]">
            Current Image
          </label>

          <div className="overflow-hidden rounded-xl border border-[#D8C9B5] bg-[#F8F2E8] p-2">
            <img
              src={initialData.imageUrl}
              alt={initialData.title}
              className="h-48 w-full rounded-lg object-cover sm:h-64"
            />
          </div>

          <p className="mt-2 text-xs text-[#817668]">
            Upload a new image below if you want to replace this image.
          </p>
        </div>
      )}

      {/* Upload Image */}
      <div>
        <label
          className="mb-2 block text-sm font-semibold text-[#40382F]"
          htmlFor="hero-image"
        >
          {initialData ? "Replace Image" : "Upload Image"}
        </label>

        <div className="rounded-xl border border-dashed border-[#CDBDA8] bg-[#F8F2E8] p-4 transition hover:border-[#B08D57]">
          <input
            id="hero-image"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setImage(e.target.files[0]);
              }
            }}
            className="block w-full cursor-pointer text-sm text-[#6F665B] file:mr-4 file:rounded-lg file:border-0 file:bg-[#EDE3D3] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#554C42] hover:file:bg-[#E3D7C5]"
          />
        </div>

        {image && (
          <p className="mt-2 text-xs font-medium text-[#A47C3A]">
            Selected: {image.name}
          </p>
        )}
      </div>

      {/* New Image Preview */}
      {image && (
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#40382F]">
            New Image Preview
          </label>

          <div className="overflow-hidden rounded-xl border border-[#D8C9B5] bg-[#F8F2E8] p-2">
            <img
              src={URL.createObjectURL(image)}
              alt="New hero slide preview"
              className="h-48 w-full rounded-lg object-cover sm:h-64"
            />
          </div>
        </div>
      )}

      {/* Current Video */}
      {initialData?.videoUrl && (
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#40382F]">
            Current Hero Video
          </label>

          <div className="overflow-hidden rounded-xl border border-[#D8C9B5] bg-black p-2">
            <video
              src={initialData.videoUrl}
              controls
              playsInline
              className="h-48 w-full rounded-lg object-cover sm:h-64"
            />
          </div>

          <p className="mt-2 text-xs text-[#817668]">
            Upload a new video below if you want to replace the current hero video.
          </p>
        </div>
      )}

      {/* Upload Video */}
      <div>
        <label
          className="mb-2 block text-sm font-semibold text-[#40382F]"
          htmlFor="hero-video"
        >
          {initialData ? "Replace Hero Video" : "Upload Hero Video"}
        </label>

        <div className="rounded-xl border border-dashed border-[#CDBDA8] bg-[#F8F2E8] p-4 transition hover:border-[#B08D57]">
          <input
            id="hero-video"
            type="file"
            accept="video/mp4,video/webm,video/quicktime"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setVideo(e.target.files[0]);
              }
            }}
            className="block w-full cursor-pointer text-sm text-[#6F665B] file:mr-4 file:rounded-lg file:border-0 file:bg-[#EDE3D3] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#554C42] hover:file:bg-[#E3D7C5]"
          />
        </div>

        {video && (
          <p className="mt-2 text-xs font-medium text-[#A47C3A]">
            Selected: {video.name}
          </p>
        )}
      </div>

      {/* New Video Preview */}
      {video && (
        <div>
          <label className="mb-2 block text-sm font-semibold text-[#40382F]">
            New Hero Video Preview
          </label>

          <div className="overflow-hidden rounded-xl border border-[#D8C9B5] bg-black p-2">
            <video
              src={URL.createObjectURL(video)}
              controls
              playsInline
              className="h-48 w-full rounded-lg object-cover sm:h-64"
            />
          </div>
        </div>
      )}

      {/* Active */}
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E3D7C5] bg-[#F8F2E8] p-4 transition hover:border-[#B08D57]/50">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) =>
            setForm({
              ...form,
              active: e.target.checked,
            })
          }
          className="mt-0.5 h-5 w-5 rounded border-[#CDBDA8] bg-[#F8F2E8] text-[#B08D57] accent-[#B08D57] focus:ring-[#B08D57]"
        />

        <span>
          <span className="block text-sm font-semibold text-[#40382F]">
            Active
          </span>

          <span className="mt-1 block text-xs text-[#817668]">
            Show this hero slide on the public homepage.
          </span>
        </span>
      </label>

      {/* Submit */}
      <div className="flex justify-end border-t border-[#E3D7C5] pt-5">
        <button
          type="submit"
          className="rounded-xl border border-[#B08D57] bg-[#B08D57] px-8 py-3 text-sm font-semibold text-[#FFF9EF] shadow-sm transition-all duration-200 hover:border-[#8F6F3F] hover:bg-[#8F6F3F] hover:shadow-md"
        >
          {initialData
            ? "Update Hero Slide"
            : "Save Hero Slide"}
        </button>
      </div>
    </form>
  );
}