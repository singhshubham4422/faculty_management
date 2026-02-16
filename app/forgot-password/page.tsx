"use client";

import { FormEvent, useState, Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

function ForgotPasswordForm() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        try {
            const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (authError) {
                setError(authError.message);
            } else {
                setMessage("Check your email to reset your password.");
            }
        } catch {
            setError("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="w-full max-w-sm rounded border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-lg font-semibold text-slate-900">Reset Password</h1>
                <p className="mt-1 text-sm text-slate-600">Enter your email to receive a reset link.</p>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
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
                    {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
                    {message && <p className="text-sm text-green-600" role="alert">{message}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded bg-[#003262] px-3 py-2 text-sm font-medium text-white hover:bg-[#002244] disabled:opacity-70"
                    >
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-slate-600">
                    Remember your password? <Link href="/login" className="font-medium text-[#003262] hover:underline">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default function ForgotPasswordPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <ForgotPasswordForm />
        </Suspense>
    );
}
