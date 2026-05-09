import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, Loader2, MapPin, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { searchRestaurantsAI, type AIRestaurant } from "@/lib/restaurantsAI.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/restaurants")({
  head: () => ({
    meta: [
      { title: "Restaurant Finder — GlutenGo" },
      { name: "description", content: "AI-curated gluten-free restaurants, cafés and bakeries in any city worldwide." },
    ],
  }),
  component: RestaurantsPage,
});

type LevelFilter = "all" | "dedicated" | "extensive" | "options" | "limited";

function levelMeta(l: AIRestaurant["glutenFreeLevel"]) {
  switch (l) {
    case "dedicated": return { label: "100% gluten-free", className: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" };
    case "extensive": return { label: "Dedicated GF menu", className: "bg-teal-100 text-teal-700 hover:bg-teal-100" };
    case "options":   return { label: "GF options", className: "bg-amber-100 text-amber-700 hover:bg-amber-100" };
    default:          return { label: "Limited GF", className: "bg-muted text-muted-foreground" };
  }
}

function confidenceMeta(level?: AIRestaurant["confidence"]) {
  switch (level) {
    case "high":
      return { label: "High confidence", className: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    case "low":
      return { label: "Low confidence", className: "bg-rose-50 text-rose-700 border-rose-200" };
    default:
      return { label: "Medium confidence", className: "bg-amber-50 text-amber-700 border-amber-200" };
  }
}

function encodeSlug(r: AIRestaurant) {
  // url-safe base64 of "name|city|country"
  const raw = [r.name, r.city, r.country || ""].join("|");
  const b64 = btoa(unescape(encodeURIComponent(raw))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return `ai-${b64}`;
}

function RestaurantsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [input, setInput] = useState("");
  const [place, setPlace] = useState<string>("");
  const [filter, setFilter] = useState<LevelFilter>("all");

  const { data, isFetching, error } = useQuery({
    queryKey: ["ai-restaurants", place],
    queryFn: () => searchRestaurantsAI({ data: { place } }),
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
    setPlace(input.trim());
  };

  const filtered = (data?.results || []).filter((r) => filter === "all" || r.glutenFreeLevel === filter);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl">Find safe restaurants</h1>
        <p className="mt-2 text-muted-foreground">
          Type any city, town or village. We use AI to research the best gluten-free spots — dedicated bakeries, certified restaurants, and trusted cafés with safe protocols.
        </p>
      </div>

      <form onSubmit={onSearch} className="mt-8 flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[260px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g. Antwerp, Lisbon, Bali, Brugge..."
            className="pl-9 h-12"
          />
        </div>
        <Button type="submit" size="lg" disabled={!input.trim() || isFetching}>
          {isFetching ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Researching…</> : <><Sparkles className="mr-2 h-4 w-4" /> Search</>}
        </Button>
      </form>

      {place && (
        <div className="mt-4 flex flex-wrap gap-2">
          {(["all", "dedicated", "extensive", "options"] as LevelFilter[]).map((k) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                filter === k ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"
              }`}
            >
              {k === "all" ? "All" : k === "dedicated" ? "100% GF" : k === "extensive" ? "Dedicated menu" : "GF options"}
            </button>
          ))}
        </div>
      )}

      {!place && (
        <div className="mt-12 rounded-3xl border border-dashed border-border bg-cream/40 p-12 text-center">
          <MapPin className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">Search a place to see safe restaurants nearby.</p>
        </div>
      )}

      {error && (
        <div className="mt-8 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {(error as Error).message}
          <div className="mt-3">
            <Button variant="outline" size="sm" onClick={() => qc.invalidateQueries({ queryKey: ["ai-restaurants", place] })}>
              Retry search
            </Button>
          </div>
        </div>
      )}

      {isFetching && (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-56 rounded-3xl" />)}
        </div>
      )}

      {place && data && !isFetching && (
        <>
          {data.summary && (
            <div className="mt-6 rounded-2xl border border-border bg-cream/40 p-4 text-sm">
              <Sparkles className="inline h-4 w-4 mr-1.5 text-primary" />
              {data.summary}
            </div>
          )}
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-800">
            AI research helps you shortlist venues, but it is not a medical guarantee. Always confirm shared fryer, prep area, and contamination protocol before ordering.
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {filtered.length} curated result{filtered.length === 1 ? "" : "s"} for <span className="font-medium text-foreground">{data.place}</span>
          </p>

          {filtered.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-border bg-cream/40 p-12 text-center text-muted-foreground">
              No matches for this filter. Try "All".
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((r) => {
                const meta = levelMeta(r.glutenFreeLevel);
                const confidence = confidenceMeta(r.confidence);
                const slug = encodeSlug(r);
                const isSaved = savedIds?.has(slug);
                return (
                  <article key={slug} className="relative flex flex-col rounded-3xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow">
                    <button
                      onClick={() => toggleSave.mutate(r)}
                      className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur transition hover:scale-110"
                      aria-label="Save"
                    >
                      <Heart className={`h-4 w-4 ${isSaved ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
                    </button>

                    <h3 className="font-display text-lg leading-tight pr-10">{r.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {[r.cuisine, r.priceLevel, r.neighborhood].filter(Boolean).join(" · ")}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Badge className={meta.className}>{meta.label}</Badge>
                      <Badge variant="outline" className={confidence.className}>{confidence.label}</Badge>
                      {r.tags?.slice(0, 2).map((t) => (
                        <Badge key={t} variant="outline" className="text-xs capitalize">{t}</Badge>
                      ))}
                    </div>

                    <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{r.glutenFreeNotes}</p>
                    {r.cautionNote && <p className="mt-2 text-xs text-amber-700">{r.cautionNote}</p>}

                    {r.address && (
                      <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" /> {r.address}
                      </p>
                    )}

                    <Link to="/restaurants/$slug" params={{ slug }} className="mt-4">
                      <Button variant="outline" size="sm" className="w-full">View details →</Button>
                    </Link>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}
