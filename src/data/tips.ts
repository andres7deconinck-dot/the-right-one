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
];

export function tipOfTheDay(): string {
  const day = Math.floor(Date.now() / (24 * 60 * 60 * 1000));
  return TRAVEL_TIPS[day % TRAVEL_TIPS.length];
}
