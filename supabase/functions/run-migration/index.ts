import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import postgres from "https://deno.land/x/postgres@v0.17.0/mod.ts";

const ADMIN_EMAIL = "info.neurixx@gmail.com";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { "Content-Type": "application/json", ...cors },
    });
  }

  const anonClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
  );
  const { data: { user } } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
  if (!user || user.email !== ADMIN_EMAIL) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403, headers: { "Content-Type": "application/json", ...cors },
    });
  }

  try {
    const client = new postgres.Client(Deno.env.get("SUPABASE_DB_URL")!);
    await client.connect();

    await client.queryArray(`
      ALTER TABLE public.blog_posts ADD COLUMN IF NOT EXISTS display_author text
    `);

    await client.queryArray(`
      UPDATE public.blog_posts
      SET display_author = 'Aqua Fantasy Aquapark Hotel & Spa'
      WHERE hotel_name ILIKE '%Aqua Fantasy%' AND display_author IS NULL
    `);

    await client.end();

    return new Response(JSON.stringify({ ok: true }), {
      status: 200, headers: { "Content-Type": "application/json", ...cors },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { "Content-Type": "application/json", ...cors },
    });
  }
});
