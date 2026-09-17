"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { Rate } from "@/services/rate.service";

type Props = {
  rate?: Rate | null;
};

export default function EditRateForm({ rate }: Props) {
  const router = useRouter();

  const [value, setValue] = useState(
    rate ? String(rate.rate) : ""
  );

  const [active, setActive] = useState(
    rate?.active ?? true
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    if (!rate) {
      setError(
        "Rate information could not be loaded. Please go back and try again."
      );
      return;
    }

    const numericRate = Number(value);

    if (
      !value.trim() ||
      Number.isNaN(numericRate) ||
      numericRate < 0
    ) {
      setError("Please enter a valid rate.");
      return;
    }

    try {
      setSaving(true);

      /*
       * The admin API expects FormData.
       * Do NOT manually set Content-Type here.
       * The browser will automatically set the correct
       * multipart/form-data boundary.
       */
      const formData = new FormData();

      formData.append("rate", String(numericRate));
      formData.append("active", String(active));

      const response = await fetch(
        `/api/admin/rates/${encodeURIComponent(rate.id)}`,
        {
          method: "PATCH",
          body: formData,
        }
      );

      if (!response.ok) {
        const data = await response.json().catch(() => null);

        throw new Error(
          data?.error ||
            data?.message ||
            "Unable to update the rate."
        );
      }

      /*
       * Go back to the Rates dashboard.
       * Refresh the server-rendered rates list.
       */
      router.push("/admin/rates");
      router.refresh();
    } catch (err) {
      console.error("Failed to update rate:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update the rate. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (!rate) {
    return (
      <div className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-8 shadow-[0_4px_18px_rgba(80,60,30,0.04)]">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#A47C3A]">
            Rate Management
          </p>

          <h2 className="mt-2 text-2xl font-bold text-[#302A23]">
            Rate Not Found
          </h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#6F665B]">
            The rate you are trying to edit could not be
            loaded. It may have been deleted or the
            selected rate is invalid.
          </p>

          <button
            type="button"
            onClick={() => router.push("/admin/rates")}
            className="mt-6 rounded-xl border border-[#B08D57] bg-[#B08D57] px-6 py-3 font-semibold text-[#FFF9EF] transition-all duration-200 hover:border-[#8F6F3F] hover:bg-[#8F6F3F]"
          >
            ← Back to Rates
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-6 shadow-[0_4px_18px_rgba(80,60,30,0.04)] md:p-8"
    >
      {/* Collection */}

      <div>
        <label className="text-sm font-semibold text-[#40382F]">
          Collection
        </label>

        <div className="mt-2 rounded-xl border border-[#D0C1AC] bg-[#EDE3D3] px-4 py-3 font-medium text-[#302A23]">
          {rate.collection}
        </div>
      </div>

      {/* Purity */}

      <div className="mt-5">
        <label className="text-sm font-semibold text-[#40382F]">
          Purity
        </label>

        <div className="mt-2 rounded-xl border border-[#D0C1AC] bg-[#EDE3D3] px-4 py-3 font-medium text-[#302A23]">
          {rate.purity}
        </div>
      </div>

      {/* Rate */}

      <div className="mt-5">
        <label
          htmlFor="rate"
          className="text-sm font-semibold text-[#40382F]"
        >
          Rate ({rate.unit})
        </label>

        <input
          id="rate"
          type="number"
          min="0"
          step="0.01"
          value={value}
          onChange={(event) =>
            setValue(event.target.value)
          }
          className="mt-2 w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] px-4 py-3 font-medium text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
          placeholder="Enter rate"
        />
      </div>

      {/* Active */}

      <div className="mt-5 flex items-center justify-between rounded-xl border border-[#D8C9B5] bg-[#F8F2E8] p-4">
        <div>
          <p className="font-semibold text-[#302A23]">
            Active
          </p>

          <p className="mt-1 text-sm text-[#6F665B]">
            Show this rate on the public website.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setActive(!active)}
          className={`relative h-6 w-11 rounded-full transition-colors duration-200 ${
            active
              ? "bg-[#B08D57]"
              : "bg-[#B9AD9D]"
          }`}
          aria-label="Toggle active status"
        >
          <span
            className={`absolute top-1 h-4 w-4 rounded-full bg-[#FFF9EF] shadow-sm transition-all duration-200 ${
              active ? "left-6" : "left-1"
            }`}
          />
        </button>
      </div>

      {/* Error */}

      {error && (
        <p className="mt-5 rounded-xl border border-[#C58B84] bg-[#F7E9E7] px-4 py-3 text-sm font-medium text-[#9A4F49]">
          {error}
        </p>
      )}

      {/* Buttons */}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={saving}
          className="flex-1 rounded-xl border border-[#B08D57] bg-[#B08D57] px-5 py-4 font-semibold text-[#FFF9EF] shadow-sm transition-all duration-200 hover:border-[#8F6F3F] hover:bg-[#8F6F3F] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Rate"}
        </button>

        <button
          type="button"
          onClick={() => router.push("/admin/rates")}
          className="flex-1 rounded-xl border border-[#D0C1AC] bg-[#EDE3D3] px-5 py-4 font-semibold text-[#554C42] transition-all duration-200 hover:border-[#B08D57] hover:bg-[#F3EDE2] hover:text-[#8F6F3F]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}