import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();
  if (!profile || profile.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: rows, error } = await supabaseAdmin
    .from("applications")
    .select(
      `
      id,
      post_id,
      student_id,
      resume_url,
      status,
      created_at,
      posts(title, type)
    `
    )
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  type Row = {
    id: string;
    post_id: string;
    student_id: string;
    resume_url: string | null;
    status: string;
    created_at: string;
    posts: { title: string | null; type: string } | { title: string | null; type: string }[] | null;
  };
  const applications = await Promise.all(
    (rows || []).map(async (row: Row) => {
      const post = Array.isArray(row.posts) ? row.posts[0] : row.posts;
      const { data: userData } = await supabaseAdmin.auth.admin.getUserById(row.student_id);
      return {
        id: row.id,
        post_id: row.post_id,
        student_id: row.student_id,
        student_email: userData?.user?.email ?? null,
        resume_url: row.resume_url,
        status: row.status,
        created_at: row.created_at,
        post_title: post?.title ?? "",
        post_type: post?.type ?? "",
      };
    })
  );

  return NextResponse.json({ applications });
}
