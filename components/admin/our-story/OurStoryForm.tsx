"use client";

import { useState } from "react";
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

  const [formData, setFormData] = useState<FormData>(
    story
      ? {
          title: story.title,
          paragraphOne: story.paragraphOne,
          paragraphTwo: story.paragraphTwo,
          buttonText: story.buttonText,
          buttonLink: story.buttonLink,
          active: story.active,
        }
      : defaultFormData
  );

  const [isSaving, setIsSaving] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(
    field: keyof FormData,
    value: string | boolean
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const response = await fetch(
        "/api/admin/our-story",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data =
        (await response.json().catch(() => null)) as
          | ApiResponse
          | null;

      if (!response.ok) {
        setError(
          typeof data?.message === "string"
            ? data.message
            : "Unable to update Our Story."
        );

        return;
      }

      setSuccess(
        "Our Story updated successfully."
      );

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
          Edit the content displayed in the
          Our Story section on the Home page.
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
              value={formData.paragraphOne}
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
              value={formData.paragraphTwo}
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

      {/* Button */}
      <section className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-6 shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
        <h2 className="text-xl font-semibold text-[#302A23]">
          Call To Action
        </h2>

        <p className="mt-1 text-sm text-[#6F665B]">
          Configure the button displayed below
          the story.
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
              value={formData.buttonText}
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
              value={formData.buttonLink}
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
              Example: /gold, /diamond or /categories
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