import { createClient } from "@supabase/supabase-js";

let supabaseAdminClient: any = null;

function requireAdminEnv(name: string, value: string | undefined) {
  if (!value) {
    throw new Error(`Missing required Supabase env var: ${name}`);
  }

  return value;
}

export function getSupabaseAdmin(): any {
  if (!supabaseAdminClient) {
    const supabaseUrl = requireAdminEnv(
      "SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL",
      process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
    );
    const serviceRoleKey = requireAdminEnv(
      "SUPABASE_SERVICE_ROLE_KEY",
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    supabaseAdminClient = createClient(supabaseUrl, serviceRoleKey);
  }

  return supabaseAdminClient;
}
