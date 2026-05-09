// AI translation card generator using Lovable AI Gateway
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": Deno.env.get("APP_ORIGIN") ?? "http://localhost:5173",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { language, languageLabel, severity, context } = await req.json();
    const auth = req.headers.get("Authorization");
    if (!auth) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: auth } },
    });

    const { data: userData } = await supabase.auth.getUser();
    const userId = userData.user?.id;
    if (!userId) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    if (!language || !languageLabel || !severity) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (typeof context === "string" && context.length > 500) {
      return new Response(JSON.stringify({ error: "Context too long" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const windowStart = new Date(Date.now() - 60_000).toISOString();
    const { count } = await supabase
      .from("ai_request_logs")
      .select("*", { head: true, count: "exact" })
      .eq("user_id", userId)
      .eq("endpoint", "generate-card")
      .gte("created_at", windowStart);
    if ((count ?? 0) >= 10) {
      return new Response(JSON.stringify({ error: "Rate limit reached, try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    await supabase.from("ai_request_logs").insert({ user_id: userId, endpoint: "generate-card" });

    const { data: quotaRows, error: quotaError } = await supabase.rpc("consume_card_quota", { p_user_id: userId });
    if (quotaError) throw quotaError;
    const quota = quotaRows?.[0];
    if (!quota || quota.remaining < 0 || (quota.plan === "free" && quota.used > 3)) {
      return new Response(JSON.stringify({ error: "quota_exceeded", message: "You've reached your monthly card limit. Upgrade for unlimited cards." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const sysPrompt = `You write extremely accurate gluten-allergy translation cards for ${severity === "intolerant" ? "people with severe gluten intolerance" : "people with celiac disease"}. Output a single calm, polite, restaurant-ready note in ${languageLabel} (${language}). Rules: include a clear medical statement, mention cross-contamination risk, ask for separate preparation, mention that even a small amount makes the person sick, and end with thank you. Use natural ${languageLabel} the way a native restaurant guest would write it. NO English. NO explanations. Just the message text. Keep under 380 characters.`;
    const userPrompt = context?.trim() ? `Additional context to incorporate: ${context}` : "Write the card.";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);
    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: sysPrompt }, { role: "user", content: userPrompt }],
      }),
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (aiRes.status === 429) return new Response(JSON.stringify({ error: "Rate limit reached, try again shortly." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (aiRes.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits in workspace settings." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    if (!aiRes.ok) {
      const t = await aiRes.text();
      console.error("AI error", aiRes.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const aiJson = await aiRes.json();
    const body = aiJson.choices?.[0]?.message?.content?.trim() || "";
    const title = severity === "intolerant" ? "Severe Gluten Intolerance" : "Celiac Disease — Strict Gluten-Free";

    const { data: card, error: insErr } = await supabase
      .from("translation_cards")
      .insert({ user_id: userId, language, language_label: languageLabel, title, body, severity })
      .select()
      .single();
    if (insErr) throw insErr;

    return new Response(JSON.stringify({ card, remaining: quota.remaining }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
