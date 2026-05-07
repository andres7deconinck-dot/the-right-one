import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import { Heart, Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { RESTAURANTS, BADGE_LABEL, priceSymbol, scoreColor, type Restaurant } from "@/data/restaurants";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/restaurants")({
  head: () => ({
    meta: [
      { title: "Restaurant Finder — GlutenGo" },
      { name: "description", content: "Community-verified gluten-free restaurants in 40+ countries." },
    ],
  }),
  component: RestaurantsPage,
});

type FilterKey = "all" | "certified" | "separate-kitchen" | "rating-4" | "p1" | "p2" | "p3";

function RestaurantsPage() {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState<Set<FilterKey>>(new Set(["all"]));
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!user) return;
    supabase.from("saved_restaurants").select("restaurant_id").eq("user_id", user.id)
      .then(({ data }) => setSavedIds(new Set((data || []).map((r: any) => r.restaurant_id))));
  }, [user]);

  const toggleFilter = (k: FilterKey) => {
    setFilters((prev) => {
      const next = new Set(prev);
      if (k === "all") return new Set(["all"]);
      next.delete("all");
      if (next.has(k)) next.delete(k); else next.add(k);
      if (next.size === 0) next.add("all");
      return next;
    });
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return RESTAURANTS.filter((r) => {
      if (q && !`${r.name} ${r.city} ${r.country} ${r.cuisine}`.toLowerCase().includes(q)) return false;
      if (filters.has("all")) return true;
      if (filters.has("certified") && !r.badges.includes("certified")) return false;
      if (filters.has("separate-kitchen") && !r.badges.includes("separate-kitchen")) return false;
      if (filters.has("rating-4") && r.rating < 4.0) return false;
      const tierFilters: PriceTier[] = [];
      if (filters.has("p1")) tierFilters.push(1);
      if (filters.has("p2")) tierFilters.push(2);
      if (filters.has("p3")) tierFilters.push(3);
      if (tierFilters.length && !tierFilters.includes(r.priceTier as any)) return false;
      return true;
    });
  }, [query, filters]);

  type PriceTier = 1 | 2 | 3;

  const toggleSave = async (r: Restaurant) => {
    if (!user) return;
    if (savedIds.has(r.slug)) {
      await supabase.from("saved_restaurants").delete().eq("user_id", user.id).eq("restaurant_id", r.slug);
      setSavedIds((s) => { const n = new Set(s); n.delete(r.slug); return n; });
      toast.success("Removed from saved");
    } else {
      const { error } = await supabase.from("saved_restaurants").insert({ user_id: user.id, restaurant_id: r.slug });
      if (error) { toast.error(error.message); return; }
      setSavedIds((s) => new Set(s).add(r.slug));
      toast.success("Saved");
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl">Find safe restaurants abroad</h1>
        <p className="mt-2 text-muted-foreground">Community-verified gluten-free restaurants in 40+ countries.</p>
      </div>

      <div className="mt-8 flex gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by city, country or name..." className="pl-9" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { k: "all" as const, label: "All" },
          { k: "certified" as const, label: "🟢 Certified" },
          { k: "separate-kitchen" as const, label: "👨‍🍳 Separate kitchen" },
          { k: "rating-4" as const, label: "⭐ 4.0+" },
          { k: "p1" as const, label: "€" },
          { k: "p2" as const, label: "€€" },
          { k: "p3" as const, label: "€€€" },
        ].map((f) => (
          <button
            key={f.k}
            onClick={() => toggleFilter(f.k)}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              filters.has(f.k) ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-border bg-cream/40 p-12 text-center text-muted-foreground">
          No restaurants match your filters.
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {results.map((r) => (
            <article key={r.slug} className="relative flex flex-col rounded-3xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow">
              <button
                onClick={() => toggleSave(r)}
                className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur transition hover:scale-110"
                aria-label="Save"
              >
                <Heart className={`h-4 w-4 ${savedIds.has(r.slug) ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
              </button>

              <div className="flex items-start gap-3 pr-12">
                <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-full font-display text-lg font-bold ${scoreColor(r.gfScore)}`}>
                  {r.gfScore}
                </div>
                <div>
                  <h3 className="font-display text-lg leading-tight">{r.name}</h3>
                  <p className="text-xs text-muted-foreground">{r.cuisine}</p>
                  <p className="mt-1 text-xs">{r.countryFlag} {r.city}, {r.country}</p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {r.badges.map((b) => (
                  <Badge key={b} variant="secondary" className="text-xs font-normal">{BADGE_LABEL[b]}</Badge>
                ))}
              </div>

              <div className="mt-3 flex items-center justify-between text-xs">
                <span className={`rounded-full px-2 py-0.5 ${
                  r.crossContaminationRisk === "low" ? "bg-emerald-100 text-emerald-700" :
                  r.crossContaminationRisk === "medium" ? "bg-amber-100 text-amber-700" :
                  "bg-rose-100 text-rose-700"
                }`}>
                  Risk: {r.crossContaminationRisk}
                </span>
                <span className="flex items-center gap-1 text-muted-foreground">
                  <Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {r.rating} ({r.reviewCount}) · {priceSymbol(r.priceTier)}
                </span>
              </div>

              <Link to="/restaurants/$slug" params={{ slug: r.slug }} className="mt-4">
                <Button variant="outline" size="sm" className="w-full">View details →</Button>
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
