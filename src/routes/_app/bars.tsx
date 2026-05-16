import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bookmark, BookmarkCheck, ExternalLink, Globe, Heart, Loader2,
  MapPin, Phone, Search, Sparkles, Trash2, Wine, X, Plus, Beer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { searchBarsAI, type AIRestaurant } from "@/lib/restaurantsAI.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/bars")({
  head: () => ({
    meta: [
      { title: "Gluten-Free Bars & Pubs Worldwide — GlutenGo" },
      { name: "description", content: "Find gluten-free bars, pubs, craft beer taprooms, wine bars and cocktail lounges worldwide. AI-researched venues with safe drink lists for coeliac disease." },
    ],
  }),
  component: BarsPage,
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

function levelMeta(l: AIRestaurant["glutenFreeLevel"]) {
  switch (l) {
    case "dedicated": return { label: "100% GF bar", className: "bg-amber-100 text-amber-800 hover:bg-amber-100 border-amber-200" };
    case "extensive": return { label: "GF drinks", className: "bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200" };
    case "options":   return { label: "GF options", className: "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200" };
    default:          return { label: "Limited", className: "bg-muted text-muted-foreground border-border" };
  }
}

function levelBar(l: AIRestaurant["glutenFreeLevel"]) {
  switch (l) {
    case "dedicated": return "bg-amber-500";
    case "extensive": return "bg-orange-400";
    case "options":   return "bg-yellow-400";
    default:          return "bg-muted-foreground/40";
  }
}

function riskMeta(l: AIRestaurant["glutenFreeLevel"]) {
  switch (l) {
    case "dedicated": return { label: "100% GF bar", sub: "Fully gluten-free bar", color: "bg-amber-50 border-amber-200", badge: "bg-amber-100 text-amber-800", bar: "bg-amber-500", risk: "Low risk" };
    case "extensive": return { label: "GF drinks", sub: "Extensive GF drinks range", color: "bg-orange-50 border-orange-200", badge: "bg-orange-100 text-orange-700", bar: "bg-orange-400", risk: "Low risk" };
    case "options":   return { label: "Caution", sub: "Limited GF drink options", color: "bg-yellow-50 border-yellow-200", badge: "bg-yellow-100 text-yellow-700", bar: "bg-yellow-400", risk: "Medium risk" };
    default:          return { label: "Limited", sub: "Very limited GF options", color: "bg-rose-50 border-rose-200", badge: "bg-rose-100 text-rose-700", bar: "bg-rose-400", risk: "High risk" };
  }
}

function confidenceDot(c?: AIRestaurant["confidence"]) {
  switch (c) {
    case "high": return "bg-emerald-500";
    case "low":  return "bg-rose-500";
    default:     return "bg-amber-400";
  }
}

function encodeSlug(r: AIRestaurant) {
  const raw = [r.name, r.city, r.country || ""].join("|");
  const b64 = btoa(unescape(encodeURIComponent(raw))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `ai-${b64}`;
}

function decodeSlug(slug: string): { name: string; city: string; country: string } | null {
  const m = slug.match(/^ai-(.+)$/);
  if (!m) return null;
  try {
    const b64 = m[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - b64.length % 4) % 4);
    const decoded = decodeURIComponent(escape(atob(padded)));
    const [name, city, country] = decoded.split("|");
    return { name: name || slug, city: city || "", country: country || "" };
  } catch { return null; }
}

// ─── Detail sheet ─────────────────────────────────────────────────────────────

function BarSheet({
  r, open, onClose, user, trips, savedData, onToggleSave,
}: {
  r: AIRestaurant | null;
  open: boolean;
  onClose: () => void;
  user: any;
  trips: any[];
  savedData: Map<string, string | null>;
  onToggleSave: () => void;
}) {
  const [selectedTrip, setSelectedTrip] = useState<string>("none");
  const [addingTrip, setAddingTrip] = useState(false);

  if (!r) return null;
  const slug = encodeSlug(r);
  const isSaved = savedData.has(slug);
  const currentTripId = savedData.get(slug) ?? null;
  const meta = riskMeta(r.glutenFreeLevel);
  const mapsQuery = encodeURIComponent([r.name, r.address, r.city, r.country].filter(Boolean).join(", "));
  const mapsUrl = `https://maps.google.com/?q=${mapsQuery}`;
  const mapsEmbed = `https://maps.google.com/maps?q=${mapsQuery}&output=embed&z=16`;
  const hasAddress = !!(r.address || r.city);

  const addToTrip = async () => {
    if (!user) { toast.error("Sign in to save"); return; }
    setAddingTrip(true);
    try {
      const trip_id = selectedTrip === "none" ? null : selectedTrip;
      const { error } = await supabase.from("saved_restaurants").upsert(
        { user_id: user.id, restaurant_id: slug, trip_id },
        { onConflict: "user_id,restaurant_id" },
      );
      if (error) { toast.error(error.message); return; }
      onToggleSave();
      const tripName = trips.find(t => t.id === trip_id)?.title || trips.find(t => t.id === trip_id)?.destination_city;
      toast.success(trip_id ? `Saved to "${tripName}"` : "Saved to favourites");
    } finally { setAddingTrip(false); }
  };

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col overflow-hidden">
        {/* Header */}
        <div className={`border-b ${meta.color} px-5 pt-5 pb-4`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/70 shadow-sm">
                <Wine className="h-5 w-5 text-amber-700" />
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
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Badge className={`${meta.badge} text-xs font-semibold`}>{meta.label}</Badge>
            <span className="text-xs text-muted-foreground">{meta.sub}</span>
            <span className="ml-auto flex items-center gap-1 text-[11px] text-muted-foreground">
              <span className={`inline-block h-2 w-2 rounded-full ${confidenceDot(r.confidence)}`} />
              {r.confidence === "high" ? "High confidence" : r.confidence === "low" ? "Low confidence" : "Medium confidence"}
            </span>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
              <span>GF safety level</span><span className="font-medium">{meta.risk}</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-black/10">
              <div className={`h-1.5 rounded-full ${meta.bar} transition-all`}
                style={{ width: r.glutenFreeLevel === "dedicated" ? "100%" : r.glutenFreeLevel === "extensive" ? "75%" : r.glutenFreeLevel === "options" ? "50%" : "25%" }} />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {r.tags && r.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {r.tags.map((t) => <Badge key={t} variant="outline" className="text-[11px] capitalize">{t}</Badge>)}
            </div>
          )}

          <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-2">Safe drinks protocol</p>
            <p className="text-sm leading-relaxed text-foreground">{r.glutenFreeNotes}</p>
            {r.cautionNote && (
              <div className="mt-3 flex gap-2.5 rounded-xl border border-amber-300 bg-amber-100 px-3 py-2.5">
                <span className="text-base leading-none mt-0.5">⚠</span>
                <p className="text-xs text-amber-900">{r.cautionNote}</p>
              </div>
            )}
          </div>

          {r.mustTry && r.mustTry.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5">Recommended GF drinks</p>
              <ul className="grid gap-1.5">
                {r.mustTry.map((d) => (
                  <li key={d} className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-1.5 text-sm">
                    <span>🍺</span> {d}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {hasAddress && (
            <div className="rounded-2xl overflow-hidden border border-border">
              <iframe src={mapsEmbed} className="h-44 w-full border-0" loading="lazy" title={`Map: ${r.name}`} />
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

          {(r.phone || r.website || r.openingHours) && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Contact & opening hours</p>
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
            AI research. Always show your translation card and confirm the GF drink protocol on arrival.
          </p>
        </div>

        {/* Footer */}
        <div className="border-t border-border bg-card px-5 py-4 space-y-3">
          {user && (
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2 uppercase tracking-wider">
                {isSaved ? "Saved" : "Add to trip"}
              </p>
              <div className="flex gap-2">
                <Select value={selectedTrip} onValueChange={setSelectedTrip}>
                  <SelectTrigger className="h-9 flex-1 text-sm">
                    <SelectValue placeholder="Choose a trip…" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Save only (no trip)</SelectItem>
                    {trips.map((t) => (
                      <SelectItem key={t.id} value={t.id}>
                        {t.title || t.destination_city || t.destination_country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button size="sm" onClick={addToTrip} disabled={addingTrip} variant={isSaved ? "outline" : "default"} className="gap-1.5 shrink-0">
                  {isSaved ? <><BookmarkCheck className="h-3.5 w-3.5" /> Update</>
                    : addingTrip ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    : <><Plus className="h-3.5 w-3.5" /> Add</>}
                </Button>
              </div>
              {isSaved && currentTripId && (
                <p className="mt-1.5 text-xs text-emerald-600">✓ Saved to "{trips.find(t => t.id === currentTripId)?.title || "trip"}"</p>
              )}
              {isSaved && !currentTripId && (
                <p className="mt-1.5 text-xs text-emerald-600">✓ Saved to favourites</p>
              )}
            </div>
          )}
          {hasAddress && (
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="block">
              <Button variant="outline" className="w-full text-sm gap-2">
                <MapPin className="h-4 w-4" /> Open in Google Maps
              </Button>
            </a>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ─── Saved view ───────────────────────────────────────────────────────────────

function SavedView({ user, savedData, trips, onRemove }: { user: any; savedData: Map<string, string | null>; trips: any[]; onRemove: (slug: string) => void }) {
  const [removing, setRemoving] = useState<string | null>(null);

  if (!user) {
    return (
      <div className="mt-12 rounded-3xl border border-dashed border-border bg-amber-50/40 p-12 text-center">
        <Wine className="mx-auto h-10 w-10 text-muted-foreground/40" />
        <p className="mt-3 text-muted-foreground">Sign in to save your favourite bars.</p>
      </div>
    );
  }
  if (savedData.size === 0) {
    return (
      <div className="mt-12 rounded-3xl border border-dashed border-border bg-amber-50/40 p-12 text-center">
        <Wine className="mx-auto h-10 w-10 text-muted-foreground/40" />
        <p className="mt-3 text-muted-foreground">No bars saved yet. Search a city and tap the heart icon.</p>
      </div>
    );
  }

  const remove = async (slug: string) => {
    setRemoving(slug);
    await supabase.from("saved_restaurants").delete().eq("user_id", user.id).eq("restaurant_id", slug);
    onRemove(slug);
    setRemoving(null);
    toast.success("Removed from favourites");
  };

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from(savedData.entries()).map(([slug, tripId]) => {
        const decoded = decodeSlug(slug);
        if (!decoded) return null;
        const trip = trips.find(t => t.id === tripId);
        return (
          <div key={slug} className="flex flex-col rounded-3xl border border-border bg-card p-5 shadow-soft">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-100 text-amber-700">
                <Wine className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="font-display text-base leading-snug truncate">{decoded.name}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {[decoded.city, decoded.country].filter(Boolean).join(", ")}
                </p>
              </div>
            </div>
            {trip && (
              <div className="mt-3 flex items-center gap-1.5 rounded-full bg-primary/5 border border-primary/20 px-3 py-1 text-xs text-primary w-fit">
                <Bookmark className="h-3 w-3" />{trip.title || trip.destination_city || "Trip"}
              </div>
            )}
            <div className="mt-4 flex gap-2">
              <Button
                variant="ghost" size="sm"
                className="shrink-0 text-rose-500 hover:text-rose-600 hover:bg-rose-50 px-2 ml-auto"
                onClick={() => remove(slug)} disabled={removing === slug}
              >
                {removing === slug ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function BarsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [input, setInput] = useState("");
  const [place, setPlace] = useState("");
  const [filter, setFilter] = useState<"all" | "dedicated" | "extensive" | "options">("all");
  const [selected, setSelected] = useState<AIRestaurant | null>(null);
  const [view, setView] = useState<"search" | "saved">("search");

  const { data, isFetching, error } = useQuery({
    queryKey: ["ai-bars", place],
    queryFn: () => searchBarsAI({ data: { place } }),
    enabled: !!place,
    staleTime: 1000 * 60 * 60,
    retry: false,
  });

  const { data: savedData = new Map<string, string | null>(), refetch: refetchSaved } = useQuery({
    queryKey: ["saved-bars", user?.id],
    queryFn: async () => {
      if (!user) return new Map<string, string | null>();
      const { data } = await supabase.from("saved_restaurants").select("restaurant_id, trip_id").eq("user_id", user.id);
      return new Map((data || []).map((r: any) => [r.restaurant_id, r.trip_id ?? null]));
    },
    enabled: !!user,
  });

  const savedIds = new Set(savedData.keys());

  const { data: trips = [] } = useQuery({
    queryKey: ["trips-list", user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from("trips").select("id, title, destination_city, destination_country").eq("user_id", user.id).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!user,
  });

  const toggleSave = useMutation({
    mutationFn: async (r: AIRestaurant) => {
      if (!user) throw new Error("Sign in to save");
      const id = encodeSlug(r);
      if (savedIds.has(id)) {
        await supabase.from("saved_restaurants").delete().eq("user_id", user.id).eq("restaurant_id", id);
        return { saved: false };
      }
      const { error } = await supabase.from("saved_restaurants").insert({ user_id: user.id, restaurant_id: id });
      if (error) throw error;
      return { saved: true };
    },
    onSuccess: (res) => {
      qc.invalidateQueries({ queryKey: ["saved-bars", user?.id] });
      toast.success(res.saved ? "Saved" : "Removed");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) { setPlace(input.trim()); setView("search"); }
  };

  const filtered = (data?.results || []).filter(r => filter === "all" || r.glutenFreeLevel === filter);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      {/* Hero */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-amber-100 text-amber-700">
              <Wine className="h-5 w-5" />
            </span>
            <span className="text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-3 py-1">Find Spots — Bars</span>
          </div>
          <h1 className="font-display text-4xl">Gluten-free bars & pubs</h1>
          <p className="mt-2 text-muted-foreground">
            Find bars, craft beer taprooms, wine bars and cocktail lounges where you can drink safely with coeliac disease — worldwide, AI-researched.
          </p>
        </div>
        {user && (
          <button
            onClick={() => setView(v => v === "saved" ? "search" : "saved")}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-all ${view === "saved" ? "border-amber-400 bg-amber-50 text-amber-700" : "border-border bg-card hover:bg-muted"}`}
          >
            <Heart className={`h-4 w-4 ${view === "saved" ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`} />
            My favourites
            {savedData.size > 0 && (
              <span className={`ml-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold leading-none ${view === "saved" ? "bg-amber-200 text-amber-700" : "bg-muted text-muted-foreground"}`}>
                {savedData.size}
              </span>
            )}
          </button>
        )}
      </div>

      {/* Search */}
      <form onSubmit={onSearch} className="mt-6 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="e.g. Ghent, Amsterdam, Lisbon, Tokyo…" className="pl-9 h-12" />
        </div>
        <Button type="submit" size="lg" disabled={!input.trim() || isFetching} className="h-12 px-6 bg-amber-600 hover:bg-amber-700 text-white">
          {isFetching ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching…</> : <><Sparkles className="mr-2 h-4 w-4" /> Search bars</>}
        </Button>
      </form>

      {/* Saved view */}
      {view === "saved" && (
        <SavedView user={user} savedData={savedData} trips={trips} onRemove={() => qc.invalidateQueries({ queryKey: ["saved-bars", user?.id] })} />
      )}

      {/* Search view */}
      {view === "search" && (
        <>
          {/* Level filter */}
          {place && (
            <div className="mt-5 flex flex-wrap gap-2">
              {(["all", "dedicated", "extensive", "options"] as const).map((k) => (
                <button key={k} onClick={() => setFilter(k)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${filter === k ? "border-amber-500 bg-amber-500 text-white" : "border-border bg-card hover:bg-muted"}`}
                >
                  {k === "all" ? "All bars" : k === "dedicated" ? "✓ 100% GF bar" : k === "extensive" ? "Good GF selection" : "GF drink options"}
                </button>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!place && (
            <div className="mt-12 rounded-3xl border border-dashed border-amber-200 bg-amber-50/40 p-12 text-center">
              <div className="flex justify-center gap-4 text-amber-300">
                <Wine className="h-10 w-10" />
                <Beer className="h-10 w-10" />
              </div>
              <p className="mt-4 text-muted-foreground">Search any city to find gluten-free bars.</p>
              <p className="mt-1 text-sm text-muted-foreground/70">From craft beer taprooms to wine bars and cocktail lounges — enjoy safely.</p>
            </div>
          )}

          {error && (
            <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {(error as Error).message}
              <div className="mt-3">
                <Button variant="outline" size="sm" onClick={() => qc.invalidateQueries({ queryKey: ["ai-bars", place] })}>Retry</Button>
              </div>
            </div>
          )}

          {isFetching && (
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-64 rounded-3xl" />)}
            </div>
          )}

          {place && data && !isFetching && (
            <>
              {data.summary && (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50/60 p-4 text-sm">
                  <Sparkles className="inline h-4 w-4 mr-1.5 text-amber-600" />{data.summary}
                </div>
              )}
              <div className="mt-3 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
                AI research helps shortlist safe bars. Not a medical guarantee. Always confirm the GF drink protocol with the bartender.
              </div>
              <p className="mt-4 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{filtered.length}</span> bars found in{" "}
                <span className="font-medium text-foreground">{data.place}</span>
              </p>
              {filtered.length === 0 ? (
                <div className="mt-8 rounded-3xl border border-dashed border-border bg-cream/40 p-12 text-center text-muted-foreground">
                  No results for this filter. Try "All bars".
                </div>
              ) : (
                <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                  {filtered.map((r) => {
                    const meta = levelMeta(r.glutenFreeLevel);
                    const slug = encodeSlug(r);
                    const isSaved = savedIds.has(slug);
                    return (
                      <article key={slug} className="group relative flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow">
                        <div className={`h-1.5 w-full ${levelBar(r.glutenFreeLevel)}`} />
                        <div className="flex flex-1 flex-col p-5">
                          <button onClick={() => toggleSave.mutate(r)}
                            className="absolute right-4 top-5 grid h-8 w-8 place-items-center rounded-full bg-background/90 shadow-sm backdrop-blur transition hover:scale-110"
                            aria-label="Save"
                          >
                            <Heart className={`h-4 w-4 ${isSaved ? "fill-amber-500 text-amber-500" : "text-muted-foreground"}`} />
                          </button>

                          <div className="flex items-center gap-2 mb-2">
                            <Wine className="h-4 w-4 text-amber-600 shrink-0" />
                            <h3 className="font-display text-lg leading-tight pr-9">{r.name}</h3>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {[r.cuisine, r.priceLevel, r.neighborhood].filter(Boolean).join(" · ")}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-1.5">
                            <Badge className={`${meta.className} text-xs`}>{meta.label}</Badge>
                            <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                              <span className={`inline-block h-2 w-2 rounded-full ${confidenceDot(r.confidence)}`} />
                              {r.confidence === "high" ? "Reliable" : r.confidence === "low" ? "Uncertain" : "Medium"}
                            </span>
                            {r.tags?.slice(0, 2).map((t) => <Badge key={t} variant="outline" className="text-[11px] capitalize">{t}</Badge>)}
                          </div>

                          <p className="mt-3 flex-1 text-sm text-muted-foreground line-clamp-3">{r.glutenFreeNotes}</p>

                          {r.mustTry && r.mustTry.length > 0 && (
                            <p className="mt-2 text-xs text-amber-700">🍺 {r.mustTry[0]}</p>
                          )}

                          {r.cautionNote && (
                            <p className="mt-2 text-xs text-amber-700 line-clamp-2">⚠ {r.cautionNote}</p>
                          )}

                          {r.address && (
                            <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                              {r.address}{r.neighborhood ? `, ${r.neighborhood}` : ""}
                            </p>
                          )}

                          <div className="mt-4 flex gap-2">
                            <Button variant="outline" size="sm" className="flex-1 text-xs" onClick={() => setSelected(r)}>Details →</Button>
                            {r.address && (
                              <a href={`https://maps.google.com/?q=${encodeURIComponent([r.name, r.address, r.city].filter(Boolean).join(", "))}`} target="_blank" rel="noreferrer" className="shrink-0">
                                <Button variant="ghost" size="sm" className="text-xs px-2.5"><MapPin className="h-3.5 w-3.5" /></Button>
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
        </>
      )}

      <BarSheet
        r={selected} open={!!selected} onClose={() => setSelected(null)}
        user={user} trips={trips} savedData={savedData}
        onToggleSave={() => qc.invalidateQueries({ queryKey: ["saved-bars", user?.id] })}
      />
    </div>
  );
}
