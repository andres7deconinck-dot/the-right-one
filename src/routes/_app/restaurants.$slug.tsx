import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Clock, Coffee, ExternalLink, Globe, Heart, MapPin, Phone, Pill, ShoppingCart, Sparkles, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchRestaurantDetailAI, type AIRestaurant } from "@/lib/restaurantsAI.functions";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/restaurants/$slug")({
  head: () => ({ meta: [{ title: "Venue details — GlutenGo" }] }),
  component: RestaurantDetail,
});

function levelMeta(l: AIRestaurant["glutenFreeLevel"]) {
  switch (l) {
    case "dedicated": return { label: "100% gluten-free", className: "bg-emerald-100 text-emerald-700", bar: "bg-emerald-500" };
    case "extensive": return { label: "Dedicated GF menu", className: "bg-teal-100 text-teal-700",    bar: "bg-teal-500" };
    case "options":   return { label: "GF options",         className: "bg-amber-100 text-amber-700",  bar: "bg-amber-400" };
    default:          return { label: "Limited GF",          className: "bg-muted text-muted-foreground", bar: "bg-muted-foreground/40" };
  }
}

function confidenceMeta(level?: AIRestaurant["confidence"]) {
  switch (level) {
    case "high": return { label: "High confidence", className: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" };
    case "low":  return { label: "Low confidence",  className: "bg-rose-100 text-rose-700",       dot: "bg-rose-500" };
    default:     return { label: "Medium confidence", className: "bg-amber-100 text-amber-700",   dot: "bg-amber-400" };
  }
}

function venueIcon(type?: AIRestaurant["venueType"]) {
  switch (type) {
    case "coffeebar":   return Coffee;
    case "supermarket": return ShoppingCart;
    case "pharmacy":    return Pill;
    default:            return UtensilsCrossed;
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
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-32 rounded-2xl" />
      </div>
    );
  }

  if (error || !r) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-16 text-center">
        <h1 className="font-display text-3xl">Venue not found</h1>
        <p className="mt-2 text-muted-foreground">{(error as Error)?.message || "We couldn't load this venue."}</p>
        <Link to="/restaurants" className="mt-6 inline-block">
          <Button variant="outline"><ArrowLeft className="mr-1.5 h-4 w-4" /> Back to search</Button>
        </Link>
      </div>
    );
  }

  const meta = levelMeta(r.glutenFreeLevel);
  const confidence = confidenceMeta(r.confidence);
  const VenueIcon = venueIcon(r.venueType);
  const mapsQuery = encodeURIComponent([r.name, r.address, r.city, r.country].filter(Boolean).join(", "));
  const mapsUrl = `https://maps.google.com/?q=${mapsQuery}`;
  const mapsEmbed = `https://maps.google.com/maps?q=${mapsQuery}&output=embed&z=16`;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <Link to="/restaurants" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to search
      </Link>

      {/* Header */}
      <div className="mt-6">
        <div className="flex items-start gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <VenueIcon className="h-6 w-6" />
          </span>
          <div>
            <h1 className="font-display text-4xl leading-tight">{r.name}</h1>
            <p className="mt-1 text-muted-foreground">
              {[r.cuisine, r.priceLevel, r.neighborhood, r.city, r.country].filter(Boolean).join(" · ")}
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Badge className={meta.className}>{meta.label}</Badge>
          <span className="flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium">
            <span className={`h-2 w-2 rounded-full ${confidence.dot}`} />
            {confidence.label}
          </span>
          {r.tags?.map((t) => <Badge key={t} variant="outline" className="capitalize text-xs">{t}</Badge>)}
        </div>
      </div>

      {/* Map embed */}
      {(r.address || r.city) && (
        <div className="mt-6 overflow-hidden rounded-2xl border border-border shadow-soft">
          <iframe
            src={mapsEmbed}
            className="h-64 w-full border-0 md:h-80"
            loading="lazy"
            title={`Map: ${r.name}`}
          />
          <div className="flex items-center justify-between border-t border-border bg-card px-4 py-2.5">
            <div className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">
                {[r.address, r.city, r.country].filter(Boolean).join(", ")}
              </span>
            </div>
            <a href={mapsUrl} target="_blank" rel="noreferrer" className="shrink-0 ml-4">
              <Button variant="outline" size="sm" className="text-xs gap-1.5">
                <ExternalLink className="h-3.5 w-3.5" /> Open in Maps
              </Button>
            </a>
          </div>
        </div>
      )}

      {/* GF protocol */}
      <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <h2 className="flex items-center gap-2 font-display text-lg">
          <Sparkles className="h-4 w-4 text-primary" /> Gluten-free protocol
        </h2>
        <p className="mt-2 text-sm leading-relaxed">{r.glutenFreeNotes}</p>
        {r.cautionNote && (
          <p className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2.5 text-xs text-amber-800">
            ⚠ {r.cautionNote}
          </p>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          Source: {r.verificationSource || "AI research + public web sources"}
          {r.lastVerifiedAt ? ` · Last checked ${new Date(r.lastVerifiedAt).toLocaleDateString()}` : ""}
        </p>
      </div>

      {/* Must-try dishes */}
      {r.mustTry && r.mustTry.length > 0 && (
        <div className="mt-6 rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg">Must-try gluten-free items</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {r.mustTry.map((d) => (
              <li key={d} className="flex items-center gap-2 rounded-xl bg-muted/50 px-3 py-2 text-sm">
                <span>🍽️</span> {d}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Contact & hours */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="flex items-center gap-2 font-display text-lg">
          <Clock className="h-4 w-4" /> Contact & hours
        </h2>
        {r.openingHours && (
          <p className="mt-3 whitespace-pre-line rounded-xl bg-muted/50 px-4 py-3 text-sm">{r.openingHours}</p>
        )}
        <div className="mt-3 space-y-2">
          {r.phone && (
            <a href={`tel:${r.phone}`} className="flex items-center gap-2.5 text-sm hover:text-primary transition-colors">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span>{r.phone}</span>
            </a>
          )}
          {r.website && (
            <a href={r.website} target="_blank" rel="noreferrer" className="flex items-center gap-2.5 text-sm hover:text-primary transition-colors break-all">
              <Globe className="h-4 w-4 shrink-0 text-muted-foreground" />
              <span>{r.website}</span>
            </a>
          )}
          {!r.phone && !r.website && !r.openingHours && (
            <p className="text-sm text-muted-foreground">Call ahead to confirm gluten-free availability.</p>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        AI-researched. Always show your translation card and confirm cross-contamination protocols on arrival.
      </p>

      {/* Save to trip */}
      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-lg flex items-center gap-2">
          <Heart className="h-4 w-4 text-rose-500" /> Save to my trip
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">Link this venue to one of your planned trips.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Select value={selectedTrip} onValueChange={setSelectedTrip}>
            <SelectTrigger className="w-64"><SelectValue placeholder="Choose trip (optional)" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Save without trip</SelectItem>
              {trips.map((t) => (
                <SelectItem key={t.id} value={t.id}>{t.title || t.destination_city || t.destination_country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={saveToTrip} variant={saved ? "outline" : "default"}>
            {saved ? "Update saved" : "Save venue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
