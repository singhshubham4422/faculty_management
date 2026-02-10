"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data.success) {
        const message =
          data?.message || "Incorrect password. Please try again.";
        setError(message);
        setLoading(false);
        return;
      }

      // Mark this browser as having an active admin session
      if (typeof window !== "undefined") {
        window.localStorage.setItem("isAdmin", "true");
      }

      router.push("/admin/dashboard");
    } catch (err) {
      console.error("Admin login failed", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 text-slate-900">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-slate-50 to-indigo-50" aria-hidden />
      <div className="relative w-full max-w-md rounded-2xl border border-slate-200 bg-white/90 p-8 shadow-xl backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700">
            🔒
          </div>
          <div>
            <p className="text-sm font-medium text-indigo-700">Faculty Admin Login</p>
            <h1 className="text-xl font-semibold text-slate-900">Secure access</h1>
          </div>
        </div>

        <p className="mt-3 text-sm text-slate-600">
          Enter the admin password to continue. Sessions stay active only in this browser.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-semibold text-slate-800"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-100"
              required
            />
          </div>

          {error && (
            <div
              className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
              role="alert"
            >
              <span aria-hidden>⚠️</span>
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-500">
          Contact program leadership if you need access or forgot the password.
        </p>
      </div>
    </div>
  );
}
