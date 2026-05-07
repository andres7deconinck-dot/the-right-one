import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink, Heart, MapPin, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRestaurant, BADGE_LABEL, priceSymbol, scoreColor } from "@/data/restaurants";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/restaurants/$slug")({
  head: ({ params }) => {
    const r = getRestaurant(params.slug);
    return { meta: [{ title: r ? `${r.name} — GlutenGo` : "Restaurant — GlutenGo" }] };
  },
  component: RestaurantDetail,
});

function RestaurantDetail() {
  const { slug } = Route.useParams();
  const r = getRestaurant(slug);
  const { user } = useAuth();
  const [trips, setTrips] = useState<any[]>([]);
  const [selectedTrip, setSelectedTrip] = useState<string>("none");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("trips").select("id,destination_country,destination_city,title,status").eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => setTrips(data || []));
    supabase.from("saved_restaurants").select("trip_id").eq("user_id", user.id).eq("restaurant_id", slug).maybeSingle()
      .then(({ data }) => { setSaved(!!data); if (data?.trip_id) setSelectedTrip(data.trip_id); });
  }, [user, slug]);

  if (!r) throw notFound();

  const saveToTrip = async () => {
    if (!user) return;
    const trip_id = selectedTrip === "none" ? null : selectedTrip;
    await supabase.from("saved_restaurants").upsert(
      { user_id: user.id, restaurant_id: r.slug, trip_id },
      { onConflict: "user_id,restaurant_id" },
    );
    setSaved(true);
    toast.success(trip_id ? "Saved to trip" : "Saved");
  };

  const mapsUrl = `https://maps.google.com/?q=${r.lat},${r.lng}`;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <Link to="/restaurants" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to restaurants
      </Link>

      <div className="mt-6 flex flex-wrap items-start justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl">{r.name}</h1>
          <p className="mt-1 text-muted-foreground">{r.cuisine} · {r.countryFlag} {r.city}, {r.country}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {r.badges.map((b) => <Badge key={b} variant="secondary">{BADGE_LABEL[b]}</Badge>)}
            <Badge variant="outline">{priceSymbol(r.priceTier)}</Badge>
            <span className="flex items-center gap-1 text-sm"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {r.rating} ({r.reviewCount})</span>
          </div>
        </div>
        <div className={`grid h-24 w-24 place-items-center rounded-full font-display text-3xl font-bold shadow-soft ${scoreColor(r.gfScore)}`}>
          {r.gfScore}
        </div>
      </div>

      <p className="mt-6 text-foreground/90">{r.description}</p>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="flex items-center gap-2 font-display text-lg"><MapPin className="h-4 w-4" /> Location</h2>
          <p className="mt-2 text-sm text-muted-foreground">{r.address}</p>
          <a href={mapsUrl} target="_blank" rel="noreferrer">
            <Button variant="outline" size="sm" className="mt-3"><ExternalLink className="mr-1.5 h-3.5 w-3.5" /> Open in Google Maps</Button>
          </a>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <h2 className="font-display text-lg">Opening hours</h2>
          <table className="mt-2 w-full text-sm">
            <tbody>{r.hours.map((h) => (
              <tr key={h.day}><td className="py-1 pr-4 text-muted-foreground">{h.day}</td><td className="py-1">{h.open}</td></tr>
            ))}</tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <h2 className="font-display text-lg">Cross-contamination info</h2>
        <p className="mt-2 text-sm">
          Risk level: <span className={`rounded-full px-2 py-0.5 text-xs ${
            r.crossContaminationRisk === "low" ? "bg-emerald-100 text-emerald-700" :
            r.crossContaminationRisk === "medium" ? "bg-amber-100 text-amber-700" :
            "bg-rose-100 text-rose-700"
          }`}>{r.crossContaminationRisk}</span>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          {r.badges.includes("separate-kitchen") ? "Dedicated GF prep area." : "Shared kitchen — confirm protocols on arrival."}{" "}
          {r.badges.includes("separate-fryer") && "Separate fryer for GF items."}
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-border bg-card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg flex items-center gap-2"><Heart className="h-4 w-4 text-rose-500" /> Save to my trip</h2>
        </div>
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

      <div className="mt-8">
        <h2 className="font-display text-2xl">Community reviews</h2>
        <p className="text-sm text-muted-foreground">By celiac travelers.</p>
        <div className="mt-4 space-y-3">
          {r.reviews.map((rev, i) => (
            <div key={i} className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{rev.name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(rev.date).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  {Array.from({ length: rev.rating }).map((_, k) => <Star key={k} className="h-3 w-3 fill-amber-400 text-amber-400" />)}
                </div>
              </div>
              <Badge variant="outline" className="mt-2 text-xs">
                {rev.reaction === "none" ? "✅ No reaction" : rev.reaction === "mild" ? "⚠️ Mild reaction" : "🔴 Severe reaction"}
              </Badge>
              <p className="mt-2 text-sm">{rev.comment}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          <button className="hover:underline">Report an error →</button>
        </p>
      </div>
    </div>
  );
}
