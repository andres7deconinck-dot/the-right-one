export const TRAVEL_TIPS = [
  "In Japan, always request tamari instead of regular soy sauce.",
  "In Italy, look for the 'Spiga Barrata' symbol on packaged foods.",
  "In Thailand, fish sauce is usually GF — soy sauce is not.",
  "Always call ahead to restaurants on your first visit to a new country.",
  "Download your translation cards before boarding — airport WiFi is unreliable.",
  "When in doubt, choose a dish with fewer than 5 ingredients.",
  "In France, buckwheat galettes (sarrasin) are naturally gluten-free.",
  "Always carry a GF snack bar for emergencies — especially in Asia.",
  "Hotels can often arrange GF breakfast if you ask at check-in.",
  "Most fresh fish, meat, and vegetables are naturally gluten-free worldwide.",
  "In Argentina, look for 'Sin TACC' on packaging — the government mandates GF alternatives in restaurants.",
  "In Greece, fryers are dedicated to chips only — ask and staff will confirm proudly.",
  "In Ireland, allergen information is legally required on all restaurant menus.",
  "In Portugal, ask for the 'ementa de alergénios' — nearly every restaurant has a dedicated allergen menu.",
  "In Budapest, GF lángos (fried dough) is available at dedicated spots — a celiac bucket-list snack.",
  "In Vietnam, even 'naturally GF' dishes may use wheat-containing bouillon cubes — always ask about the broth.",
  "In Spain, visit Cangas del Narcea — a village in Asturias where most residents are celiac and GF food is everywhere.",
];

export function tipOfTheDay(): string {
  const day = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  return TRAVEL_TIPS[day % TRAVEL_TIPS.length];
}
