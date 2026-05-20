// Run: node scripts/seed-blog-posts.mjs
// Requires SUPABASE_SERVICE_ROLE_KEY in environment

import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://efqiowtyxmdbzehfsion.supabase.co";
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const AUTHOR_EMAIL = "info.neurixx@gmail.com";

if (!SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY environment variable.");
  console.error("Run: $env:SUPABASE_SERVICE_ROLE_KEY='your-key-here'; node scripts/seed-blog-posts.mjs");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").slice(0, 80);

const readingMinutes = (content) =>
  Math.max(1, Math.round(content.split(/\s+/).length / 220));

const posts = [
  {
    title: "The 5 Most Celiac-Friendly Cities in Europe (2025 Guide)",
    excerpt: "Traveling with celiac disease in Europe is easier than ever — but not all cities are equal. These five destinations consistently come up as the safest, most enjoyable places to eat gluten-free.",
    country_code: "EU",
    country_name: "Europe",
    tags: ["travel", "europe", "cities", "restaurants"],
    is_featured: true,
    content: `Traveling with celiac disease in Europe is easier than ever — but not all cities are equal. These five destinations consistently come up in the celiac community as the safest, most enjoyable places to eat gluten-free.

## 1. Rome, Italy

Rome is arguably the celiac capital of the world. The Italian Celiac Association (AIC) certifies thousands of restaurants, and the GF scene is extraordinary.

**Don't miss:**
- **Mama Eat** — AIC-certified, dual kitchen, near Campo de' Fiori. The gold standard for safe Italian food.
- **Pandali bakery** — steps from the Pantheon, 100% gluten-free. Everything in the display case is safe.
- **Celiachiamo Lab** — a fully GF supermarket and bakery with hot food to go. Incredible range, great value.

Even pharmacies in Rome sell certified GF bread and pasta. The AIC sticker on restaurant windows (not handmade signs) is your signal that the kitchen has been independently verified.

## 2. Lisbon, Portugal

Every restaurant in Portugal keeps a dedicated allergen menu (ementa de alergénios) by law. Lisbon's fish-and-rice-heavy cuisine is naturally celiac-friendly, and staff genuinely understand cross-contamination — no need to over-explain.

The grilled fish, arroz dishes, and piri-piri chicken are naturally GF. Continente and Pingo Doce supermarkets have excellent free-from ranges. Lisbon is a hidden gem that deserves far more attention in the celiac travel community.

## 3. Dublin, Ireland

Allergen menus are legally required in every Irish restaurant. GF fish and chips are a staple — even in rural pubs. In Dublin, the Ranelagh and Rathmines neighbourhoods have the highest concentration of celiac-friendly spots.

A full Irish breakfast (GF sausages, black and white pudding, eggs, rashers) is entirely achievable if you ask about the sausages. The Coeliac Society of Ireland app lists verified venues across the whole country.

## 4. Barcelona, Spain

Barcelona's GF scene has grown significantly. **Gula Sana** offers dedicated GF tapas with a separate kitchen; **Copasetic** is a celiac-safe brunch favourite in Eixample. The Gràcia neighbourhood has the highest density of GF-aware restaurants in the city.

Mercadona supermarket has what many celiacs consider the best GF supermarket aisle in Europe — stocked with the FACE-certified Adpan range and their own sin gluten products.

## 5. Buenos Aires, Argentina

Surprising but true: Argentina is one of the world's safest destinations for celiacs. The government legally mandates restaurants to offer GF bread alternatives — it's your right by law. The **Sin TACC** certification logo (sin trigo, avena, cebada, centeno) is on packaged products everywhere, including in shops inside remote national parks in Patagonia.

In Buenos Aires, the Palermo and Recoleta neighbourhoods have the highest density of ACA-certified restaurants. The GF dining scene rivals Italy for variety and safety — and Buenos Aires is significantly cheaper.

---

*Use the GlutenGo country guides for detailed safe/avoid lists, emergency phrases, and certified restaurant finders for all five destinations.*`,
  },
  {
    title: "How to Travel Gluten-Free in Japan: A Celiac's Complete Guide",
    excerpt: "Japan is one of the most challenging but rewarding destinations for celiac travelers. Standard soy sauce contains wheat, awareness is low — but with the right preparation, a safe trip is absolutely possible.",
    country_code: "JP",
    country_name: "Japan",
    city: "Tokyo",
    tags: ["japan", "asia", "soy sauce", "translation card", "tips"],
    is_featured: true,
    content: `Japan is one of the most challenging but rewarding destinations for celiac travelers. Standard soy sauce contains wheat, cross-contamination awareness is limited — but with the right preparation, a safe and incredible trip is absolutely possible.

## The Main Risk: Soy Sauce is Everywhere

Standard Japanese soy sauce (醤油 — shoyu) contains wheat. It is in almost everything: teriyaki, ramen broth, dipping sauces, marinades, and many restaurant salad dressings. This is the single biggest risk for celiacs in Japan.

**Always carry tamari packets.** Kikkoman Tamari is widely available and clearly labeled gluten-free. Present your packets at restaurants before ordering.

## What's Safe to Eat

- **Sashimi** — raw fish is naturally GF. Use tamari you bring yourself instead of the house soy sauce.
- **Yakitori (shio)** — grilled skewers with salt only. Ask specifically for "shio" (salt), not "tare" (sauce).
- **Plain rice and onigiri** — check konbini (convenience store) labels for 麦 or 小麦 (wheat).
- **Edamame** — always safe.
- **100% buckwheat soba (十割そば)** — very rare and must be confirmed explicitly. Most soba contains wheat.
- **Plain tofu dishes** — generally safe, confirm no soy sauce is added.

## What to Avoid

- **Regular soy sauce (醤油)** — contains wheat, used in almost everything
- **Tempura** — wheat batter
- **Ramen and udon** — wheat noodles
- **Miso soup** — often contains wheat
- **Teriyaki sauce** — soy sauce based
- **Imitation crab (surimi)** — often contains wheat starch

## Practical Tips for Japan

**1. Get a Japanese celiac translation card before you leave.**
A written card in Japanese is far more effective than trying to explain verbally. Kitchen staff often cannot understand English spoken under pressure. GlutenGo's Japanese translation card includes cross-contamination wording and is phonetically guided.

**2. Research restaurants in advance.**
Tokyo (especially Shibuya, Shinjuku, and Ginza) and Osaka have English-speaking GF-aware restaurants. Research before you go — don't rely on finding somewhere safe on arrival.

**3. Use konbini carefully.**
Convenience store onigiri is generally safe — look for 麦/小麦 (wheat) on the label. Plain rice onigiri with salmon or tuna fillings are usually safe.

**4. The Japan Sprue Association (JSA)** maintains a small list of certified venues. Their resources are limited compared to European associations, so personal research is essential.

**5. Carry backup food.**
Non-perishable GF snacks are essential for Japan. There will be situations — long train journeys, rural areas, late nights — where no safe option is available. Being prepared prevents hunger-driven risk-taking.

Japan rewards careful preparation with some of the most extraordinary food experiences available anywhere in the world. With the right tools, it is absolutely manageable.`,
  },
  {
    title: "10 Things Nobody Tells You About Traveling with Celiac Disease",
    excerpt: "From Italy being safer than you think to Vietnam being riskier than it looks — the honest, experience-based truths about traveling with celiac disease that guidebooks don't cover.",
    tags: ["tips", "travel", "celiac", "beginners", "cross-contamination"],
    is_featured: false,
    content: `After years of traveling with celiac disease, the celiac community has accumulated hard-won knowledge that doesn't make it into most travel guides. Here are ten things that actually matter.

## 1. "Gluten-free" on a menu doesn't mean celiac-safe

This is the most important thing to know. Many restaurants offer GF options that are prepared on the same surfaces, with the same utensils, or in the same fryer oil as wheat-containing dishes. Always ask specifically about **cross-contamination** — not just ingredients. The phrase "we use separate utensils and a clean surface" is what you need to hear.

## 2. Italy is safer than you think

The stereotype that Italian food is dangerous for celiacs is outdated. Italy has the highest celiac awareness of any country in the world. The AIC (Italian Celiac Association) certifies thousands of restaurants. Waiters understand "senza glutine" better than almost anywhere else. Rome alone has over 60 dedicated GF venues. If you've avoided Italy — go.

## 3. Vietnam is riskier than it looks

Traditional Vietnamese food seems naturally safe: rice noodles, fish sauce, fresh herbs. But **Knorr bouillon cubes containing wheat** are routinely added to broths — including in pho, which should theoretically be naturally GF. Soy sauce and oyster sauce appear in dishes where you wouldn't expect them. Vigilance is needed even for dishes that should be safe.

## 4. Argentina is a hidden gem

The Argentine government officially recognises celiac disease as a disability. Restaurants are **legally required** to offer GF bread alternatives. The Sin TACC certification logo (sin trigo, avena, cebada, centeno) appears on packaged products everywhere — more commonly than GF labels in most of Europe. Buenos Aires rivals Italy for the quality of the GF dining scene.

## 5. France is improving — but only in cities

Paris has excellent dedicated GF bakeries (Helmut Newcake, NoGlu) and a growing certified restaurant scene. Outside major cities, awareness drops significantly. In rural France, carrying your own food is not optional — it is essential.

## 6. "May contain traces" warnings are not standardised

In the EU, precautionary allergen labels like "may contain traces of wheat" are **voluntary and unregulated**. There is no legal requirement for when they must be used. In Australia, "gluten-free" legally means under 3ppm — stricter than the EU's 20ppm standard. Knowing the local standards matters.

## 7. Airports are dangerous territory

Shared surfaces, time pressure, limited options, and staff with no specialist training. Always eat a proper meal before you fly, or carry your own food. Do not rely on airport restaurants even if they claim GF options. This is where many celiacs get caught out.

## 8. Rural areas can surprise you positively

Scotland's rural pubs regularly serve GF fish and chips, often flagged with a labeled toothpick. Ireland's remote villages frequently carry GF bread. Sweden has GF options in even tiny villages. Don't assume rural automatically means unsafe — research first, and you'll often be surprised.

## 9. Written translation cards beat spoken requests every time

Even a few words in the local language helps. But a written celiac translation card in the local language — covering ingredients, cross-contamination, and kitchen preparation — is significantly more effective than speaking. Kitchen staff often cannot process spoken English requests accurately under service pressure.

## 10. The right apps change everything

GlutenGo (country guides, translation cards, emergency phrases), the AIC app (Italy), the Coeliac UK app, the Australian Coeliac app, and the Canadian Celiac Association app all list certified venues that have been specifically vetted for celiac safety — not just "gluten sensitivity." These apps reduce anxiety and replace guesswork with verified information.

---

*The celiac travel community is large and generous with information. If you travel somewhere new, share what you learn — the next traveler will benefit.*`,
  },
];

async function main() {
  // Get author's user ID by email
  const { data: { users }, error: userError } = await supabase.auth.admin.listUsers();
  if (userError) { console.error("Error fetching users:", userError.message); process.exit(1); }

  const author = users.find((u) => u.email === AUTHOR_EMAIL);
  if (!author) { console.error(`User ${AUTHOR_EMAIL} not found.`); process.exit(1); }

  console.log(`Found author: ${author.email} (${author.id})`);

  for (const post of posts) {
    let slug = slugify(post.title);
    const { data: existing } = await supabase.from("blog_posts").select("id").eq("slug", slug);
    if (existing && existing.length) {
      console.log(`Skipping "${post.title}" — already exists.`);
      continue;
    }

    const { data, error } = await supabase.from("blog_posts").insert({
      author_id: author.id,
      title: post.title,
      slug,
      excerpt: post.excerpt,
      content: post.content,
      country_code: post.country_code ?? null,
      country_name: post.country_name ?? null,
      city: post.city ?? null,
      tags: post.tags,
      is_featured: post.is_featured ?? false,
      status: "published",
      verified_by_admin: true,
      published_at: new Date().toISOString(),
      reading_minutes: readingMinutes(post.content),
    }).select("id, slug").single();

    if (error) {
      console.error(`Error inserting "${post.title}":`, error.message);
    } else {
      console.log(`✓ Published: "${post.title}" → /blog/${data.slug}`);
    }
  }

  console.log("\nDone.");
}

main().catch(console.error);
