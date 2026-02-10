import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Create Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const { password } = await req.json();

    if (!password) {
      return NextResponse.json(
        { success: false, message: "Password required" },
        { status: 400 }
      );
    }

    // Fetch stored hash
    const { data, error } = await supabase
      .from("faculty_config")
      .select("password_hash")
      .limit(1)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { success: false, message: "Admin config not found" },
        { status: 500 }
      );
    }

    // Compare password using Postgres crypt
    const { data: match, error: matchError } = await supabase.rpc(
      "verify_admin_password",
      {
        input_password: password,
        stored_hash: data.password_hash,
      }
    );

    if (matchError || !match) {
      return NextResponse.json(
        { success: false, message: "Incorrect password" },
        { status: 401 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Admin login error", err);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
