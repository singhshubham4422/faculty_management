import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  try {
    const { application_id } = await req.json();

    if (!application_id) {
      return new Response("Missing application_id", { status: 400 });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
    const CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID")!;

    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    const { data, error } = await supabase
      .from("applications")
      .select(`
        student_id,
        resume_url,
        posts ( title )
      `)
      .eq("id", application_id)
      .single();

    if (error || !data) {
      console.error("Fetch error:", error);
      return new Response("Application not found", { status: 404 });
    }

    const { data: userData } = await supabase.auth.admin.getUserById(data.student_id);
    const email = userData?.user?.email ?? "—";

    const message = `
📥 *New Application*

📌 *${data.posts?.title ?? "Opportunity"}*
🧑 Student ID: ${data.student_id}
📧 ${email}

📄 Resume:
${data.resume_url ?? "—"}
`;

    const telegramRes = await fetch(
      `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    const telegramJson = await telegramRes.json();
    console.log("Telegram response:", telegramJson);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("notify-applications error:", err);
    return new Response("Internal error", { status: 500 });
  }
});
