"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { Store } from "@/services/store.service";

type Props = {
  store: Store;
};

type StoreFormData = {
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  whatsappUrl: string;
  googleMapsUrl: string;
  description: string;
  active: boolean;
};

type ApiResponse = {
  message?: unknown;
};

export default function EditStoreForm({ store }: Props) {
  const router = useRouter();

  const [formData, setFormData] = useState<StoreFormData>({
    name: store.name,
    address: store.address,
    phone: store.phone,
    whatsapp: store.whatsapp,
    whatsappUrl:
      store.whatsappUrl || "https://wa.me/919111311179",
    googleMapsUrl: store.googleMapsUrl,
    description: store.description,
    active: store.active,
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState(
    store.logo || ""
  );

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(
    field: keyof StoreFormData,
    value: string | boolean
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  function handleLogoChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("Logo image must be smaller than 10 MB.");
      return;
    }

    setError("");
    setLogoFile(file);

    const previewUrl = URL.createObjectURL(file);
    setLogoPreview(previewUrl);
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setIsSaving(true);

    try {
      const payload = new FormData();

      payload.append("name", formData.name);
      payload.append("address", formData.address);
      payload.append("phone", formData.phone);

      const whatsappNumber = formData.whatsapp
        .replace(/\D/g, "")
        .trim();

      payload.append(
        "whatsapp",
        whatsappNumber
      );

      payload.append(
        "whatsappUrl",
        formData.whatsappUrl.trim()
      );

      payload.append(
        "googleMapsUrl",
        formData.googleMapsUrl.trim()
      );

      payload.append(
        "description",
        formData.description
      );

      payload.append(
        "active",
        String(formData.active)
      );

      if (logoFile) {
        payload.append(
          "logo",
          logoFile
        );
      }

      const response = await fetch(
        `/api/admin/stores/${store.id}`,
        {
          method: "PUT",
          body: payload,
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
            : "Unable to update the store."
        );

        return;
      }

      setSuccess(
        "Store updated successfully."
      );

      router.refresh();

      setTimeout(() => {
        router.push("/admin/stores");
        router.refresh();
      }, 700);
    } catch {
      setError(
        "Unable to update the store. Please check your connection and try again."
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
      {/* Collection */}
      <section className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-6 shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A47C3A]">
          Collection
        </p>

        <div className="mt-3 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-[#302A23]">
              {store.collection} Store
            </h2>

            <p className="mt-1 text-sm text-[#6F665B]">
              The collection type cannot be changed here.
            </p>
          </div>

          <span className="rounded-xl border border-[#B08D57]/30 bg-[#B08D57]/10 px-4 py-2 text-sm font-semibold text-[#8F6F3F]">
            {store.collection}
          </span>
        </div>
      </section>

      {/* Store Logo */}
      <section className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-6 shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
        <h2 className="text-xl font-semibold text-[#302A23]">
          Store Logo
        </h2>

        <p className="mt-1 text-sm text-[#6F665B]">
          This logo will be displayed on the Home page and Contact page.
        </p>

        <div className="mt-6 grid gap-6 md:grid-cols-[180px_1fr] md:items-start">
          <div className="flex h-44 w-full items-center justify-center rounded-2xl border border-[#D8C9B5] bg-[#F3EDE2] p-4">
            {logoPreview ? (
              <img
                src={logoPreview}
                alt={`${store.name} logo`}
                className="max-h-36 max-w-full object-contain"
              />
            ) : (
              <div className="text-center">
                <p className="text-sm font-semibold text-[#6F665B]">
                  No logo
                </p>

                <p className="mt-1 text-xs text-[#918576]">
                  Upload a store logo
                </p>
              </div>
            )}
          </div>

          <div>
            <label
              htmlFor="logo"
              className="mb-2 block text-sm font-semibold text-[#40382F]"
            >
              Upload Logo
            </label>

            <input
              id="logo"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              onChange={handleLogoChange}
              className="block w-full cursor-pointer rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] text-sm text-[#40382F] file:mr-4 file:border-0 file:border-r file:border-[#D0C1AC] file:bg-[#EDE3D3] file:px-4 file:py-3 file:font-semibold file:text-[#8F6F3F] hover:file:bg-[#F3EDE2]"
            />

            <p className="mt-2 text-xs leading-5 text-[#817668]">
              Recommended: PNG, JPG, WEBP or SVG. Keep the logo under 10 MB.
            </p>

            {logoFile && (
              <p className="mt-3 text-sm font-medium text-[#8F6F3F]">
                Selected: {logoFile.name}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Basic Information */}
      <section className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-6 shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
        <h2 className="text-xl font-semibold text-[#302A23]">
          Basic Information
        </h2>

        <p className="mt-1 text-sm text-[#6F665B]">
          Information displayed on the public website.
        </p>

        <div className="mt-6 space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-[#40382F]"
            >
              Store Name
            </label>

            <input
              id="name"
              type="text"
              value={formData.name}
              onChange={(event) =>
                updateField(
                  "name",
                  event.target.value
                )
              }
              required
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
              placeholder="Store name"
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-[#40382F]"
            >
              Description
            </label>

            <textarea
              id="description"
              value={formData.description}
              onChange={(event) =>
                updateField(
                  "description",
                  event.target.value
                )
              }
              rows={4}
              className="w-full resize-none rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
              placeholder="Store description"
            />
          </div>

          <div>
            <label
              htmlFor="address"
              className="mb-2 block text-sm font-semibold text-[#40382F]"
            >
              Address
            </label>

            <textarea
              id="address"
              value={formData.address}
              onChange={(event) =>
                updateField(
                  "address",
                  event.target.value
                )
              }
              rows={3}
              className="w-full resize-none rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
              placeholder="Full store address"
            />
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-6 shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
        <h2 className="text-xl font-semibold text-[#302A23]">
          Contact Information
        </h2>

        <p className="mt-1 text-sm text-[#6F665B]">
          Phone and WhatsApp details.
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {/* Phone */}
          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-semibold text-[#40382F]"
            >
              Phone
            </label>

            <input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(event) =>
                updateField(
                  "phone",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
              placeholder="Phone number"
            />
          </div>

          {/* WhatsApp Number */}
          <div>
            <label
              htmlFor="whatsapp"
              className="mb-2 block text-sm font-semibold text-[#40382F]"
            >
              WhatsApp Number
            </label>

            <input
              id="whatsapp"
              type="tel"
              value={formData.whatsapp}
              onChange={(event) =>
                updateField(
                  "whatsapp",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
              placeholder="Example: 919111311179"
            />

            <p className="mt-2 text-xs text-[#817668]">
              Enter only the country code and number. No +, spaces or URL.
            </p>
          </div>

          {/* WhatsApp URL */}
          <div className="md:col-span-2">
            <label
              htmlFor="whatsappUrl"
              className="mb-2 block text-sm font-semibold text-[#40382F]"
            >
              WhatsApp URL
            </label>

            <input
              id="whatsappUrl"
              type="url"
              value={formData.whatsappUrl}
              onChange={(event) =>
                updateField(
                  "whatsappUrl",
                  event.target.value
                )
              }
              className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
              placeholder="https://wa.me/919111311179"
            />

            <p className="mt-2 text-xs text-[#817668]">
              This URL is used by the website WhatsApp buttons.
            </p>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-6 shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
        <h2 className="text-xl font-semibold text-[#302A23]">
          Google Maps
        </h2>

        <p className="mt-1 text-sm text-[#6F665B]">
          Link visitors can use to find this store.
        </p>

        <div className="mt-6">
          <label
            htmlFor="googleMapsUrl"
            className="mb-2 block text-sm font-semibold text-[#40382F]"
          >
            Google Maps URL
          </label>

          <input
            id="googleMapsUrl"
            type="url"
            value={formData.googleMapsUrl}
            onChange={(event) =>
              updateField(
                "googleMapsUrl",
                event.target.value
              )
            }
            className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
            placeholder="https://maps.google.com/..."
          />
        </div>
      </section>

      {/* Status */}
      <section className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-6 shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-semibold text-[#302A23]">
              Store Status
            </h2>

            <p className="mt-1 text-sm leading-6 text-[#6F665B]">
              Inactive stores are hidden from the public website.
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
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() =>
            router.push("/admin/stores")
          }
          disabled={isSaving}
          className="rounded-xl border border-[#D0C1AC] bg-[#EDE3D3] px-6 py-3 text-sm font-semibold text-[#554C42] transition-all duration-200 hover:border-[#B08D57] hover:bg-[#F3EDE2] hover:text-[#8F6F3F] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Cancel
        </button>

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