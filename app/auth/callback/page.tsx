"use client";

import { supabase } from "@/lib/supabase";
import { Suspense, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hasExchanged = useRef(false);

  const code = searchParams.get("code");

  useEffect(() => {
    if (!code) {
      router.replace("/login");
      return;
    }

    if (hasExchanged.current) {
      return;
    }

    hasExchanged.current = true;
    let cancelled = false;

    const exchange = async () => {
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (cancelled) return;

      if (exchangeError) {
        router.replace("/login");
        return;
      }

      router.replace("/login");
    };

    exchange();

    return () => {
      cancelled = true;
    };
  }, [code, router]);

  return (
    <main className="flex min-h-screen items-center justify-center px-4 text-center">
      <div className="max-w-md space-y-3">
        <h1 className="text-2xl font-semibold">Email verification</h1>
        <p className="text-sm text-slate-700">Verifying your account...</p>
      </div>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center px-4 text-center">
          <div className="max-w-md space-y-3">
            <h1 className="text-2xl font-semibold">Email verification</h1>
            <p className="text-sm text-slate-700">Verifying your account...</p>
          </div>
        </main>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}