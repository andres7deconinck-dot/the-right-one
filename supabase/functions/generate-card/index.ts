// AI translation card generator using Lovable AI Gateway
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLAN_LIMITS: Record<string, number> = { free: 3, traveler: 10000, family: 10000 };

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

    // Quota check
    const { data: profile } = await supabase.from("profiles").select("plan, cards_used_this_month").eq("id", userId).single();
    const plan = profile?.plan || "free";
    const used = profile?.cards_used_this_month || 0;
    if (used >= (PLAN_LIMITS[plan] ?? 3)) {
      return new Response(JSON.stringify({ error: "quota_exceeded", message: "You've reached your monthly card limit. Upgrade for unlimited cards." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const sysPrompt = `You write extremely accurate gluten-allergy translation cards for ${severity === "intolerant" ? "people with severe gluten intolerance" : "people with celiac disease"}. Output a single calm, polite, restaurant-ready note in ${languageLabel} (${language}). Rules: include a clear medical statement, mention cross-contamination risk, ask for separate preparation, mention that even a small amount makes the person sick, and end with thank you. Use natural ${languageLabel} the way a native restaurant guest would write it. NO English. NO explanations. Just the message text. Keep under 380 characters.`;
    const userPrompt = context?.trim() ? `Additional context to incorporate: ${context}` : "Write the card.";

    const aiRes = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${Deno.env.get("LOVABLE_API_KEY")}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [{ role: "system", content: sysPrompt }, { role: "user", content: userPrompt }],
      }),
    });

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

    await supabase.from("profiles").update({ cards_used_this_month: used + 1 }).eq("id", userId);

    return new Response(JSON.stringify({ card, remaining: Math.max(0, (PLAN_LIMITS[plan] ?? 3) - used - 1) }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
