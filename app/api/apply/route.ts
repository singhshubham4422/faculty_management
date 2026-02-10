import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { post_id, student_name, email, mobile, resume_url } = body;

    if (!post_id || !student_name || !email || !mobile || !resume_url) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("applications")
      .insert({
        post_id,
        student_name,
        email,
        mobile,
        resume_url,
      })
      .select("id")
      .single();

    if (error) {
      console.error("Insert error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // 🔔 TELEGRAM NOTIFY (THIS WAS THE ISSUE)
    const notifyRes = await fetch(
      `${supabaseUrl}/functions/v1/notify-applications`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${anonKey}`, // ⭐ REQUIRED
        },
        body: JSON.stringify({ application_id: data.id }),
      }
    );

    if (!notifyRes.ok) {
      console.error("Notify failed:", await notifyRes.text());
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
