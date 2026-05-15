import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft, Zap, Shield, Coffee, UtensilsCrossed, Moon, Apple,
  Beer, AlertTriangle, ShoppingCart, CheckCircle2, XCircle, AlertCircle,
  MapPin, Plane, Save, ChevronDown, ChevronUp, Lightbulb,
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

interface DayPlan {
  theme: string;
  area: string;
  tip: string;
  breakfast: Place;
  lunch: Place;
  dinner: Place;
  snack: Place;
}

interface BarOption {
  name: string;
  gfOptions: string[];
  note: string;
}

interface CityData {
  safetyScore: number;
  summary: string;
  days: DayPlan[];
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

// ─── City database ────────────────────────────────────────────────────────────

const CITY_DB: Record<string, CityData> = {
  rome: {
    safetyScore: 9,
    summary: "Rome is one of the best cities in the world for celiac travelers. Italy legally recognizes celiac disease and AIC-certified restaurants are widespread. The AIC app shows certified restaurants near you at any moment.",
    days: [
      {
        theme: "Trastevere — the most charming neighborhood",
        area: "Trastevere",
        tip: "Take the 8 tram from Largo Argentina directly into Trastevere. Arrive early to beat the crowds at the market.",
        breakfast: { name: "Fior Fiore", type: "café", safety: "safe", explanation: "AIC-certified café. Dedicated GF pastries baked fresh each morning in a separate preparation area." },
        lunch: { name: "Ginger Roma (Trastevere branch)", type: "restaurant", safety: "safe", explanation: "Entirely GF menu. AIC certified. Dedicated celiac kitchen with separate utensils — one of Rome's safest." },
        dinner: { name: "Ristorante Grano", type: "restaurant", safety: "safe", explanation: "AIC-certified trattoria with GF pasta and pizza. Book in advance — popular with locals and celiac tourists alike." },
        snack: { name: "Bar San Calisto", type: "bar", safety: "safe", explanation: "Trastevere institution. Wine, prosecco and GF beer available. Stick to drinks and you're completely safe." },
      },
      {
        theme: "Prati & Vatican — art, history and great eating",
        area: "Prati",
        tip: "Prati is directly across the Tiber from the Vatican. Visit the museums early, then explore Prati's wide streets for lunch.",
        breakfast: { name: "Caffe San Pietro", type: "café", safety: "safe", explanation: "GF cornetti and rice cakes available. Staff are Vatican-area trained — they deal with international celiac guests daily." },
        lunch: { name: "Il Sorpasso", type: "restaurant", safety: "safe", explanation: "Large, clearly marked GF menu. Trained staff, extremely popular with Roman celiacs. Book or arrive early." },
        dinner: { name: "La Soffitta Renovatio", type: "restaurant", safety: "safe", explanation: "Classic Roman trattoria near the Vatican with a dedicated GF menu. Regulars swear by the GF cacio e pepe." },
        snack: { name: "Naturasì Prati", type: "supermarket", safety: "safe", explanation: "Organic supermarket with Rome's best GF selection. Perfect for picking up snacks, GF crackers, or breakfast items for tomorrow." },
      },
      {
        theme: "Jewish Ghetto & Campo de' Fiori — history and street food",
        area: "Jewish Ghetto",
        tip: "Jewish-Roman cuisine is naturally GF-friendly: carciofi alla giudia (artichokes), baccalà in pastella (ask for GF), and dolci ebraici. The Ghetto bakeries are worth exploring.",
        breakfast: { name: "Pasticceria Boccione", type: "café", safety: "risk", explanation: "Historic Jewish bakery on Via Portico d'Ottavia. Traditional pastries — ask specifically which are GF. Shared kitchen risk." },
        lunch: { name: "Giggetto al Portico d'Ottavia", type: "restaurant", safety: "safe", explanation: "Famous Jewish-Roman restaurant. Explicitly mention celiac — they accommodate well. The fried artichokes are GF." },
        dinner: { name: "Osteria dell'Angelo", type: "restaurant", safety: "risk", explanation: "Traditional Roman trattoria near Campo de' Fiori. GF pasta available but confirm no cross-contamination each visit." },
        snack: { name: "Forno Campo de' Fiori", type: "café", safety: "risk", explanation: "Iconic street pizza by the square — wheat everywhere. Buy a drink and sit in the piazza instead." },
      },
      {
        theme: "Testaccio — Rome's authentic food market district",
        area: "Testaccio",
        tip: "Testaccio Market (Mercato di Testaccio) opens at 7 am. Stall 15 has a dedicated GF seller. The neighborhood is Rome's most working-class and authentic.",
        breakfast: { name: "Mercato di Testaccio (stall 15)", type: "café", safety: "safe", explanation: "Dedicated GF stall at Testaccio market. Fresh GF breads and pastries sourced from certified suppliers." },
        lunch: { name: "Roscioli Salumeria con Cucina", type: "restaurant", safety: "risk", explanation: "World-famous deli and restaurant. GF pasta available on request — kitchen is busy, confirm preparation clearly." },
        dinner: { name: "Flavio al Velavevodetto", type: "restaurant", safety: "safe", explanation: "Carved into Monte dei Cocci (broken amphorae hill). GF menu available, staff experienced with celiac." },
        snack: { name: "Conad City Testaccio", type: "supermarket", safety: "safe", explanation: "Own-brand GF line (star*) includes pasta, snack bars and bread. Good value for stocking up." },
      },
      {
        theme: "Pigneto & Ostiense — creative, hipster Rome",
        area: "Pigneto",
        tip: "Pigneto is 20 min east of center by bus (route 81). It's Rome's most creative district with murals, street art and aperitivo bars. Great for a slower day.",
        breakfast: { name: "Café Necci dal 1924", type: "café", safety: "risk", explanation: "Pasolini's favourite café in Pigneto. Eggs and coffee are safe — pastries are shared prep. Ask staff." },
        lunch: { name: "Terre e Domus (Forum branch)", type: "restaurant", safety: "safe", explanation: "Wine and regional Roman food. GF menu well-marked. Stunning location near the Forum Colosseum." },
        dinner: { name: "Primo al Pigneto", type: "restaurant", safety: "safe", explanation: "Michelin-mentioned Pigneto restaurant. Chef-owner accommodates celiac well — call ahead to confirm." },
        snack: { name: "Carrefour Express Ostiense", type: "supermarket", safety: "safe", explanation: "Basic GF section. Good for rice cakes, fruit and packaged GF items. Open until late." },
      },
      {
        theme: "Aventino & Circo Massimo — green Rome",
        area: "Aventino",
        tip: "The Aventine Hill is one of Rome's quietest neighborhoods. Visit the Knights of Malta keyhole (perfect Colosseum view), then the Orange Garden for picnic views over the city.",
        breakfast: { name: "Mercato Circo Massimo", type: "café", safety: "safe", explanation: "Farmers' market every Saturday and Sunday morning. GF vendors on site with certified products." },
        lunch: { name: "Il Bocconcino", type: "restaurant", safety: "safe", explanation: "Near the Colosseum, AIC certified. Great GF pasta. Avoid high tourist season without a reservation." },
        dinner: { name: "Ristorante Fortunato", type: "restaurant", safety: "risk", explanation: "High-end near the Pantheon. Ask explicitly for GF preparation — kitchen is not dedicated but staff are experienced." },
        snack: { name: "Naturasì Aventino", type: "supermarket", safety: "safe", explanation: "Organic supermarket. Grab GF snacks, a bottle of wine, and picnic on the Orange Garden terrrace." },
      },
      {
        theme: "Centro Storico — Pantheon, piazzas and farewell to Rome",
        area: "Centro Storico",
        tip: "Start at Piazza Navona, walk to the Pantheon, then Campo de' Fiori for aperitivo. The centro is touristy but several AIC-certified gems are hidden here.",
        breakfast: { name: "Bar Sant'Eustachio", type: "café", safety: "risk", explanation: "Rome's most famous coffee bar. The coffee is safe. Pastries are shared prep — skip them." },
        lunch: { name: "Ginger Roma (Centro branch)", type: "restaurant", safety: "safe", explanation: "Second branch of the fully GF restaurant, near the Pantheon. AIC certified. Ideal last lunch in Rome." },
        dinner: { name: "Ristorante La Campana", type: "restaurant", safety: "safe", explanation: "Rome's oldest restaurant (1518). GF menu available. A fitting farewell dinner in the heart of historic Rome." },
        snack: { name: "Pasticceria Regoli", type: "café", safety: "risk", explanation: "Historic bakery on Esquilino. Ask for GF options — some ricotta-based pastries are GF but verify each visit." },
      },
    ],
    bars: [
      { name: "Freni e Frizioni (Trastevere)", gfOptions: ["Menabrea Gluten Free", "Cider"], note: "Trastevere's trendiest bar. GF beer in bottles. Ask staff to confirm. Great aperitivo spread — ask which snacks are GF." },
      { name: "Il Sorpasso Bar", gfOptions: ["Birra del Borgo (GF)", "Natural wine"], note: "Same group as the restaurant. GF-aware staff, same kitchen standards." },
      { name: "Pigneto area bars", gfOptions: ["Wine", "Prosecco", "GF cider"], note: "Hip neighbourhood. Wine and prosecco are always safe. Ask for GF beer — some craft bars carry it." },
      { name: "Rec 23 (Testaccio)", gfOptions: ["GF craft beer (seasonal)", "Wine"], note: "Industrial-chic bar near the old slaughterhouse. Ask for GF options at the bar." },
    ],
    supermarkets: [
      { name: "Naturasì", type: "supermarket", safety: "safe", explanation: "Best GF selection in Rome. Dedicated shelves with certified products. Located throughout the city." },
      { name: "Conad City", type: "supermarket", safety: "safe", explanation: "Own-brand GF line (star*) includes pasta, bread and snacks. Solid value." },
      { name: "Carrefour Express", type: "supermarket", safety: "safe", explanation: "Basic GF section. Good for rice cakes, fruit and packaged items. Very widespread." },
    ],
    emergency: {
      advice: "Download the AIC app (Associazione Italiana Celiachia) for certified restaurants near you. If exposed: rest, rehydrate, eat only plain rice or banana. Nearest hospital with gastroenterology: Ospedale Fatebenefratelli on Isola Tiberina.",
      safeSnacks: ["Plain rice cakes (Naturasì)", "Bananas and apples", "Packaged GF crackers", "Plain yogurt (check label)", "Boiled eggs from any bar"],
    },
  },

  tokyo: {
    safetyScore: 7,
    summary: "Tokyo is naturally safer due to its rice-based cuisine, but soy sauce (shoyu) contains wheat and is in almost everything. Always carry a Japanese celiac card. The GF restaurant scene is growing fast in 2025.",
    days: [
      {
        theme: "Shinjuku — the city that never sleeps",
        area: "Shinjuku",
        tip: "Print or screenshot your Japanese celiac card before arriving. Staff are respectful and will try to help even with a language barrier.",
        breakfast: { name: "T's Restaurant Shinjuku", type: "restaurant", safety: "safe", explanation: "Fully vegan and GF. Dedicated kitchen. Staff speak English. One of the safest breakfast spots in all of Tokyo." },
        lunch: { name: "Ain Soph Journey (Shinjuku)", type: "restaurant", safety: "safe", explanation: "GF-friendly vegan restaurant. English menu, English-speaking staff, and genuine celiac understanding." },
        dinner: { name: "Shabu-shabu restaurant (ask for GF broth)", type: "restaurant", safety: "risk", explanation: "Hot pot with thin beef slices. Most shabu-shabu broth is GF — confirm no soy sauce added. Use ponzu sparingly." },
        snack: { name: "Natural Lawson Shinjuku", type: "supermarket", safety: "safe", explanation: "Convenience store with full allergen labeling by law. Look for rice-based snacks and fresh fruit." },
      },
      {
        theme: "Harajuku & Shibuya — fashion, culture, great food",
        area: "Harajuku",
        tip: "Takeshita Street is full of gluten. Head to the quieter Omotesando end for calmer, GF-safer café options.",
        breakfast: { name: "Granger & Co (Omotesando)", type: "café", safety: "risk", explanation: "Australian café with GF-marked items. Shared kitchen — cross-contamination possible. Ask staff clearly." },
        lunch: { name: "Maisen Tonkatsu (ask for GF version)", type: "restaurant", safety: "risk", explanation: "Tonkatsu is normally breaded in wheat. Some branches offer rice flour coating — call ahead and verify." },
        dinner: { name: "Cereal Lab Café (Shibuya)", type: "restaurant", safety: "safe", explanation: "Dedicated GF kitchen, English menu. Book ahead — it fills quickly, especially on weekends." },
        snack: { name: "Seijo Ishii (Shibuya)", type: "supermarket", safety: "safe", explanation: "Premium supermarket with imported GF products from Europe. Excellent for pasta, crackers and safe snacks." },
      },
      {
        theme: "Asakusa & Ueno — old Tokyo and temples",
        area: "Asakusa",
        tip: "Nakamise shopping street in Asakusa sells senbei (rice crackers) — safe if you pick plain ones without soy sauce. Ask the vendor.",
        breakfast: { name: "Pelican Café (Asakusa)", type: "café", safety: "risk", explanation: "Famous toast café — wheat-heavy. Order coffee and plain boiled eggs. Safe options exist but limited." },
        lunch: { name: "Sometaro Okonomiyaki", type: "restaurant", safety: "unsafe", explanation: "Traditional okonomiyaki uses wheat flour. Even GF alternatives have high CC risk in this kitchen. Avoid." },
        dinner: { name: "Waentei-Kikko (Asakusa)", type: "restaurant", safety: "safe", explanation: "Kaiseki-style Japanese. Chef accommodates celiac with advance notice. Tatami room, traditional experience." },
        snack: { name: "Fresh fruit from Ueno Ameya-yokocho market", type: "café", safety: "safe", explanation: "Open-air market between Ueno and Okachimachi stations. Fresh fruit stalls are completely safe." },
      },
      {
        theme: "Toyosu & Ginza — the fish market and luxury",
        area: "Toyosu",
        tip: "Toyosu outer market is best visited early (6–9 am). Sushi for breakfast is a local tradition. Bring tamari (GF soy sauce) in a small bottle.",
        breakfast: { name: "Sushi Dai (Toyosu outer market)", type: "restaurant", safety: "risk", explanation: "Fresh market sushi — mostly safe. The rice and fish are GF. Standard soy sauce contains gluten — bring tamari or ask for salt." },
        lunch: { name: "Ginza Six food hall (GF stalls)", type: "restaurant", safety: "safe", explanation: "Luxury shopping mall basement food hall. Labeling is generally excellent. Look for rice-based stalls." },
        dinner: { name: "Sukiyabashi Jiro Honten", type: "restaurant", safety: "risk", explanation: "World-famous sushi. Rice is safe; the seasoned rice vinegar is GF; soy sauce is not. Inform staff in advance and bring tamari." },
        snack: { name: "Kaldi Coffee Farm (Ginza)", type: "supermarket", safety: "safe", explanation: "Import store with GF pasta, crackers and snacks from Europe. Great for stocking up on familiar products." },
      },
      {
        theme: "Nakameguro & Shimokitazawa — Tokyo's coolest neighborhoods",
        area: "Nakameguro",
        tip: "Walk the Meguro River canal in Nakameguro — lined with cafés and boutiques. Cherry blossoms in spring make it unmissable.",
        breakfast: { name: "Onibus Coffee (Nakameguro)", type: "café", safety: "safe", explanation: "Third-wave coffee shop. Eggs and yogurt available. Coffee is of course GF. Staff are international and helpful." },
        lunch: { name: "Kurkku Kitchen (Nakameguro)", type: "restaurant", safety: "safe", explanation: "Organic and sustainable food. GF options clearly marked. One of Tokyo's most celiac-aware casual restaurants." },
        dinner: { name: "Izakaya — AVOID", type: "bar", safety: "unsafe", explanation: "Most izakaya dishes contain soy sauce, wheat-based sauces or are fried in shared oil. Explore Shimokitazawa wine bars instead." },
        snack: { name: "Seijo Ishii (Shimokitazawa)", type: "supermarket", safety: "safe", explanation: "Pick up GF snacks and a bottle of Japanese wine for an evening in the neighborhood." },
      },
      {
        theme: "Akihabara & Yanaka — tech and old Tokyo",
        area: "Akihabara",
        tip: "Yanaka is Tokyo's best-preserved old neighborhood — a 25-min walk from Akihabara. Yanaka Ginza shopping street has traditional snack vendors; ask for plain rice crackers.",
        breakfast: { name: "Eggs 'n Things (Harajuku, morning trip)", type: "café", safety: "risk", explanation: "Eggs, fresh fruit and yogurt are safe. Pancakes and French toast are not. Order carefully." },
        lunch: { name: "Chabuzen (Yanaka)", type: "restaurant", safety: "safe", explanation: "Traditional Japanese set meals in Yanaka. Staff are slow-paced and accommodating — show your celiac card." },
        dinner: { name: "T's Restaurant (revisit for a safe dinner)", type: "restaurant", safety: "safe", explanation: "Fully GF and vegan. A reliable safe choice when you want to end the day without worry." },
        snack: { name: "Natural Lawson (Akihabara)", type: "supermarket", safety: "safe", explanation: "Allergen labeling by law. Safer than standard 7-Eleven for identifying GF products." },
      },
      {
        theme: "Odaiba & teamLab — futuristic Tokyo",
        area: "Odaiba",
        tip: "Odaiba is a man-made island in Tokyo Bay — take the driverless Yurikamome monorail for stunning city views. teamLab Borderless is here — book tickets weeks in advance.",
        breakfast: { name: "DiverCity Tokyo food court", type: "café", safety: "risk", explanation: "Large food court with some labeled GF options. Go early before crowds; ask staff directly about preparation." },
        lunch: { name: "Bills (Odaiba)", type: "café", safety: "safe", explanation: "Australian-Japanese café chain. GF items clearly marked. Ricotta hotcakes have a GF version." },
        dinner: { name: "Tableaux (Daikanyama)", type: "restaurant", safety: "safe", explanation: "European-style fine dining. GF menu available, English-speaking staff. A sophisticated farewell dinner." },
        snack: { name: "7-Eleven (Odaiba — plain rice onigiri)", type: "supermarket", safety: "risk", explanation: "Plain white rice onigiri without filling is usually GF — check the allergen label on the back carefully." },
      },
    ],
    bars: [
      { name: "Craft beer bars (Nakameguro)", gfOptions: ["Yoho Brewing Ao-Oni (GF)", "Cider"], note: "Some craft bars carry GF options. Call ahead — availability varies." },
      { name: "Wine bars (Ginza)", gfOptions: ["Japanese wine", "Sake (pure rice sake)"], note: "Pure rice sake is GF. Confirm it is not blended. Ginza has excellent wine bars." },
      { name: "Bar Benfiddich (Shinjuku)", gfOptions: ["Craft cocktails (most GF)", "Wine"], note: "World-renowned cocktail bar. Most spirits are GF — avoid anything with beer as an ingredient." },
      { name: "General note", gfOptions: ["Wine", "Shochu (sweet potato/rice)"], note: "Japanese beer contains gluten. Stick to wine, pure sake, or GF craft beer specifically labeled." },
    ],
    supermarkets: [
      { name: "Natural Lawson", type: "supermarket", safety: "safe", explanation: "Full allergen labeling by law. Easier to identify safe products than standard convenience stores." },
      { name: "Seijo Ishii", type: "supermarket", safety: "safe", explanation: "Premium supermarket with imported GF products from Europe. Shibuya and Shinjuku locations." },
      { name: "Kaldi Coffee Farm", type: "supermarket", safety: "safe", explanation: "Import store with GF pasta, crackers and snacks. Multiple locations across Tokyo." },
    ],
    emergency: {
      advice: "Download the 'Gluten Free Japan' app. If exposed: plain white rice, banana, pure water. Show your celiac card to staff. Hospital: St. Luke's International (Chuo-ku) has English-speaking staff.",
      safeSnacks: ["Plain white rice onigiri (check label)", "Bananas", "Pure rice crackers (check no shoyu)", "Boiled edamame (plain)", "Fresh fruit from markets"],
    },
  },

  barcelona: {
    safetyScore: 8,
    summary: "Barcelona has excellent GF awareness boosted by a strong local celiac association (ACSA). GF paella, tapas and pintxos are widely available. Estrella Damm Daura (GF beer) is made locally and available everywhere.",
    days: [
      {
        theme: "Gothic Quarter & El Born — medieval Barcelona",
        area: "Gothic Quarter",
        tip: "The Gothic Quarter's narrow streets hide great GF spots. El Born next door is trendier — stroll between them after lunch.",
        breakfast: { name: "Federal Café (El Born)", type: "café", safety: "safe", explanation: "GF toast, eggs, granola and smoothie bowls. Clearly marked on menu. Staff speak English and understand celiac." },
        lunch: { name: "La Pepita (Gràcia — 20 min walk)", type: "restaurant", safety: "safe", explanation: "ACSA-recommended avocado toast and salads on GF bread. Worth the short walk from Born." },
        dinner: { name: "El Xampanyet (El Born)", type: "restaurant", safety: "risk", explanation: "Classic tapas bar near Picasso Museum. Some tapas are GF — anchovies, olives, cheese. Confirm each with staff." },
        snack: { name: "Veritas (El Born branch)", type: "supermarket", safety: "safe", explanation: "Organic supermarket with Barcelona's best GF section. Great for afternoon snacks before dinner." },
      },
      {
        theme: "Eixample — Gaudí, modernisme and great restaurants",
        area: "Eixample",
        tip: "The Eixample grid is perfect for walking. Sagrada Família is a 15-min walk from most restaurants listed here. Book the Sagrada Família early — queues are brutal.",
        breakfast: { name: "Flax & Kale (Tallers, near Eixample)", type: "café", safety: "safe", explanation: "Health-focused café with a full GF menu. Very celiac-aware staff. Great açaí bowls and GF pastries." },
        lunch: { name: "Honest Greens (Eixample)", type: "restaurant", safety: "safe", explanation: "Modern healthy restaurant. GF clearly labelled throughout menu. One of Barcelona's most reliable celiac options." },
        dinner: { name: "Parking Pizza (Eixample)", type: "restaurant", safety: "safe", explanation: "GF pizza bases with a separate oven and dedicated utensils. Book ahead — very popular with celiacs." },
        snack: { name: "Bon Preu (Eixample)", type: "supermarket", safety: "safe", explanation: "Local chain with a large GF section and own-brand GF products. Good value." },
      },
      {
        theme: "Barceloneta & Port Olímpic — beach and seafood",
        area: "Barceloneta",
        tip: "Seafood in Barceloneta is naturally GF-friendly — grilled fish, arroz (rice) and gambas. The risk is in sauces. Ask for 'sin gluten' and specify no breadcrumbs.",
        breakfast: { name: "Bar Calders (Sant Antoni) — pick up snacks first", type: "café", safety: "safe", explanation: "Pick up GF snacks from Veritas before heading to the beach. The bar itself opens at noon." },
        lunch: { name: "La Mar Salada (Barceloneta)", type: "restaurant", safety: "safe", explanation: "Seafood restaurant near Barceloneta with GF paella available on advance request. Sea views, excellent service." },
        dinner: { name: "Can Ros (Barceloneta)", type: "restaurant", safety: "risk", explanation: "Family-run seafood since 1911. GF rice dishes available — confirm sauces and stocks contain no gluten." },
        snack: { name: "Mercadona (Barceloneta)", type: "supermarket", safety: "safe", explanation: "Hacendado GF own-brand line. Very affordable. Stock up on GF crackers for the beach." },
      },
      {
        theme: "Gràcia — the village within the city",
        area: "Gràcia",
        tip: "Gràcia feels like a separate village. During Festa Major de Gràcia (August), streets are decorated — most bar food during fiestas is gluten-heavy so eat in restaurants.",
        breakfast: { name: "La Pepita (Gràcia)", type: "restaurant", safety: "safe", explanation: "ACSA-certified. GF bread for all toasts. This is the original Pepita — a Barcelona celiac classic." },
        lunch: { name: "La Pepita (longer lunch menu)", type: "restaurant", safety: "safe", explanation: "Full lunch menu with GF pasta, salads and more. Ask for the gluten-free menu card." },
        dinner: { name: "Gresca (Eixample, near Gràcia border)", type: "restaurant", safety: "safe", explanation: "Michelin-recommended modern Catalan. Chef Rafa Peña is celiac-aware — call ahead when booking." },
        snack: { name: "Veritas (Gràcia branch)", type: "supermarket", safety: "safe", explanation: "The biggest Veritas in Barcelona. Huge dedicated GF section — best for stocking up mid-trip." },
      },
      {
        theme: "Montjuïc & Poble Sec — gardens and tapas bars",
        area: "Montjuïc",
        tip: "Take the cable car up Montjuïc for panoramic views. Poble Sec below has Barcelona's most interesting tapas bar street: Carrer de Blai (pintxos street). Ask which are GF.",
        breakfast: { name: "Cafè de l'Acadèmia (Barri Gòtic)", type: "café", safety: "risk", explanation: "Traditional Catalan café. Eggs and toast (on GF bread if you ask) are possible — confirm with staff." },
        lunch: { name: "Bodega Sepúlveda (Poble Sec)", type: "restaurant", safety: "risk", explanation: "Traditional Catalan. GF options possible — ask staff and confirm preparation each time." },
        dinner: { name: "Quimet & Quimet (Poble Sec)", type: "bar", safety: "risk", explanation: "Famous standing bar with conservas (tinned fish) tapas. Many are naturally GF — anchovies, mussels, tuna. Confirm bread." },
        snack: { name: "Mercat de Sant Antoni", type: "supermarket", safety: "safe", explanation: "Beautifully restored 19th-century market. Fresh produce and several organic stalls with GF products." },
      },
      {
        theme: "Poblenou & 22@ — beach, tech district and local life",
        area: "Poblenou",
        tip: "Poblenou is Barcelona's old industrial district turned creative hub. The Rambla del Poblenou is a quieter, local alternative to La Rambla — lined with good cafés.",
        breakfast: { name: "Cafè del Centre (Poblenou)", type: "café", safety: "safe", explanation: "Neighborhood café on the Rambla del Poblenou. Eggs, fruit and coffee. Ask about GF toast options." },
        lunch: { name: "Federal Café (Poblenou branch)", type: "café", safety: "safe", explanation: "Second Federal Café location. Same GF standards as the Born branch — reliable and well-marked." },
        dinner: { name: "Restaurant 7 Portes (Port Olímpic)", type: "restaurant", safety: "risk", explanation: "Historic restaurant since 1836. GF paella available — must be ordered in advance. One of Barcelona's most iconic spots." },
        snack: { name: "Bon Preu (Poblenou)", type: "supermarket", safety: "safe", explanation: "Neighborhood supermarket. Local GF product selection. Pick up snacks for the beach walk." },
      },
      {
        theme: "Tibidabo & Sarrià — the hills above Barcelona",
        area: "Sarrià",
        tip: "Take the FGC train from Plaça Catalunya to Sarrià for a quiet, upscale neighborhood. Tibidabo amusement park is at the top — most food there is unsafe for celiacs.",
        breakfast: { name: "Bar Tomàs de Sarrià", type: "café", safety: "risk", explanation: "Famous for patatas bravas (sometimes GF — ask). Coffee and juice are safe. Best to eat before going uphill." },
        lunch: { name: "Cervecería Catalana (Eixample, back for lunch)", type: "restaurant", safety: "risk", explanation: "Great tapas but shared kitchen. Confirm each dish individually. Get a table — it's worth the wait." },
        dinner: { name: "Lasarte (Eixample)", type: "restaurant", safety: "safe", explanation: "Three Michelin stars. Chef Martín Berasategui accommodates celiac disease. Book weeks in advance. A special farewell dinner." },
        snack: { name: "Veritas (Sarrià)", type: "supermarket", safety: "safe", explanation: "Veritas in the Sarrià neighborhood. Pick up GF wine biscuits and artisan GF crackers for the hillside." },
      },
    ],
    bars: [
      { name: "Bar Calders (Sant Antoni)", gfOptions: ["Estrella Damm Daura (GF)", "Cider"], note: "Daura is brewed locally by Estrella Damm specifically as a GF beer. Available almost everywhere in Barcelona." },
      { name: "Morro Fi (Eixample)", gfOptions: ["Estrella Damm Daura", "Wine", "Vermouth"], note: "Craft bar with Daura on draught. Traditional Catalan vermouth is GF. Great atmosphere." },
      { name: "Bar Marsella (Gothic Quarter)", gfOptions: ["Absinthe (GF)", "Wine"], note: "Barcelona's oldest bar (1820). Absinthe and wine are safe. Dusty bottles and incredible atmosphere." },
      { name: "Any vermutería", gfOptions: ["Vermouth", "Wine", "Cider"], note: "Traditional Catalan vermouth is GF. A local Sunday morning ritual — vermouth with olives." },
    ],
    supermarkets: [
      { name: "Veritas", type: "supermarket", safety: "safe", explanation: "Organic chain with the widest GF selection in Barcelona. Multiple locations." },
      { name: "Bon Preu / Esclat", type: "supermarket", safety: "safe", explanation: "Local chain with large GF section and own-brand GF products." },
      { name: "Mercadona", type: "supermarket", safety: "safe", explanation: "Nationwide chain with Hacendado GF line. Excellent value." },
    ],
    emergency: {
      advice: "Contact ACSA (Associació Celíacs de Catalunya) for their restaurant guide. If exposed: plain rice, banana, water. Hospital: Hospital Clínic de Barcelona has excellent GF food service during stays.",
      safeSnacks: ["Estrella Daura GF beer or cider", "Plain Pringles (original)", "Rice cakes (Veritas)", "Fresh fruit from La Boqueria", "Plain mixed nuts"],
    },
  },

  amsterdam: {
    safetyScore: 8,
    summary: "Amsterdam has high GF awareness with many dedicated GF restaurants and bakeries. The Dutch celiac association (NCV) is active and Albert Heijn — the main supermarket chain — has an excellent own-brand GF range.",
    days: [
      {
        theme: "Jordaan — canals, art and the best cafés",
        area: "Jordaan",
        tip: "The Jordaan is Amsterdam's most charming neighborhood. The Anne Frank House is here — book tickets months in advance. Stroll the Negen Straatjes (9 Streets) for boutique shopping.",
        breakfast: { name: "Bakers & Roasters (Jordaan)", type: "café", safety: "safe", explanation: "GF pancakes and brunch items clearly marked. Staff trained in celiac. Hugely popular — arrive early or wait." },
        lunch: { name: "Bolhoed (Prinsengracht)", type: "restaurant", safety: "safe", explanation: "Vegetarian restaurant with many GF dishes clearly marked. Cozy canal-side setting in the Jordaan." },
        dinner: { name: "Restaurant Envy (Jordaan)", type: "restaurant", safety: "safe", explanation: "Modern European with an extensive GF menu. Call ahead to confirm — consistently excellent for celiac travelers." },
        snack: { name: "Albert Heijn (Jordaan)", type: "supermarket", safety: "safe", explanation: "AH own-brand GF line with great labeling. Perfect for snacks — GF stroopwafels, rice cakes and more." },
      },
      {
        theme: "Museum Quarter & Vondelpark — art and green space",
        area: "Museum Quarter",
        tip: "Rijksmuseum, Van Gogh Museum and Stedelijk are all within 5 min walk. Book all tickets online — no walk-ins. Vondelpark is Amsterdam's central park, perfect for a GF picnic.",
        breakfast: { name: "Dignita Hoftuin (near Museum Quarter)", type: "café", safety: "safe", explanation: "Social enterprise café with GF menu options. Celiac-aware kitchen. Beautiful garden setting." },
        lunch: { name: "Pluk Amsterdam (De Pijp, nearby)", type: "café", safety: "safe", explanation: "Trendy café with GF salads and bowls. Ingredients listed clearly. One of Amsterdam's most Instagram-friendly spots." },
        dinner: { name: "Rijsel (Museum Quarter)", type: "restaurant", safety: "risk", explanation: "French-style rotisserie. Chicken and simple salads can be GF — ask staff explicitly about preparation." },
        snack: { name: "Marqt (Museum Quarter)", type: "supermarket", safety: "safe", explanation: "Premium organic supermarket near the museums. Great GF range — pick up snacks for Vondelpark." },
      },
      {
        theme: "De Pijp — Amsterdam's most multicultural neighborhood",
        area: "De Pijp",
        tip: "Albert Cuyp Market is the heart of De Pijp — open Mon–Sat. Herring (haring) stalls are naturally GF. De Pijp has the highest density of restaurants per block in Amsterdam.",
        breakfast: { name: "Bakers & Roasters (De Pijp — original branch)", type: "café", safety: "safe", explanation: "The original Bakers & Roasters. Slightly less crowded than the Jordaan branch. Same excellent GF pancakes." },
        lunch: { name: "Semhar (De Pijp)", type: "restaurant", safety: "safe", explanation: "Ethiopian restaurant — injera is teff-based and gluten-free. Naturally celiac-safe cuisine with vibrant flavors." },
        dinner: { name: "Café George (De Pijp)", type: "café", safety: "risk", explanation: "Modern brasserie. GF pasta available but confirm preparation carefully each visit." },
        snack: { name: "Albert Cuyp Market herring stall", type: "café", safety: "safe", explanation: "Raw herring (haring) with onions — a Dutch street food classic that is completely GF. Skip the bread roll." },
      },
      {
        theme: "Centrum & Red Light District — the historic heart",
        area: "Centrum",
        tip: "The Red Light District is worth exploring in daylight for the architecture. Avoid most tourist trap restaurants on the main streets — the GF options listed here are the exceptions.",
        breakfast: { name: "Albert Heijn To Go (Central Station)", type: "supermarket", safety: "safe", explanation: "Pick up GF yogurt, fruit and rice cakes before heading out. Efficient and completely safe." },
        lunch: { name: "Pluk Amsterdam (Centrum branch)", type: "café", safety: "safe", explanation: "Second Pluk location in the city center. Same GF standards and fresh, clear labeling." },
        dinner: { name: "Bridges Restaurant (Sofitel Legend)", type: "restaurant", safety: "safe", explanation: "Fine dining in a historic bank building. Chef accommodates celiac with advance notice. A special occasion dinner." },
        snack: { name: "Ekoplaza (Centrum)", type: "supermarket", safety: "safe", explanation: "Organic-only supermarket. Wide dedicated GF range — the best in Amsterdam for certified products." },
      },
      {
        theme: "Noord — Amsterdam's creative frontier",
        area: "Noord",
        tip: "Take the free ferry behind Central Station to Amsterdam Noord. A 10-min crossing takes you to a completely different, industrial-creative Amsterdam. Eye Film Museum is here.",
        breakfast: { name: "Pllek (Noord)", type: "café", safety: "risk", explanation: "Trendy beach bar-café made from shipping containers. GF options possible — ask staff about each dish." },
        lunch: { name: "NDSM Wharf food trucks", type: "café", safety: "risk", explanation: "Food truck festival area. Look for trucks with allergen menus. Options vary — go at lunchtime for most choice." },
        dinner: { name: "Café Noorderlicht (Noord)", type: "café", safety: "risk", explanation: "Greenhouse café in Noord. Some GF options — ask staff. Great atmosphere worth the trip regardless." },
        snack: { name: "Albert Heijn (Noord)", type: "supermarket", safety: "safe", explanation: "AH store in Noord. Same excellent GF own-brand range. Stock up before the evening." },
      },
      {
        theme: "Plantage & Eastern Islands — nature and waterfront",
        area: "Plantage",
        tip: "Plantage is Amsterdam's green zoo quarter. Artis Royal Zoo and the Hortus Botanicus are here. The Eastern Islands (Borneo, Java, KNSM) are quieter, architectural gems.",
        breakfast: { name: "Dignita (Hoftuin)", type: "café", safety: "safe", explanation: "Open for breakfast from 9am. GF options clearly marked. Quiet start before the zoo." },
        lunch: { name: "Café Kadijk (Kadijksplein)", type: "café", safety: "risk", explanation: "Local neighborhood café near the Eastern Islands. Ask about GF options — simple eggs and salads are usually safe." },
        dinner: { name: "Restaurant Breda (Jordaan, evening)", type: "restaurant", safety: "safe", explanation: "Modern Dutch cuisine. Chef accommodates celiac with advance notice. Intimate, excellent wine list." },
        snack: { name: "Marqt (Plantage area)", type: "supermarket", safety: "safe", explanation: "Premium organic grocery. Pick up artisanal GF snacks and local cheeses (always GF)." },
      },
      {
        theme: "Oud-Zuid & Zuidas — upscale Amsterdam farewell",
        area: "Oud-Zuid",
        tip: "Oud-Zuid is Amsterdam's most affluent neighborhood. The Concertgebouw concert hall and Museumplein are here. A leisurely final morning in a neighborhood café before heading to the airport.",
        breakfast: { name: "Brasserie Keyzer (near Concertgebouw)", type: "café", safety: "risk", explanation: "Historic café next to the Concertgebouw. Eggs and coffee are safe — ask about GF toast." },
        lunch: { name: "Pluk Amsterdam (final lunch)", type: "café", safety: "safe", explanation: "Reliable last GF lunch before departure. Always fresh, always labeled, always accommodating." },
        dinner: { name: "Brouwerij 't IJ (farewell drinks)", type: "bar", safety: "safe", explanation: "Famous windmill brewery in Amsterdam. GF craft beer available seasonally. End your trip with a local beer at an icon." },
        snack: { name: "Ekoplaza (Oud-Zuid)", type: "supermarket", safety: "safe", explanation: "Stock up on Dutch GF products to take home — AH GF stroopwafels, Ekoplaza GF crackers." },
      },
    ],
    bars: [
      { name: "Brouwerij 't IJ (De Gooyer windmill)", gfOptions: ["GF craft beer (seasonal)", "Cider"], note: "Famous windmill brewery. Ask for GF options at the bar — available seasonally. Worth visiting regardless." },
      { name: "Café de Klos (Leidseplein)", gfOptions: ["Wine", "Jenever (Dutch gin)"], note: "Traditional brown café (bruine kroeg). Wine and genever spirits are safe. Beer contains gluten." },
      { name: "Bar Bukowski (Oosterpark)", gfOptions: ["Wine", "Cider", "Spirits"], note: "Trendy bar with wide drink selection. GF options easily available. Good music and atmosphere." },
      { name: "In de Wildeman (Centrum)", gfOptions: ["GF beer (ask)", "Cider"], note: "Craft beer specialist. Ask specifically for GF bottles — they usually stock a couple. Great selection of spirits too." },
    ],
    supermarkets: [
      { name: "Albert Heijn", type: "supermarket", safety: "safe", explanation: "Nationwide chain with AH GF own-brand line. Very well labeled. Found on almost every corner." },
      { name: "Marqt", type: "supermarket", safety: "safe", explanation: "Organic premium supermarket with excellent GF section." },
      { name: "Ekoplaza", type: "supermarket", safety: "safe", explanation: "Organic-only supermarket. Wide dedicated GF range — best for certified products." },
    ],
    emergency: {
      advice: "NCV (Nederlandse Coeliakie Vereniging) has an app with safe restaurants. If exposed: plain rice, banana, electrolytes. Hospital: Amsterdam UMC (AMC) — excellent gastroenterology department.",
      safeSnacks: ["Rice cakes (AH GF line)", "Bananas", "Plain nuts (sealed pack)", "Gouda cheese (always GF)", "Packaged GF cookies (AH)"],
    },
  },

  paris: {
    safetyScore: 7,
    summary: "Paris is improving fast for celiac travelers. A growing number of 100% GF bakeries and certified restaurants have opened. French cuisine relies heavily on flour so vigilance in traditional brasseries is essential.",
    days: [
      {
        theme: "Le Marais — the Jewish Quarter and medieval Paris",
        area: "Le Marais",
        tip: "The Marais combines the historic Jewish Quarter (rue des Rosiers) with the LGBT+ hub and the Centre Pompidou. Jewish deli food is often naturally GF — falafel in a salad bowl instead of pita.",
        breakfast: { name: "Noglu Passage des Panoramas", type: "café", safety: "safe", explanation: "100% GF bakery and café near the Grands Boulevards. Dedicated kitchen. No CC risk. A must-visit for Paris celiac travelers." },
        lunch: { name: "Le Potager du Marais", type: "restaurant", safety: "safe", explanation: "Vegan and GF. Most dishes clearly marked. In the heart of the Marais — excellent value for Paris." },
        dinner: { name: "Chez Hanna (Le Marais)", type: "restaurant", safety: "risk", explanation: "Jewish Marais restaurant. Falafel and hummus can be GF — ask for a bowl instead of pita. Confirm falafel ingredients." },
        snack: { name: "Naturalia (Le Marais)", type: "supermarket", safety: "safe", explanation: "Organic chain with excellent GF section. Great for afternoon snacks — GF crackers, fruit, chocolate." },
      },
      {
        theme: "Saint-Germain-des-Prés — literary cafés and the Left Bank",
        area: "Saint-Germain",
        tip: "Sartre and Simone de Beauvoir wrote at Café de Flore and Les Deux Magots. The coffee is safe; the pastries are not. Walk to Luxembourg Gardens after lunch.",
        breakfast: { name: "Helmut Newcake (République, morning trip)", type: "café", safety: "safe", explanation: "Paris's first GF patisserie. Croissants, éclairs — all GF. No CC risk. Worth the 20-min walk from Saint-Germain." },
        lunch: { name: "Noglu Restaurant (lunch menu)", type: "restaurant", safety: "safe", explanation: "Dedicated 100% GF restaurant. Lunch menu changes daily — always safe. Book in advance for weekday lunches." },
        dinner: { name: "Breizh Café (Marais or Saint-Germain)", type: "restaurant", safety: "safe", explanation: "Buckwheat galettes are naturally GF. Confirm 100% buckwheat flour with no wheat added — ask explicitly." },
        snack: { name: "Helmut Newcake (takeaway)", type: "café", safety: "safe", explanation: "GF pastries and snacks to take away. Perfect for Luxembourg Gardens picnic." },
      },
      {
        theme: "Montmartre & Pigalle — the bohemian hilltop",
        area: "Montmartre",
        tip: "Climb to Sacré-Cœur early before the tourist rush. Rue Lepic is Montmartre's food street — the market and produce shops are worth exploring. Most crêpe stands are NOT GF.",
        breakfast: { name: "Café des Deux Moulins (Montmartre)", type: "café", safety: "risk", explanation: "Amélie Poulain's café. Eggs and coffee are safe. Croissants are not GF. Order carefully." },
        lunch: { name: "Le Miroir (Montmartre)", type: "restaurant", safety: "risk", explanation: "Good modern French bistro on Rue des Martyrs. Some GF options — ask the waiter explicitly about each dish." },
        dinner: { name: "Le Relais Gascon (Montmartre)", type: "restaurant", safety: "risk", explanation: "Rustic French. Salads can be GF without croutons — confirm dressing. Meat dishes may be safe." },
        snack: { name: "Naturalia (Pigalle)", type: "supermarket", safety: "safe", explanation: "Organic chain. GF snacks for the hill climb. Pick up supplies before tackling Montmartre." },
      },
      {
        theme: "Bastille & Nation — working-class Paris",
        area: "Bastille",
        tip: "The Aligre Market (Marché d'Aligre) near Bastille is one of Paris's best and most affordable. Fresh produce and cheese stalls are completely GF. Open every morning except Monday.",
        breakfast: { name: "Aligre Market fresh produce", type: "café", safety: "safe", explanation: "Fresh fruit, vegetables, and artisan cheese from the morning market. Completely safe GF breakfast option." },
        lunch: { name: "Septime (Bastille)", type: "restaurant", safety: "safe", explanation: "Acclaimed modern French. Chef accommodates celiac — must inform clearly when booking. One of Paris's best restaurants." },
        dinner: { name: "Le Bistrot Paul Bert (Bastille)", type: "restaurant", safety: "risk", explanation: "Classic bistro. Steak-frites can be GF if fries are not shared-fried — always ask and confirm." },
        snack: { name: "Monoprix Bio (Bastille)", type: "supermarket", safety: "safe", explanation: "Organic section of Monoprix with good GF range. Pick up GF crackers and fruit for the afternoon." },
      },
      {
        theme: "Canal Saint-Martin & République — hipster Paris",
        area: "Canal Saint-Martin",
        tip: "Canal Saint-Martin is Paris's most Instagram-friendly neighborhood. Picnic by the canal with GF supplies from a nearby épicerie bio. The area has a growing number of GF-aware cafés.",
        breakfast: { name: "Du Pain et des Idées (Canal Saint-Martin)", type: "café", safety: "unsafe", explanation: "Famous bakery — beautiful but entirely wheat-based. Skip it. Buy coffee and eat GF breakfast from Naturalia nearby." },
        lunch: { name: "Holybelly (Canal Saint-Martin)", type: "café", safety: "risk", explanation: "Australian brunch café. GF pancakes available on weekends. Confirm prep — shared griddle is a risk." },
        dinner: { name: "Comptoir Général (Canal Saint-Martin)", type: "restaurant", safety: "risk", explanation: "African-inspired restaurant and bar. Some GF dishes — ask staff about each. Great atmosphere." },
        snack: { name: "Épicerie bio (Canal area)", type: "supermarket", safety: "safe", explanation: "Small organic shops along the canal sell GF snacks. Perfect for canal picnic supplies." },
      },
      {
        theme: "Palais-Royal & Louvre — culture and elegance",
        area: "Palais-Royal",
        tip: "Book Louvre tickets online. The museum is enormous — wear comfortable shoes and allow a full morning. The Palais-Royal gardens are a beautiful hidden gem afterward.",
        breakfast: { name: "Noglu (Passage des Panoramas)", type: "café", safety: "safe", explanation: "Start the cultural day right at Paris's best 100% GF café. Croissants, quiche and pastries." },
        lunch: { name: "Kunitoraya 2 (Palais-Royal)", type: "restaurant", safety: "risk", explanation: "Japanese-French fusion. Some GF options but CC risk in kitchen. Ask specifically — staff are helpful." },
        dinner: { name: "Le Grand Véfour (Palais-Royal)", type: "restaurant", safety: "safe", explanation: "Two Michelin stars in the Palais-Royal arcades. Chef Guy Martin is celiac-aware — call ahead. Historic and stunning." },
        snack: { name: "Carrefour City (Louvre area)", type: "supermarket", safety: "safe", explanation: "Carrefour Bio GF own-brand line. Good for quick afternoon snacks near the museums." },
      },
      {
        theme: "Île Saint-Louis & Notre-Dame — farewell to Paris",
        area: "Île de la Cité",
        tip: "Notre-Dame reopened in 2024 after restoration — book timed entry. Île Saint-Louis is one of Paris's most charming islands. Berthillon ice cream is GF — confirm each flavor.",
        breakfast: { name: "Café de Flore (farewell coffee)", type: "café", safety: "risk", explanation: "Iconic Left Bank café. Coffee and freshly squeezed orange juice are safe. Say no to the bread basket." },
        lunch: { name: "Brasserie de l'Île Saint-Louis", type: "restaurant", safety: "risk", explanation: "Classic Alsatian brasserie on the island. Steak, eggs, and simple dishes can be GF — confirm each with staff." },
        dinner: { name: "Septime (farewell dinner or Noglu)", type: "restaurant", safety: "safe", explanation: "If you couldn't book Septime before, try again for your farewell dinner. Alternatively, Noglu Restaurant does excellent GF evening meals." },
        snack: { name: "Berthillon ice cream (Île Saint-Louis)", type: "café", safety: "safe", explanation: "Paris's most famous ice cream. Scoops are GF — confirm each flavor. Avoid cone (wheat) — use a cup." },
      },
    ],
    bars: [
      { name: "Experimental Cocktail Club (Marais)", gfOptions: ["Wine", "Cocktails (most)", "Cider"], note: "Sophisticated cocktail bar. Most spirits and wine are GF. Ask about ingredients in complex cocktails." },
      { name: "Café de la Paix (Opéra)", gfOptions: ["Champagne", "Wine", "Spirits"], note: "Historic grand café. Wine and champagne are always safe. An expensive but unforgettable experience." },
      { name: "Little Red Door (Marais)", gfOptions: ["Craft cocktails", "Wine"], note: "Award-winning cocktail bar. Staff are knowledgeable about ingredients." },
      { name: "Craft beer bars (Canal Saint-Martin)", gfOptions: ["GF craft beer (ask)", "Cider"], note: "Growing craft scene. Ask specifically for GF options — varies by bar and season." },
    ],
    supermarkets: [
      { name: "Naturalia", type: "supermarket", safety: "safe", explanation: "Best GF section in Paris. Own-brand certified GF products." },
      { name: "Monoprix Bio", type: "supermarket", safety: "safe", explanation: "Organic section of Monoprix with decent GF range. Found throughout Paris." },
      { name: "Carrefour City", type: "supermarket", safety: "safe", explanation: "Carrefour Bio GF own-brand line. Found throughout central Paris." },
    ],
    emergency: {
      advice: "AFDIAG (Association Française Des Intolérants Au Gluten) has a restaurant guide. If exposed: plain rice, banana, water. Hospital: Hôpital Lariboisière — ask for gastro-entérologie. Say: 'J'ai mangé du gluten, je suis cœliaque.'",
      safeSnacks: ["Rice cakes (Naturalia)", "Fresh fruit from any market", "Plain cheese (fromage)", "GF crackers (Naturalia)", "Berthillon ice cream (cup, not cone)"],
    },
  },

  london: {
    safetyScore: 9,
    summary: "London leads Europe in GF awareness. Natasha's Law (2021) requires full ingredient labeling on all pre-packed food. Chains like Wagamama and Nando's have dedicated GF menus. Coeliac UK has over 140,000 members.",
    days: [
      {
        theme: "Soho & Covent Garden — the buzzing West End",
        area: "Soho",
        tip: "Soho has London's highest restaurant density. Book dinner well in advance — walk-ins are difficult at good restaurants. Covent Garden market has street food stalls — check allergen menus.",
        breakfast: { name: "Granger & Co (Clerkenwell)", type: "café", safety: "safe", explanation: "Australian café — the London original. GF ricotta hotcakes and eggs. Well labeled, trained staff." },
        lunch: { name: "Mele e Pere (Soho)", type: "restaurant", safety: "safe", explanation: "Italian wine bar with dedicated GF pasta. One of Soho's most celiac-reliable options. Book ahead." },
        dinner: { name: "Dishoom (Covent Garden)", type: "restaurant", safety: "risk", explanation: "Indian — rice dishes, dal and grilled meats are safe. Naan and roti contain gluten. Staff are helpful if asked." },
        snack: { name: "Whole Foods Market (Kensington)", type: "supermarket", safety: "safe", explanation: "Huge GF section with prepared foods labeled. Multiple London locations. Great for afternoon snacking." },
      },
      {
        theme: "South Bank & Borough Market — food, culture, river",
        area: "South Bank",
        tip: "Borough Market (Thurs–Sat) is London's greatest food market. Many stalls have allergen menus on request. Seek out the dedicated GF stalls — there are several. Arrive before noon.",
        breakfast: { name: "Monmouth Coffee (Borough Market)", type: "café", safety: "safe", explanation: "London's finest coffee roaster. Coffee is GF. Pick up fruit and GF snacks from the market stalls for breakfast." },
        lunch: { name: "Roast Restaurant (Borough Market)", type: "restaurant", safety: "risk", explanation: "Classic British roast in a stunning Borough Market setting. GF options available — confirm sauces and gravy." },
        dinner: { name: "Brasserie Zédel (Piccadilly)", type: "restaurant", safety: "risk", explanation: "Stunning French brasserie. GF steak available — confirm sauce and whether fries are in a dedicated fryer." },
        snack: { name: "Marks & Spencer (London Bridge)", type: "supermarket", safety: "safe", explanation: "Excellent GF labelling and own-brand GF range. Perfect for afternoon snacks near Borough Market." },
      },
      {
        theme: "Notting Hill & Portobello Road — market day",
        area: "Notting Hill",
        tip: "Portobello Road Market is best on Saturday (all market sections open). Antiques, fresh produce, and street food. The covered Portobello Market section has food stalls — check allergens.",
        breakfast: { name: "Electric Diner (Portobello)", type: "café", safety: "risk", explanation: "American-style diner. Eggs and bacon are GF; hash browns — confirm no wheat. Ask staff clearly." },
        lunch: { name: "Ottolenghi (Notting Hill)", type: "café", safety: "risk", explanation: "Salads and dishes often GF but shared service equipment is a risk. Ask which dishes were prepared without wheat." },
        dinner: { name: "Stem & Glory (King's Cross for the evening)", type: "restaurant", safety: "safe", explanation: "Vegan restaurant with a fully GF kitchen. Very celiac safe — one of London's most reliable options." },
        snack: { name: "Planet Organic (Notting Hill)", type: "supermarket", safety: "safe", explanation: "Organic supermarket with an excellent GF section. Good for market day snack supplies." },
      },
      {
        theme: "East London — Shoreditch & Brick Lane",
        area: "Shoreditch",
        tip: "Brick Lane is famous for curry houses — rice and dal dishes are usually GF. The Sunday Upmarket at Ely's Yard has GF food stalls. Shoreditch street art is best explored in the morning.",
        breakfast: { name: "Ozone Coffee (Shoreditch)", type: "café", safety: "safe", explanation: "New Zealand-run specialty coffee. GF breakfast items available. Staff are attentive to dietary requirements." },
        lunch: { name: "Wagamama (Shoreditch)", type: "restaurant", safety: "safe", explanation: "Full GF menu with a dedicated GF wok protocol. One of the UK's most celiac-safe restaurant chains." },
        dinner: { name: "Brat (Shoreditch)", type: "restaurant", safety: "risk", explanation: "Michelin-starred, fire-focused cooking. Some GF options — call ahead and ask the chef's team to accommodate." },
        snack: { name: "Tesco (Shoreditch)", type: "supermarket", safety: "safe", explanation: "Free From range is large and well-priced. Great for picking up GF snacks for the afternoon." },
      },
      {
        theme: "Greenwich & South East — maritime history",
        area: "Greenwich",
        tip: "Greenwich is 30 min from central London by DLR or river bus. Greenwich Park has stunning views over London from the Royal Observatory. The Cutty Sark and National Maritime Museum are nearby.",
        breakfast: { name: "Planque (Hackney — on the way)", type: "café", safety: "safe", explanation: "Wine bar and café with GF options. Ask staff — some dishes are fully GF. Stop on the way to Greenwich." },
        lunch: { name: "Nando's (Greenwich)", type: "restaurant", safety: "safe", explanation: "GF menu and dedicated fryer for GF chips. Consistently safe across all UK branches. Peri-peri chicken is GF." },
        dinner: { name: "The Spread Eagle (Hackney — return evening)", type: "restaurant", safety: "safe", explanation: "Fully vegan pub with GF options. A London rarity — pub food that is genuinely celiac-safe." },
        snack: { name: "Waitrose (Greenwich)", type: "supermarket", safety: "safe", explanation: "Premium supermarket with excellent GF section and clear labelling. Prepared GF salads available." },
      },
      {
        theme: "Kensington & Chelsea — museums and royal parks",
        area: "Kensington",
        tip: "The Natural History Museum, V&A and Science Museum are all free and within 5 min walk. Hyde Park and Kensington Gardens stretch west — perfect for a GF picnic afternoon.",
        breakfast: { name: "Daylesford Organic (Kensington)", type: "café", safety: "safe", explanation: "Upscale farm shop café. GF options clearly marked. Excellent GF pastries and full English alternatives." },
        lunch: { name: "Leon (South Kensington)", type: "café", safety: "safe", explanation: "Fast-food chain with a GF menu. Clearly labelled, good for a quick post-museum lunch." },
        dinner: { name: "Bibendum (Chelsea)", type: "restaurant", safety: "safe", explanation: "Iconic Art Nouveau restaurant in the Michelin Building. Chef accommodates celiac with advance notice. Stunning setting." },
        snack: { name: "Marks & Spencer (Kensington High Street)", type: "supermarket", safety: "safe", explanation: "Large GF prepared foods section. Perfect for Hyde Park picnic supplies." },
      },
      {
        theme: "Camden & Primrose Hill — music, market and views",
        area: "Camden",
        tip: "Camden Market (open daily) has global food stalls — allergen menus available on request. Primrose Hill above gives the best view of London's skyline. The Beatles connection: Abbey Road is nearby.",
        breakfast: { name: "Greenberry Café (Primrose Hill)", type: "café", safety: "safe", explanation: "Neighborhood café on Primrose Hill. GF options on request — eggs and fruit are always safe." },
        lunch: { name: "Camden Market GF stalls (weekend)", type: "restaurant", safety: "risk", explanation: "Several stalls cater GF — ask each vendor for an allergen menu. Global food options from Korean to Mexican." },
        dinner: { name: "Brewdog Camden (farewell drinks and dinner)", type: "bar", safety: "safe", explanation: "Brewdog Vagabond GF pale ale and a GF burger to end the trip. A fitting London farewell." },
        snack: { name: "Whole Foods Market (Camden)", type: "supermarket", safety: "safe", explanation: "Huge GF section. Stock up on English GF products to take home — Nakd bars, M&S GF biscuits." },
      },
    ],
    bars: [
      { name: "Brewdog (all branches)", gfOptions: ["Brewdog Vagabond (GF)", "Cider"], note: "Major craft beer chain. GF Vagabond Pale Ale available at all branches. Reliable and consistent." },
      { name: "Wetherspoons (London-wide)", gfOptions: ["GF beer (ask)", "Wine", "Cider"], note: "Pub chain with a GF menu including beer. Ask staff to check stock — it varies by branch." },
      { name: "Any pub (general)", gfOptions: ["Kopparberg cider", "Rekorderlig", "Wine", "Spirits"], note: "Cider is widely available in every UK pub. All pure spirits are GF. Ask about GF beer specifically." },
      { name: "American Bar at The Savoy", gfOptions: ["Champagne", "Classic cocktails (most GF)", "Wine"], note: "London's most famous cocktail bar. Most cocktails GF — ask the bartender about ingredients." },
    ],
    supermarkets: [
      { name: "Marks & Spencer", type: "supermarket", safety: "safe", explanation: "Excellent GF labelling. Own-brand GF range covers everything from ready meals to biscuits." },
      { name: "Waitrose", type: "supermarket", safety: "safe", explanation: "Premium supermarket with extensive GF section and excellent labeling." },
      { name: "Tesco", type: "supermarket", safety: "safe", explanation: "Free From range is large and affordable. Available on every high street." },
    ],
    emergency: {
      advice: "Coeliac UK app has a restaurant guide and product checker. Call NHS 111 for medical advice. If exposed: rest, hydrate, eat plain rice or banana. Any major hospital A&E can help.",
      safeSnacks: ["M&S GF ready meals", "Tesco Free From crisps", "Banana", "Walkers Ready Salted crisps (GF)", "Nakd bars"],
    },
  },
};

// ─── Generic fallback ─────────────────────────────────────────────────────────

function getGenericCityData(city: string): CityData {
  return {
    safetyScore: 6,
    summary: `Gluten-free options in ${city} vary. Research local celiac associations before you travel and always carry a GlutenGo translation card. Rice-based local dishes are often naturally safer.`,
    days: [
      {
        theme: "Arrival day — settle in safely",
        area: "City center",
        tip: "First priority on arrival: locate the nearest supermarket or organic food store for emergency GF supplies.",
        breakfast: { name: "Hotel breakfast (carefully)", type: "café", safety: "risk", explanation: "Ask staff about dedicated GF preparation. Stick to plain eggs, fresh fruit and yogurt." },
        lunch: { name: "Local supermarket GF aisle", type: "supermarket", safety: "safe", explanation: "Buy packaged certified GF products for your first safe meal while you get oriented." },
        dinner: { name: "International hotel restaurant", type: "restaurant", safety: "safe", explanation: "Hotel restaurants can usually accommodate celiac with notice. Call ahead and confirm." },
        snack: { name: "Fresh fruit stall", type: "café", safety: "safe", explanation: "Markets and street stalls selling whole fruit are always safe anywhere in the world." },
      },
      {
        theme: "Day 2 — explore the local market",
        area: "Local market district",
        tip: "Find the city's main food market. Fresh produce, whole fruits, unprocessed meat and fish are naturally GF. The risk is in sauces and marinades.",
        breakfast: { name: "Supermarket GF section", type: "supermarket", safety: "safe", explanation: "Look for GF bread, yogurt and certified breakfast products. Stock up for easy mornings." },
        lunch: { name: "Grilled fish or seafood restaurant", type: "restaurant", safety: "risk", explanation: "Plain grilled fish is usually GF. Confirm no wheat in the batter or marinade before ordering." },
        dinner: { name: "Rice-based local cuisine", type: "restaurant", safety: "safe", explanation: "Plain rice with grilled protein and vegetables is usually safe. Ask about sauces separately." },
        snack: { name: "Organic / health food store", type: "supermarket", safety: "safe", explanation: "Organic shops typically carry imported GF products with clear labeling." },
      },
      {
        theme: "Day 3 — city center exploration",
        area: "City center",
        tip: "Carry your GlutenGo translation card everywhere. Download the Find Me Gluten Free app for crowdsourced restaurant ratings wherever you are.",
        breakfast: { name: "Fresh fruit and nuts from a market", type: "café", safety: "safe", explanation: "The safest breakfast option globally. Fresh unprocessed fruit and sealed nut packs." },
        lunch: { name: "Indian / rice-based cuisine restaurant", type: "restaurant", safety: "risk", explanation: "Dal, rice curries and tandoori grills can be GF — confirm no wheat flour is used as a thickener." },
        dinner: { name: "Upscale restaurant (call ahead)", type: "restaurant", safety: "safe", explanation: "Upscale restaurants worldwide are generally more celiac-aware. Call ahead and explain your needs." },
        snack: { name: "Packaged certified GF snacks (supermarket)", type: "supermarket", safety: "safe", explanation: "Look for the crossed grain symbol or explicit GF certification on packaged products." },
      },
      {
        theme: "Day 4 — neighborhood wandering",
        area: "Local neighborhoods",
        tip: "Ask your accommodation host or concierge for local restaurant recommendations — they often know which kitchens are most careful.",
        breakfast: { name: "GF yogurt and fruit (supermarket)", type: "supermarket", safety: "safe", explanation: "Plain yogurt and fresh fruit are safe in virtually any country. Check yogurt for added grain." },
        lunch: { name: "Salad bar (dressing on the side)", type: "café", safety: "risk", explanation: "Ask for no croutons, confirm dressing is GF. Simple salads with olive oil and lemon are always safe." },
        dinner: { name: "Local recommendation from host", type: "restaurant", safety: "risk", explanation: "Use your GlutenGo translation card to explain celiac disease. Most cultures respect this when informed clearly." },
        snack: { name: "Local supermarket fresh section", type: "supermarket", safety: "safe", explanation: "Fresh cut fruit, plain nuts and boiled eggs from any supermarket deli counter are safe." },
      },
      {
        theme: "Day 5 — day trip or relaxed day",
        area: "Wider region",
        tip: "For day trips, pack a day bag with GF snacks, rice cakes and fruit. Do not assume GF options will be available in smaller towns outside the main city.",
        breakfast: { name: "Prepare your own (hotel room or Airbnb)", type: "supermarket", safety: "safe", explanation: "Buy GF bread, eggs and fruit the evening before and prepare breakfast in your room." },
        lunch: { name: "Plain rice dish at a local restaurant", type: "restaurant", safety: "safe", explanation: "Rice with plain grilled protein — the universal safe option when traveling in unknown territory." },
        dinner: { name: "Return to a known safe restaurant", type: "restaurant", safety: "safe", explanation: "Return to a restaurant where you already had a safe meal. Consistency reduces risk on day trips." },
        snack: { name: "Packed snacks from home base", type: "supermarket", safety: "safe", explanation: "Rice cakes, bananas and sealed nut packs are the perfect day-trip snack kit." },
      },
      {
        theme: "Day 6 — local food experience",
        area: "Food district",
        tip: "Try to identify one genuinely GF-friendly local restaurant through Find Me Gluten Free or local celiac social media groups. This gives you a safe anchor for the rest of your stay.",
        breakfast: { name: "Established safe breakfast spot (revisit)", type: "café", safety: "safe", explanation: "Return to the safest breakfast option you found during your trip." },
        lunch: { name: "Local celiac-recommended restaurant", type: "restaurant", safety: "safe", explanation: "Research ahead on Find Me Gluten Free or local celiac Facebook groups for the safest local option." },
        dinner: { name: "Wine bar with charcuterie", type: "bar", safety: "risk", explanation: "Cured meats, cheese and olives are naturally GF. Confirm no marinades or coatings. Wine is always GF." },
        snack: { name: "Fresh fruit market", type: "café", safety: "safe", explanation: "An afternoon at a fresh market — fruit, nuts and whole foods are your safest snacking option worldwide." },
      },
      {
        theme: "Day 7 — farewell",
        area: "City center",
        tip: "Stock up on any local GF products you've discovered to bring home. Check airport food options in advance — airport food is often the most difficult for celiacs.",
        breakfast: { name: "Best GF breakfast found during trip (revisit)", type: "café", safety: "safe", explanation: "End with your safest breakfast discovery from the week." },
        lunch: { name: "Supermarket GF packed meal (airport prep)", type: "supermarket", safety: "safe", explanation: "Buy a safe supermarket meal for the airport — do not rely on airport food options." },
        dinner: { name: "Airport or home", type: "restaurant", safety: "risk", explanation: "Pack GF snacks for the journey. Most airports have limited GF options — bring your own as backup." },
        snack: { name: "Sealed GF snacks for travel", type: "supermarket", safety: "safe", explanation: "Rice cakes, Nakd bars, sealed nuts — pack at least 2 hours of snacks for any journey." },
      },
    ],
    bars: [
      { name: "Wine bars", gfOptions: ["Wine", "Cider (if available)", "Spirits"], note: "Wine and pure spirits are gluten-free worldwide. Ask specifically for GF beer." },
      { name: "Local bars", gfOptions: ["Wine", "Local spirits"], note: "Regular beer contains gluten. Ask explicitly for gluten-free alternatives." },
    ],
    supermarkets: [
      { name: "Local supermarket", type: "supermarket", safety: "safe", explanation: "Look for 'senza glutine', 'sin gluten', 'gluten-free' or the crossed grain GF symbol." },
      { name: "Organic / health food store", type: "supermarket", safety: "safe", explanation: "Organic stores carry imported GF products with clear international labeling." },
    ],
    emergency: {
      advice: "Always carry your GlutenGo translation card. If exposed: drink water, eat plain rice or banana, rest. Find the nearest hospital and show your diagnosis letter. Avoid all food until symptoms subside.",
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
  return { city, country, days, strictness, data: getCityData(city) };
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

function MealRow({ label, icon, place, strictMode }: { label: string; icon: React.ReactNode; place: Place; strictMode: boolean }) {
  const isSkipped = strictMode && place.safety !== "safe";
  const borderColor = place.safety === "safe" ? "border-emerald-200" : place.safety === "risk" ? "border-amber-200" : "border-rose-200";

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {icon} {label}
      </div>
      <div className={`rounded-xl border bg-card p-3 ${isSkipped ? "border-rose-200 opacity-60" : borderColor}`}>
        <div className="flex items-start justify-between gap-2">
          <p className={`font-medium text-sm ${isSkipped ? "line-through text-muted-foreground" : ""}`}>{place.name}</p>
          <SafetyBadge level={place.safety} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground capitalize">{place.type}</p>
        {isSkipped ? (
          <p className="mt-1.5 text-xs text-rose-600 font-medium">⚠ Skipped — not safe for celiac strict mode. Use a supermarket alternative.</p>
        ) : (
          <p className="mt-1.5 text-xs leading-relaxed text-foreground/70">{place.explanation}</p>
        )}
      </div>
    </div>
  );
}

function QuickSafetyMode({ plan }: { plan: TripPlan }) {
  const allMeals = plan.data.days.flatMap(d => [d.breakfast, d.lunch, d.dinner, d.snack]);
  const safeRestaurants = allMeals.filter(p => p.safety === "safe" && p.type !== "supermarket").slice(0, 5);

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
            {safeRestaurants.length > 0 ? safeRestaurants.map((p, i) => (
              <li key={i} className="flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-600" />
                <span>{p.name}</span>
              </li>
            )) : (
              <li className="text-sm text-muted-foreground">Switch to "Low sensitivity" for more options.</li>
            )}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-2">Safest supermarkets</p>
          <ul className="space-y-1.5">
            {plan.data.supermarkets.filter(s => s.safety === "safe").slice(0, 3).map((s) => (
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
            {plan.data.bars.slice(0, 3).map((b) => (
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
  const dayPlan = plan.data.days[day % plan.data.days.length];
  const isStrict = plan.strictness === "strict";

  return (
    <div className="space-y-4">
      {/* Area theme + tip */}
      <div className="rounded-xl bg-muted/50 px-4 py-3">
        <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary mb-1">
          <MapPin className="h-3 w-3" /> {dayPlan.area}
        </div>
        <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-500" />
          <span className="leading-relaxed">{dayPlan.tip}</span>
        </div>
      </div>

      {/* Meals */}
      <MealRow label="Breakfast" icon={<Coffee className="h-3.5 w-3.5" />} place={dayPlan.breakfast} strictMode={isStrict} />
      <MealRow label="Lunch" icon={<UtensilsCrossed className="h-3.5 w-3.5" />} place={dayPlan.lunch} strictMode={isStrict} />
      <MealRow label="Dinner" icon={<Moon className="h-3.5 w-3.5" />} place={dayPlan.dinner} strictMode={isStrict} />
      <MealRow label="Snack / Drinks" icon={<Apple className="h-3.5 w-3.5" />} place={dayPlan.snack} strictMode={isStrict} />
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
              <p className="mt-1 text-xs text-muted-foreground">Unsafe/risk venues are flagged and skipped. Only fully safe places shown.</p>
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
              {Array.from({ length: plan.days }).map((_, i) => {
                const dayPlan = plan.data.days[i % plan.data.days.length];
                return (
                  <div key={i} className="rounded-2xl border border-border overflow-hidden">
                    <button
                      onClick={() => toggleDay(i)}
                      className="w-full flex items-center justify-between px-5 py-4 bg-card hover:bg-muted/50 transition text-left"
                    >
                      <div>
                        <span className="font-medium">Day {i + 1}</span>
                        <span className="ml-3 text-sm text-muted-foreground">{dayPlan.theme}</span>
                      </div>
                      {openDays.includes(i) ? <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />}
                    </button>
                    {openDays.includes(i) && (
                      <div className="px-5 pb-5 pt-2 bg-card">
                        <DayCard day={i} plan={plan} />
                      </div>
                    )}
                  </div>
                );
              })}
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
              <p className="text-xs font-semibold uppercase tracking-wider text-rose-700 mb-2">Safe food options</p>
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
