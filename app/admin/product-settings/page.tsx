"use client";

import { useEffect, useState } from "react";

type ProductSettings = {
  id: string;
  line1: string;
  line2: string;
  line3: string;
  line4: string;
};

const DEFAULT_SETTINGS: ProductSettings = {
  id: "",
  line1: "100% Certified Gold and Diamond Jewellery.",
  line2: "Handmade jewellery.",
  line3: "BIS Hallmark Jewellery.",
  line4: "Shipped all over India.",
};

export default function ProductSettingsPage() {
  const [settings, setSettings] =
    useState<ProductSettings>(DEFAULT_SETTINGS);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/admin/product-settings",
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(
            data?.message ||
              data?.error ||
              "Failed to load Product Settings."
          );
        }

        const row = data?.data ?? data?.row ?? data;

        setSettings({
          id: row?.$id ?? row?.id ?? "",
          line1:
            row?.line1 ??
            DEFAULT_SETTINGS.line1,
          line2:
            row?.line2 ??
            DEFAULT_SETTINGS.line2,
          line3:
            row?.line3 ??
            DEFAULT_SETTINGS.line3,
          line4:
            row?.line4 ??
            DEFAULT_SETTINGS.line4,
        });
      } catch (err) {
        console.error(
          "Product settings load error:",
          err
        );

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load Product Settings."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  function updateField(
    field: keyof Omit<ProductSettings, "id">,
    value: string
  ) {
    setSettings((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setMessage("");
      setError("");

      /*
       * Product Settings already has one Appwrite row.
       * Therefore we always UPDATE that row.
       */
      if (!settings.id) {
        throw new Error(
          "Product Settings row ID is missing. Please refresh the page."
        );
      }

      const formData = new FormData();

      formData.append("line1", settings.line1);
      formData.append("line2", settings.line2);
      formData.append("line3", settings.line3);
      formData.append("line4", settings.line4);

      const response = await fetch(
        `/api/admin/product-settings/${settings.id}`,
        {
          method: "PATCH",
          credentials: "include",
          body: formData,
        }
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Failed to save Product Settings."
        );
      }

      const savedRow =
        data?.data ?? data?.row ?? data;

      setSettings((current) => ({
        ...current,
        id:
          savedRow?.$id ??
          savedRow?.id ??
          current.id,
        line1:
          savedRow?.line1 ??
          current.line1,
        line2:
          savedRow?.line2 ??
          current.line2,
        line3:
          savedRow?.line3 ??
          current.line3,
        line4:
          savedRow?.line4 ??
          current.line4,
      }));

      setMessage(
        "Product Settings saved successfully."
      );
    } catch (err) {
      console.error(
        "Product settings save error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to save Product Settings."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="space-y-6 text-[#302A23]">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A47C3A]">
            Management
          </p>

          <h1 className="mt-1 text-4xl font-bold tracking-tight text-[#302A23]">
            Product Settings
          </h1>

          <p className="mt-2 text-[#6F665B]">
            Manage the common information displayed on
            all product pages.
          </p>
        </div>

        <div className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-10 text-center shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
          <p className="text-sm font-medium text-[#6F665B]">
            Loading Product Settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-[#302A23]">
      {/* HEADER */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#A47C3A]">
          Management
        </p>

        <h1 className="mt-1 text-4xl font-bold tracking-tight text-[#302A23]">
          Product Settings
        </h1>

        <p className="mt-2 text-[#6F665B]">
          Manage the common information displayed on
          all product pages.
        </p>
      </div>

      {/* SUCCESS */}
      {message && (
        <div className="rounded-xl border border-[#8EAF8F] bg-[#E8F1E6] px-5 py-4 text-sm font-semibold text-[#47704A]">
          {message}
        </div>
      )}

      {/* ERROR */}
      {error && (
        <div className="rounded-xl border border-[#D5A3A0] bg-[#F7E9E7] px-5 py-4 text-sm font-semibold text-[#9A4F49]">
          {error}
        </div>
      )}

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-6 shadow-[0_4px_18px_rgba(80,60,30,0.04)] sm:p-8"
      >
        <div className="space-y-6">
          {/* LINE 1 */}
          <div>
            <label
              htmlFor="line1"
              className="mb-2 block text-sm font-semibold text-[#302A23]"
            >
              Line 1
            </label>

            <input
              id="line1"
              type="text"
              value={settings.line1}
              onChange={(event) =>
                updateField(
                  "line1",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-[#D8C9B5] bg-white px-4 py-3 text-[#302A23] outline-none transition focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/20"
              placeholder="100% Certified Gold and Diamond Jewellery."
            />
          </div>

          {/* LINE 2 */}
          <div>
            <label
              htmlFor="line2"
              className="mb-2 block text-sm font-semibold text-[#302A23]"
            >
              Line 2
            </label>

            <input
              id="line2"
              type="text"
              value={settings.line2}
              onChange={(event) =>
                updateField(
                  "line2",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-[#D8C9B5] bg-white px-4 py-3 text-[#302A23] outline-none transition focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/20"
              placeholder="Handmade jewellery."
            />
          </div>

          {/* LINE 3 */}
          <div>
            <label
              htmlFor="line3"
              className="mb-2 block text-sm font-semibold text-[#302A23]"
            >
              Line 3
            </label>

            <input
              id="line3"
              type="text"
              value={settings.line3}
              onChange={(event) =>
                updateField(
                  "line3",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-[#D8C9B5] bg-white px-4 py-3 text-[#302A23] outline-none transition focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/20"
              placeholder="BIS Hallmark Jewellery."
            />
          </div>

          {/* LINE 4 */}
          <div>
            <label
              htmlFor="line4"
              className="mb-2 block text-sm font-semibold text-[#302A23]"
            >
              Line 4
            </label>

            <input
              id="line4"
              type="text"
              value={settings.line4}
              onChange={(event) =>
                updateField(
                  "line4",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-[#D8C9B5] bg-white px-4 py-3 text-[#302A23] outline-none transition focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/20"
              placeholder="Shipped all over India."
            />
          </div>
        </div>

        {/* SAVE */}
        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg border border-[#B08D57] bg-[#B08D57] px-6 py-3 text-sm font-semibold text-[#FFF9EF] transition-all duration-200 hover:border-[#8F6F3F] hover:bg-[#8F6F3F] hover:shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}