// Minimal Deno typings for editor/TS checks (Supabase Edge Functions runtime provides Deno).
declare const Deno: {
  serve: (
    handler: (req: Request) => Response | Promise<Response>
  ) => unknown;
  env: {
    get: (key: string) => string | undefined;
  };
};

Deno.serve(async () => {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");

  if (!token || !chatId) {
    return new Response("Missing Telegram secrets", { status: 500 });
  }

  const message =
    "✅ Telegram test successful!\nFaculty Management System is connected.";

  const res = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    }
  );

  return new Response(
    JSON.stringify({ success: true }),
    { headers: { "Content-Type": "application/json" } }
  );
});
