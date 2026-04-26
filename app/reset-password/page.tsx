"use client";

import { FormEvent, useState, Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [sessionReady, setSessionReady] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const code = searchParams.get("code");

        if (!code) {
            setSessionReady(true);
            return;
        }

        let cancelled = false;

        const exchange = async () => {
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

            if (cancelled) {
                return;
            }

            if (exchangeError) {
                setError(exchangeError.message);
            }

            setSessionReady(true);
        };

        void exchange();

        return () => {
            cancelled = true;
        };
    }, [searchParams]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setError(null);
        setMessage(null);
        setLoading(true);

        if (!sessionReady) {
            setError("Please wait while we open your recovery session.");
            setLoading(false);
            return;
        }

        try {
            const { error: authError } = await supabase.auth.updateUser({
                password: password
            });

            if (authError) {
                setError(authError.message);
                setLoading(false);
            } else {
                setMessage("Password updated successfully.");
                router.replace("/login");
            }
        } catch {
            setError("Something went wrong.");
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
            <div className="w-full max-w-sm rounded border border-slate-200 bg-white p-6 shadow-sm">
                <h1 className="text-lg font-semibold text-slate-900">Set New Password</h1>
                <p className="mt-1 text-sm text-slate-600">Enter your new password below.</p>
                <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-slate-800">New Password</label>
                        <input
                            id="password"
                            type="password"
                            autoComplete="new-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 w-full rounded border border-slate-300 px-3 py-2 text-sm"
                            required
                            minLength={6}
                        />
                    </div>
                    {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
                    {message && <p className="text-sm text-green-600" role="alert">{message}</p>}
                    <button
                        type="submit"
                        disabled={loading || !sessionReady}
                        className="w-full rounded bg-[#003262] px-3 py-2 text-sm font-medium text-white hover:bg-[#002244] disabled:opacity-70"
                    >
                        {loading ? "Updating..." : sessionReady ? "Update Password" : "Opening Recovery Session..."}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="flex min-h-screen items-center justify-center">Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
