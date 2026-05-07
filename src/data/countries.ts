export type CountryGuide = {
  slug: string;
  name: string;
  flag: string;
  hero: string; // gradient classes
  awareness: "high" | "medium" | "low";
  intro: string;
  safe: string[];
  avoid: string[];
  brands: string[];
  emergencyPhrase: { lang: string; text: string };
  tips: string[];
};

export const COUNTRIES: CountryGuide[] = [
  {
    slug: "italy",
    name: "Italy",
    flag: "🇮🇹",
    hero: "from-emerald-100 via-rose-100 to-amber-100",
    awareness: "high",
    intro: "Italy is one of the safest countries for celiacs. The AIC (Italian Celiac Association) certifies thousands of restaurants, and waiters genuinely understand 'senza glutine'.",
    safe: ["AIC-certified restaurants", "Risotto (verify broth)", "Polenta", "Grilled fish & meat", "Fresh fruit & gelato (single ingredient)"],
    avoid: ["Pasta unless senza glutine", "Pizza unless certified", "Fritters & fried items (shared oil)", "Bruschetta", "Stuffed meats (often breaded)"],
    brands: ["Schär", "Nutrifree", "Massimo Zero", "DS Gluten Free"],
    emergencyPhrase: { lang: "Italian", text: "Sono celiaco/a. Anche piccole tracce di glutine mi fanno stare male. Per favore, può preparare il mio piatto separatamente?" },
    tips: ["Look for the green AIC spike-of-wheat logo.", "Pharmacies sell certified gluten-free bread/pasta.", "Restaurants must legally serve allergens info on request."],
  },
  {
    slug: "japan",
    name: "Japan",
    flag: "🇯🇵",
    hero: "from-rose-100 via-stone-100 to-sky-100",
    awareness: "low",
    intro: "Awareness is limited and soy sauce contains wheat. Travel with translation cards and stick to naturally gluten-free traditional dishes.",
    safe: ["Sashimi (bring tamari)", "Yakitori (salt only — 'shio')", "Plain rice & onigiri (no soy)", "Mochi (check fillings)", "Shabu-shabu without sauces"],
    avoid: ["Regular soy sauce (shoyu)", "Tempura", "Ramen, udon, soba (often wheat)", "Teriyaki", "Imitation crab"],
    brands: ["Kikkoman Tamari (gluten-free)", "San-J Tamari", "Aeon GFREE line"],
    emergencyPhrase: { lang: "Japanese", text: "私はセリアック病です。小麦・大麦・ライ麦・醤油（小麦入り）は絶対に食べられません。少しでも入ると重い症状が出ます。別の調理をお願いします。" },
    tips: ["100% buckwheat soba is rare — confirm 十割そば.", "Carry tamari packets.", "Konbini onigiri is risky — read labels for 麦/小麦."],
  },
  {
    slug: "thailand",
    name: "Thailand",
    flag: "🇹🇭",
    hero: "from-amber-100 via-emerald-100 to-rose-100",
    awareness: "low",
    intro: "Thai cuisine is naturally rice-based, but soy sauce, oyster sauce, and shared woks are common. Translation cards are essential.",
    safe: ["Pad Thai (ask no soy sauce)", "Tom Yum (verify no flour)", "Som Tam (no fish sauce w/ wheat)", "Grilled meats", "Sticky rice with mango"],
    avoid: ["Soy & oyster sauce", "Spring rolls", "Satay marinade", "Fried items (shared oil)", "Som tam with cracker"],
    brands: ["Healthy Mate", "Doi Kham rice products"],
    emergencyPhrase: { lang: "Thai", text: "ฉันแพ้กลูเตน (ข้าวสาลี) อย่างรุนแรง กรุณาอย่าใส่ซีอิ๊ว ซอสหอยนางรม หรือแป้งสาลี แม้แต่นิดเดียวก็ทำให้ฉันป่วยหนัก" },
    tips: ["Ask for fish sauce ('nam pla') instead of soy.", "Street food risk: shared utensils.", "Bangkok has dedicated GF cafés — search ahead."],
  },
  {
    slug: "spain",
    name: "Spain",
    flag: "🇪🇸",
    hero: "from-amber-100 via-rose-100 to-orange-100",
    awareness: "high",
    intro: "FACE (Spanish Celiac Federation) certifies many restaurants. Tapas culture is risky (shared surfaces) but options are growing fast.",
    safe: ["Tortilla española (verify pan)", "Jamón ibérico", "Grilled fish", "Paella (some are GF — confirm)", "Patatas bravas (separate fryer needed)"],
    avoid: ["Croquetas", "Empanadas", "Fried calamari", "Migas", "Most beer (cider is safer)"],
    brands: ["Schär", "Adpan", "Mercadona Sin Gluten line", "Beiker"],
    emergencyPhrase: { lang: "Spanish", text: "Soy celíaco/a. Incluso pequeñas cantidades de gluten me hacen enfermar gravemente. ¿Pueden preparar mi plato por separado, sin contaminación cruzada?" },
    tips: ["Look for the FACE crossed-grain logo.", "Mercadona has a huge sin gluten section.", "Carrefour stocks Schär."],
  },
  {
    slug: "usa",
    name: "USA",
    flag: "🇺🇸",
    hero: "from-sky-100 via-stone-100 to-rose-100",
    awareness: "high",
    intro: "FDA labeling requires <20ppm for 'gluten-free' claims. Major chains have GF menus. Cross-contamination still varies by restaurant.",
    safe: ["Chipotle (corn tortillas, verify)", "In-N-Out protein style", "Most steakhouses", "Sushi (with tamari)", "Five Guys (dedicated fryer)"],
    avoid: ["Shared fryers (most fries)", "Diner pancake griddles", "Soy sauce (default contains wheat)", "Beer (unless labeled GF)", "Imitation seafood"],
    brands: ["Schär", "Canyon Bakehouse", "Bob's Red Mill", "Udi's", "Glutino"],
    emergencyPhrase: { lang: "English", text: "I have celiac disease. Even tiny amounts of gluten make me very sick. Please prepare my food on a clean surface with clean utensils, and avoid any shared fryers." },
    tips: ["Find Me Gluten Free app is widely used here.", "Whole Foods & Trader Joe's mark GF clearly.", "Confirm 'GF menu' = dedicated prep, not just ingredients."],
  },
];
