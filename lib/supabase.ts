import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

declare global {
  // eslint-disable-next-line no-var
  var __supabaseClient__: SupabaseClient | undefined;
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export const supabase = globalThis.__supabaseClient__ ?? createClient();

if (!globalThis.__supabaseClient__) {
  globalThis.__supabaseClient__ = supabase;
}
