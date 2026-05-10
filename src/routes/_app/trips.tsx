import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Plane, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { COUNTRIES } from "@/data/countries";

export const Route = createFileRoute("/_app/trips")({
  head: () => ({ meta: [{ title: "My Trips — GlutenGo" }] }),
  component: TripsPage,
});

function flagFor(country?: string | null) {
  if (!country) return "🌍";
  const c = COUNTRIES.find((x) => x.name.toLowerCase() === country.toLowerCase());
  return c?.flag ?? "🌍";
}

function TripsPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: trips, isLoading } = useQuery({
    queryKey: ["trips", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];
      const { data: ts } = await supabase.from("trips").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
      const ids = (ts || []).map((t) => t.id);
      const counts: Record<string, number> = {};
      if (ids.length) {
        const { data: saves } = await supabase.from("saved_restaurants").select("trip_id").in("trip_id", ids);
        (saves || []).forEach((s: any) => {
          if (s.trip_id) counts[s.trip_id] = (counts[s.trip_id] || 0) + 1;
        });
      }
      return (ts || []).map((t) => ({ ...t, savedCount: counts[t.id] || 0 }));
    },
  });

  if (authLoading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-10">
        <div className="h-10 w-48 animate-pulse rounded-lg bg-muted" />
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-40 rounded-3xl" />)}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-10">
        <h1 className="font-display text-4xl">My Trips</h1>
        <div className="mt-12 rounded-3xl border border-dashed border-border bg-cream/40 p-12 text-center">
          <Plane className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-lg font-display">Sign in to start planning</p>
          <p className="mt-1 text-sm text-muted-foreground">Create a free account to plan trips, save restaurants and download travel packs.</p>
          <Link to="/auth" search={{ redirect: "/trips" } as any}><Button className="mt-5"><Plus className="mr-1.5 h-4 w-4" /> Create free account</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">My Trips</h1>
          <p className="mt-1 text-muted-foreground">Plan, save, and pack everything you need.</p>
        </div>
        <Link to="/trips/new"><Button><Plus className="mr-1.5 h-4 w-4" /> Plan new trip</Button></Link>
      </div>

      {isLoading ? (
        <div className="mt-8 grid gap-4 md:grid-cols-3">{[1,2,3].map((i) => <Skeleton key={i} className="h-40 rounded-3xl" />)}</div>
      ) : (trips || []).length === 0 ? (
        <div className="mt-12 rounded-3xl border border-dashed border-border bg-cream/40 p-12 text-center">
          <Plane className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">No trips yet. Where are you headed?</p>
          <Link to="/trips/new"><Button className="mt-4"><Plus className="mr-1.5 h-4 w-4" /> Plan your first trip</Button></Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(trips || []).map((t) => (
            <Link key={t.id} to="/trips/$id" params={{ id: t.id }} className="rounded-3xl border border-border bg-card p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl">{flagFor(t.destination_country || t.destination)}</p>
                  <h3 className="mt-2 font-display text-lg">{t.title || t.destination_city || t.destination_country || t.destination}</h3>
                  <p className="text-xs text-muted-foreground">{t.destination_city || ""}{t.destination_city && t.destination_country ? ", " : ""}{t.destination_country || t.destination || ""}</p>
                </div>
                <Badge variant={t.status === "active" ? "default" : "secondary"} className="capitalize">{t.status || "planning"}</Badge>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">
                {t.start_date ? new Date(t.start_date).toLocaleDateString() : "—"} → {t.end_date ? new Date(t.end_date).toLocaleDateString() : "—"}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{t.savedCount} restaurants saved</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
