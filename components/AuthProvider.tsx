"use client";

import { supabase } from "@/lib/supabase";
import type { Session, User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type Profile = {
  full_name: string | null;
  mobile: string | null;
  role: string | null;
};

type AuthContextValue = {
  user: User | null;
  profile: Profile | null;
  authReady: boolean;
  profileLoading: boolean;
  loading: boolean;
  refreshSession: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const profileRequestId = useRef(0);

  const resetAuthState = useCallback((ready = true) => {
    setUser(null);
    setProfile(null);
    setProfileLoading(false);
    profileRequestId.current += 1;
    setAuthReady(ready);
  }, []);

  const clearInvalidSession = useCallback(async () => {
    try {
      await supabase.auth.signOut();
    } catch {
      // Best-effort cleanup only.
    }
    resetAuthState(true);
  }, [resetAuthState]);

  const loadProfile = useCallback(async (userId: string) => {
    const requestId = ++profileRequestId.current;
    setProfileLoading(true);

    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("full_name, mobile, role")
        .eq("id", userId)
        .maybeSingle();

      if (requestId !== profileRequestId.current) {
        return;
      }

      if (error) {
        setProfile(null);
        return;
      }

      setProfile(data ?? null);
    } catch {
      if (requestId !== profileRequestId.current) {
        return;
      }
      setProfile(null);
    } finally {
      if (requestId === profileRequestId.current) {
        setProfileLoading(false);
      }
    }
  }, []);

  const applySession = useCallback((session: Session | null) => {
    const nextUser = session?.user ?? null;
    setUser(nextUser);
    setAuthReady(true);

    if (!nextUser) {
      setProfile(null);
      setProfileLoading(false);
      profileRequestId.current += 1;
      return;
    }

    void loadProfile(nextUser.id);
  }, [loadProfile]);

  const shouldTreatAsInvalidSessionError = (errorMessage: string) => {
    const normalized = errorMessage.toLowerCase();
    return (
      normalized.includes("invalid") ||
      normalized.includes("jwt") ||
      normalized.includes("refresh token") ||
      normalized.includes("session not found")
    );
  };

  const refreshSession = useCallback(async () => {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        if (shouldTreatAsInvalidSessionError(sessionError.message ?? "")) {
          await clearInvalidSession();
          return;
        }
        resetAuthState(true);
        return;
      }

      applySession(sessionData.session ?? null);
    } catch {
      resetAuthState(true);
    }
  }, [applySession, clearInvalidSession, resetAuthState]);

  useEffect(() => {
    resetAuthState(false);
    void refreshSession();

    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      applySession(session);

      if (event === "SIGNED_IN" || event === "SIGNED_OUT") {
        router.refresh();
      }
    });

    return () => listener.subscription.unsubscribe();
  }, [applySession, refreshSession, resetAuthState, router]);

  const signOut = useCallback(async () => {
    await clearInvalidSession();
    router.refresh();
  }, [clearInvalidSession, router]);

  const loading = !authReady;

  const value = useMemo(
    () => ({ user, profile, authReady, profileLoading, loading, refreshSession, signOut }),
    [user, profile, authReady, profileLoading, loading, refreshSession, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
