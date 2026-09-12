"use client";

import { FormEvent, useState } from "react";

type Props = {
  product?: string;
  productSlug?: string;
  collection?: string;
};

export default function EnquiryForm({
  product = "",
  productSlug = "",
  collection = "",
}: Props) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setStatus("");

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          product,
          productSlug,
          collection,
          message,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit enquiry");
      }

      setStatus(
        "Thank you! Your enquiry has been submitted successfully."
      );

      setName("");
      setPhone("");
      setEmail("");
      setMessage("");
    } catch (error) {
      setStatus(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:p-8"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Name */}
        <div>
          <label
            htmlFor="name"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Name *
          </label>

          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Your name"
            className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-500"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor="phone"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Phone *
          </label>

          <input
            id="phone"
            type="tel"
            required
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Your phone number"
            className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-500"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Your email address"
            className="w-full rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-500"
          />
        </div>

        {/* Product */}
        <div>
          <label
            htmlFor="product"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Product
          </label>

          <input
            id="product"
            type="text"
            value={product}
            readOnly
            placeholder="Selected product"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-400 outline-none"
          />
        </div>

        {/* Collection */}
        <div>
          <label
            htmlFor="collection"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Collection
          </label>

          <input
            id="collection"
            type="text"
            value={collection}
            readOnly
            placeholder="Gold / Diamond"
            className="w-full rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-zinc-400 outline-none"
          />
        </div>

        {/* Message */}
        <div className="md:col-span-2">
          <label
            htmlFor="message"
            className="mb-2 block text-sm font-medium text-zinc-300"
          >
            Message
          </label>

          <textarea
            id="message"
            rows={5}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Tell us what you would like to know..."
            className="w-full resize-none rounded-xl border border-zinc-800 bg-black px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-yellow-500"
          />
        </div>
      </div>

      {/* Status */}
      {status && (
        <div className="mt-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-4 py-3 text-sm text-yellow-400">
          {status}
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-yellow-500 px-6 py-4 font-semibold text-black transition hover:bg-yellow-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Enquiry"}
      </button>
    </form>
  );
}