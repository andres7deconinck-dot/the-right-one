import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, ExternalLink, Globe, Heart, MapPin, Phone, Clock, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchRestaurantBySlug, dietLabel } from "@/lib/osmRestaurants";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/restaurants/$slug")({
  head: () => ({ meta: [{ title: "Restaurant — GlutenGo" }] }),
  component: RestaurantDetail,
});

function RestaurantDetail() {
  const { slug } = Route.useParams();
  const { user } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<string>("none");
  const [saved, setSaved] = useState(false);

  const { data: r, isLoading, error } = useQuery({
    queryKey: ["osm-restaurant", slug],
    queryFn: () => fetchRestaurantBySlug(slug),
    staleTime: 1000 * 60 * 30,
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
      { user_id: user.id, restaurant_id: r.slug, trip_id },
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
        <p className="mt-2 text-muted-foreground">It may no longer be listed in OpenStreetMap.</p>
        <Link to="/restaurants" className="mt-6 inline-block">
          <Button variant="outline"><ArrowLeft className="mr-1.5 h-4 w-4" /> Back to search</Button>
        </Link>
      </div>
    );
  }

  const lbl = dietLabel(r.diet);
  const mapsUrl = `https://maps.google.com/?q=${r.lat},${r.lng}`;
  const osmUrl = `https://www.openstreetmap.org/${r.osmType}/${r.osmId}`;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <Link to="/restaurants" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to search
      </Link>

      <div className="mt-6">
        <h1 className="font-display text-4xl">{r.name}</h1>
        {r.cuisine && <p className="mt-1 text-muted-foreground capitalize">{r.cuisine}</p>}
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <Badge
            className={
              lbl.tone === "emerald" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" :
              lbl.tone === "amber" ? "bg-amber-100 text-amber-700 hover:bg-amber-100" :
              ""
            }
          >
            {lbl.label}
          </Badge>
          {r.takeaway === "yes" && <Badge variant="outline">Takeaway</Badge>}
          {r.outdoorSeating === "yes" && <Badge variant="outline">Outdoor seating</Badge>}
          {r.wheelchair === "yes" && <Badge variant="outline">Wheelchair accessible</Badge>}
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 font-display text-lg"><MapPin className="h-4 w-4" /> Location</h2>
          {r.address ? (
            <p className="mt-2 text-sm text-muted-foreground">{r.address}</p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Address not provided. Use the map link below.</p>
          )}
          <div className="mt-3 flex flex-wrap gap-2">
            <a href={mapsUrl} target="_blank" rel="noreferrer">
              <Button variant="outline" size="sm"><ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Google Maps</Button>
            </a>
            <a href={osmUrl} target="_blank" rel="noreferrer">
              <Button variant="ghost" size="sm">View on OSM</Button>
            </a>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 font-display text-lg"><Clock className="h-4 w-4" /> Opening hours</h2>
          {r.openingHours ? (
            <p className="mt-2 text-sm whitespace-pre-line">{r.openingHours}</p>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Not listed. Check their website or call ahead.</p>
          )}
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
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-lg">What we know about gluten-free</h2>
        <ul className="mt-3 space-y-2 text-sm">
          {r.diet === "only" && <li>✅ Listed as <strong>100% gluten-free</strong> — the entire menu is safe.</li>}
          {r.diet === "yes" && <li>⚠️ Offers gluten-free options — always confirm cross-contamination protocols on arrival.</li>}
          {r.tags["diet:vegan"] === "yes" && <li>🌱 Also offers vegan options.</li>}
          {r.tags["diet:vegetarian"] === "yes" && <li>🥗 Also offers vegetarian options.</li>}
          {r.tags["diet:lactose_free"] === "yes" && <li>🥛 Lactose-free options.</li>}
          {r.tags.delivery === "yes" && <li>🛵 Delivery available.</li>}
          {r.tags.reservation === "yes" && <li>📅 Reservations possible.</li>}
        </ul>
        <p className="mt-4 text-xs text-muted-foreground">
          Data from OpenStreetMap contributors. Always show your translation card and confirm protocols before ordering.
        </p>
      </div>

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
