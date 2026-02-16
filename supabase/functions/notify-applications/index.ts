import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { application_id } = await req.json();

    if (!application_id) {
      return new Response(JSON.stringify({ error: "Missing application_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const TELEGRAM_BOT_TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN")!;
    const TELEGRAM_CHAT_ID = Deno.env.get("TELEGRAM_CHAT_ID")!;

    // Create a Supabase client with the Service Role Key
    const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_KEY);

    // 1. Fetch Application Row
    const { data: application, error: appError } = await supabaseAdmin
      .from("applications")
      .select("id, student_id, post_id, resume_url")
      .eq("id", application_id)
      .single();

    if (appError || !application) {
      console.error("Error fetching application:", appError);
      return new Response(JSON.stringify({ error: "Application not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Fetch Related Post using post_id
    const { data: post, error: postError } = await supabaseAdmin
      .from("posts")
      .select("title")
      .eq("id", application.post_id)
      .single();

    if (postError || !post) {
      console.error("Error fetching post:", postError);
      return new Response(JSON.stringify({ error: "Post not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Fetch Related Profile using student_id
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("profiles")
      .select("full_name, mobile")
      .eq("id", application.student_id)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      // Proceed even if profile fetch fails, but log it.
    }

    // 4. Fetch Student Email using supabaseAdmin.auth.admin.getUserById(student_id)
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(
      application.student_id
    );

    if (userError || !userData.user) {
      console.error("Error fetching user email:", userError);
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const email = userData.user.email;
    const fullName = profile?.full_name ?? "Unknown Name";
    const mobile = profile?.mobile ?? "Not provided";

    // 5. Construct Message String
    const message = `
📥 *New Application Received*

📌 *Opportunity:* ${post.title}
👤 *Student:* ${fullName}
📧 *Email:* ${email}
📱 *Mobile:* ${mobile}

📄 *Resume:*
${application.resume_url ?? "No resume uploaded"}
    `;

    // 6. Send Message using Telegram Bot API
    const telegramRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );

    const telegramData = await telegramRes.json();
    if (!telegramData.ok) {
      console.error("Telegram API Error:", telegramData);
      return new Response(JSON.stringify({ error: "Failed to send Telegram notification" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 7. Return Success Response
    return new Response(JSON.stringify({ success: true, message: "Notification sent" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (err) {
    console.error("Unexpected error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
