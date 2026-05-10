import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, Coffee, ExternalLink, Globe, Heart, Loader2, MapPin, Pill, Phone, Search, ShoppingCart, Sparkles, UtensilsCrossed, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  searchRestaurantsAI,
  searchCoffeeBarsAI,
  searchSupermarketsAI,
  searchPharmaciesAI,
  type AIRestaurant,
  type AISearchResult,
  type VenueCategory,
} from "@/lib/restaurantsAI.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/restaurants")({
  head: () => ({
    meta: [
      { title: "Gluten-Free Restaurant Finder: AI-Curated Venues Worldwide" },
      { name: "description", content: "Find gluten-free restaurants, coffee bars, supermarkets and pharmacies in any city worldwide. AI-researched, celiac-safe venues with cross-contamination notes." },
      { name: "keywords", content: "gluten-free restaurants near me, celiac safe restaurants, gluten-free coffee bar, gluten-free supermarket, celiac pharmacy, gluten-free venues worldwide" },
      { property: "og:title", content: "Gluten-Free Restaurant Finder: Any City, Worldwide" },
      { property: "og:description", content: "AI-researched gluten-free restaurants, coffee bars, supermarkets and pharmacies in any city. Celiac-safe with cross-contamination notes." },
      { property: "og:url", content: "https://glutengo.app/restaurants" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: RestaurantsPage,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

type LevelFilter = "all" | "dedicated" | "extensive" | "options" | "limited";

function levelMeta(l: AIRestaurant["glutenFreeLevel"]) {
  switch (l) {
    case "dedicated": return { label: "100% GF", className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100 border-emerald-200" };
    case "extensive": return { label: "Dedicated GF menu", className: "bg-teal-100 text-teal-700 hover:bg-teal-100 border-teal-200" };
    case "options":   return { label: "GF options", className: "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200" };
    default:          return { label: "Limited GF", className: "bg-muted text-muted-foreground border-border" };
  }
}

function levelBar(l: AIRestaurant["glutenFreeLevel"]) {
  switch (l) {
    case "dedicated": return "bg-emerald-500";
    case "extensive": return "bg-teal-500";
    case "options":   return "bg-amber-400";
    default:          return "bg-muted-foreground/40";
  }
}

function confidenceMeta(level?: AIRestaurant["confidence"]) {
  switch (level) {
    case "high": return { dot: "bg-emerald-500", label: "High confidence" };
    case "low":  return { dot: "bg-rose-500", label: "Low confidence" };
    default:     return { dot: "bg-amber-400", label: "Medium confidence" };
  }
}

function encodeSlug(r: AIRestaurant) {
  const raw = [r.name, r.city, r.country || ""].join("|");
  const b64 = btoa(unescape(encodeURIComponent(raw))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `ai-${b64}`;
}

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORIES: { id: VenueCategory; label: string; Icon: React.ElementType; placeholder: string; color: string }[] = [
  { id: "restaurant",  label: "Restaurants",    Icon: UtensilsCrossed, placeholder: "e.g. Antwerp, Lisbon, Bali, Brugge…", color: "text-primary" },
  { id: "coffeebar",   label: "Coffee Bars",    Icon: Coffee,          placeholder: "e.g. Ghent, Amsterdam, Barcelona…",   color: "text-amber-600" },
  { id: "supermarket", label: "Supermarkets",   Icon: ShoppingCart,    placeholder: "e.g. Brussels, Paris, Berlin…",       color: "text-teal-600" },
  { id: "pharmacy",    label: "Pharmacies",     Icon: Pill,            placeholder: "e.g. Rome, Madrid, Tokyo…",           color: "text-rose-600" },
];

const CATEGORY_SEARCH_FN: Record<VenueCategory, (args: { data: { place: string } }) => Promise<AISearchResult | null>> = {
  restaurant:  searchRestaurantsAI,
  coffeebar:   searchCoffeeBarsAI,
  supermarket: searchSupermarketsAI,
  pharmacy:    searchPharmaciesAI,
};

const CATEGORY_EMPTY: Record<VenueCategory, string> = {
  restaurant:  "No restaurants found for this filter. Try 'All'.",
  coffeebar:   "No coffee bars found. Try searching without a filter.",
  supermarket: "No supermarkets found. Try 'All'.",
  pharmacy:    "No pharmacies found. Try without a filter.",
};

// ─── Detail sheet ─────────────────────────────────────────────────────────────

function venueIcon(type?: AIRestaurant["venueType"]) {
  switch (type) {
    case "coffeebar":   return Coffee;
    case "supermarket": return ShoppingCart;
    case "pharmacy":    return Pill;
    default:            return UtensilsCrossed;
  }
}

function riskMeta(l: AIRestaurant["glutenFreeLevel"]) {
  switch (l) {
    case "dedicated": return { label: "Zeer veilig", sub: "100% glutenvrij restaurant", color: "bg-emerald-50 border-emerald-200", badge: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-500", risk: "Laag risico" };
    case "extensive": return { label: "Veilig", sub: "Uitgebreid glutenvrij menu", color: "bg-teal-50 border-teal-200", badge: "bg-teal-100 text-teal-700", bar: "bg-teal-500", risk: "Laag risico" };
    case "options":   return { label: "Voorzichtig", sub: "Glutenvrije opties beschikbaar", color: "bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-700", bar: "bg-amber-400", risk: "Matig risico" };
    default:          return { label: "Beperkt", sub: "Beperkte glutenvrije opties", color: "bg-rose-50 border-rose-200", badge: "bg-rose-100 text-rose-700", bar: "bg-rose-400", risk: "Hoog risico" };
  }
}

function RestaurantSheet({ r, open, onClose }: { r: AIRestaurant | null; open: boolean; onClose: () => void }) {
  if (!r) return null;
  const meta = riskMeta(r.glutenFreeLevel);
  const conf = confidenceMeta(r.confidence);
  const VenueIcon = venueIcon(r.venueType);
  const mapsQuery = encodeURIComponent([r.name, r.address, r.city, r.country].filter(Boolean).join(", "));
  const mapsUrl = `https://maps.google.com/?q=${mapsQuery}`;
  const mapsEmbed = `https://maps.google.com/maps?q=${mapsQuery}&output=embed&z=16`;
  const hasAddress = !!(r.address || r.city);

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col overflow-hidden">
        {/* Color bar + header */}
        <div className={`border-b ${meta.color} px-5 pt-5 pb-4`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/70 text-foreground shadow-sm">
                <VenueIcon className="h-5 w-5" />
              </span>
              <div>
                <h2 className="font-display text-xl leading-tight">{r.name}</h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {[r.cuisine, r.priceLevel, r.city, r.country].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
            <button onClick={onClose} className="shrink-0 rounded-full p-1.5 hover:bg-black/10 transition-colors">
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Safety level */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge className={`${meta.badge} text-xs font-semibold`}>{meta.label}</Badge>
            <span className="text-xs text-muted-foreground">{meta.sub}</span>
            <span className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground">
              <span className={`inline-block h-2 w-2 rounded-full ${conf.dot}`} />
              {conf.label}
            </span>
          </div>

          {/* Risk bar */}
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
              <span>Veiligheidsniveau</span>
              <span className="font-medium">{meta.risk}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-black/10">
              <div className={`h-1.5 rounded-full ${meta.bar} transition-all`}
                style={{ width: r.glutenFreeLevel === "dedicated" ? "100%" : r.glutenFreeLevel === "extensive" ? "75%" : r.glutenFreeLevel === "options" ? "50%" : "25%" }}
              />
            </div>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">

          {/* Tags */}
          {r.tags && r.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {r.tags.map((t) => <Badge key={t} variant="outline" className="text-[11px] capitalize">{t}</Badge>)}
            </div>
          )}

          {/* GF protocol */}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">Glutenvrij protocol</p>
            <p className="text-sm leading-relaxed text-foreground">{r.glutenFreeNotes}</p>
            {r.cautionNote && (
              <div className="mt-3 flex gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
                <span className="text-base leading-none mt-0.5">⚠</span>
                <p className="text-xs text-amber-800">{r.cautionNote}</p>
              </div>
            )}
            <p className="mt-2.5 text-[10px] text-muted-foreground">
              Bron: {r.verificationSource || "AI onderzoek + publieke bronnen"}
            </p>
          </div>

          {/* Map */}
          {hasAddress && (
            <div className="rounded-2xl overflow-hidden border border-border">
              <iframe
                src={mapsEmbed}
                className="h-44 w-full border-0"
                loading="lazy"
                title={`Kaart: ${r.name}`}
              />
              <div className="flex items-center justify-between border-t border-border bg-card px-3 py-2">
                <div className="flex items-start gap-1.5 min-w-0">
                  <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate">
                    {[r.address, r.neighborhood, r.city].filter(Boolean).join(", ")}
                  </span>
                </div>
                <a href={mapsUrl} target="_blank" rel="noreferrer" className="shrink-0 ml-2">
                  <Button variant="outline" size="sm" className="text-xs h-7 gap-1 px-2">
                    <ExternalLink className="h-3 w-3" /> Maps
                  </Button>
                </a>
              </div>
            </div>
          )}

          {/* Must-try */}
          {r.mustTry && r.mustTry.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">Glutenvrij aanbevolen</p>
              <ul className="grid gap-1.5">
                {r.mustTry.map((d) => (
                  <li key={d} className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-1.5 text-sm">
                    <span>🍽</span> {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Contact & hours */}
          {(r.phone || r.website || r.openingHours) && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Contact & openingsuren</p>
              {r.openingHours && (
                <p className="whitespace-pre-line rounded-xl bg-muted/50 px-3 py-2 text-xs mb-2">{r.openingHours}</p>
              )}
              <div className="space-y-2">
                {r.phone && (
                  <a href={`tel:${r.phone}`} className="flex items-center gap-2 text-sm hover:text-primary transition-colors">
                    <Phone className="h-3.5 w-3.5 text-muted-foreground" /> {r.phone}
                  </a>
                )}
                {r.website && (
                  <a href={r.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm hover:text-primary transition-colors break-all">
                    <Globe className="h-3.5 w-3.5 shrink-0 text-muted-foreground" /> {r.website}
                  </a>
                )}
              </div>
            </div>
          )}

          <p className="text-[10px] text-muted-foreground pb-2">
            AI-onderzoek. Toon altijd je vertaalkaart en bevestig het glutenvrije protocol bij aankomst.
          </p>
        </div>

        {/* Footer action */}
        <div className="border-t border-border bg-card px-5 py-3 flex gap-2">
          <Link to="/restaurants/$slug" params={{ slug: encodeSlug(r) }} className="flex-1">
            <Button variant="outline" className="w-full text-sm">Volledige pagina</Button>
          </Link>
          {hasAddress && (
            <a href={mapsUrl} target="_blank" rel="noreferrer">
              <Button variant="ghost" size="icon" className="shrink-0">
                <MapPin className="h-4 w-4" />
              </Button>
            </a>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function RestaurantsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [input, setInput] = useState("");
  const [place, setPlace] = useState<string>("");
  const [category, setCategory] = useState<VenueCategory>("restaurant");
  const [filter, setFilter] = useState<LevelFilter>("all");
  const [selected, setSelected] = useState<AIRestaurant | null>(null);

  const activeCat = CATEGORIES.find(c => c.id === category)!;

  const { data, isFetching, error } = useQuery({
    queryKey: ["ai-venues", place, category],
    queryFn: () => CATEGORY_SEARCH_FN[category]({ data: { place } }),
    enabled: !!place,
    staleTime: 1000 * 60 * 60,
    retry: false,
  });

  const { data: savedIds } = useQuery({
    queryKey: ["saved-restaurants", user?.id],
    queryFn: async () => {
      if (!user) return new Set<string>();
      const { data } = await supabase.from("saved_restaurants").select("restaurant_id").eq("user_id", user.id);
      return new Set((data || []).map((r: any) => r.restaurant_id));
    },
    enabled: !!user,
  });

  const toggleSave = useMutation({
    mutationFn: async (r: AIRestaurant) => {
      if (!user) throw new Error("Sign in to save");
      const id = encodeSlug(r);
      if (savedIds?.has(id)) {
        await supabase.from("saved_restaurants").delete().eq("user_id", user.id).eq("restaurant_id", id);
        return { saved: false };
      }
      const { error } = await supabase.from("saved_restaurants").insert({ user_id: user.id, restaurant_id: id });
      if (error) throw error;
      return { saved: true };
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["saved-restaurants", user?.id] });
      toast.success(res.saved ? "Saved" : "Removed");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) setPlace(input.trim());
  };

  const switchCategory = (cat: VenueCategory) => {
    setCategory(cat);
    setFilter("all");
  };

  const filtered = (data?.results || []).filter((r) => filter === "all" || r.glutenFreeLevel === filter);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      {/* Header */}
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl">Find gluten-free spots</h1>
        <p className="mt-2 text-muted-foreground">
          AI-researched restaurants, coffee bars, supermarkets and pharmacies, all gluten-free friendly, in any city worldwide.
        </p>
      </div>

      {/* Search bar */}
      <form onSubmit={onSearch} className="mt-8 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={activeCat.placeholder}
            className="pl-9 h-12"
          />
        </div>
        <Button type="submit" size="lg" disabled={!input.trim() || isFetching} className="h-12 px-6">
          {isFetching
            ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Researching…</>
            : <><Sparkles className="mr-2 h-4 w-4" /> Search</>}
        </Button>
      </form>

      {/* Category tabs */}
      <div className="mt-5 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => {
          const active = category === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => switchCategory(cat.id)}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${
                active
                  ? "border-primary bg-primary text-primary-foreground shadow-soft"
                  : "border-border bg-card hover:bg-muted"
              }`}
            >
              <cat.Icon className="h-4 w-4" />
              {cat.label}
              {place && !isFetching && (
                <span className={`ml-1 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                  active
                    ? "bg-white/20 text-white"
                    : "bg-muted-foreground/10 text-muted-foreground"
                }`}>
                  {category === cat.id
                    ? filtered.length
                    : qc.getQueryData<{ results: any[] }>(["ai-venues", place, cat.id])?.results.length ?? "·"
                  }
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Level filter */}
      {place && (
        <div className="mt-4 flex flex-wrap gap-2">
          {(["all", "dedicated", "extensive", "options"] as LevelFilter[]).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                filter === k ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"
              }`}
            >
              {k === "all" ? "All levels" : k === "dedicated" ? "✓ 100% GF" : k === "extensive" ? "Dedicated menu" : "GF options"}
            </button>
          ))}
        </div>
      )}

      {/* Empty state — no search yet */}
      {!place && (
        <div className="mt-12 rounded-3xl border border-dashed border-border bg-cream/40 p-12 text-center">
          <div className="flex justify-center gap-4 text-muted-foreground/40">
            <UtensilsCrossed className="h-8 w-8" />
            <Coffee className="h-8 w-8" />
            <ShoppingCart className="h-8 w-8" />
            <Pill className="h-8 w-8" />
          </div>
          <p className="mt-4 text-muted-foreground">Search any city to find gluten-free friendly spots.</p>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {(error as Error).message}
          <div className="mt-3">
            <Button variant="outline" size="sm" onClick={() => qc.invalidateQueries({ queryKey: ["ai-venues", place, category] })}>
              Retry
            </Button>
          </div>
        </div>
      )}

      {/* Loading skeletons */}
      {isFetching && (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-3xl" />)}
        </div>
      )}

      {/* Results */}
      {place && data && !isFetching && (
        <>
          {data.summary && (
            <div className="mt-6 rounded-2xl border border-border bg-cream/40 p-4 text-sm">
              <Sparkles className="inline h-4 w-4 mr-1.5 text-primary" />
              {data.summary}
            </div>
          )}

          <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            AI research helps shortlist venues. Not a medical guarantee. Always confirm protocols before ordering.
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{filtered.length}</span>{" "}
            {activeCat.label.toLowerCase()} found in{" "}
            <span className="font-medium text-foreground">{data.place}</span>
          </p>

          {filtered.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-border bg-cream/40 p-12 text-center text-muted-foreground">
              {CATEGORY_EMPTY[category]}
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((r) => {
                const meta = levelMeta(r.glutenFreeLevel);
                const conf = confidenceMeta(r.confidence);
                const slug = encodeSlug(r);
                const isSaved = savedIds?.has(slug);
                return (
                  <article key={slug} className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow">
                    {/* Top color bar */}
                    <div className={`h-1.5 w-full ${levelBar(r.glutenFreeLevel)}`} />

                    <div className="flex flex-1 flex-col p-5">
                      {/* Save button */}
                      <button
                        onClick={() => toggleSave.mutate(r)}
                        className="absolute right-4 top-5 grid h-8 w-8 place-items-center rounded-full bg-background/90 shadow-sm backdrop-blur transition hover:scale-110"
                        aria-label="Save"
                      >
                        <Heart className={`h-4 w-4 ${isSaved ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
                      </button>

                      {/* Name & meta */}
                      <h3 className="font-display text-lg leading-tight pr-9">{r.name}</h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {[r.cuisine, r.priceLevel, r.neighborhood].filter(Boolean).join(" · ")}
                      </p>

                      {/* Badges */}
                      <div className="mt-3 flex flex-wrap items-center gap-1.5">
                        <Badge className={`${meta.className} text-xs`}>{meta.label}</Badge>
                        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                          <span className={`inline-block h-2 w-2 rounded-full ${conf.dot}`} />
                          {conf.label}
                        </span>
                        {r.tags?.slice(0, 2).map((t) => (
                          <Badge key={t} variant="outline" className="text-[11px] capitalize">{t}</Badge>
                        ))}
                      </div>

                      {/* GF notes */}
                      <p className="mt-3 flex-1 text-sm text-muted-foreground line-clamp-3">{r.glutenFreeNotes}</p>

                      {/* Caution */}
                      {r.cautionNote && (
                        <p className="mt-2 text-xs text-amber-700 line-clamp-2">⚠ {r.cautionNote}</p>
                      )}

                      {/* Address */}
                      {r.address && (
                        <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
                          <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                          {r.address}{r.neighborhood ? `, ${r.neighborhood}` : ""}
                        </p>
                      )}

                      {/* Actions */}
                      <div className="mt-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 text-xs"
                          onClick={() => setSelected(r)}
                        >
                          Details tonen →
                        </Button>
                        {r.address && (
                          <a
                            href={`https://maps.google.com/?q=${encodeURIComponent([r.name, r.address, r.city].filter(Boolean).join(", "))}`}
                            target="_blank"
                            rel="noreferrer"
                            className="shrink-0"
                          >
                            <Button variant="ghost" size="sm" className="text-xs px-2.5">
                              <MapPin className="h-3.5 w-3.5" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      <RestaurantSheet r={selected} open={!!selected} onClose={() => setSelected(null)} />
    </div>
  );
}
