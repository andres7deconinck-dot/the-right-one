// Extra navigation/header strings used outside the main Translations type.
// Keyed by the 3 supported UI languages. Other lang codes fall back to "en".

type NavExtras = {
  findSpots: string;
  spots: {
    restaurants: { label: string; desc: string };
    bars: { label: string; desc: string };
    pharmacies: { label: string; desc: string };
    shops: { label: string; desc: string };
  };
  tools: {
    cards: string;
    assistant: string;
    travelMode: string;
    trips: string;
    ingredient: string;
    emergency: string;
  };
};

const en: NavExtras = {
  findSpots: "Find Spots",
  spots: {
    restaurants: { label: "Restaurants", desc: "Gluten-free restaurants worldwide" },
    bars: { label: "Bars", desc: "Safe drinks & bar options" },
    pharmacies: { label: "Pharmacies", desc: "Pharmacies & medical help" },
    shops: { label: "Shops", desc: "Gluten-free supermarkets & shops" },
  },
  tools: {
    cards: "Medical-grade allergy cards in multiple languages",
    assistant: "Ask anything about traveling gluten-free",
    travelMode: "Fullscreen card to show restaurant staff",
    trips: "Plan trips, save restaurants, download travel packs",
    ingredient: "Scan & analyze ingredients for hidden gluten",
    emergency: "Critical phrases per country & language",
  },
};

const nl: NavExtras = {
  findSpots: "Vind plekken",
  spots: {
    restaurants: { label: "Restaurants", desc: "Glutenvrije restaurants wereldwijd" },
    bars: { label: "Bars", desc: "Veilige drankjes & bar-opties" },
    pharmacies: { label: "Apotheken", desc: "Apotheken & medische hulp" },
    shops: { label: "Winkels", desc: "Glutenvrije supermarkten & winkels" },
  },
  tools: {
    cards: "Medische allergiekaarten in meerdere talen",
    assistant: "Vraag alles over glutenvrij reizen",
    travelMode: "Volledig scherm om aan het personeel te tonen",
    trips: "Plan reizen, bewaar restaurants, download reispakketten",
    ingredient: "Scan & analyseer ingrediënten op verborgen gluten",
    emergency: "Kritieke frases per land & taal",
  },
};

const fr: NavExtras = {
  findSpots: "Trouver des lieux",
  spots: {
    restaurants: { label: "Restaurants", desc: "Restaurants sans gluten dans le monde" },
    bars: { label: "Bars", desc: "Boissons sûres et options bar" },
    pharmacies: { label: "Pharmacies", desc: "Pharmacies & aide médicale" },
    shops: { label: "Magasins", desc: "Supermarchés & magasins sans gluten" },
  },
  tools: {
    cards: "Cartes d'allergie médicales en plusieurs langues",
    assistant: "Posez toutes vos questions sur le voyage sans gluten",
    travelMode: "Carte plein écran à montrer au personnel",
    trips: "Planifiez vos voyages, sauvegardez restaurants, packs hors ligne",
    ingredient: "Scannez & analysez les ingrédients pour le gluten caché",
    emergency: "Phrases critiques par pays et langue",
  },
};

export function getNavExtras(lang: string): NavExtras {
  if (lang === "nl") return nl;
  if (lang === "fr") return fr;
  return en;
}
