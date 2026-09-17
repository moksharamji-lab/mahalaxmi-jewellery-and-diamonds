"use client";

import { useState } from "react";
type Props = {
  nextPath: string;
};

type LoginResponse = {
  message?: unknown;
};

export default function LoginForm({ nextPath }: Props) {
 

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data =
        (await response.json().catch(() => null)) as
          | LoginResponse
          | null;

      if (!response.ok) {
        setError(
          typeof data?.message === "string"
            ? data.message
            : "Unable to sign in. Please try again."
        );

        return;
      }

      window.location.assign(nextPath);
    } catch {
      setError(
        "Unable to sign in. Check your connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-6 rounded-2xl border border-[#D8C9B5] bg-[#FAF6EE] p-8 shadow-[0_18px_50px_rgba(80,60,30,0.10)]"
    >
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#A47C3A]">
          Admin Portal
        </p>

        <h1 className="mt-3 text-3xl font-bold tracking-tight text-[#302A23]">
          Welcome back
        </h1>

        <p className="mt-2 text-[#6F665B]">
          Sign in to manage Mahalaxmi Jewellery.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label
            className="mb-2 block text-sm font-semibold text-[#40382F]"
            htmlFor="email"
          >
            Email
          </label>

          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label
            className="mb-2 block text-sm font-semibold text-[#40382F]"
            htmlFor="password"
          >
            Password
          </label>

          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-[#D0C1AC] bg-[#F8F2E8] p-3 text-[#302A23] outline-none transition placeholder:text-[#8A7F70] focus:border-[#B08D57] focus:ring-2 focus:ring-[#B08D57]/15"
            placeholder="Enter your password"
            required
          />
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="rounded-xl border border-[#C58B84] bg-[#F7E9E7] p-3 text-sm font-medium text-[#9A4F49]"
        >
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl border border-[#B08D57] bg-[#B08D57] px-6 py-3 font-semibold text-[#FFF9EF] shadow-sm transition-all duration-200 hover:border-[#8F6F3F] hover:bg-[#8F6F3F] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isSubmitting ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}