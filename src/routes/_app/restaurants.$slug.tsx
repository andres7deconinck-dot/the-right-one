import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Globe, Heart, MapPin, Phone, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchRestaurantDetailAI, type AIRestaurant } from "@/lib/restaurantsAI.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/restaurants/$slug")({
  head: () => ({ meta: [{ title: "Restaurant — GlutenGo" }] }),
  component: RestaurantDetail,
});

function levelMeta(l: AIRestaurant["glutenFreeLevel"]) {
  switch (l) {
    case "dedicated": return { label: "100% gluten-free", className: "bg-emerald-100 text-emerald-700" };
    case "extensive": return { label: "Dedicated GF menu", className: "bg-teal-100 text-teal-700" };
    case "options":   return { label: "GF options", className: "bg-amber-100 text-amber-700" };
    default:          return { label: "Limited GF", className: "bg-muted text-muted-foreground" };
  }
}

function RestaurantDetail() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<string>("none");
  const [saved, setSaved] = useState(false);

  const { data: r, isLoading, error } = useQuery({
    queryKey: ["ai-restaurant", slug],
    queryFn: () => fetchRestaurantDetailAI({ data: { slug } }),
    staleTime: 1000 * 60 * 60,
    retry: false,
  });

  useEffect(() => {
    if (!user) return;
    supabase.from("trips").select("id,destination_country,destination_city,title,status").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setTrips(data || []));
    supabase.from("saved_restaurants").select("trip_id").eq("user_id", user.id).eq("restaurant_id", slug).maybeSingle()
      .then(({ data }) => { setSaved(!!data); if (data?.trip_id) setSelectedTrip(data.trip_id); });
  }, [user, slug]);

  const saveToTrip = async () => {
    if (!user || !r) return;
    const trip_id = selectedTrip === "none" ? null : selectedTrip;
    await supabase.from("saved_restaurants").upsert(
      { user_id: user.id, restaurant_id: slug, trip_id },
      { onConflict: "user_id,restaurant_id" },
    );
    setSaved(true);
    toast.success(trip_id ? "Saved to trip" : "Saved");
  };

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-10 space-y-4">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-12 w-2/3" />
        <Skeleton className="h-32" />
      </div>
    );
  }

  if (error || !r) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center">
        <h1 className="font-display text-3xl">Restaurant not found</h1>
        <p className="mt-2 text-muted-foreground">{(error as Error)?.message || "We couldn't load this venue."}</p>
        <Link to="/restaurants" className="mt-6 inline-block">
          <Button variant="outline"><ArrowLeft className="mr-1.5 h-4 w-4" /> Back to search</Button>
        </Link>
      </div>
    );
  }

  const meta = levelMeta(r.glutenFreeLevel);
  const mapsQuery = encodeURIComponent([r.name, r.address, r.city, r.country].filter(Boolean).join(", "));
  const mapsUrl = `https://maps.google.com/?q=${mapsQuery}`;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <Link to="/restaurants" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to search
      </Link>

      <div className="mt-6">
        <h1 className="font-display text-4xl">{r.name}</h1>
        <p className="mt-1 text-muted-foreground">
          {[r.cuisine, r.priceLevel, r.neighborhood, r.city].filter(Boolean).join(" · ")}
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge className={meta.className}>{meta.label}</Badge>
          {r.tags?.map((t) => <Badge key={t} variant="outline" className="capitalize">{t}</Badge>)}
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <h2 className="flex items-center gap-2 font-display text-lg">
          <Sparkles className="h-4 w-4 text-primary" /> Gluten-free protocol
        </h2>
        <p className="mt-2 text-sm leading-relaxed">{r.glutenFreeNotes}</p>
      </div>

      {r.mustTry && r.mustTry.length > 0 && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg">Must-try gluten-free dishes</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {r.mustTry.map((d) => <li key={d}>🍽️ {d}</li>)}
          </ul>
        </div>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 font-display text-lg"><MapPin className="h-4 w-4" /> Location</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {[r.address, r.city, r.country].filter(Boolean).join(", ") || "Address not provided."}
          </p>
          <div className="mt-3">
            <a href={mapsUrl} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm"><ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Open in Google Maps</Button>
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 font-display text-lg"><Clock className="h-4 w-4" /> Contact & hours</h2>
          {r.openingHours && <p className="mt-2 text-sm whitespace-pre-line">{r.openingHours}</p>}
          <div className="mt-3 space-y-1.5">
            {r.phone && (
              <a href={`tel:${r.phone}`} className="flex items-center gap-2 text-sm hover:underline">
                <Phone className="h-3.5 w-3.5" /> {r.phone}
              </a>
            )}
            {r.website && (
              <a href={r.website} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-sm hover:underline break-all">
                <Globe className="h-3.5 w-3.5" /> {r.website}
              </a>
            )}
            {!r.phone && !r.website && !r.openingHours && (
              <p className="text-sm text-muted-foreground">Call ahead to confirm gluten-free availability.</p>
            )}
          </div>
        </div>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        AI-researched. Always show your translation card and confirm cross-contamination protocols on arrival.
      </p>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-lg flex items-center gap-2"><Heart className="h-4 w-4 text-rose-500" /> Save to my trip</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          <Select value={selectedTrip} onValueChange={setSelectedTrip}>
            <SelectTrigger className="w-64"><SelectValue placeholder="Choose trip (optional)" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Save without trip</SelectItem>
              {trips.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.title || t.destination_city || t.destination_country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={saveToTrip}>{saved ? "Update" : "Save"}</Button>
        </div>
      </div>
    </div>
  );
}
