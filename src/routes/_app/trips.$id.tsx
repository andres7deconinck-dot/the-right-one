import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, BookOpen, Download, FileText, MapPin, Pill, Plus, ShoppingBag, Trash2, UtensilsCrossed, Wine } from "lucide-react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useSubscription } from "@/hooks/useSubscription";
import { COUNTRIES } from "@/data/countries";
import { toast } from "sonner";

function decodeAISlug(slug: string): { name: string; city: string; country: string } | null {
  const m = slug.match(/^(?:ai|bar|pharmacy|shop)-(.+)$/);
  if (!m) return null;
  try {
    const b64 = m[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = b64 + "=".repeat((4 - b64.length % 4) % 4);
    const bytes = Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
    const raw = new TextDecoder().decode(bytes);
    const [name, city, country] = raw.split("|");
    if (!name || !city) return null;
    return { name, city, country: country || "" };
  } catch {
    return null;
  }
}

function slugVenueType(slug: string): "restaurant" | "bar" | "pharmacy" | "shop" {
  if (slug.startsWith("bar-")) return "bar";
  if (slug.startsWith("pharmacy-")) return "pharmacy";
  if (slug.startsWith("shop-")) return "shop";
  return "restaurant";
}

export const Route = createFileRoute("/_app/trips/$id")({
  head: () => ({ meta: [{ title: "Trip — GlutenGo" }] }),
  component: TripDetail,
});

function flagFor(country?: string | null) {
  const c = COUNTRIES.find((x) => x.name.toLowerCase() === (country || "").toLowerCase());
  return c?.flag ?? "🌍";
}

function TripDetail() {
  const { id } = Route.useParams();
  const { user } = useAuth();
  const { isActive } = useSubscription();
  const nav = useNavigate();
  const [trip, setTrip] = useState<any>(null);
  const [loadError, setLoadError] = useState(false);
  const [notes, setNotes] = useState("");
  const [savedRest, setSavedRest] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState("");

  const load = async () => {
    if (!user) return;
    const { data: t, error } = await supabase.from("trips").select("*").eq("id", id).maybeSingle();
    if (error || !t) { setLoadError(true); return; }
    setTrip(t); setNotes(t.notes || "");
    const { data: sr } = await supabase.from("saved_restaurants").select("*").eq("trip_id", id);
    setSavedRest(sr || []);
    const { data: cs } = await supabase.from("translation_cards").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setCards(cs || []);
    const { data: ci } = await supabase.from("trip_checklist_items").select("*").eq("trip_id", id).order("sort_order");
    setItems(ci || []);
  };
  useEffect(() => { load(); }, [user, id]);

  const saveNotes = async () => {
    await supabase.from("trips").update({ notes }).eq("id", id);
    toast.success("Saved");
  };

  const cycleStatus = async () => {
    const next = trip.status === "planning" ? "active" : trip.status === "active" ? "completed" : "planning";
    await supabase.from("trips").update({ status: next }).eq("id", id);
    setTrip((prev: any) => ({ ...prev, status: next }));
    toast.success(`Status → ${next}`);
  };

  const toggleItem = async (item: any) => {
    await supabase.from("trip_checklist_items").update({ is_completed: !item.is_completed }).eq("id", item.id);
    setItems((prev) => prev.map((x) => x.id === item.id ? { ...x, is_completed: !x.is_completed } : x));
  };
  const addItem = async () => {
    if (!newItem.trim()) return;
    const { data } = await supabase.from("trip_checklist_items").insert({ trip_id: id, label: newItem, sort_order: items.length + 1 }).select().single();
    if (data) setItems([...items, data]);
    setNewItem("");
  };
  const delItem = async (iid: string) => {
    await supabase.from("trip_checklist_items").delete().eq("id", iid);
    setItems(items.filter((x) => x.id !== iid));
  };
  const removeRest = async (sid: string) => {
    await supabase.from("saved_restaurants").delete().eq("id", sid);
    setSavedRest(savedRest.filter((x) => x.id !== sid));
  };
  const deleteTrip = async () => {
    if (!confirm("Delete this trip?")) return;
    await supabase.from("trips").delete().eq("id", id);
    nav({ to: "/trips" });
  };

  const generatePDF = () => {
    if (!isActive) { toast.error("Travel pack PDF is a Traveler/Family feature"); return; }
    const doc = new jsPDF();
    let y = 20;
    doc.setFontSize(22); doc.text(`${flagFor(trip.destination_country)} ${trip.title || trip.destination_city || trip.destination_country}`, 20, y); y += 10;
    doc.setFontSize(11); doc.setTextColor(100);
    doc.text(`${trip.start_date || ""} → ${trip.end_date || ""}`, 20, y); y += 12;
    doc.setTextColor(0); doc.setFontSize(14); doc.text("Restaurants", 20, y); y += 7;
    doc.setFontSize(10);
    savedRest.forEach((s) => {
      const info = decodeAISlug(s.restaurant_id);
      if (!info) return;
      doc.text(`• ${info.name} — ${info.city}${info.country ? ", " + info.country : ""}`, 22, y, { maxWidth: 170 }); y += 6;
    });
    y += 6; doc.setFontSize(14); doc.text("Checklist", 20, y); y += 7; doc.setFontSize(10);
    items.forEach((i) => { doc.text(`${i.is_completed ? "[x]" : "[ ]"} ${i.label}`, 22, y); y += 6; });
    if (notes) { y += 6; doc.setFontSize(14); doc.text("Notes", 20, y); y += 7; doc.setFontSize(10); doc.text(notes, 22, y, { maxWidth: 170 }); }
    doc.save(`glutengo-${trip.title || trip.destination_country || "trip"}.pdf`);
  };

  if (loadError) {
    return (
      <div className="mx-auto max-w-5xl px-5 py-10">
        <Link to="/trips" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back to trips
        </Link>
        <div className="mt-8 rounded-3xl border border-dashed border-border p-12 text-center">
          <p className="text-muted-foreground">Trip not found or you don't have access to it.</p>
          <Link to="/trips"><Button className="mt-4">View my trips</Button></Link>
        </div>
      </div>
    );
  }
  if (!trip) return <div className="mx-auto max-w-5xl px-5 py-10"><Skeleton className="h-40" /></div>;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      <Link to="/trips" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to trips
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">{flagFor(trip.destination_country)} {trip.title || trip.destination_city || trip.destination_country || trip.destination}</h1>
          <p className="text-sm text-muted-foreground">
            {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : "—"} → {trip.end_date ? new Date(trip.end_date).toLocaleDateString() : "—"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={cycleStatus}
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize transition ${
              trip.status === "planning" ? "bg-amber-100 text-amber-700 hover:bg-amber-200" :
              trip.status === "active" ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" :
              "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {trip.status} ↻
          </button>
          <Button variant="outline" size="sm" onClick={deleteTrip}><Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mt-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="restaurants">Saved Spots</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="pack">Travel Pack</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <Stat label="Saved venues" value={savedRest.length} />
            <Stat label="Translation cards" value={cards.length} />
            <Stat label="Checklist done" value={`${items.filter(i => i.is_completed).length}/${items.length}`} />
          </div>

          {/* Quick actions */}
          <div className="flex flex-wrap gap-2">
            {trip.destination_city && (
              <Link to="/restaurants">
                <Button variant="outline" size="sm" className="gap-1.5">
                  <MapPin className="h-3.5 w-3.5" /> Find restaurants in {trip.destination_city}
                </Button>
              </Link>
            )}
            {(() => {
              const countryGuide = COUNTRIES.find(
                (x) => x.name.toLowerCase() === (trip.destination_country || "").toLowerCase()
              );
              return countryGuide ? (
                <Link to="/countries/$slug" params={{ slug: countryGuide.slug }}>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <BookOpen className="h-3.5 w-3.5" /> {countryGuide.flag} Country guide
                  </Button>
                </Link>
              ) : null;
            })()}
            <Link to="/cards">
              <Button variant="outline" size="sm" className="gap-1.5">+ Translation card</Button>
            </Link>
          </div>

          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display text-lg">Notes</h3>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} className="mt-2" />
            <Button size="sm" onClick={saveNotes} className="mt-2">Save</Button>
          </div>
        </TabsContent>

        <TabsContent value="restaurants" className="mt-6">
          {savedRest.length === 0 ? (
            <Empty
              msg="No spots saved to this trip yet."
              cta={
                <div className="flex flex-wrap gap-2 justify-center">
                  <Link to="/restaurants"><Button size="sm" variant="outline"><UtensilsCrossed className="mr-1.5 h-3.5 w-3.5" /> Restaurants</Button></Link>
                  <Link to="/bars"><Button size="sm" variant="outline"><Wine className="mr-1.5 h-3.5 w-3.5" /> Bars</Button></Link>
                  <Link to="/pharmacies"><Button size="sm" variant="outline"><Pill className="mr-1.5 h-3.5 w-3.5" /> Pharmacies</Button></Link>
                  <Link to="/shops"><Button size="sm" variant="outline"><ShoppingBag className="mr-1.5 h-3.5 w-3.5" /> Shops</Button></Link>
                </div>
              }
            />
          ) : (
            <div className="space-y-6">
              {(
                [
                  { type: "restaurant", label: "Restaurants", Icon: UtensilsCrossed, to: "/restaurants" as const, color: "text-emerald-600" },
                  { type: "bar",        label: "Bars",        Icon: Wine,            to: "/bars"        as const, color: "text-amber-600" },
                  { type: "pharmacy",   label: "Pharmacies",  Icon: Pill,            to: "/pharmacies"  as const, color: "text-blue-600" },
                  { type: "shop",       label: "Shops",       Icon: ShoppingBag,     to: "/shops"       as const, color: "text-green-600" },
                ] as const
              ).map(({ type, label, Icon, to, color }) => {
                const group = savedRest.filter((s) => slugVenueType(s.restaurant_id) === type);
                if (group.length === 0) return null;
                return (
                  <div key={type}>
                    <div className={`flex items-center gap-2 mb-2 ${color}`}>
                      <Icon className="h-4 w-4" />
                      <span className="text-sm font-semibold uppercase tracking-wider">{label}</span>
                      <span className="ml-1 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">{group.length}</span>
                    </div>
                    <div className="space-y-2">
                      {group.map((s) => {
                        const info = decodeAISlug(s.restaurant_id);
                        if (!info) return null;
                        return (
                          <div key={s.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
                            <div>
                              <p className="font-medium">{info.name}</p>
                              <p className="text-xs text-muted-foreground">{info.city}{info.country ? `, ${info.country}` : ""}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => removeRest(s.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
              <div className="flex flex-wrap gap-2 pt-2">
                <Link to="/restaurants"><Button variant="outline" size="sm"><UtensilsCrossed className="mr-1.5 h-3.5 w-3.5" /> Add restaurant</Button></Link>
                <Link to="/bars"><Button variant="outline" size="sm"><Wine className="mr-1.5 h-3.5 w-3.5" /> Add bar</Button></Link>
                <Link to="/pharmacies"><Button variant="outline" size="sm"><Pill className="mr-1.5 h-3.5 w-3.5" /> Add pharmacy</Button></Link>
                <Link to="/shops"><Button variant="outline" size="sm"><ShoppingBag className="mr-1.5 h-3.5 w-3.5" /> Add shop</Button></Link>
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="cards" className="mt-6">
          {cards.length === 0 ? (
            <Empty msg="No translation cards yet." cta={<Link to="/cards"><Button size="sm">Generate a card</Button></Link>} />
          ) : (
            <div className="space-y-2">
              {cards.map((c) => (
                <div key={c.id} className="rounded-2xl border border-border bg-card p-4">
                  <p className="text-xs font-medium text-primary">{c.language_label}</p>
                  <p className="mt-1 line-clamp-2 text-sm">{c.body}</p>
                </div>
              ))}
              <Link to="/cards"><Button variant="outline" size="sm" className="mt-2"><Plus className="mr-1.5 h-3.5 w-3.5" /> New card</Button></Link>
            </div>
          )}
        </TabsContent>

        <TabsContent value="checklist" className="mt-6 space-y-2">
          {items.map((i) => (
            <div key={i.id} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
              <Checkbox checked={i.is_completed} onCheckedChange={() => toggleItem(i)} />
              <span className={`flex-1 text-sm ${i.is_completed ? "text-muted-foreground line-through" : ""}`}>{i.label}</span>
              <button onClick={() => delItem(i.id)}><Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" /></button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input value={newItem} onChange={(e) => setNewItem(e.target.value)} placeholder="Add item..." />
            <Button onClick={addItem}><Plus className="h-4 w-4" /></Button>
          </div>
        </TabsContent>

        <TabsContent value="pack" className="mt-6">
          <div className="rounded-3xl border border-border bg-card-soft p-8 text-center">
            <FileText className="mx-auto h-10 w-10 text-primary" />
            <h3 className="mt-3 font-display text-2xl">Download your travel pack</h3>
            <p className="mt-2 text-sm text-muted-foreground">A PDF with all restaurants, checklist and notes.</p>
            {isActive ? (
              <Button onClick={generatePDF} className="mt-5"><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
            ) : (
              <Link to="/pricing"><Button className="mt-5">Upgrade for travel packs</Button></Link>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: any }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 font-display text-2xl">{value}</p>
    </div>
  );
}

function Empty({ msg, cta }: { msg: string; cta: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-border bg-cream/40 p-10 text-center">
      <p className="text-muted-foreground">{msg}</p>
      <div className="mt-3">{cta}</div>
    </div>
  );
}
