import { createServerFn } from "@tanstack/react-start";

export type AIRestaurant = {
  id: string;
  name: string;
  cuisine?: string;
  priceLevel?: "$" | "$$" | "$$$" | "$$$$";
  glutenFreeLevel: "dedicated" | "extensive" | "options" | "limited";
  glutenFreeNotes: string;
  mustTry?: string[];
  address?: string;
  neighborhood?: string;
  city: string;
  country?: string;
  phone?: string;
  website?: string;
  openingHours?: string;
  tags?: string[];
};

export type AISearchResult = {
  place: string;
  summary: string;
  results: AIRestaurant[];
};

const SYSTEM = `You are a meticulous gluten-free travel researcher for people with coeliac disease.
Return ONLY real, currently operating restaurants/cafés/bakeries in the user's city that are genuinely safe or known for gluten-free options.
PRIORITISE in this order:
1. Fully dedicated 100% gluten-free venues (no shared kitchen).
2. Venues certified by a coeliac association (AIC, AOECS, Coeliac UK, etc.).
3. Venues with a dedicated gluten-free menu and clear cross-contamination protocol.
4. Well-reviewed venues with multiple safe gluten-free options.

NEVER invent venues. If you are not confident a place exists at the given location, omit it.
Avoid generic chains (Domino's, McDonald's, etc.) UNLESS the local branch is genuinely known for safe GF.
Aim for 8-15 high-quality results. Prefer specificity over quantity.`;

const SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string", description: "1-2 sentence overview of the GF scene in this place" },
    results: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          cuisine: { type: "string" },
          priceLevel: { type: "string", enum: ["$", "$$", "$$$", "$$$$"] },
          glutenFreeLevel: { type: "string", enum: ["dedicated", "extensive", "options", "limited"] },
          glutenFreeNotes: { type: "string", description: "What's safe, certifications, cross-contamination notes" },
          mustTry: { type: "array", items: { type: "string" } },
          address: { type: "string" },
          neighborhood: { type: "string" },
          city: { type: "string" },
          country: { type: "string" },
          phone: { type: "string" },
          website: { type: "string" },
          openingHours: { type: "string" },
          tags: { type: "array", items: { type: "string" }, description: "e.g. vegan, bakery, breakfast, certified-AIC" },
        },
        required: ["name", "glutenFreeLevel", "glutenFreeNotes", "city"],
        additionalProperties: false,
      },
    },
  },
  required: ["summary", "results"],
  additionalProperties: false,
};

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

export const searchRestaurantsAI = createServerFn({ method: "GET" })
  .inputValidator((data: { place: string }) => data)
  .handler(async ({ data }): Promise<AISearchResult | null> => {
    const place = data.place.trim();
    if (!place) return null;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI gateway is not configured.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM },
          {
            role: "user",
            content: `Find the best gluten-free restaurants, cafés and bakeries in: ${place}. Include real addresses where possible.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "return_restaurants",
              description: "Return the curated list of safe gluten-free venues",
              parameters: SCHEMA,
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "return_restaurants" } },
      }),
    });

    if (res.status === 429) throw new Error("AI rate limit reached — try again in a minute.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits in Lovable Cloud → Settings → Workspace.");
    if (!res.ok) {
      const t = await res.text();
      throw new Error(`AI error: ${res.status} ${t.slice(0, 200)}`);
    }

    const json = await res.json();
    const call = json.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) throw new Error("AI returned no results.");
    let parsed: { summary: string; results: Omit<AIRestaurant, "id">[] };
    try {
      parsed = JSON.parse(call.function.arguments);
    } catch {
      throw new Error("AI returned invalid JSON.");
    }

    const seen = new Set<string>();
    const results: AIRestaurant[] = [];
    for (const r of parsed.results || []) {
      let id = `ai-${slugify(`${r.name}-${r.city || place}`)}`;
      let n = 2;
      while (seen.has(id)) id = `ai-${slugify(`${r.name}-${r.city || place}`)}-${n++}`;
      seen.add(id);
      results.push({ ...r, id });
    }

    return { place, summary: parsed.summary || "", results };
  });

export const fetchRestaurantDetailAI = createServerFn({ method: "GET" })
  .inputValidator((data: { slug: string }) => data)
  .handler(async ({ data }): Promise<AIRestaurant | null> => {
    const m = data.slug.match(/^ai-(.+)$/);
    if (!m) return null;
    let raw: string;
    try {
      const b64 = m[1].replace(/-/g, "+").replace(/_/g, "/");
      const padded = b64 + "=".repeat((4 - b64.length % 4) % 4);
      raw = decodeURIComponent(escape(atob(padded)));
    } catch { return null; }
    const [name, city, country] = raw.split("|");
    if (!name || !city) return null;

    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI gateway is not configured.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM },
          { role: "user", content: `Provide detailed information about the restaurant "${name}" in ${city}${country ? ", " + country : ""}. Include full address, opening hours, phone, website, gluten-free protocol, must-try dishes, and any certifications. Only return if the venue is real.` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "return_restaurant",
            description: "Return the venue details",
            parameters: {
              type: "object",
              properties: SCHEMA.properties.results.items.properties,
              required: ["name", "glutenFreeLevel", "glutenFreeNotes", "city"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "return_restaurant" } },
      }),
    });

    if (res.status === 429) throw new Error("AI rate limit reached — try again in a minute.");
    if (res.status === 402) throw new Error("AI credits exhausted.");
    if (!res.ok) throw new Error(`AI error: ${res.status}`);
    const json = await res.json();
    const call = json.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) return null;
    try {
      const r = JSON.parse(call.function.arguments);
      return { ...r, id: data.slug };
    } catch { return null; }
  });
