import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, Zap, Shield, Coffee, UtensilsCrossed, Moon, Apple,
  Beer, AlertTriangle, ShoppingCart, CheckCircle2, XCircle, AlertCircle,
  MapPin, Plane, Save, ChevronDown, ChevronUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { COUNTRIES } from "@/data/countries";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

type SafetyLevel = "safe" | "risk" | "unsafe";
type PlaceType = "restaurant" | "café" | "bar" | "supermarket";

interface Place {
  name: string;
  type: PlaceType;
  safety: SafetyLevel;
  explanation: string;
}

interface BarOption {
  name: string;
  gfOptions: string[];
  note: string;
}

interface CityData {
  safetyScore: number;
  summary: string;
  breakfasts: Place[];
  lunches: Place[];
  dinners: Place[];
  snacks: Place[];
  bars: BarOption[];
  supermarkets: Place[];
  emergency: { advice: string; safeSnacks: string[] };
}

interface TripPlan {
  city: string;
  country: string;
  days: number;
  strictness: "low" | "strict";
  data: CityData;
}

// ─── Mock city database (replace with API call later) ─────────────────────────

const CITY_DB: Record<string, CityData> = {
  rome: {
    safetyScore: 9,
    summary: "Rome is one of the best cities in the world for celiac travelers. Italy legally recognizes celiac disease and AIC-certified restaurants are widespread. Most staff understand cross-contamination.",
    breakfasts: [
      { name: "Fior Fiore", type: "café", safety: "safe", explanation: "AIC-certified café with dedicated GF pastries and a separate preparation area." },
      { name: "Caffe San Pietro", type: "café", safety: "safe", explanation: "GF cornetti and rice cakes on request. Staff are trained." },
      { name: "Bar del Fico", type: "café", safety: "risk", explanation: "Gluten-free options available but shared kitchen equipment — ask staff." },
    ],
    lunches: [
      { name: "Ginger Roma", type: "restaurant", safety: "safe", explanation: "Entirely gluten-free menu. AIC certified. Dedicated celiac kitchen." },
      { name: "Il Sorpasso", type: "restaurant", safety: "safe", explanation: "Large GF menu clearly marked. Trained staff, popular with celiacs." },
      { name: "Supplì Roma", type: "restaurant", safety: "risk", explanation: "Rice balls are available GF but fryer cross-contamination is a risk — ask first." },
    ],
    dinners: [
      { name: "Ristorante Grano", type: "restaurant", safety: "safe", explanation: "AIC-certified, GF pasta and pizza with dedicated utensils. Book in advance." },
      { name: "La Soffitta Renovatio", type: "restaurant", safety: "safe", explanation: "Classic Roman trattoria with full GF menu. Very popular — book ahead." },
      { name: "Osteria dell'Angelo", type: "restaurant", safety: "risk", explanation: "Traditional kitchen. GF pasta available but confirm no cross-contamination each time." },
      { name: "Ristorante Fortunato", type: "restaurant", safety: "risk", explanation: "High-end traditional. Ask explicitly for GF preparation — kitchen is not dedicated." },
    ],
    snacks: [
      { name: "Naturasì (organic supermarket)", type: "supermarket", safety: "safe", explanation: "Large GF section with certified products. Great for snacks and breakfast items." },
      { name: "Bar San Calisto", type: "bar", safety: "safe", explanation: "Wine, prosecco and GF beer available. No snack risk if you stick to drinks." },
    ],
    bars: [
      { name: "Freni e Frizioni", gfOptions: ["Menabrea Gluten Free", "Cider"], note: "Trendiest Trastevere bar. GF beer in bottles. Ask staff to confirm." },
      { name: "Il Sorpasso Bar", gfOptions: ["Birra del Borgo (GF)", "Natural wine"], note: "Same group as the restaurant — GF-aware staff." },
      { name: "Pigneto area bars", gfOptions: ["Wine", "Prosecco", "GF cider"], note: "Hip neighbourhood. Wine and prosecco are always safe alternatives." },
    ],
    supermarkets: [
      { name: "Naturasì", type: "supermarket", safety: "safe", explanation: "Best GF selection in Rome. Dedicated shelves. Located throughout the city." },
      { name: "Conad City", type: "supermarket", safety: "safe", explanation: "Own-brand GF line (star*) includes pasta, bread and snacks." },
      { name: "Carrefour Express", type: "supermarket", safety: "safe", explanation: "Basic GF section. Good for rice cakes, fruit and packaged GF items." },
    ],
    emergency: {
      advice: "Rome has the AIC app (Associazione Italiana Celiachia) — download it for certified restaurants near you. If exposed: rest, rehydrate, eat only plain rice or banana. Nearest hospital with gastro: Ospedale Fatebenefratelli (Isola Tiberina).",
      safeSnacks: ["Plain rice cakes (Naturasì)", "Bananas and apples", "Packaged GF crackers", "Plain yogurt (check label)", "Boiled eggs"],
    },
  },

  tokyo: {
    safetyScore: 7,
    summary: "Tokyo is naturally safer due to its rice-based cuisine, but hidden gluten in soy sauce (shoyu) is the main risk. Celiac-dedicated restaurants are growing. Always carry a Japanese celiac card.",
    breakfasts: [
      { name: "T's Restaurant (Shinjuku)", type: "restaurant", safety: "safe", explanation: "Fully vegan and GF. Dedicated kitchen. One of the safest in Tokyo." },
      { name: "Convenience store (7-Eleven)", type: "restaurant", safety: "risk", explanation: "Onigiri with plain rice filling can be safe — check packaging carefully for soy sauce." },
      { name: "Eggs 'n Things (Harajuku)", type: "café", safety: "risk", explanation: "Eggs and fruit are safe but pancakes and toast are not. Order carefully." },
    ],
    lunches: [
      { name: "Ain Soph Journey (Shinjuku)", type: "restaurant", safety: "safe", explanation: "GF-friendly vegan restaurant. Staff speak English and understand celiac." },
      { name: "Sushi Dai (Toyosu)", type: "restaurant", safety: "risk", explanation: "Fresh sushi is mostly safe but soy sauce contains gluten — bring tamari or ask for salt." },
      { name: "Ippudo Ramen", type: "restaurant", safety: "unsafe", explanation: "Ramen broth almost always contains soy sauce with gluten. Not recommended." },
    ],
    dinners: [
      { name: "Cereal Lab Café (Shibuya)", type: "restaurant", safety: "safe", explanation: "Dedicated GF kitchen, English menu available. Book ahead." },
      { name: "Yakitori near Yurakucho", type: "restaurant", safety: "risk", explanation: "Plain chicken skewers can be safe if you confirm no tare (sauce). Ask staff." },
      { name: "Sukiyabashi Jiro", type: "restaurant", safety: "risk", explanation: "Sushi omakase — rice is safe but soy sauce is not. Bring tamari and inform staff in advance." },
      { name: "Any izakaya (general)", type: "bar", safety: "unsafe", explanation: "Most izakaya dishes contain soy sauce or are fried in shared oil. Not recommended." },
    ],
    snacks: [
      { name: "Natural Lawson", type: "supermarket", safety: "safe", explanation: "Convenience store with labeled allergen info. Look for rice-based snacks." },
      { name: "Fruits in Season shop", type: "café", safety: "safe", explanation: "Fresh fruit shops throughout Tokyo are always safe." },
    ],
    bars: [
      { name: "Craft beer bars (Nakameguro)", gfOptions: ["Yoho Brewing Ao-Oni (GF)", "Cider"], note: "Some craft beer bars carry GF options. Call ahead." },
      { name: "Wine bars (Ginza)", gfOptions: ["Japanese wine", "Sake (pure rice sake)"], note: "Pure rice sake is gluten-free. Confirm it is not mixed." },
      { name: "General note", gfOptions: ["Wine", "Shochu (sweet potato/rice)"], note: "Regular Japanese beer contains gluten. Stick to wine, pure sake or GF craft beer." },
    ],
    supermarkets: [
      { name: "Natural Lawson", type: "supermarket", safety: "safe", explanation: "Allergen labeling by law. Easier to identify safe products than regular convenience stores." },
      { name: "Seijo Ishii", type: "supermarket", safety: "safe", explanation: "Premium supermarket with imported GF products. Locations in Shibuya and Shinjuku." },
      { name: "Kaldi Coffee Farm", type: "supermarket", safety: "safe", explanation: "Import store with GF pasta, crackers and snacks from Europe." },
    ],
    emergency: {
      advice: "Download the 'Gluten-Free Japan' app. If exposed: plain white rice (onigiri without filling), banana, pure water. Show staff your celiac card. Hospital: St. Luke's International (Chuo-ku) has English-speaking staff.",
      safeSnacks: ["Plain white rice onigiri (check label)", "Bananas", "Pure rice crackers (check no shoyu)", "Boiled edamame", "Fresh fruit"],
    },
  },

  barcelona: {
    safetyScore: 8,
    summary: "Barcelona has excellent GF awareness, boosted by a strong local celiac association (ACSA). GF paella, tapas and pintxos are widely available. Most restaurants understand celiac disease.",
    breakfasts: [
      { name: "Flax & Kale (Tallers)", type: "café", safety: "safe", explanation: "Health-focused café with full GF menu. Very celiac-aware staff." },
      { name: "Federal Café", type: "café", safety: "safe", explanation: "GF toast, eggs and granola. Marked on menu. Staff are well trained." },
      { name: "Bar Marsella", type: "bar", safety: "risk", explanation: "Coffee and juice are safe. Pastries have cross-contamination risk." },
    ],
    lunches: [
      { name: "La Pepita (Gràcia)", type: "restaurant", safety: "safe", explanation: "Dedicated GF avocado toast and salads. ACSA recommended." },
      { name: "Parking Pizza", type: "restaurant", safety: "safe", explanation: "GF pizza bases available. Separate oven and utensils used." },
      { name: "Bodega Sepúlveda", type: "restaurant", safety: "risk", explanation: "Traditional Catalan. GF options possible — ask staff and confirm preparation." },
    ],
    dinners: [
      { name: "Honest Greens", type: "restaurant", safety: "safe", explanation: "Modern healthy restaurant. GF clearly labelled. Friendly and trained staff." },
      { name: "Cervecería Catalana", type: "restaurant", safety: "risk", explanation: "Great tapas but shared kitchen. Confirm each dish individually." },
      { name: "Restaurant 7 Portes", type: "restaurant", safety: "risk", explanation: "Historic restaurant. GF paella available — must be ordered in advance." },
      { name: "Gresca", type: "restaurant", safety: "safe", explanation: "High-end Michelin-recommended. Chef is celiac-aware, call ahead." },
    ],
    snacks: [
      { name: "Veritas (organic supermarket)", type: "supermarket", safety: "safe", explanation: "Best GF section in Barcelona. Multiple locations across the city." },
      { name: "Casa Fernández", type: "café", safety: "safe", explanation: "GF empanadas and snacks available. Popular with locals." },
    ],
    bars: [
      { name: "Bar Calders (Sant Antoni)", gfOptions: ["Estrella Damm Daura (GF)", "Cider"], note: "Daura is a Spanish GF beer — widely available in Barcelona." },
      { name: "Morro Fi", gfOptions: ["Estrella Damm Daura", "Wine", "Vermouth"], note: "Craft bar with GF beer on draught. Wine and vermouth always safe." },
      { name: "Any vermutería", gfOptions: ["Vermouth", "Wine", "Cider"], note: "Traditional Catalan vermouth is GF. Great local experience." },
    ],
    supermarkets: [
      { name: "Veritas", type: "supermarket", safety: "safe", explanation: "Organic chain with the widest GF selection in the city." },
      { name: "Bon Preu / Esclat", type: "supermarket", safety: "safe", explanation: "Local chain with large GF section and own-brand GF products." },
      { name: "Mercadona", type: "supermarket", safety: "safe", explanation: "Major Spanish supermarket with Hacendado GF line. Good value." },
    ],
    emergency: {
      advice: "Contact ACSA (Associació Celíacs de Catalunya) via their website for emergency restaurant lists. If exposed: plain rice, banana, water. Hospital: Hospital Clínic de Barcelona has excellent GF food service.",
      safeSnacks: ["Estrella Daura GF beer or cider", "Plain Pringles (original)", "Rice cakes (Veritas)", "Fresh fruit from La Boqueria", "Plain nuts"],
    },
  },

  amsterdam: {
    safetyScore: 8,
    summary: "Amsterdam has high GF awareness with many dedicated GF restaurants and bakeries. The Dutch celiac association (NCV) is active and most supermarkets carry excellent GF ranges.",
    breakfasts: [
      { name: "Bakers & Roasters", type: "café", safety: "safe", explanation: "GF pancakes and brunch items clearly marked. Trained staff." },
      { name: "Dignita (Hoftuin)", type: "café", safety: "safe", explanation: "Social enterprise café with GF menu options. Celiac-aware kitchen." },
      { name: "Albert Heijn (breakfast)", type: "supermarket", safety: "safe", explanation: "Large GF section with bread, yogurt and muesli. Safe and practical." },
    ],
    lunches: [
      { name: "Bolhoed (Prinsengracht)", type: "restaurant", safety: "safe", explanation: "Vegetarian restaurant with many GF dishes clearly marked." },
      { name: "Tibits", type: "restaurant", safety: "risk", explanation: "Buffet restaurant — cross-contamination risk with shared serving utensils." },
      { name: "Pluk Amsterdam", type: "café", safety: "safe", explanation: "Trendy café with GF salads and bowls. Ingredients listed clearly." },
    ],
    dinners: [
      { name: "Restaurant Envy", type: "restaurant", safety: "safe", explanation: "Modern European with extensive GF menu. Call ahead to confirm." },
      { name: "Rijsel", type: "restaurant", safety: "risk", explanation: "French-style rotisserie. Chicken and salads can be GF — ask staff." },
      { name: "Semhar", type: "restaurant", safety: "safe", explanation: "Ethiopian restaurant — injera is teff-based and GF. Naturally gluten-free cuisine." },
      { name: "Café George", type: "café", safety: "risk", explanation: "Modern brasserie. GF pasta available but confirm preparation." },
    ],
    snacks: [
      { name: "Marqt (organic)", type: "supermarket", safety: "safe", explanation: "Premium supermarket with large GF range. Multiple Amsterdam locations." },
      { name: "Poke Perfect", type: "café", safety: "safe", explanation: "Poke bowls with rice base. GF soy sauce available on request." },
    ],
    bars: [
      { name: "Brouwerij 't IJ (brewery)", gfOptions: ["GF craft beer (seasonal)", "Cider"], note: "Famous windmill brewery. Ask for GF options at the bar — available seasonally." },
      { name: "Café de Klos", gfOptions: ["Wine", "Jenever (Dutch gin)"], note: "Traditional brown café. Wine and spirits are safe. Beer contains gluten." },
      { name: "Bar Bukowski", gfOptions: ["Wine", "Cider", "Spirits"], note: "Trendy bar with wide drink selection. GF options easily available." },
    ],
    supermarkets: [
      { name: "Albert Heijn", type: "supermarket", safety: "safe", explanation: "Nationwide chain with AH GF own-brand line. Very well labeled." },
      { name: "Marqt", type: "supermarket", safety: "safe", explanation: "Organic premium supermarket with excellent GF section." },
      { name: "Ekoplaza", type: "supermarket", safety: "safe", explanation: "Organic-only supermarket. Wide dedicated GF range." },
    ],
    emergency: {
      advice: "NCV (Nederlandse Coeliakie Vereniging) has an app with safe restaurants. If exposed: plain rice, banana, electrolytes. Hospital: Amsterdam UMC (AMC) — excellent gastroenterology department.",
      safeSnacks: ["Rice cakes (Albert Heijn GF line)", "Bananas", "Plain nuts", "Gouda cheese", "Packaged GF cookies (AH)"],
    },
  },

  paris: {
    safetyScore: 7,
    summary: "Paris is improving rapidly for celiac travelers. A growing number of GF bakeries and certified restaurants exist. French cuisine relies heavily on flour so vigilance is needed in traditional brasseries.",
    breakfasts: [
      { name: "Noglu (Passage des Panoramas)", type: "café", safety: "safe", explanation: "100% gluten-free bakery and café. Dedicated kitchen. A must-visit." },
      { name: "Helmut Newcake", type: "café", safety: "safe", explanation: "First GF patisserie in Paris. Croissants, éclairs — all GF. No CC risk." },
      { name: "Café de Flore", type: "café", safety: "risk", explanation: "Iconic café. Eggs and coffee are safe but pastries are not. CC risk." },
    ],
    lunches: [
      { name: "Noglu Restaurant", type: "restaurant", safety: "safe", explanation: "Dedicated GF restaurant. Lunch menu changes daily. Always safe." },
      { name: "Le Potager du Marais", type: "restaurant", safety: "safe", explanation: "Vegan and GF. Most dishes marked. Good Marais location." },
      { name: "Chez L'Ami Jean", type: "restaurant", safety: "risk", explanation: "Basque cuisine. Rice dishes can be GF — confirm with staff in detail." },
    ],
    dinners: [
      { name: "Septime (Bastille)", type: "restaurant", safety: "safe", explanation: "Acclaimed modern French. Chef accommodates celiac — must inform when booking." },
      { name: "Kunitoraya 2 (Palais-Royal)", type: "restaurant", safety: "risk", explanation: "Japanese-French fusion. Soba options available but CC risk in kitchen." },
      { name: "Breizh Café", type: "restaurant", safety: "safe", explanation: "Buckwheat crêpes (galettes) are naturally GF. Confirm 100% buckwheat flour." },
      { name: "Le Bistrot Paul Bert", type: "restaurant", safety: "risk", explanation: "Classic bistro. Steak-frites can be GF if fries not shared — always ask." },
    ],
    snacks: [
      { name: "Naturalia (organic)", type: "supermarket", safety: "safe", explanation: "Organic chain with excellent GF section throughout Paris." },
      { name: "Helmut Newcake (takeaway)", type: "café", safety: "safe", explanation: "GF pastries and snacks to take away. Perfect for Tuileries picnics." },
    ],
    bars: [
      { name: "Experimental Cocktail Club", gfOptions: ["Wine", "Cocktails (most)", "Cider"], note: "Sophisticated cocktail bar. Most spirits and wine are GF." },
      { name: "Café de la Paix", gfOptions: ["Champagne", "Wine", "Spirits"], note: "Historic grand café. Wine and champagne are always safe." },
      { name: "Craft beer bars (Canal Saint-Martin)", gfOptions: ["GF craft beer (ask)", "Cider"], note: "Growing craft scene. Ask specifically for GF options — varies by bar." },
    ],
    supermarkets: [
      { name: "Naturalia", type: "supermarket", safety: "safe", explanation: "Best GF section in Paris. Own-brand certified GF products." },
      { name: "Monoprix Bio", type: "supermarket", safety: "safe", explanation: "Organic section of Monoprix with decent GF range." },
      { name: "Carrefour City", type: "supermarket", safety: "safe", explanation: "Carrefour Bio GF own-brand line. Found throughout central Paris." },
    ],
    emergency: {
      advice: "AFDIAG (Association Française Des Intolérants Au Gluten) has a restaurant guide. If exposed: plain rice, banana, water. Hospital: Hôpital Lariboisière — ask for 'gastro-entérologie'. Say: 'J'ai mangé du gluten, je suis coeliac.'",
      safeSnacks: ["Rice cakes (Naturalia)", "Maison Mulot GF macarons", "Fresh fruit", "Plain cheese", "GF crackers (Naturalia)"],
    },
  },

  london: {
    safetyScore: 9,
    summary: "London leads Europe in GF awareness. Natasha's Law (2021) requires full ingredient labeling. Chains like Wagamama and Nando's have dedicated GF menus. Coeliac UK has over 140,000 members.",
    breakfasts: [
      { name: "By Chloe (Covent Garden)", type: "café", safety: "safe", explanation: "Plant-based chain with GF menu. Staff trained in celiac." },
      { name: "Pret A Manger", type: "café", safety: "risk", explanation: "GF labelled items available but shared kitchen — CC risk. Choose carefully." },
      { name: "Granger & Co", type: "café", safety: "safe", explanation: "Australian café with GF pancakes and eggs. Ask staff — menu well labeled." },
    ],
    lunches: [
      { name: "Wagamama", type: "restaurant", safety: "safe", explanation: "Full GF menu with dedicated GF wok protocol. One of UK's safest chains." },
      { name: "Nando's", type: "restaurant", safety: "safe", explanation: "GF menu, dedicated fryer for GF chips. Staff trained in celiac protocol." },
      { name: "Ottolenghi (any branch)", type: "café", safety: "risk", explanation: "Salads and dishes often GF but shared service equipment is a risk." },
    ],
    dinners: [
      { name: "Mele e Pere (Soho)", type: "restaurant", safety: "safe", explanation: "Italian wine bar with dedicated GF pasta. Book ahead." },
      { name: "Dishoom", type: "restaurant", safety: "risk", explanation: "Indian — rice dishes and dal are safe. Naan and roti are not. Ask staff." },
      { name: "Brasserie Zédel", type: "restaurant", safety: "risk", explanation: "Classic French brasserie. GF steak available — confirm sauce and fryer." },
      { name: "Stem & Glory (King's Cross)", type: "restaurant", safety: "safe", explanation: "Vegan restaurant with fully GF kitchen. Very celiac safe." },
    ],
    snacks: [
      { name: "Whole Foods Market", type: "supermarket", safety: "safe", explanation: "Huge GF section. Prepared foods labelled. Multiple London locations." },
      { name: "Leon", type: "café", safety: "safe", explanation: "Fast-food chain with GF menu. Clearly labelled. Good for quick stops." },
    ],
    bars: [
      { name: "Brewdog (any branch)", gfOptions: ["Brewdog Vagabond (GF)", "Cider"], note: "Major craft beer chain. GF Vagabond Pale Ale widely available." },
      { name: "Wetherspoons", gfOptions: ["GF beer (ask)", "Wine", "Cider"], note: "Pub chain with GF menu including beer. Ask staff to check stock." },
      { name: "Any pub", gfOptions: ["Cider", "Wine", "Gluten-free spirits"], note: "Cider is widely available in UK pubs. Kopparberg, Rekorderlig etc." },
    ],
    supermarkets: [
      { name: "Marks & Spencer", type: "supermarket", safety: "safe", explanation: "Excellent GF labelling. Own-brand GF range across all categories." },
      { name: "Waitrose", type: "supermarket", safety: "safe", explanation: "Premium supermarket with extensive GF section and clear labelling." },
      { name: "Tesco", type: "supermarket", safety: "safe", explanation: "Free From range is large and well-priced. Available everywhere." },
    ],
    emergency: {
      advice: "Coeliac UK app has restaurant guide and product checker. Call NHS 111 for medical advice. If exposed: rest, hydrate, eat plain rice or banana. Any major hospital A&E can help.",
      safeSnacks: ["M&S GF ready meals", "Tesco Free From crisps", "Banana", "Walkers Ready Salted crisps (GF)", "Nakd bars"],
    },
  },
};

// Generic fallback for cities not in database
function getGenericCityData(city: string): CityData {
  return {
    safetyScore: 6,
    summary: `Gluten-free options in ${city} vary. Research local celiac associations before you travel and always carry a translation card explaining your condition clearly. Rice-based local dishes are often naturally safer.`,
    breakfasts: [
      { name: "Hotel breakfast", type: "café", safety: "risk", explanation: "Ask staff about dedicated GF preparation. Eggs, fruit and plain yogurt are usually safe." },
      { name: "Local supermarket", type: "supermarket", safety: "safe", explanation: "Buy packaged GF products from the supermarket for a safe morning meal." },
      { name: "Fresh fruit stall / market", type: "café", safety: "safe", explanation: "Always a safe option. Fresh fruit and nuts require no preparation." },
    ],
    lunches: [
      { name: "Rice-based local dishes", type: "restaurant", safety: "safe", explanation: "Plain rice with grilled protein is usually safe. Ask about sauces separately." },
      { name: "Local salad bar", type: "café", safety: "risk", explanation: "Salads can be GF if dressing is confirmed GF and croutons are excluded." },
      { name: "Local pizza / pasta restaurant", type: "restaurant", safety: "unsafe", explanation: "High cross-contamination risk unless dedicated GF kitchen is confirmed." },
    ],
    dinners: [
      { name: "Grilled fish or meat restaurant", type: "restaurant", safety: "risk", explanation: "Plain grilled protein is usually safe. Confirm marinades and sauces contain no gluten." },
      { name: "Indian / rice-based cuisine", type: "restaurant", safety: "risk", explanation: "Dal, rice and curries can be safe — confirm no wheat flour used as thickener." },
      { name: "International hotel restaurant", type: "restaurant", safety: "safe", explanation: "Hotel restaurants in larger hotels usually can accommodate celiac disease." },
    ],
    snacks: [
      { name: "Local supermarket GF section", type: "supermarket", safety: "safe", explanation: "Check for a free-from or GF aisle. Packaged certified products are safest." },
      { name: "Fresh fruit and nuts", type: "café", safety: "safe", explanation: "Markets and street stalls selling whole fruit are always safe." },
    ],
    bars: [
      { name: "Wine bars", gfOptions: ["Wine", "Cider (if available)", "Spirits"], note: "Wine and pure spirits are gluten-free worldwide. Ask for GF beer specifically." },
      { name: "Local bars", gfOptions: ["Wine", "Local spirits"], note: "Regular beer contains gluten. Ask explicitly for gluten-free alternatives." },
    ],
    supermarkets: [
      { name: "Local supermarket", type: "supermarket", safety: "safe", explanation: "Look for products labeled 'senza glutine', 'sin gluten', 'gluten-free' or the GF symbol." },
      { name: "Organic / health food store", type: "supermarket", safety: "safe", explanation: "Organic stores typically carry imported GF products with clear labelling." },
    ],
    emergency: {
      advice: "Always carry your GlutenGo translation card. If exposed: drink water, eat plain rice or banana, rest. Find the nearest hospital and show them your diagnosis letter. Avoid all food until symptoms subside.",
      safeSnacks: ["Packaged rice cakes", "Bananas", "Plain nuts (sealed pack)", "Plain yogurt (check label)", "Hard-boiled eggs"],
    },
  };
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function normalizeCityKey(city: string): string {
  return city.toLowerCase().trim().replace(/\s+/g, "");
}

function getCityData(city: string): CityData {
  const key = normalizeCityKey(city);
  for (const [k, v] of Object.entries(CITY_DB)) {
    if (key === k || key.startsWith(k) || k.startsWith(key)) return v;
  }
  return getGenericCityData(city);
}

function generatePlan(city: string, country: string, days: number, strictness: "low" | "strict"): TripPlan {
  const data = getCityData(city);
  const filter = (places: Place[]) =>
    strictness === "strict" ? places.filter((p) => p.safety === "safe") : places;
  return {
    city,
    country,
    days,
    strictness,
    data: {
      ...data,
      breakfasts: filter(data.breakfasts),
      lunches: filter(data.lunches),
      dinners: filter(data.dinners),
    },
  };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function SafetyBadge({ level }: { level: SafetyLevel }) {
  if (level === "safe") return (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700">
      <CheckCircle2 className="h-3 w-3" /> Safe
    </span>
  );
  if (level === "risk") return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
      <AlertCircle className="h-3 w-3" /> Risk
    </span>
  );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-2 py-0.5 text-xs font-medium text-rose-700">
      <XCircle className="h-3 w-3" /> Unsafe
    </span>
  );
}

function ScoreRing({ score }: { score: number }) {
  const color = score >= 8 ? "text-emerald-600" : score >= 6 ? "text-amber-600" : "text-rose-600";
  const bg = score >= 8 ? "bg-emerald-50 border-emerald-200" : score >= 6 ? "bg-amber-50 border-amber-200" : "bg-rose-50 border-rose-200";
  return (
    <div className={`flex flex-col items-center justify-center rounded-2xl border p-5 ${bg}`}>
      <span className={`font-display text-5xl font-bold ${color}`}>{score}</span>
      <span className="mt-1 text-xs text-muted-foreground">/ 10 safety</span>
    </div>
  );
}

function PlaceCard({ place }: { place: Place }) {
  const borderColor = place.safety === "safe" ? "border-emerald-200" : place.safety === "risk" ? "border-amber-200" : "border-rose-200";
  return (
    <div className={`rounded-xl border bg-card p-3 ${borderColor}`}>
      <div className="flex items-start justify-between gap-2">
        <p className="font-medium text-sm">{place.name}</p>
        <SafetyBadge level={place.safety} />
      </div>
      <p className="mt-1 text-xs text-muted-foreground capitalize">{place.type}</p>
      <p className="mt-1.5 text-xs leading-relaxed text-foreground/70">{place.explanation}</p>
    </div>
  );
}

function QuickSafetyMode({ plan }: { plan: TripPlan }) {
  const { data } = plan;
  const safeRestaurants = [
    ...data.breakfasts.filter(p => p.safety === "safe"),
    ...data.lunches.filter(p => p.safety === "safe"),
    ...data.dinners.filter(p => p.safety === "safe"),
  ].slice(0, 5);

  return (
    <div className="rounded-3xl border border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 p-5">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="h-5 w-5 text-emerald-600" />
        <h3 className="font-display text-xl text-emerald-900">Quick Safety Mode</h3>
        <span className="rounded-full bg-emerald-600 px-2 py-0.5 text-xs text-white font-medium">Instant picks</span>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">Top 5 safest restaurants</p>
          <ul className="space-y-1.5">
            {safeRestaurants.length > 0 ? safeRestaurants.map((p) => (
              <li key={p.name} className="flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                <span>{p.name}</span>
              </li>
            )) : (
              <li className="text-sm text-muted-foreground">Increase to "Low sensitivity" mode for more options.</li>
            )}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">Safest supermarkets</p>
          <ul className="space-y-1.5">
            {data.supermarkets.filter(s => s.safety === "safe").slice(0, 3).map((s) => (
              <li key={s.name} className="flex items-center gap-1.5 text-sm">
                <ShoppingCart className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                <span>{s.name}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">Safest bars</p>
          <ul className="space-y-1.5">
            {data.bars.slice(0, 3).map((b) => (
              <li key={b.name} className="flex items-center gap-1.5 text-sm">
                <Beer className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                <span>{b.name} — {b.gfOptions[0]}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function DayCard({ day, plan }: { day: number; plan: TripPlan }) {
  const { data } = plan;
  const breakfast = data.breakfasts[day % Math.max(data.breakfasts.length, 1)];
  const lunch = data.lunches[day % Math.max(data.lunches.length, 1)];
  const dinner = data.dinners[day % Math.max(data.dinners.length, 1)];
  const snack = data.snacks[day % Math.max(data.snacks.length, 1)];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <h4 className="font-display text-lg mb-4">Day {day + 1}</h4>
      <div className="space-y-3">
        {breakfast && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Coffee className="h-3.5 w-3.5" /> Breakfast
            </div>
            <PlaceCard place={breakfast} />
          </div>
        )}
        {lunch && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <UtensilsCrossed className="h-3.5 w-3.5" /> Lunch
            </div>
            <PlaceCard place={lunch} />
          </div>
        )}
        {dinner && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Moon className="h-3.5 w-3.5" /> Dinner
            </div>
            <PlaceCard place={dinner} />
          </div>
        )}
        {snack && (
          <div>
            <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Apple className="h-3.5 w-3.5" /> Snack
            </div>
            <PlaceCard place={snack} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export const Route = createFileRoute("/_app/trips/new")({
  head: () => ({ meta: [{ title: "Plan a trip — GlutenGo" }] }),
  component: NewTrip,
});

function NewTrip() {
  const { user, loading } = useRequireAuth();
  const nav = useNavigate();

  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [days, setDays] = useState(3);
  const [strictness, setStrictness] = useState<"low" | "strict">("strict");
  const [plan, setPlan] = useState<TripPlan | null>(null);
  const [saving, setSaving] = useState(false);
  const [openDays, setOpenDays] = useState<number[]>([0]);

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-10">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
        <div className="mt-8 h-64 animate-pulse rounded-3xl bg-muted" />
      </div>
    );
  }

  const generate = () => {
    if (!city.trim()) { toast.error("Enter a city first"); return; }
    const generated = generatePlan(city.trim(), country, days, strictness);
    setPlan(generated);
    setOpenDays([0]);
    setTimeout(() => document.getElementById("trip-plan")?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const saveTrip = async () => {
    if (!plan) return;
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("trips")
        .insert({
          user_id: user.id,
          title: `${plan.city} — ${plan.days} day${plan.days > 1 ? "s" : ""}`,
          destination: plan.country || plan.city,
          destination_country: plan.country || null,
          destination_city: plan.city,
          status: "planning",
        })
        .select("id")
        .single();
      if (error) { toast.error(error.message); return; }
      toast.success("Trip saved!");
      nav({ to: "/trips/$id", params: { id: data.id } });
    } finally {
      setSaving(false);
    }
  };

  const toggleDay = (i: number) =>
    setOpenDays((prev) => prev.includes(i) ? prev.filter((d) => d !== i) : [...prev, i]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-10">
      <Link to="/trips" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to trips
      </Link>

      <h1 className="mt-4 font-display text-4xl">Plan a gluten-free trip</h1>
      <p className="mt-1 text-muted-foreground">Fill in your destination and instantly get a personalised safe itinerary.</p>

      {/* Form */}
      <div className="mt-8 space-y-5 rounded-3xl border border-border bg-card p-6 shadow-soft">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>City *</Label>
            <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Rome, Tokyo, Barcelona…" className="mt-1.5" />
          </div>
          <div>
            <Label>Country (optional)</Label>
            <select value={country} onChange={(e) => setCountry(e.target.value)} className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
              <option value="">Select…</option>
              {COUNTRIES.map((c) => <option key={c.slug} value={c.name}>{c.flag} {c.name}</option>)}
            </select>
          </div>
        </div>

        <div>
          <Label>Duration</Label>
          <div className="mt-2 flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium border transition ${
                  days === d ? "bg-primary text-primary-foreground border-primary" : "border-border bg-card hover:bg-muted"
                }`}
              >
                {d} {d === 1 ? "day" : "days"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <Label>Strictness level</Label>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <button
              onClick={() => setStrictness("low")}
              className={`rounded-2xl border p-4 text-left transition ${strictness === "low" ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600" />
                <span className="font-medium text-sm">Low sensitivity</span>
                {strictness === "low" && <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Shows all options including places with some cross-contamination risk.</p>
            </button>
            <button
              onClick={() => setStrictness("strict")}
              className={`rounded-2xl border p-4 text-left transition ${strictness === "strict" ? "border-primary bg-primary/5" : "border-border hover:bg-muted"}`}
            >
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-600" />
                <span className="font-medium text-sm">Celiac strict</span>
                {strictness === "strict" && <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />}
              </div>
              <p className="mt-1 text-xs text-muted-foreground">Only shows fully safe venues. No cross-contamination risk accepted.</p>
            </button>
          </div>
        </div>

        <Button onClick={generate} size="lg" className="w-full">
          <Plane className="mr-2 h-4 w-4" /> Generate trip plan
        </Button>
      </div>

      {/* Generated plan */}
      {plan && (
        <div id="trip-plan" className="mt-10 space-y-8">

          {/* Quick Safety Mode */}
          <QuickSafetyMode plan={plan} />

          {/* Overview */}
          <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl">{plan.city}{plan.country ? `, ${plan.country}` : ""}</h2>
              <Badge variant="secondary" className="ml-auto">
                {plan.days} {plan.days === 1 ? "day" : "days"} · {plan.strictness === "strict" ? "Celiac strict" : "Low sensitivity"}
              </Badge>
            </div>
            <div className="flex gap-5 items-start">
              <ScoreRing score={plan.data.safetyScore} />
              <p className="flex-1 text-sm leading-relaxed text-foreground/80">{plan.data.summary}</p>
            </div>
          </div>

          {/* Daily itinerary */}
          <div>
            <h2 className="font-display text-2xl mb-4">Daily itinerary</h2>
            <div className="space-y-3">
              {Array.from({ length: plan.days }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-border overflow-hidden">
                  <button
                    onClick={() => toggleDay(i)}
                    className="w-full flex items-center justify-between px-5 py-4 bg-card hover:bg-muted/50 transition text-left"
                  >
                    <span className="font-medium">Day {i + 1}</span>
                    {openDays.includes(i) ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                  </button>
                  {openDays.includes(i) && (
                    <div className="px-5 pb-5 bg-card">
                      <DayCard day={i} plan={plan} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Bars */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Beer className="h-5 w-5 text-primary" />
              <h2 className="font-display text-2xl">Bars & drinks</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {plan.data.bars.map((bar) => (
                <div key={bar.name} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                  <p className="font-medium text-sm">{bar.name}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {bar.gfOptions.map((opt) => (
                      <span key={opt} className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700 font-medium">{opt}</span>
                    ))}
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{bar.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Emergency */}
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-rose-600" />
              <h2 className="font-display text-2xl text-rose-900">Emergency section</h2>
            </div>
            <p className="text-sm leading-relaxed text-rose-800">{plan.data.emergency.advice}</p>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-700 mb-2">Safe food options nearby</p>
              <ul className="space-y-1">
                {plan.data.emergency.safeSnacks.map((s) => (
                  <li key={s} className="flex items-center gap-2 text-sm text-rose-800">
                    <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-rose-500" /> {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-700 mb-2">Safe supermarkets</p>
              <div className="flex flex-wrap gap-2">
                {plan.data.supermarkets.map((s) => (
                  <span key={s.name} className="inline-flex items-center gap-1 rounded-full border border-rose-200 bg-white/60 px-3 py-1 text-xs text-rose-800">
                    <ShoppingCart className="h-3 w-3" /> {s.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Save button */}
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setPlan(null)}>Start over</Button>
            <Button onClick={saveTrip} disabled={saving} size="lg">
              <Save className="mr-2 h-4 w-4" />
              {saving ? "Saving…" : "Save this trip"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
