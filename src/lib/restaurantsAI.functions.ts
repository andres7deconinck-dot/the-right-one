import { createServerFn } from "@tanstack/react-start";

export type VenueCategory = "restaurant" | "coffeebar" | "supermarket" | "pharmacy" | "bar";

export type AIRestaurant = {
  id: string;
  venueType?: VenueCategory;
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
  confidence?: "low" | "medium" | "high";
  verificationSource?: string;
  lastVerifiedAt?: string;
  cautionNote?: string;
};

export type AISearchResult = {
  place: string;
  category: VenueCategory;
  summary: string;
  results: AIRestaurant[];
};

// ─── Category prompts ─────────────────────────────────────────────────────────

const SYSTEM_BASE = `You are a meticulous gluten-free travel researcher for people with coeliac disease.
Return ONLY real, currently operating venues in the user's city that are genuinely safe or well-known for gluten-free options.
NEVER invent venues. If you are not confident a place exists at the given location, omit it.
Aim for 10-20 high-quality results. Include a wide range across neighborhoods. Prefer specificity over quantity.`;

const SYSTEMS: Record<VenueCategory, string> = {
  restaurant: `${SYSTEM_BASE}
PRIORITISE restaurants/cafés/bakeries in this order:
1. Fully dedicated 100% gluten-free venues (no shared kitchen).
2. Venues certified by a coeliac association (AIC, AOECS, Coeliac UK, etc.).
3. Venues with a dedicated gluten-free menu and clear cross-contamination protocol.
4. Well-reviewed venues with multiple safe gluten-free options.
Avoid generic chains unless the local branch is genuinely known for safe GF.`,

  coffeebar: `${SYSTEM_BASE}
Find coffee bars, espresso bars, tea rooms and café-patisseries that serve gluten-free pastries, cakes, or snacks.
PRIORITISE:
1. Coffee bars with a dedicated GF display case or certified GF bakery products.
2. Venues where staff can identify GF items and prevent cross-contamination.
3. Spots with oat-free or dedicated preparation for celiac customers.
Note in glutenFreeNotes which items are safe and whether shared display cases are used.`,

  supermarket: `${SYSTEM_BASE}
Find supermarkets, health food stores, organic stores and specialty shops with a good gluten-free product range.
PRIORITISE:
1. Stores with a dedicated GF aisle or certified GF section.
2. Health food stores and organic shops specialising in allergen-free products.
3. Supermarkets carrying AOECS crossed-grain certified products.
4. Stores with knowledgeable staff who can help celiac customers.
In glutenFreeNotes describe what GF products are available (bread, pasta, snacks, etc.).`,

  pharmacy: `${SYSTEM_BASE}
Find pharmacies, health stores and parapharmacies that carry gluten-free dietary products or can assist celiac patients.
PRIORITISE:
1. Pharmacies with a dedicated GF supplement and food section.
2. Stores staffed by pharmacists trained in celiac disease.
3. Health stores carrying GF vitamins, dietary products, and AOECS-certified items.
4. Pharmacies that can order GF medications or advise on gluten-containing excipients in drugs.
In glutenFreeNotes describe available GF products, supplements, and staff expertise.`,

  bar: `${SYSTEM_BASE}
Find bars, pubs, craft beer bars, wine bars, cocktail lounges and taprooms that are safe for people with coeliac disease.
PRIORITISE:
1. Bars that exclusively serve certified GF beers (Estrella Damm Daura, Glutenberg, Omission, Ground Breaker, Green's).
2. Taprooms of dedicated GF breweries.
3. Wine bars and cider bars (naturally GF drinks only).
4. Cocktail bars with GF spirits lists and bartenders trained in celiac cross-contamination.
5. Pubs with at least one certified GF beer on tap (not just bottled).
In glutenFreeNotes: list which specific beers/ciders/cocktails are safe and note any cross-contamination risks (e.g. beer-based cocktails, shared bar towels, food served on bar surface).
In mustTry: list 2-4 specific safe drinks to order (e.g. "Daura Damm GF beer", "House dry cider", "Mojito with Havana Club rum").
Use the cuisine field for bar type (e.g. "Craft beer bar", "Wine bar", "Cocktail lounge", "Cider bar", "Gastropub").`,
};

const USER_PROMPTS: Record<VenueCategory, (place: string) => string> = {
  restaurant: (p) => `Find the best gluten-free restaurants, cafés and bakeries in: ${p}. Include real addresses where possible.`,
  coffeebar: (p) => `Find coffee bars and cafés in: ${p} with gluten-free pastries or snacks. Include real addresses.`,
  supermarket: (p) => `Find supermarkets and health food stores in: ${p} with a good gluten-free product selection. Include real addresses.`,
  pharmacy: (p) => `Find pharmacies and health stores in: ${p} that stock gluten-free dietary products or can advise celiac patients. Include real addresses.`,
  bar: (p) => `Find bars, pubs, craft beer taprooms, wine bars and cocktail bars in: ${p} that are safe for celiacs — with certified GF beers, ciders or cocktail menus. Include real addresses.`,
};

// ─── JSON Schema shared for all categories ────────────────────────────────────

const ITEM_SCHEMA = {
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
    tags: { type: "array", items: { type: "string" } },
    confidence: { type: "string", enum: ["low", "medium", "high"] },
    verificationSource: { type: "string" },
    lastVerifiedAt: { type: "string" },
    cautionNote: { type: "string" },
  },
  required: ["name", "glutenFreeLevel", "glutenFreeNotes", "city"],
  additionalProperties: false,
};

const SCHEMA = {
  type: "object",
  properties: {
    summary: { type: "string", description: "1-2 sentence overview of the GF scene in this place" },
    results: { type: "array", items: ITEM_SCHEMA },
  },
  required: ["summary", "results"],
  additionalProperties: false,
};

// ─── Mock data ────────────────────────────────────────────────────────────────

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

const DEV_MOCK_RESTAURANTS: AIRestaurant[] = [
  { id: "ai-demo-r1", venueType: "restaurant", name: "La Bottega Senza Glutine", cuisine: "Italian", priceLevel: "$$", glutenFreeLevel: "dedicated", glutenFreeNotes: "100% gluten-free kitchen. AIC certified. Dedicated pasta, pizza and pastries. Zero cross-contamination risk.", mustTry: ["GF lasagna", "Penne al pomodoro", "Tiramisu GF"], city: "Demo City", tags: ["dedicated", "certified-AIC", "pasta"], confidence: "high", verificationSource: "AIC certification", cautionNote: "Always confirm on arrival — this is demo data." },
  { id: "ai-demo-r2", venueType: "restaurant", name: "The Celiac Kitchen", cuisine: "Modern European", priceLevel: "$$$", glutenFreeLevel: "dedicated", glutenFreeNotes: "Fully dedicated GF restaurant. Trained staff, separate prep area, tamari available. Coeliac UK certified.", city: "Demo City", tags: ["dedicated", "certified", "dinner"], confidence: "high", verificationSource: "Coeliac UK listing", cautionNote: "Demo data — verify before visiting." },
  { id: "ai-demo-r3", venueType: "restaurant", name: "Sushi Tamari", cuisine: "Japanese", priceLevel: "$$", glutenFreeLevel: "extensive", glutenFreeNotes: "Uses tamari instead of soy sauce. No tempura on GF orders. Dedicated GF menu with 20+ items.", mustTry: ["Sashimi platter", "Tamari hand rolls", "Miso soup (GF verified)"], city: "Demo City", tags: ["japanese", "tamari", "sashimi"], confidence: "medium", cautionNote: "Demo data — always confirm tamari is used on your order." },
  { id: "ai-demo-r4", venueType: "restaurant", name: "Green Bowl Café", cuisine: "Café / Health Food", priceLevel: "$", glutenFreeLevel: "options", glutenFreeNotes: "Clearly marked GF options. Shared kitchen but staff trained in allergen protocols. Many naturally GF salads and bowls.", city: "Demo City", tags: ["cafe", "salads", "healthy"], confidence: "medium", cautionNote: "Shared kitchen — cross-contamination possible. Demo data." },
  { id: "ai-demo-r5", venueType: "restaurant", name: "Panadería Sin Gluten", cuisine: "Bakery", priceLevel: "$", glutenFreeLevel: "dedicated", glutenFreeNotes: "Dedicated GF bakery. No wheat on premises. Fresh bread, croissants and pastries baked daily. FACE certified.", mustTry: ["Pan de molde GF", "Croissant sin gluten", "Magdalenas"], city: "Demo City", tags: ["bakery", "certified-FACE", "breakfast"], confidence: "high", verificationSource: "FACE certification", cautionNote: "Demo data." },
  { id: "ai-demo-r6", venueType: "restaurant", name: "Thai Garden (GF Options)", cuisine: "Thai", priceLevel: "$$", glutenFreeLevel: "options", glutenFreeNotes: "Staff aware of gluten. Uses fish sauce on request. Shared wok — request separate pan. Pad Thai and rice dishes available GF.", city: "Demo City", tags: ["thai", "rice-dishes"], confidence: "low", cautionNote: "Shared wok risk — always request separate pan. Demo data." },
  { id: "ai-demo-r7", venueType: "restaurant", name: "Quinoa & Co.", cuisine: "Vegetarian / Vegan", priceLevel: "$", glutenFreeLevel: "extensive", glutenFreeNotes: "Fully plant-based menu with extensive GF labelling. Uses GF oats. Staff certified in allergen management. 80% of dishes are gluten-free by default.", mustTry: ["Quinoa buddha bowl", "GF wrap with hummus", "Chia pudding"], city: "Demo City", tags: ["vegan", "gf-menu", "healthy"], confidence: "high", cautionNote: "Demo data." },
  { id: "ai-demo-r8", venueType: "restaurant", name: "Grill & Go (GF Verified)", cuisine: "Steakhouse / Grill", priceLevel: "$$$", glutenFreeLevel: "extensive", glutenFreeNotes: "Grilled meats prepared without marinades containing gluten. GF burger buns available. Separate fryer for GF fries. Staff trained in celiac cross-contamination protocols.", mustTry: ["GF ribeye", "Sweet potato fries (GF fryer)", "GF chocolate lava cake"], city: "Demo City", tags: ["grill", "steak", "gf-buns"], confidence: "medium", cautionNote: "Demo data — confirm which sauces contain gluten." },
  { id: "ai-demo-r9", venueType: "restaurant", name: "Dim Sum Heaven (GF Menu)", cuisine: "Chinese / Dim Sum", priceLevel: "$$", glutenFreeLevel: "options", glutenFreeNotes: "Select GF dim sum items made with rice flour. Tamari available instead of soy sauce. Must specifically request GF preparation — shared steam baskets in standard service.", city: "Demo City", tags: ["chinese", "dim-sum", "rice-based"], confidence: "low", cautionNote: "Always explicitly request GF preparation. Shared equipment risk. Demo data." },
  { id: "ai-demo-r10", venueType: "restaurant", name: "Boulangerie Sans Blé", cuisine: "French Bakery", priceLevel: "$", glutenFreeLevel: "dedicated", glutenFreeNotes: "100% gluten-free French bakery. No wheat on premises. Baguettes, croissants, tarts, and quiches all GF. AFDIAG member. Popular with local celiac association.", mustTry: ["GF baguette", "Chocolate eclair GF", "Quiche Lorraine GF"], city: "Demo City", tags: ["bakery", "dedicated", "french", "AFDIAG"], confidence: "high", verificationSource: "AFDIAG listing", cautionNote: "Demo data." },
];

const DEV_MOCK_COFFEEBARS: AIRestaurant[] = [
  { id: "ai-demo-c1", venueType: "coffeebar", name: "Koffle — 100% GF Coffee Bar", cuisine: "Coffee bar", priceLevel: "$", glutenFreeLevel: "dedicated", glutenFreeNotes: "Fully gluten-free bakery concept. All pastries, muffins and cakes are GF. Separate display case, no shared tongs. Popular with local celiac community.", mustTry: ["GF banana muffin", "Almond croissant", "Brownie GF"], city: "Demo City", tags: ["dedicated", "bakery", "coffee", "vegan-options"], confidence: "high", cautionNote: "Demo data." },
  { id: "ai-demo-c2", venueType: "coffeebar", name: "The Green Mug", cuisine: "Coffee & Tea", priceLevel: "$", glutenFreeLevel: "extensive", glutenFreeNotes: "Dedicated GF display shelf with labelled items. Staff rotate tongs per section. GF syrups and oat-free milk available. Baristas trained in allergens.", city: "Demo City", tags: ["coffee", "gf-display", "oat-free"], confidence: "high", cautionNote: "Demo data." },
  { id: "ai-demo-c3", venueType: "coffeebar", name: "Espresso Republique", cuisine: "Espresso bar", priceLevel: "$", glutenFreeLevel: "options", glutenFreeNotes: "2 certified GF options (cookie, protein bar) in sealed packaging. Drinks are naturally GF. Ask staff to use clean equipment for milk frothing.", city: "Demo City", tags: ["coffee", "espresso", "sealed-gf"], confidence: "medium", cautionNote: "Limited GF food options. Demo data." },
  { id: "ai-demo-c4", venueType: "coffeebar", name: "Café Céréale-Free", cuisine: "Brunch café", priceLevel: "$$", glutenFreeLevel: "extensive", glutenFreeNotes: "Brunch café with an extensive GF menu: rice cakes, GF toast, egg dishes, smoothie bowls. Clear menu labelling. Popular with gluten-sensitive community.", mustTry: ["GF avocado toast", "Acai bowl", "GF granola"], city: "Demo City", tags: ["brunch", "coffee", "gf-menu", "healthy"], confidence: "high", cautionNote: "Demo data." },
  { id: "ai-demo-c5", venueType: "coffeebar", name: "Matcha & More", cuisine: "Tea bar / Café", priceLevel: "$", glutenFreeLevel: "dedicated", glutenFreeNotes: "Speciality matcha and tea bar. All food items are GF — rice-based snacks, mochi and GF cakes. No shared equipment with gluten-containing products.", mustTry: ["Matcha latte", "GF mochi", "Rice snack box"], city: "Demo City", tags: ["matcha", "tea", "dedicated", "japanese-inspired"], confidence: "high", cautionNote: "Demo data." },
  { id: "ai-demo-c6", venueType: "coffeebar", name: "Pâtisserie Libre", cuisine: "French patisserie", priceLevel: "$$", glutenFreeLevel: "extensive", glutenFreeNotes: "Half the patisserie menu is GF, clearly labelled. Separate utensils and prep area for GF items. Allergen chart available at counter.", mustTry: ["GF tarte tatin", "Macaron (GF)", "GF financier"], city: "Demo City", tags: ["patisserie", "french", "gf-pastries"], confidence: "medium", cautionNote: "Shared bakery space — confirm GF item identity before purchase. Demo data." },
  { id: "ai-demo-c7", venueType: "coffeebar", name: "Raw & Roasted", cuisine: "Specialty coffee", priceLevel: "$", glutenFreeLevel: "options", glutenFreeNotes: "Third-wave specialty coffee shop. Naturally GF cold brew and single-origin pour-overs. A few GF snack items (nuts, chocolate). No GF pastries — food is minimal.", city: "Demo City", tags: ["specialty-coffee", "cold-brew", "minimal-food"], confidence: "medium", cautionNote: "Very limited GF food. Demo data." },
  { id: "ai-demo-c8", venueType: "coffeebar", name: "The Free Cup", cuisine: "Allergen-free café", priceLevel: "$$", glutenFreeLevel: "dedicated", glutenFreeNotes: "Dedicated allergen-free café. 100% gluten-free, nut-free and dairy-free options available. Run by a family with celiac disease. Full allergen matrix available for every item.", mustTry: ["GF carrot cake", "Oat-free GF cookie", "Allergen-free latte"], city: "Demo City", tags: ["allergen-free", "dedicated", "family-run"], confidence: "high", verificationSource: "Local celiac association listing", cautionNote: "Demo data." },
];

const DEV_MOCK_SUPERMARKETS: AIRestaurant[] = [
  { id: "ai-demo-s1", venueType: "supermarket", name: "BioBazaar Health Store", cuisine: "Health food store", priceLevel: "$", glutenFreeLevel: "dedicated", glutenFreeNotes: "Specialist health food store with a 30m² dedicated GF section. AOECS crossed-grain certified products. Staff trained in celiac dietary needs. GF bread, pasta, flours, snacks and baking mixes.", city: "Demo City", tags: ["health-store", "AOECS-certified", "organic", "gf-aisle"], confidence: "high", cautionNote: "Demo data." },
  { id: "ai-demo-s2", venueType: "supermarket", name: "FreeFrom Supermarket", cuisine: "Supermarket", priceLevel: "$", glutenFreeLevel: "extensive", glutenFreeNotes: "Own-brand 'Free From' range clearly labelled. Dedicated GF shelf in bread and pasta aisles. Staff can access allergen info for all own-brand products.", city: "Demo City", tags: ["supermarket", "free-from", "own-brand"], confidence: "medium", cautionNote: "Demo data — GF range varies by branch." },
  { id: "ai-demo-s3", venueType: "supermarket", name: "City Market (GF Aisle)", cuisine: "Supermarket", priceLevel: "$$", glutenFreeLevel: "extensive", glutenFreeNotes: "Large GF range including Schär, Glutino, and own-brand Bio items. Products grouped by allergen in dedicated aisle. QR allergen scanner available in-store.", city: "Demo City", tags: ["supermarket", "schar", "bio-range"], confidence: "medium", cautionNote: "Demo data." },
  { id: "ai-demo-s4", venueType: "supermarket", name: "Organic World", cuisine: "Organic & specialty", priceLevel: "$$", glutenFreeLevel: "dedicated", glutenFreeNotes: "Curated organic store specialising in free-from products. Over 200 certified GF items. Staff knowledgeable in celiac requirements. Also carries GF oats (certified purity protocol).", city: "Demo City", tags: ["organic", "gf-specialist", "certified-oats", "vegan"], confidence: "high", cautionNote: "Demo data." },
  { id: "ai-demo-s5", venueType: "supermarket", name: "Nature's Basket", cuisine: "Natural foods store", priceLevel: "$$", glutenFreeLevel: "extensive", glutenFreeNotes: "Natural foods supermarket with excellent GF selection. Dedicated allergen-free zone. Staff can access product ingredient lists digitally. GF bread baked on-site in dedicated oven.", city: "Demo City", tags: ["natural-foods", "gf-bakery", "allergen-zone"], confidence: "high", cautionNote: "Demo data." },
  { id: "ai-demo-s6", venueType: "supermarket", name: "Whole & Free Market", cuisine: "Health & specialty", priceLevel: "$$$", glutenFreeLevel: "dedicated", glutenFreeNotes: "Premium health food market. Extensive GF section with imported and local certified GF brands. Staff trained in celiac disease. Full traceability info available for all own-brand items.", city: "Demo City", tags: ["premium", "imported-gf", "certified", "full-range"], confidence: "high", cautionNote: "Demo data." },
  { id: "ai-demo-s7", venueType: "supermarket", name: "Asian Grocery (GF Staples)", cuisine: "Asian grocery", priceLevel: "$", glutenFreeLevel: "options", glutenFreeNotes: "Asian specialty grocery with excellent naturally GF staples: rice noodles, rice flour, mochi, tamari, miso (GF variety). Staff may not speak English — bring translation card.", city: "Demo City", tags: ["asian", "rice-noodles", "tamari", "naturally-gf"], confidence: "medium", cautionNote: "Check labels for wheat starch in Asian products. Demo data." },
  { id: "ai-demo-s8", venueType: "supermarket", name: "The Celiac Shop (Online + Collection)", cuisine: "Specialty GF store", priceLevel: "$$", glutenFreeLevel: "dedicated", glutenFreeNotes: "Dedicated GF-only store. 100% gluten-free environment. Wide range of hard-to-find GF products. Click-and-collect available. All products AOECS crossed-grain certified.", city: "Demo City", tags: ["gf-only", "AOECS", "click-collect", "specialist"], confidence: "high", verificationSource: "AOECS member store", cautionNote: "Demo data." },
];

const DEV_MOCK_BARS: AIRestaurant[] = [
  { id: "ai-demo-b1", venueType: "bar", name: "The Gluten-Free Taproom", cuisine: "Craft beer bar", priceLevel: "$$", glutenFreeLevel: "dedicated", glutenFreeNotes: "100% gluten-free taproom. All beers brewed in dedicated GF brewery. No wheat, barley or rye on premises. Glutenberg, Ground Breaker, and Green's beers on tap. GF snacks available.", mustTry: ["Glutenberg IPA (GF certified)", "Green's Discovery amber ale", "House GF cider on tap"], city: "Demo City", tags: ["craft-beer", "dedicated", "taproom", "gf-brewery"], confidence: "high", cautionNote: "Demo data — verify before visiting." },
  { id: "ai-demo-b2", venueType: "bar", name: "Daura Tapas Bar", cuisine: "Spanish tapas bar", priceLevel: "$$", glutenFreeLevel: "extensive", glutenFreeNotes: "Specialises in Estrella Damm Daura (certified GF beer, <3 ppm gluten). Full GF tapas menu from dedicated kitchen. Bar surfaces cleaned hourly. Staff trained in celiac cross-contamination. Ask to confirm Daura tap on arrival.", mustTry: ["Estrella Daura GF draught", "GF sangria (house wine)", "Patatas bravas from GF kitchen"], city: "Demo City", tags: ["daura", "tapas", "gf-draught", "certified-beer"], confidence: "high", cautionNote: "Demo data." },
  { id: "ai-demo-b3", venueType: "bar", name: "Vino & Co. Wine Bar", cuisine: "Wine bar", priceLevel: "$$$", glutenFreeLevel: "dedicated", glutenFreeNotes: "Wine-only bar — all wines, spirits and liqueurs are naturally GF. GF cheese boards and charcuterie prepared in dedicated kitchen. No beer served on premises. All staff allergen trained.", mustTry: ["Natural biodynamic wine selection", "House GF charcuterie board", "Certified GF Champagne"], city: "Demo City", tags: ["wine", "dedicated", "natural-wine", "charcuterie"], confidence: "high", cautionNote: "Demo data." },
  { id: "ai-demo-b4", venueType: "bar", name: "The Cider House", cuisine: "Cider bar", priceLevel: "$", glutenFreeLevel: "dedicated", glutenFreeNotes: "Dedicated cider bar — all products naturally gluten-free by nature. 15+ artisan ciders on tap from small producers. No beer or wheat-based drinks served. Staff knowledgeable in celiac requirements. Clean dedicated bar surfaces.", mustTry: ["Dry farmhouse cider (house)", "Pear cider (poire)", "Sparkling rosé cider"], city: "Demo City", tags: ["cider", "dedicated", "artisan", "naturally-gf"], confidence: "high", cautionNote: "Demo data." },
  { id: "ai-demo-b5", venueType: "bar", name: "Alchemy Cocktail Lounge", cuisine: "Cocktail lounge", priceLevel: "$$$", glutenFreeLevel: "extensive", glutenFreeNotes: "Craft cocktail bar with dedicated GF cocktail menu (flagged on menu). All spirits used are naturally GF (rum, tequila, vodka, gin, whisky*). No beer-based cocktails served. Bartenders trained in allergen awareness. *Some whisky may be flagged — ask bartender.", mustTry: ["GF Mojito (Havana Club rum)", "Margarita (100% agave tequila)", "GF Bloody Mary (tamari not soy sauce)"], city: "Demo City", tags: ["cocktails", "craft", "gf-menu", "dedicated-cocktails"], confidence: "medium", cautionNote: "Demo data — ask bartender about shared tools." },
  { id: "ai-demo-b6", venueType: "bar", name: "The Local Pub (GF tap)", cuisine: "Traditional pub", priceLevel: "$", glutenFreeLevel: "options", glutenFreeNotes: "Standard pub with 1 dedicated GF beer tap (Daura Damm, <3 ppm certified) and Rekorderlig cider on draught. Regular bar surfaces — shared with food. Staff aware of celiac disease but kitchen is NOT GF safe. Stick to drinks only and avoid bar snacks.", mustTry: ["Daura Damm GF draught", "Rekorderlig cider draught", "House gin & tonic (GF spirit)"], city: "Demo City", tags: ["pub", "gf-tap", "cider", "regular-pub"], confidence: "medium", cautionNote: "Shared bar — food NOT safe for celiacs. Drinks only. Demo data." },
];

const DEV_MOCK_PHARMACIES: AIRestaurant[] = [
  { id: "ai-demo-p1", venueType: "pharmacy", name: "Apotheek BioFarm", cuisine: "Pharmacy", priceLevel: "$", glutenFreeLevel: "extensive", glutenFreeNotes: "Dedicated GF dietary section with supplements, GF vitamins and enzymatic aids (DPPIV). Pharmacist trained in celiac disease. Can advise on gluten-containing excipients in medications and order alternatives.", city: "Demo City", tags: ["pharmacy", "celiac-trained", "supplements", "gf-vitamins"], confidence: "high", cautionNote: "Demo data." },
  { id: "ai-demo-p2", venueType: "pharmacy", name: "Pharmacie du Cœliaque", cuisine: "Pharmacy", priceLevel: "$", glutenFreeLevel: "dedicated", glutenFreeNotes: "Specialist celiac-focused pharmacy. Stocks GF bread, pasta, snacks from AOECS-certified brands. Provides free medication gluten-content check service. Pharmacist speaks French and Dutch.", city: "Demo City", tags: ["pharmacy", "AOECS", "gf-food", "medication-check"], confidence: "high", verificationSource: "Belgian Celiac Association listing", cautionNote: "Demo data." },
  { id: "ai-demo-p3", venueType: "pharmacy", name: "Health Hub Pharmacy", cuisine: "Health store / Pharmacy", priceLevel: "$", glutenFreeLevel: "options", glutenFreeNotes: "Large parapharmacy with a health food corner including GF snacks, protein bars and supplements. Basic allergen advice available. Can order specific GF medications on request.", city: "Demo City", tags: ["parapharmacy", "health-food", "supplements"], confidence: "medium", cautionNote: "Demo data — limited GF food selection." },
  { id: "ai-demo-p4", venueType: "pharmacy", name: "VitalPharm Celiac Centre", cuisine: "Pharmacy", priceLevel: "$", glutenFreeLevel: "dedicated", glutenFreeNotes: "Pharmacy with a dedicated celiac disease support counter. Full range of GF vitamins (B12, D3, iron), digestive enzymes, and DPPIV supplements. Pharmacist certified in celiac nutrition counselling.", city: "Demo City", tags: ["pharmacy", "celiac-support", "nutrition-counselling", "dppiv"], confidence: "high", cautionNote: "Demo data." },
  { id: "ai-demo-p5", venueType: "pharmacy", name: "GreenLife Compounding Pharmacy", cuisine: "Compounding pharmacy", priceLevel: "$$", glutenFreeLevel: "extensive", glutenFreeNotes: "Compounding pharmacy that can prepare GF formulations of common medications. All compounded products are gluten-free by default. Can verify excipients in off-the-shelf medications on request.", city: "Demo City", tags: ["compounding", "gf-medications", "prescription-gf"], confidence: "high", cautionNote: "Demo data — call ahead for compounding timeline." },
  { id: "ai-demo-p6", venueType: "pharmacy", name: "MediNatura (Natural Pharmacy)", cuisine: "Natural pharmacy", priceLevel: "$", glutenFreeLevel: "options", glutenFreeNotes: "Natural and homeopathic pharmacy with a good range of GF nutritional supplements and herbal remedies. Staff can check for gluten in supplement ingredients. Limited GF food range.", city: "Demo City", tags: ["natural-pharmacy", "supplements", "herbal"], confidence: "medium", cautionNote: "Demo data." },
];

const MOCK_BY_CATEGORY: Record<VenueCategory, AIRestaurant[]> = {
  restaurant: DEV_MOCK_RESTAURANTS,
  coffeebar: DEV_MOCK_COFFEEBARS,
  supermarket: DEV_MOCK_SUPERMARKETS,
  pharmacy: DEV_MOCK_PHARMACIES,
  bar: DEV_MOCK_BARS,
};

const DEMO_SUMMARY: Record<VenueCategory, string> = {
  restaurant: `⚠️ Demo mode — AI gateway not configured. Showing sample restaurants. Add LOVABLE_API_KEY to enable live search.`,
  coffeebar: `⚠️ Demo mode — showing sample coffee bars. Add LOVABLE_API_KEY to .env for live AI search.`,
  supermarket: `⚠️ Demo mode — showing sample supermarkets. Add LOVABLE_API_KEY to .env for live AI search.`,
  pharmacy: `⚠️ Demo mode — showing sample pharmacies. Add LOVABLE_API_KEY to .env for live AI search.`,
  bar: `⚠️ Demo mode — showing sample bars. Add LOVABLE_API_KEY to .env for live AI search.`,
};

// ─── HTTP helper ──────────────────────────────────────────────────────────────

async function aiFetchWithRetry(body: unknown): Promise<Response> {
  let lastError: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    try {
      const apiKey = process.env.LOVABLE_API_KEY;
      if (!apiKey) throw new Error("AI gateway is not configured.");
      const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeout);
      if (res.ok || res.status < 500 || attempt === 2) return res;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    } catch (error: any) {
      clearTimeout(timeout);
      lastError = error;
      if (error?.name === "AbortError") {
        lastError = new Error("Search timed out — the AI is taking too long. Please try again.");
      }
      if (attempt === 2) break;
      await new Promise((resolve) => setTimeout(resolve, 500 * (attempt + 1)));
    }
  }
  throw lastError instanceof Error ? lastError : new Error("AI request failed");
}

// ─── Internal search helper ───────────────────────────────────────────────────

async function runSearch(place: string, category: VenueCategory): Promise<AISearchResult | null> {
  if (!place) return null;

  if (!process.env.LOVABLE_API_KEY) {
    await new Promise(r => setTimeout(r, 700));
    return {
      place,
      category,
      summary: DEMO_SUMMARY[category],
      results: MOCK_BY_CATEGORY[category].map(r => ({ ...r, city: place })),
    };
  }

  const res = await aiFetchWithRetry({
    model: "google/gemini-2.5-flash",
    messages: [
      { role: "system", content: SYSTEMS[category] },
      { role: "user", content: USER_PROMPTS[category](place) },
    ],
    tools: [{
      type: "function",
      function: {
        name: "return_venues",
        description: "Return the curated list of gluten-free venues",
        parameters: SCHEMA,
      },
    }],
    tool_choice: { type: "function", function: { name: "return_venues" } },
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
    results.push({
      ...r,
      id,
      venueType: category,
      confidence: r.confidence ?? "medium",
      verificationSource: r.verificationSource ?? "AI research + public web sources",
      cautionNote: r.cautionNote ?? "Always confirm gluten-free availability on arrival.",
    });
  }

  return { place, category, summary: parsed.summary || "", results };
}

// ─── Exported server functions ────────────────────────────────────────────────

export const searchRestaurantsAI = createServerFn({ method: "GET" })
  .inputValidator((data: { place: string }) => data)
  .handler(({ data }) => runSearch(data.place.trim(), "restaurant"));

export const searchCoffeeBarsAI = createServerFn({ method: "GET" })
  .inputValidator((data: { place: string }) => data)
  .handler(({ data }) => runSearch(data.place.trim(), "coffeebar"));

export const searchSupermarketsAI = createServerFn({ method: "GET" })
  .inputValidator((data: { place: string }) => data)
  .handler(({ data }) => runSearch(data.place.trim(), "supermarket"));

export const searchPharmaciesAI = createServerFn({ method: "GET" })
  .inputValidator((data: { place: string }) => data)
  .handler(({ data }) => runSearch(data.place.trim(), "pharmacy"));

export const searchBarsAI = createServerFn({ method: "GET" })
  .inputValidator((data: { place: string }) => data)
  .handler(({ data }) => runSearch(data.place.trim(), "bar"));

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

    if (!process.env.LOVABLE_API_KEY) {
      await new Promise(r => setTimeout(r, 600));
      // Return a rich mock detail from demo data if found
      const allMock = [...DEV_MOCK_RESTAURANTS, ...DEV_MOCK_COFFEEBARS, ...DEV_MOCK_SUPERMARKETS, ...DEV_MOCK_PHARMACIES];
      const found = allMock.find(r => r.name === name);
      if (found) return { ...found, city, country: country || found.country, id: data.slug };
      return { id: data.slug, venueType: "restaurant", name, city, country: country || undefined, glutenFreeLevel: "options", glutenFreeNotes: "Demo mode — no details available without LOVABLE_API_KEY.", cautionNote: "This is demo data." };
    }

    const res = await aiFetchWithRetry({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: SYSTEMS.restaurant },
        { role: "user", content: `Provide detailed information about the venue "${name}" in ${city}${country ? ", " + country : ""}. Include full address, opening hours, phone, website, gluten-free protocol, must-try items, and any certifications. Only return if the venue is real.` },
      ],
      tools: [{
        type: "function",
        function: {
          name: "return_venue",
          description: "Return the venue details",
          parameters: {
            type: "object",
            properties: ITEM_SCHEMA.properties,
            required: ITEM_SCHEMA.required,
            additionalProperties: false,
          },
        },
      }],
      tool_choice: { type: "function", function: { name: "return_venue" } },
    });

    if (res.status === 429) throw new Error("AI rate limit reached — try again in a minute.");
    if (res.status === 402) throw new Error("AI credits exhausted.");
    if (!res.ok) throw new Error(`AI error: ${res.status}`);
    const json = await res.json();
    const call = json.choices?.[0]?.message?.tool_calls?.[0];
    if (!call) return null;
    try {
      const r = JSON.parse(call.function.arguments);
      return {
        ...r,
        id: data.slug,
        confidence: r.confidence ?? "medium",
        verificationSource: r.verificationSource ?? "AI research + public web sources",
        cautionNote: r.cautionNote ?? "Always confirm gluten-free availability on arrival.",
      };
    } catch { return null; }
  });
