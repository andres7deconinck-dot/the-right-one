import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Heart, Loader2, MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { searchGlutenFree, dietLabel, type OsmRestaurant } from "@/lib/osmRestaurants.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/restaurants")({
  head: () => ({
    meta: [
      { title: "Restaurant Finder — GlutenGo" },
      { name: "description", content: "Search any city worldwide for gluten-free restaurants, cafés and bakeries." },
    ],
  }),
  component: RestaurantsPage,
});

type DietFilter = "all" | "only" | "yes";

function RestaurantsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [input, setInput] = useState("");
  const [place, setPlace] = useState<string>("");
  const [diet, setDiet] = useState<DietFilter>("all");

  const { data, isFetching, error } = useQuery({
    queryKey: ["osm-restaurants", place],
    queryFn: () => searchGlutenFree({ data: { place } }),
    enabled: !!place,
    staleTime: 1000 * 60 * 30,
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
    mutationFn: async (r: OsmRestaurant) => {
      if (!user) throw new Error("Sign in to save");
      if (savedIds?.has(r.slug)) {
        await supabase.from("saved_restaurants").delete().eq("user_id", user.id).eq("restaurant_id", r.slug);
        return { saved: false };
      }
      const { error } = await supabase.from("saved_restaurants").insert({ user_id: user.id, restaurant_id: r.slug });
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

  const filtered = (data?.results || []).filter((r) => diet === "all" || r.diet === diet);

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl">Find safe restaurants</h1>
        <p className="mt-2 text-muted-foreground">
          Type any city, town or village to discover gluten-free restaurants, cafés and bakeries from the global OpenStreetMap database.
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
          {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Search"}
        </Button>
      </form>

      {place && (
        <div className="mt-4 flex flex-wrap gap-2">
          {(["all", "only", "yes"] as DietFilter[]).map((k) => (
            <button
              key={k}
              onClick={() => setDiet(k)}
              className={`rounded-full border px-3 py-1.5 text-sm transition ${
                diet === k ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card hover:bg-muted"
              }`}
            >
              {k === "all" ? "All" : k === "only" ? "100% gluten-free" : "GF options"}
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
        </div>
      )}

      {isFetching && (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-52 rounded-3xl" />)}
        </div>
      )}

      {place && data && !isFetching && (
        <>
          <p className="mt-6 text-sm text-muted-foreground">
            {filtered.length} result{filtered.length === 1 ? "" : "s"} near <span className="font-medium text-foreground">{data.place.displayName.split(",").slice(0, 2).join(",")}</span>
          </p>

          {filtered.length === 0 ? (
            <div className="mt-8 rounded-3xl border border-dashed border-border bg-cream/40 p-12 text-center text-muted-foreground">
              No tagged gluten-free spots found here yet. Try a nearby larger city.
            </div>
          ) : (
            <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((r) => {
                const lbl = dietLabel(r.diet);
                const isSaved = savedIds?.has(r.slug);
                return (
                  <article key={r.slug} className="relative flex flex-col rounded-3xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow">
                    <button
                      onClick={() => toggleSave.mutate(r)}
                      className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-background/90 backdrop-blur transition hover:scale-110"
                      aria-label="Save"
                    >
                      <Heart className={`h-4 w-4 ${isSaved ? "fill-rose-500 text-rose-500" : "text-muted-foreground"}`} />
                    </button>

                    <h3 className="font-display text-lg leading-tight pr-10">{r.name}</h3>
                    {r.cuisine && <p className="text-xs text-muted-foreground capitalize">{r.cuisine}</p>}

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <Badge
                        variant="secondary"
                        className={
                          lbl.tone === "emerald" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" :
                          lbl.tone === "amber" ? "bg-amber-100 text-amber-700 hover:bg-amber-100" :
                          ""
                        }
                      >
                        {lbl.label}
                      </Badge>
                      {r.takeaway === "yes" && <Badge variant="outline" className="text-xs">Takeaway</Badge>}
                      {r.outdoorSeating === "yes" && <Badge variant="outline" className="text-xs">Outdoor</Badge>}
                    </div>

                    {r.address && (
                      <p className="mt-3 flex items-start gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5 shrink-0 mt-0.5" /> {r.address}
                      </p>
                    )}

                    <Link to="/restaurants/$slug" params={{ slug: r.slug }} className="mt-4">
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
