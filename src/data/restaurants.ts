export type RestaurantBadge = "certified" | "separate-kitchen" | "separate-fryer" | "trained-staff";
export type CrossContaminationRisk = "low" | "medium" | "high";
export type PriceTier = 1 | 2 | 3;

export type Restaurant = {
  slug: string;
  name: string;
  cuisine: string;
  city: string;
  country: string;
  countryFlag: string;
  lat: number;
  lng: number;
  gfScore: number;
  badges: RestaurantBadge[];
  crossContaminationRisk: CrossContaminationRisk;
  priceTier: PriceTier;
  rating: number;
  reviewCount: number;
  description: string;
  address: string;
  hours: { day: string; open: string }[];
  reviews: { name: string; date: string; rating: number; reaction: "none" | "mild" | "severe"; comment: string }[];
};

const standardHours = [
  { day: "Mon", open: "12:00 – 22:00" },
  { day: "Tue", open: "12:00 – 22:00" },
  { day: "Wed", open: "12:00 – 22:00" },
  { day: "Thu", open: "12:00 – 22:00" },
  { day: "Fri", open: "12:00 – 23:00" },
  { day: "Sat", open: "12:00 – 23:00" },
  { day: "Sun", open: "12:00 – 21:00" },
];

const demoReviews = (a: string, b: string, c: string): Restaurant["reviews"] => [
  { name: "Sara K.", date: "2025-09-12", rating: 5, reaction: "none", comment: a },
  { name: "Marco T.", date: "2025-07-03", rating: 4, reaction: "none", comment: b },
  { name: "Lena B.", date: "2025-05-20", rating: 5, reaction: "none", comment: c },
];

export const RESTAURANTS: Restaurant[] = [
  {
    slug: "ain-soph-journey-shinjuku", name: "Ain Soph Journey Shinjuku", cuisine: "Vegan & GF",
    city: "Tokyo", country: "Japan", countryFlag: "🇯🇵", lat: 35.6938, lng: 139.7036,
    gfScore: 95, badges: ["certified", "separate-kitchen", "trained-staff"], crossContaminationRisk: "low",
    priceTier: 2, rating: 4.7, reviewCount: 312,
    description: "Fully gluten-free vegan restaurant in Shinjuku. Beloved by celiac travelers for its dedicated kitchen and detailed allergen menus.",
    address: "3-8-9 Shinjuku, Shinjuku-ku, Tokyo",
    hours: standardHours,
    reviews: demoReviews("Truly safe — staff understood my card immediately.", "Pancakes were incredible. No reaction.", "First fully GF meal in Japan, total relief."),
  },
  {
    slug: "falafel-brothers-shibuya", name: "Falafel Brothers Shibuya", cuisine: "Mediterranean",
    city: "Tokyo", country: "Japan", countryFlag: "🇯🇵", lat: 35.6595, lng: 139.7004,
    gfScore: 82, badges: ["separate-kitchen", "trained-staff"], crossContaminationRisk: "low",
    priceTier: 1, rating: 4.5, reviewCount: 198,
    description: "Quick falafel and bowls with a clearly marked GF menu and a separate prep area.",
    address: "20-11 Sakuragaoka-cho, Shibuya, Tokyo",
    hours: standardHours,
    reviews: demoReviews("Great GF pita, no issues.", "Friendly staff, careful with cross contamination.", "Nice quick lunch in Shibuya."),
  },
  {
    slug: "ts-tantan-tokyo-station", name: "T's TanTan Tokyo Station", cuisine: "GF Ramen",
    city: "Tokyo", country: "Japan", countryFlag: "🇯🇵", lat: 35.6812, lng: 139.7671,
    gfScore: 88, badges: ["separate-kitchen"], crossContaminationRisk: "low",
    priceTier: 1, rating: 4.6, reviewCount: 421,
    description: "Vegan ramen inside Tokyo Station with a dedicated gluten-free option. Convenient before catching the shinkansen.",
    address: "1-9-1 Marunouchi, Chiyoda, Tokyo",
    hours: standardHours,
    reviews: demoReviews("GF ramen actually exists!", "Safe and tasty.", "Perfect pre-train meal."),
  },
  {
    slug: "il-sorpasso", name: "Il Sorpasso", cuisine: "Modern Italian",
    city: "Rome", country: "Italy", countryFlag: "🇮🇹", lat: 41.9032, lng: 12.4700,
    gfScore: 91, badges: ["certified", "trained-staff", "separate-fryer"], crossContaminationRisk: "low",
    priceTier: 2, rating: 4.6, reviewCount: 540,
    description: "AIC-certified Roman bistro near the Vatican. Excellent GF pasta and a lively aperitivo scene.",
    address: "Via Properzio, 31-33, 00193 Roma",
    hours: standardHours,
    reviews: demoReviews("AIC certified — felt completely safe.", "Best GF cacio e pepe ever.", "Servers spoke English and understood celiac."),
  },
  {
    slug: "quinzi-e-gabrieli", name: "Ristorante Quinzi e Gabrieli", cuisine: "Seafood",
    city: "Rome", country: "Italy", countryFlag: "🇮🇹", lat: 41.8986, lng: 12.4768,
    gfScore: 85, badges: ["trained-staff"], crossContaminationRisk: "low",
    priceTier: 3, rating: 4.4, reviewCount: 220,
    description: "Upscale seafood restaurant offering carefully prepared GF tasting menu.",
    address: "Via delle Coppelle, 5/6, 00186 Roma",
    hours: standardHours,
    reviews: demoReviews("Chef came out to confirm celiac protocol.", "Pricey but worth it.", "Fresh fish, no reaction."),
  },
  {
    slug: "pizzarium-bonci", name: "Pizzarium Bonci", cuisine: "GF Pizza",
    city: "Rome", country: "Italy", countryFlag: "🇮🇹", lat: 41.9077, lng: 12.4508,
    gfScore: 79, badges: ["trained-staff"], crossContaminationRisk: "medium",
    priceTier: 1, rating: 4.3, reviewCount: 1820,
    description: "Famous Roman pizza al taglio. Limited GF slices baked separately.",
    address: "Via della Meloria, 43, 00136 Roma",
    hours: standardHours,
    reviews: demoReviews("GF slice was good, ask carefully.", "Long lines but legit.", "Watch for cross contact at the counter."),
  },
  {
    slug: "la-pepita-brunch", name: "La Pepita Brunch", cuisine: "GF Brunch",
    city: "Barcelona", country: "Spain", countryFlag: "🇪🇸", lat: 41.3978, lng: 2.1699,
    gfScore: 93, badges: ["certified", "separate-kitchen", "trained-staff"], crossContaminationRisk: "low",
    priceTier: 2, rating: 4.7, reviewCount: 290,
    description: "FACE-certified brunch spot with a fully separate gluten-free menu and prep area.",
    address: "Carrer de Còrsega, 343, 08037 Barcelona",
    hours: standardHours,
    reviews: demoReviews("FACE certified — finally relaxed brunch.", "Pancakes and eggs benedict, all GF.", "Highly recommend."),
  },
  {
    slug: "bar-calders", name: "Bar Calders", cuisine: "Tapas",
    city: "Barcelona", country: "Spain", countryFlag: "🇪🇸", lat: 41.3784, lng: 2.1627,
    gfScore: 72, badges: ["trained-staff"], crossContaminationRisk: "medium",
    priceTier: 1, rating: 4.2, reviewCount: 410,
    description: "Casual Sant Antoni tapas spot with a handful of clearly marked GF dishes.",
    address: "Carrer del Parlament, 25, 08015 Barcelona",
    hours: standardHours,
    reviews: demoReviews("A few solid GF tapas.", "Ask for the GF menu.", "Lovely terrace."),
  },
  {
    slug: "flax-and-kale", name: "Flax & Kale", cuisine: "Healthy / GF",
    city: "Barcelona", country: "Spain", countryFlag: "🇪🇸", lat: 41.3858, lng: 2.1690,
    gfScore: 89, badges: ["separate-kitchen", "trained-staff"], crossContaminationRisk: "low",
    priceTier: 2, rating: 4.5, reviewCount: 1240,
    description: "Plant-forward restaurant where most of the menu is naturally gluten-free.",
    address: "Carrer dels Tallers, 74B, 08001 Barcelona",
    hours: standardHours,
    reviews: demoReviews("Loads of GF options.", "Fresh and creative.", "Great smoothies."),
  },
  {
    slug: "wolf-atelier", name: "Wolf Atelier", cuisine: "Fine Dining",
    city: "Amsterdam", country: "Netherlands", countryFlag: "🇳🇱", lat: 52.3759, lng: 4.8806,
    gfScore: 87, badges: ["trained-staff", "separate-fryer"], crossContaminationRisk: "low",
    priceTier: 3, rating: 4.6, reviewCount: 380,
    description: "Tasting-menu fine dining on a former bridge house with a dedicated GF tasting menu.",
    address: "Westerdoksplein 20, 1013 AZ Amsterdam",
    hours: standardHours,
    reviews: demoReviews("Custom GF tasting was stunning.", "Chef accommodated everything.", "Special occasion safe spot."),
  },
  {
    slug: "dignity-restaurant", name: "Dignity Restaurant", cuisine: "100% GF Kitchen",
    city: "Amsterdam", country: "Netherlands", countryFlag: "🇳🇱", lat: 52.3653, lng: 4.9012,
    gfScore: 98, badges: ["certified", "separate-kitchen", "separate-fryer", "trained-staff"], crossContaminationRisk: "low",
    priceTier: 2, rating: 4.8, reviewCount: 510,
    description: "Entirely gluten-free kitchen — every dish, every fryer, every surface. Celiac heaven.",
    address: "Van Baerlestraat 66H, 1071 BB Amsterdam",
    hours: standardHours,
    reviews: demoReviews("100% GF. Tears of joy.", "Eat anything on the menu safely.", "The best."),
  },
  {
    slug: "gartine", name: "Gartine", cuisine: "GF Lunch",
    city: "Amsterdam", country: "Netherlands", countryFlag: "🇳🇱", lat: 52.3716, lng: 4.8943,
    gfScore: 83, badges: ["trained-staff"], crossContaminationRisk: "low",
    priceTier: 2, rating: 4.5, reviewCount: 250,
    description: "Cozy lunch spot in the centre with marked GF sandwiches and high tea.",
    address: "Taksteeg 7, 1012 PB Amsterdam",
    hours: standardHours,
    reviews: demoReviews("GF high tea was lovely.", "Quiet and careful.", "Highly recommend the soup."),
  },
  {
    slug: "broccoli-revolution", name: "Broccoli Revolution", cuisine: "Vegan / GF",
    city: "Bangkok", country: "Thailand", countryFlag: "🇹🇭", lat: 13.7463, lng: 100.5325,
    gfScore: 90, badges: ["separate-kitchen", "trained-staff"], crossContaminationRisk: "low",
    priceTier: 2, rating: 4.6, reviewCount: 430,
    description: "Plant-based Bangkok favourite with clearly marked gluten-free dishes and tamari.",
    address: "899 Sukhumvit Rd, Khlong Tan Nuea, Bangkok",
    hours: standardHours,
    reviews: demoReviews("Tamari instead of soy — perfect.", "Felt safe ordering.", "Beautiful interior."),
  },
  {
    slug: "roast-coffee-eatery", name: "Roast Coffee & Eatery", cuisine: "GF Brunch",
    city: "Bangkok", country: "Thailand", countryFlag: "🇹🇭", lat: 13.7308, lng: 100.5696,
    gfScore: 76, badges: ["trained-staff"], crossContaminationRisk: "medium",
    priceTier: 2, rating: 4.3, reviewCount: 720,
    description: "Trendy all-day eatery with a few GF brunch items. Confirm with staff.",
    address: "EmQuartier, Sukhumvit Rd, Bangkok",
    hours: standardHours,
    reviews: demoReviews("Decent GF options.", "Ask for the GF menu.", "Great coffee."),
  },
  {
    slug: "may-veggie-home", name: "May Veggie Home", cuisine: "GF Thai",
    city: "Bangkok", country: "Thailand", countryFlag: "🇹🇭", lat: 13.7534, lng: 100.5018,
    gfScore: 84, badges: ["separate-kitchen", "trained-staff"], crossContaminationRisk: "low",
    priceTier: 1, rating: 4.5, reviewCount: 290,
    description: "Vegan Thai with a dedicated GF section using rice flour and tamari.",
    address: "593/29-41 Sukhumvit Soi 33/1, Bangkok",
    hours: standardHours,
    reviews: demoReviews("Authentic Thai, all safe.", "Pad thai with no soy was great.", "Lovely owner."),
  },
];

export function getRestaurant(slug: string) {
  return RESTAURANTS.find((r) => r.slug === slug);
}

export const BADGE_LABEL: Record<RestaurantBadge, string> = {
  "certified": "✅ Certified GF",
  "separate-kitchen": "🍳 Separate kitchen",
  "separate-fryer": "🚫 Separate fryer",
  "trained-staff": "👨‍🍳 Trained staff",
};

export function priceSymbol(t: PriceTier) {
  return "€".repeat(t);
}

export function scoreColor(score: number) {
  if (score >= 80) return "bg-emerald-500 text-white";
  if (score >= 50) return "bg-amber-500 text-white";
  return "bg-rose-500 text-white";
}
