"use client";

import {
  useEffect,
  useState,
} from "react";

import { useRouter } from "next/navigation";

import type { OurStory } from "@/types/our-story";

type Props = {
  story: OurStory | null;
};

type FormData = {
  title: string;
  paragraphOne: string;
  paragraphTwo: string;
  buttonText: string;
  buttonLink: string;
  active: boolean;
};

type ApiResponse = {
  message?: unknown;
};

const defaultFormData: FormData = {
  title: "Tradition Meets Elegance",

  paragraphOne:
    "Mahalaxmi Jewels brings together timeless craftsmanship and contemporary design to create jewellery for life's most memorable moments.",

  paragraphTwo:
    "From classic gold jewellery to elegant diamond creations, every piece is selected with an appreciation for beauty, detail and lasting elegance.",

  buttonText: "Explore Our Collections",

  buttonLink: "/gold",

  active: true,
};

export default function OurStoryForm({
  story,
}: Props) {
  const router = useRouter();

  const [formData, setFormData] =
    useState<FormData>(
      story
        ? {
            title: story.title,
            paragraphOne:
              story.paragraphOne,
            paragraphTwo:
              story.paragraphTwo,
            buttonText:
              story.buttonText,
            buttonLink:
              story.buttonLink,
            active: story.active,
          }
        : defaultFormData
    );

  const [imageOneFile, setImageOneFile] =
    useState<File | null>(null);

  const [imageTwoFile, setImageTwoFile] =
    useState<File | null>(null);

  const [imageOnePreview, setImageOnePreview] =
    useState(
      story?.imageUrlOne || ""
    );

  const [imageTwoPreview, setImageTwoPreview] =
    useState(
      story?.imageUrlTwo || ""
    );

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  useEffect(() => {
    return () => {
      if (
        imageOnePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          imageOnePreview
        );
      }

      if (
        imageTwoPreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(
          imageTwoPreview
        );
      }
    };
  }, [
    imageOnePreview,
    imageTwoPreview,
  ]);

  function updateField(
    field: keyof FormData,
    value: string | boolean
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleImageOneChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] ?? null;

    setImageOneFile(file);

    if (!file) {
      setImageOnePreview(
        story?.imageUrlOne || ""
      );
      return;
    }

    const previewUrl =
      URL.createObjectURL(file);

    setImageOnePreview(previewUrl);
  }

  function handleImageTwoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] ?? null;

    setImageTwoFile(file);

    if (!file) {
      setImageTwoPreview(
        story?.imageUrlTwo || ""
      );
      return;
    }

    const previewUrl =
      URL.createObjectURL(file);

    setImageTwoPreview(previewUrl);
  }

  function removeImageOne() {
    setImageOneFile(null);
    setImageOnePreview(
      story?.imageUrlOne || ""
    );

    const input =
      document.getElementById(
        "imageOne"
      ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  }

  function removeImageTwo() {
    setImageTwoFile(null);
    setImageTwoPreview(
      story?.imageUrlTwo || ""
    );

    const input =
      document.getElementById(
        "imageTwo"
      ) as HTMLInputElement | null;

    if (input) {
      input.value = "";
    }
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const body = new FormData();

      body.append(
        "title",
        formData.title
      );

      body.append(
        "paragraphOne",
        formData.paragraphOne
      );

      body.append(
        "paragraphTwo",
        formData.paragraphTwo
      );

      body.append(
        "buttonText",
        formData.buttonText
      );

      body.append(
        "buttonLink",
        formData.buttonLink
      );

      body.append(
        "active",
        String(formData.active)
      );

      if (imageOneFile) {
        body.append(
          "imageOne",
          imageOneFile
        );
      }

      if (imageTwoFile) {
        body.append(
          "imageTwo",
          imageTwoFile
        );
      }

      const response = await fetch(
        "/api/admin/our-story",
        {
          method: "PUT",
          body,
        }
      );

      const data =
        (await response
          .json()
          .catch(() => null)) as
          | ApiResponse
          | null;

      if (!response.ok) {
        setError(
          typeof data?.message ===
            "string"
            ? data.message
            : "Unable to update Our Story."
        );

        return;
      }

      setSuccess(
        "Our Story updated successfully."
      );

      setImageOneFile(null);
      setImageTwoFile(null);

      router.refresh();
    } catch {
      setError(
        "Unable to update Our Story. Please check your connection and try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {/* Main Content */}

      <section className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-6 shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A47C3A]">
          Our Story
        </p>

        <h2 className="mt-2 text-2xl font-semibold text-[#302A23]">
          Story Content
        </h2>

        <p className="mt-1 text-sm leading-6 text-[#6F665B]">
          Edit the content and images
          displayed in the Our Story
          section on the Home page.
        </p>

        <div className="mt-6 space-y-5">
          {/* Title */}

          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-[#40382F]"
            >
              Title
            </label>

            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(event) =>
                updateField(
                  "title",
                  event.target.value
                )
              }
              required
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
              placeholder="Our Story title"
            />
          </div>

          {/* Paragraph One */}

          <div>
            <label
              htmlFor="paragraphOne"
              className="mb-2 block text-sm font-semibold text-[#40382F]"
            >
              First Paragraph
            </label>

            <textarea
              id="paragraphOne"
              value={
                formData.paragraphOne
              }
              onChange={(event) =>
                updateField(
                  "paragraphOne",
                  event.target.value
                )
              }
              required
              rows={5}
              className="w-full resize-y rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
              placeholder="First Our Story paragraph"
            />
          </div>

          {/* Paragraph Two */}

          <div>
            <label
              htmlFor="paragraphTwo"
              className="mb-2 block text-sm font-semibold text-[#40382F]"
            >
              Second Paragraph
            </label>

            <textarea
              id="paragraphTwo"
              value={
                formData.paragraphTwo
              }
              onChange={(event) =>
                updateField(
                  "paragraphTwo",
                  event.target.value
                )
              }
              required
              rows={5}
              className="w-full resize-y rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
              placeholder="Second Our Story paragraph"
            />
          </div>
        </div>
      </section>

      {/* Images */}

      <section className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-6 shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A47C3A]">
          Our Story Images
        </p>

        <h2 className="mt-2 text-xl font-semibold text-[#302A23]">
          Story Gallery
        </h2>

        <p className="mt-1 text-sm leading-6 text-[#6F665B]">
          Upload two images for the Our
          Story section. Images are stored
          in Google Drive.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {/* Image One */}

          <div className="rounded-2xl border border-[#D0C1AC] bg-[#F8F2E8] p-4">
            <label
              htmlFor="imageOne"
              className="mb-3 block text-sm font-semibold text-[#40382F]"
            >
              Story Image 1
            </label>

            {imageOnePreview ? (
              <div className="relative overflow-hidden rounded-xl border border-[#D8C9B5] bg-white">
                {/* Blob URLs are used while a local upload is pending. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageOnePreview}
                  alt="Our Story image 1 preview"
                  className="h-64 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={removeImageOne}
                  className="absolute right-3 top-3 rounded-lg border border-[#C58B84] bg-[#FFF9EF] px-3 py-2 text-xs font-semibold text-[#9A4F49] shadow-sm transition hover:bg-[#F7E9E7]"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-[#D0C1AC] bg-[#FBF7EF]">
                <div className="text-center">
                  <div className="text-4xl">
                    🖼️
                  </div>

                  <p className="mt-2 text-sm font-medium text-[#6F665B]">
                    No image selected
                  </p>
                </div>
              </div>
            )}

            <input
              id="imageOne"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={
                handleImageOneChange
              }
              className="mt-4 block w-full cursor-pointer rounded-xl border border-[#D0C1AC] bg-[#FFF9EF] px-3 py-3 text-sm text-[#40382F] file:mr-4 file:rounded-lg file:border-0 file:bg-[#B08D57] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#8F6F3F]"
            />

            <p className="mt-2 text-xs text-[#817668]">
              JPG, PNG, WEBP or GIF.
            </p>
          </div>

          {/* Image Two */}

          <div className="rounded-2xl border border-[#D0C1AC] bg-[#F8F2E8] p-4">
            <label
              htmlFor="imageTwo"
              className="mb-3 block text-sm font-semibold text-[#40382F]"
            >
              Story Image 2
            </label>

            {imageTwoPreview ? (
              <div className="relative overflow-hidden rounded-xl border border-[#D8C9B5] bg-white">
                {/* Blob URLs are used while a local upload is pending. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageTwoPreview}
                  alt="Our Story image 2 preview"
                  className="h-64 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={removeImageTwo}
                  className="absolute right-3 top-3 rounded-lg border border-[#C58B84] bg-[#FFF9EF] px-3 py-2 text-xs font-semibold text-[#9A4F49] shadow-sm transition hover:bg-[#F7E9E7]"
                >
                  Remove
                </button>
              </div>
            ) : (
              <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-[#D0C1AC] bg-[#FBF7EF]">
                <div className="text-center">
                  <div className="text-4xl">
                    🖼️
                  </div>

                  <p className="mt-2 text-sm font-medium text-[#6F665B]">
                    No image selected
                  </p>
                </div>
              </div>
            )}

            <input
              id="imageTwo"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={
                handleImageTwoChange
              }
              className="mt-4 block w-full cursor-pointer rounded-xl border border-[#D0C1AC] bg-[#FFF9EF] px-3 py-3 text-sm text-[#40382F] file:mr-4 file:rounded-lg file:border-0 file:bg-[#B08D57] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-[#8F6F3F]"
            />

            <p className="mt-2 text-xs text-[#817668]">
              JPG, PNG, WEBP or GIF.
            </p>
          </div>
        </div>
      </section>

      {/* Call To Action */}

      <section className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-6 shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
        <h2 className="text-xl font-semibold text-[#302A23]">
          Call To Action
        </h2>

        <p className="mt-1 text-sm text-[#6F665B]">
          Configure the button displayed
          below the story.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {/* Button Text */}

          <div>
            <label
              htmlFor="buttonText"
              className="mb-2 block text-sm font-semibold text-[#40382F]"
            >
              Button Text
            </label>

            <input
              id="buttonText"
              type="text"
              value={
                formData.buttonText
              }
              onChange={(event) =>
                updateField(
                  "buttonText",
                  event.target.value
                )
              }
              required
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
              placeholder="Explore Our Collections"
            />
          </div>

          {/* Button Link */}

          <div>
            <label
              htmlFor="buttonLink"
              className="mb-2 block text-sm font-semibold text-[#40382F]"
            >
              Button Link
            </label>

            <input
              id="buttonLink"
              type="text"
              value={
                formData.buttonLink
              }
              onChange={(event) =>
                updateField(
                  "buttonLink",
                  event.target.value
                )
              }
              required
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
              placeholder="/gold"
            />

            <p className="mt-2 text-xs text-[#817668]">
              Example: /gold, /diamond or
              /categories
            </p>
          </div>
        </div>
      </section>

      {/* Status */}

      <section className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-6 shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-[#302A23]">
              Display Status
            </h2>

            <p className="mt-1 text-sm leading-6 text-[#6F665B]">
              Turn this off if you want to
              temporarily hide the Our Story
              section from the Home page.
            </p>
          </div>

          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={formData.active}
              onChange={(event) =>
                updateField(
                  "active",
                  event.target.checked
                )
              }
              className="peer sr-only"
            />

            <div className="h-7 w-12 rounded-full bg-[#B9AD9D] transition peer-checked:bg-[#B08D57] peer-focus:ring-2 peer-focus:ring-[#B08D57]/30" />

            <div className="absolute left-1 top-1 h-5 w-5 rounded-full bg-[#FFF9EF] shadow-sm transition peer-checked:translate-x-5" />
          </label>
        </div>
      </section>

      {/* Messages */}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-[#C58B84] bg-[#F7E9E7] p-4 text-sm font-medium text-[#9A4F49]"
        >
          {error}
        </div>
      )}

      {success && (
        <div
          role="status"
          className="rounded-xl border border-[#9BC7A9] bg-[#EDF7EF] p-4 text-sm font-medium text-[#39734A]"
        >
          {success}
        </div>
      )}

      {/* Actions */}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-xl border border-[#B08D57] bg-[#B08D57] px-6 py-3 text-sm font-semibold text-[#FFF9EF] shadow-sm transition-all duration-200 hover:border-[#8F6F3F] hover:bg-[#8F6F3F] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving
            ? "Saving Changes..."
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
