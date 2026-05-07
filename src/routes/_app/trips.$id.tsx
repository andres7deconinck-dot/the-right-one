import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Download, FileText, Plus, Trash2 } from "lucide-react";
import { jsPDF } from "jspdf";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useSubscription } from "@/hooks/useSubscription";
import { COUNTRIES } from "@/data/countries";
import { RESTAURANTS, getRestaurant } from "@/data/restaurants";
import { toast } from "sonner";

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
  const [notes, setNotes] = useState("");
  const [savedRest, setSavedRest] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState("");

  const load = async () => {
    if (!user) return;
    const { data: t } = await supabase.from("trips").select("*").eq("id", id).maybeSingle();
    if (!t) return;
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
      const r = getRestaurant(s.restaurant_id);
      if (!r) return;
      doc.text(`• ${r.name} (GF ${r.gfScore}) — ${r.address}`, 22, y, { maxWidth: 170 }); y += 6;
    });
    y += 6; doc.setFontSize(14); doc.text("Checklist", 20, y); y += 7; doc.setFontSize(10);
    items.forEach((i) => { doc.text(`${i.is_completed ? "[x]" : "[ ]"} ${i.label}`, 22, y); y += 6; });
    if (notes) { y += 6; doc.setFontSize(14); doc.text("Notes", 20, y); y += 7; doc.setFontSize(10); doc.text(notes, 22, y, { maxWidth: 170 }); }
    doc.save(`glutengo-${trip.title || trip.destination_country || "trip"}.pdf`);
  };

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
          <Badge variant="secondary" className="capitalize">{trip.status}</Badge>
          <Button variant="outline" size="sm" onClick={deleteTrip}><Trash2 className="mr-1.5 h-3.5 w-3.5" /> Delete</Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="mt-8">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="restaurants">Restaurants</TabsTrigger>
          <TabsTrigger value="cards">Cards</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="pack">Travel Pack</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-4">
          <div className="rounded-2xl border border-border bg-card p-5">
            <h3 className="font-display text-lg">Notes</h3>
            <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={6} className="mt-2" />
            <Button size="sm" onClick={saveNotes} className="mt-2">Save</Button>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <Stat label="Restaurants" value={savedRest.length} />
            <Stat label="Cards" value={cards.length} />
            <Stat label="Checklist done" value={`${items.filter(i => i.is_completed).length}/${items.length}`} />
          </div>
        </TabsContent>

        <TabsContent value="restaurants" className="mt-6">
          {savedRest.length === 0 ? (
            <Empty msg="No restaurants saved to this trip yet." cta={<Link to="/restaurants"><Button size="sm">Browse restaurants</Button></Link>} />
          ) : (
            <div className="space-y-2">
              {savedRest.map((s) => {
                const r = getRestaurant(s.restaurant_id);
                if (!r) return null;
                return (
                  <div key={s.id} className="flex items-center justify-between rounded-2xl border border-border bg-card p-4">
                    <div>
                      <Link to="/restaurants/$slug" params={{ slug: r.slug }} className="font-medium hover:underline">{r.name}</Link>
                      <p className="text-xs text-muted-foreground">{r.address} · GF {r.gfScore}</p>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => removeRest(s.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                );
              })}
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
