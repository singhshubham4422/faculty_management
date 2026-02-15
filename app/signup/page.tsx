"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: typeof window !== "undefined" ? window.location.origin + "/dashboard" : undefined },
      });
      if (authError) {
        setError(authError.message);
        setLoading(false);
        return;
      }
      if (authData.user) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ full_name: fullName.trim(), mobile: mobile.trim() })
          .eq("id", authData.user.id);
        if (updateError) {
          console.error("Profile update after signup:", updateError);
        }
      }
      setMessage("Check your email to confirm your account, then sign in.");
      setLoading(false);
    } catch {
      setError("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-sm rounded border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-lg font-semibold text-slate-900">Sign up</h1>
        <p className="mt-1 text-sm text-slate-600">Create an account to apply for opportunities.</p>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-slate-800">Full Name</label>
            <input
              id="fullName"
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-slate-800">Mobile Number</label>
            <input
              id="mobile"
              type="tel"
              autoComplete="tel"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-800">Email</label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-slate-800">Password</label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
              required
            />
          </div>
          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          {message && <p className="text-sm text-green-700" role="status">{message}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded bg-[#003262] px-3 py-2 text-sm font-medium text-white hover:bg-[#002244] disabled:opacity-70"
          >
            {loading ? "Creating account..." : "Sign up"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-600">
          Already have an account? <Link href="/login" className="font-medium text-[#003262] hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
