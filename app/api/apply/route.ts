import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * POST /api/apply
 * - createServerSupabase() reads session from cookies (next/headers).
 * - No insert is performed until the session user is validated.
 * - supabaseAdmin is used only after 401 check for the insert.
 */
export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { post_id, resume_url } = body;
    // student_id is never accepted from client; always use session user.id

    if (!post_id || !resume_url) {
      return NextResponse.json({ error: "Missing post_id or resume_url" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("applications")
      .insert({
        post_id,
        student_id: user.id,
        resume_url,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const notifyRes = await fetch(`${supabaseUrl}/functions/v1/notify-applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${anonKey}`,
      },
      body: JSON.stringify({ application_id: data.id }),
    });

    if (!notifyRes.ok) {
      console.error("Notify failed:", await notifyRes.text());
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
