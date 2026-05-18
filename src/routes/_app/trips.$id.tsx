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
import { EMERGENCY_COUNTRIES, EMERGENCY_NUMBERS } from "@/data/emergencyPhrases";
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

    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const PW = 210, PH = 297, M = 16, CW = PW - M * 2;
    let y = 0;

    // jsPDF's built-in fonts are Latin-1 only — non-Latin scripts render as
    // gibberish. Sanitize and fall back to phonetic/English notice.
    const latinSafe = (s: string) => {
      if (!s) return "";
      // strip non Latin-1 characters but keep punctuation, accented latin, basic symbols
      // Latin-1 range is 0x00–0xFF
      // eslint-disable-next-line no-control-regex
      const cleaned = s.replace(/[^\x00-\xFF]/g, "").replace(/\s+/g, " ").trim();
      return cleaned;
    };
    const hasNonLatin = (s: string) => /[^\x00-\xFF]/.test(s || "");

    const C = {
      primary:  [26,  74,  54]  as [number,number,number],
      primaryDk:[14,  46,  34]  as [number,number,number],
      green:    [22, 163,  74]  as [number,number,number],
      amber:    [217, 119,  6]  as [number,number,number],
      blue:     [37,  99, 235]  as [number,number,number],
      teal:     [16, 185, 129]  as [number,number,number],
      rose:     [225,  29,  72] as [number,number,number],
      body:     [30,  30,  30]  as [number,number,number],
      sub:      [70,  70,  70]  as [number,number,number],
      muted:    [115, 115, 115] as [number,number,number],
      white:    [255, 255, 255] as [number,number,number],
      lightBg:  [245, 250, 245] as [number,number,number],
      cream:    [253, 251, 244] as [number,number,number],
      amberBg:  [254, 252, 232] as [number,number,number],
      amberBdr: [251, 191,  36] as [number,number,number],
      roseBg:   [255, 241, 242] as [number,number,number],
      roseBdr:  [251, 113, 133] as [number,number,number],
      blueBg:   [239, 246, 255] as [number,number,number],
      grayLn:   [220, 220, 220] as [number,number,number],
    };

    const tripTitle = trip.title || trip.destination_city || trip.destination_country || "My Trip";
    const dest = [trip.destination_city, trip.destination_country].filter(Boolean).join(", ");

    // Find country guides
    const countryGuide = COUNTRIES.find(c =>
      c.name.toLowerCase() === (trip.destination_country || "").toLowerCase()
    );
    const emergencyCountry = EMERGENCY_COUNTRIES.find(e =>
      e.name.toLowerCase() === (trip.destination_country || "").toLowerCase() ||
      (trip.destination_country || "").toLowerCase().includes(e.name.toLowerCase())
    );

    const fmtDate = (d?: string | null) =>
      d ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : null;

    // ── Footer / page chrome ────────────────────────────────────────────────────
    const footer = () => {
      const n = (doc.internal as any).getNumberOfPages();
      // top hairline
      doc.setDrawColor(...C.grayLn); doc.setLineWidth(0.2);
      doc.line(M, PH - 12, PW - M, PH - 12);
      doc.setFontSize(8); doc.setFont("helvetica", "normal");
      doc.setTextColor(...C.muted);
      doc.text("GlutenGo Travel Pack", M, PH - 7);
      doc.text(latinSafe(tripTitle), PW / 2, PH - 7, { align: "center" });
      doc.text(`Page ${n}`, PW - M, PH - 7, { align: "right" });
    };

    const newPage = () => { doc.addPage(); y = M + 4; footer(); };
    const guard = (need: number) => { if (y + need > PH - 18) newPage(); };

    const sectionTitle = (title: string, col: [number,number,number], subtitle?: string) => {
      guard(subtitle ? 22 : 16);
      // accent bar
      doc.setFillColor(...col);
      doc.rect(M, y, 4, 10, "F");
      doc.setFont("helvetica","bold"); doc.setFontSize(14); doc.setTextColor(...col);
      doc.text(title.toUpperCase(), M + 8, y + 7);
      if (subtitle) {
        doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(...C.muted);
        doc.text(subtitle, M + 8, y + 12.5);
      }
      doc.setDrawColor(...C.grayLn); doc.setLineWidth(0.25);
      doc.line(M, y + (subtitle ? 16 : 12), PW - M, y + (subtitle ? 16 : 12));
      y += subtitle ? 21 : 16;
    };

    const bullet = (text: string, col: [number,number,number] = C.primary) => {
      const lines = doc.splitTextToSize(latinSafe(text), CW - 12);
      guard(lines.length * 5 + 1);
      doc.setFillColor(...col);
      doc.circle(M + 3, y - 1.4, 1.1, "F");
      doc.setFont("helvetica","normal"); doc.setFontSize(9.5); doc.setTextColor(...C.body);
      doc.text(lines, M + 7, y);
      y += lines.length * 5 + 1;
    };

    const kv = (k: string, v: string) => {
      const vLines = doc.splitTextToSize(latinSafe(v), CW - 42);
      guard(vLines.length * 5 + 2);
      doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(...C.muted);
      doc.text(k.toUpperCase(), M, y);
      doc.setFont("helvetica","normal"); doc.setFontSize(10); doc.setTextColor(...C.body);
      doc.text(vLines, M + 38, y);
      y += vLines.length * 5 + 2;
    };

    const venueRow = (idx: number, name: string, sub: string, col: [number,number,number]) => {
      guard(14);
      doc.setFillColor(250, 252, 250);
      doc.roundedRect(M, y - 2, CW, 12, 2, 2, "F");
      doc.setDrawColor(...C.grayLn); doc.setLineWidth(0.2);
      doc.roundedRect(M, y - 2, CW, 12, 2, 2, "S");
      // index pill
      doc.setFillColor(...col);
      doc.roundedRect(M + 3, y, 7, 8, 1.2, 1.2, "F");
      doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(...C.white);
      doc.text(String(idx), M + 6.5, y + 5.6, { align: "center" });
      // name
      doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(...C.body);
      doc.text(latinSafe(name), M + 13, y + 3.5, { maxWidth: CW - 18 });
      // sub
      doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(...C.muted);
      doc.text(latinSafe(sub), M + 13, y + 8, { maxWidth: CW - 18 });
      y += 14;
    };

    // ╔══════════════════════════════════════════════════════════════════════════╗
    // ║                              COVER PAGE                                  ║
    // ╚══════════════════════════════════════════════════════════════════════════╝
    // Full-page cream background
    doc.setFillColor(...C.cream);
    doc.rect(0, 0, PW, PH, "F");
    // Deep top band
    doc.setFillColor(...C.primary);
    doc.rect(0, 0, PW, 80, "F");
    doc.setFillColor(74, 222, 128);
    doc.rect(0, 76, PW, 4, "F");

    // Brand mark
    doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(195, 230, 210);
    doc.text("GLUTENGO", M, 18);
    doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(160, 210, 185);
    doc.text("YOUR GLUTEN-FREE TRAVEL COMPANION", M, 24);

    // Title block
    doc.setFont("helvetica","bold"); doc.setFontSize(40); doc.setTextColor(...C.white);
    const titleLines = doc.splitTextToSize(latinSafe(tripTitle), PW - M * 2);
    doc.text(titleLines.slice(0, 2), M, 52);
    if (dest) {
      doc.setFont("helvetica","normal"); doc.setFontSize(13); doc.setTextColor(195, 230, 210);
      doc.text(latinSafe(dest), M, 68);
    }

    // Big card with key trip info
    doc.setFillColor(...C.white);
    doc.roundedRect(M, 96, CW, 70, 4, 4, "F");
    doc.setDrawColor(...C.grayLn); doc.setLineWidth(0.3);
    doc.roundedRect(M, 96, CW, 70, 4, 4, "S");

    const startD = fmtDate(trip.start_date);
    const endD   = fmtDate(trip.end_date);
    const nights = (trip.start_date && trip.end_date)
      ? Math.max(0, Math.round((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / 86400000))
      : null;

    // 3-column grid in card
    const colW = CW / 3;
    const labelAt = (idx: number, label: string, value: string) => {
      const cx = M + colW * idx + 6;
      doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(...C.muted);
      doc.text(label.toUpperCase(), cx, 108);
      doc.setFont("helvetica","bold"); doc.setFontSize(14); doc.setTextColor(...C.primary);
      doc.text(latinSafe(value || "—"), cx, 118);
    };
    labelAt(0, "From", startD || "—");
    labelAt(1, "To", endD || "—");
    labelAt(2, "Nights", nights !== null ? String(nights) : "—");

    // divider
    doc.setDrawColor(...C.grayLn); doc.setLineWidth(0.2);
    doc.line(M + 6, 126, M + CW - 6, 126);

    // Bottom row of meta
    doc.setFont("helvetica","bold"); doc.setFontSize(8); doc.setTextColor(...C.muted);
    doc.text("DESTINATION", M + 6, 136);
    doc.text("STATUS", M + 6 + colW, 136);
    doc.text("AWARENESS LEVEL", M + 6 + colW * 2, 136);

    doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(...C.body);
    doc.text(latinSafe(dest || "Unspecified"), M + 6, 144, { maxWidth: colW - 8 });

    const statusLabel = trip.status ? trip.status.charAt(0).toUpperCase() + trip.status.slice(1) : "Planning";
    const statusCol: [number,number,number] = trip.status === "active" ? C.green : trip.status === "completed" ? C.blue : C.amber;
    doc.setFillColor(...statusCol);
    doc.roundedRect(M + 6 + colW, 139, 26, 8, 1.5, 1.5, "F");
    doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(...C.white);
    doc.text(statusLabel, M + 19 + colW, 144.5, { align: "center" });

    const awareness = countryGuide?.awareness || "—";
    const awCol: [number,number,number] = awareness === "high" ? C.green : awareness === "medium" ? C.amber : C.rose;
    doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(...awCol);
    doc.text(awareness.toUpperCase(), M + 6 + colW * 2, 144);

    // What's inside
    doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(...C.primary);
    doc.text("WHAT'S INSIDE", M + 6, 160);

    doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(...C.sub);
    const inside = [
      "Country guide & local celiac awareness",
      "Emergency phrases in local language",
      "Hospital, ambulance & pharmacy numbers",
      "Saved restaurants, bars, pharmacies & shops",
      "Personal travel checklist",
      "Cross-contamination quick reference",
      "Translation cards & private notes",
    ];
    inside.forEach((t, i) => {
      doc.setFillColor(...C.primary);
      doc.circle(M + 9, 167 + i * 0,0).circle?.(0,0,0);
    });
    // Render bullets cleanly
    inside.forEach((t, i) => {
      const row = 168 + i * 4.6;
      doc.setFillColor(...C.green);
      doc.circle(M + 9, row - 1.3, 0.9, "F");
      doc.setTextColor(...C.sub);
      doc.text(t, M + 12, row);
    });

    // Generated stamp
    doc.setFont("helvetica","italic"); doc.setFontSize(8.5); doc.setTextColor(...C.muted);
    doc.text(`Generated ${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}  ·  glutengo.be`, PW / 2, PH - 18, { align: "center" });

    // ╔══════════════════════════════════════════════════════════════════════════╗
    // ║                            PAGE 2 — OVERVIEW                              ║
    // ╚══════════════════════════════════════════════════════════════════════════╝
    newPage();

    sectionTitle("Trip Overview", C.primary, "Your essentials at a glance");
    kv("Traveller",   user?.email || "—");
    kv("Destination", dest || "—");
    if (trip.destination_city) kv("City", trip.destination_city);
    if (trip.destination_country) kv("Country", trip.destination_country);
    if (startD) kv("Departure", startD);
    if (endD)   kv("Return", endD);
    if (nights !== null) kv("Duration", `${nights} night${nights === 1 ? "" : "s"}`);
    kv("Status", statusLabel);
    if (countryGuide?.capital) kv("Capital", countryGuide.capital);
    if (countryGuide?.certBody) kv("GF Certifier", countryGuide.certBody);

    y += 4;

    // Document summary panel
    guard(34);
    doc.setFillColor(...C.lightBg);
    doc.roundedRect(M, y, CW, 28, 3, 3, "F");
    doc.setDrawColor(...C.primary); doc.setLineWidth(0.3);
    doc.roundedRect(M, y, CW, 28, 3, 3, "S");
    const stats = [
      ["Saved venues", String(savedRest.length)],
      ["Checklist items", String(items.length)],
      ["Items completed", `${items.filter(i => i.is_completed).length} / ${items.length || 0}`],
      ["Translation cards", String(cards.length)],
    ];
    const sw = CW / stats.length;
    stats.forEach(([label, val], i) => {
      const cx = M + sw * i + sw / 2;
      doc.setFont("helvetica","bold"); doc.setFontSize(16); doc.setTextColor(...C.primary);
      doc.text(val, cx, y + 13, { align: "center" });
      doc.setFont("helvetica","normal"); doc.setFontSize(8); doc.setTextColor(...C.muted);
      doc.text(label.toUpperCase(), cx, y + 21, { align: "center" });
    });
    y += 34;

    // ── Country guide ──────────────────────────────────────────────────────────
    if (countryGuide) {
      sectionTitle(`Country Guide — ${countryGuide.name}`, C.primary, "Local rules, brands and what to watch for");

      // Intro paragraph
      doc.setFont("helvetica","normal"); doc.setFontSize(10); doc.setTextColor(...C.body);
      const introLines = doc.splitTextToSize(latinSafe(countryGuide.intro), CW);
      introLines.forEach((line: string) => { guard(6); doc.text(line, M, y); y += 5.2; });
      y += 4;

      // Safe / avoid two-column
      guard(60);
      const colWidth = (CW - 6) / 2;
      const startY = y;
      // SAFE
      doc.setFillColor(240, 253, 244);
      doc.roundedRect(M, startY, colWidth, 6, 1.5, 1.5, "F");
      doc.setFont("helvetica","bold"); doc.setFontSize(9.5); doc.setTextColor(...C.green);
      doc.text("✓  SAFE CHOICES", M + 3, startY + 4.3);
      let ly = startY + 10;
      doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(...C.body);
      countryGuide.safe.forEach(item => {
        const lines = doc.splitTextToSize(latinSafe(item), colWidth - 7);
        if (ly + lines.length * 4.5 > PH - 20) return;
        doc.setFillColor(...C.green);
        doc.circle(M + 3, ly - 1.3, 0.9, "F");
        doc.text(lines, M + 6, ly);
        ly += lines.length * 4.5 + 1;
      });
      // AVOID
      const xR = M + colWidth + 6;
      doc.setFillColor(254, 242, 242);
      doc.roundedRect(xR, startY, colWidth, 6, 1.5, 1.5, "F");
      doc.setFont("helvetica","bold"); doc.setFontSize(9.5); doc.setTextColor(...C.rose);
      doc.text("✗  AVOID OR VERIFY", xR + 3, startY + 4.3);
      let ry = startY + 10;
      doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(...C.body);
      countryGuide.avoid.forEach(item => {
        const lines = doc.splitTextToSize(latinSafe(item), colWidth - 7);
        if (ry + lines.length * 4.5 > PH - 20) return;
        doc.setFillColor(...C.rose);
        doc.circle(xR + 3, ry - 1.3, 0.9, "F");
        doc.text(lines, xR + 6, ry);
        ry += lines.length * 4.5 + 1;
      });
      y = Math.max(ly, ry) + 4;

      // Trusted brands
      if (countryGuide.brands?.length) {
        guard(20);
        doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(...C.primary);
        doc.text("Trusted GF brands locally", M, y); y += 5;
        doc.setFont("helvetica","normal"); doc.setFontSize(9.5); doc.setTextColor(...C.body);
        const blines = doc.splitTextToSize(latinSafe(countryGuide.brands.join("  ·  ")), CW);
        blines.forEach((l: string) => { guard(5); doc.text(l, M, y); y += 5; });
        y += 3;
      }

      // Local tips
      if (countryGuide.tips?.length) {
        guard(14);
        doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(...C.primary);
        doc.text("Local tips from celiacs on the ground", M, y); y += 6;
        countryGuide.tips.forEach(t => bullet(t, C.amber));
        y += 3;
      }
    }

    // ── Translation / restaurant card ──────────────────────────────────────────
    if (countryGuide?.emergencyPhrase) {
      newPage();
      sectionTitle("Show This Card at Restaurants", C.green, `In ${countryGuide.emergencyPhrase.lang} — for kitchen & waitstaff`);

      const text = countryGuide.emergencyPhrase.text;
      const cardH = 100;
      guard(cardH + 6);
      doc.setFillColor(...C.white);
      doc.roundedRect(M, y, CW, cardH, 4, 4, "F");
      doc.setDrawColor(...C.green); doc.setLineWidth(0.8);
      doc.roundedRect(M, y, CW, cardH, 4, 4, "S");
      // header band
      doc.setFillColor(...C.green);
      doc.roundedRect(M, y, CW, 14, 4, 4, "F");
      doc.rect(M, y + 6, CW, 8, "F");
      doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(...C.white);
      doc.text(`${countryGuide.flag}  ${countryGuide.emergencyPhrase.lang.toUpperCase()}  ·  CELIAC DISEASE`, M + 4, y + 9.5);

      // body — Latin-safe; if original has non-latin, render placeholder + note
      const safe = latinSafe(text);
      doc.setFont("helvetica","normal"); doc.setFontSize(13); doc.setTextColor(...C.body);
      if (safe.length < 10 && hasNonLatin(text)) {
        const note = "This language uses a non-Latin script. Open this card in the GlutenGo app on your phone and show it to the waiter, or use the dedicated Translation Cards in this pack.";
        const lines = doc.splitTextToSize(note, CW - 14);
        doc.text(lines, M + 7, y + 26);
      } else {
        const lines = doc.splitTextToSize(safe, CW - 14);
        doc.text(lines, M + 7, y + 26);
      }

      // footer band
      doc.setFont("helvetica","italic"); doc.setFontSize(8.5); doc.setTextColor(...C.muted);
      doc.text("Please prepare separately with clean utensils — even tiny traces of gluten make me seriously ill.", M + 7, y + cardH - 6, { maxWidth: CW - 14 });
      y += cardH + 8;
    }

    // ── Emergency information ──────────────────────────────────────────────────
    if (emergencyCountry || trip.destination_country) {
      sectionTitle("Emergency Numbers", C.rose, "Save these to your phone before you arrive");
      const numbers: { region: string; emergency: string; ambulance: string }[] = [];
      if (emergencyCountry) {
        numbers.push({ region: emergencyCountry.name, emergency: emergencyCountry.emergencyNumber, ambulance: emergencyCountry.ambulance });
      }
      // Always include EU general / 112 fallback
      EMERGENCY_NUMBERS.forEach(n => {
        if (!numbers.find(x => x.region === n.region)) numbers.push(n);
      });

      // Table
      guard(12 + numbers.length * 8);
      doc.setFillColor(...C.roseBg);
      doc.roundedRect(M, y, CW, 10, 1.5, 1.5, "F");
      doc.setFont("helvetica","bold"); doc.setFontSize(9); doc.setTextColor(...C.rose);
      doc.text("REGION", M + 4, y + 6.5);
      doc.text("EMERGENCY", M + 80, y + 6.5);
      doc.text("AMBULANCE", M + 130, y + 6.5);
      y += 12;
      doc.setFont("helvetica","normal"); doc.setFontSize(10); doc.setTextColor(...C.body);
      numbers.forEach((n, i) => {
        if (i % 2) {
          doc.setFillColor(252, 252, 252);
          doc.rect(M, y - 5, CW, 7.5, "F");
        }
        doc.setFont("helvetica","normal"); doc.setTextColor(...C.body);
        doc.text(latinSafe(n.region), M + 4, y);
        doc.setFont("helvetica","bold"); doc.setTextColor(...C.rose);
        doc.text(n.emergency, M + 80, y);
        doc.text(n.ambulance, M + 130, y);
        y += 7.5;
      });
      y += 4;
    }

    // ── Emergency phrases (if available) ───────────────────────────────────────
    if (emergencyCountry) {
      sectionTitle(`Emergency Phrases — ${emergencyCountry.language}`, C.rose, "For doctors, pharmacists or first responders");
      emergencyCountry.phrases.forEach(p => {
        guard(p.phonetic ? 22 : 16);
        doc.setFillColor(255, 251, 251);
        doc.roundedRect(M, y - 2, CW, p.phonetic ? 20 : 14, 2, 2, "F");
        doc.setDrawColor(...C.roseBdr); doc.setLineWidth(0.2);
        doc.roundedRect(M, y - 2, CW, p.phonetic ? 20 : 14, 2, 2, "S");
        doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(...C.rose);
        doc.text(latinSafe(p.category.replace(/[^\x00-\xFF]/g, "").trim() || "Phrase").toUpperCase(), M + 3, y + 2.5);
        doc.setFont("helvetica","italic"); doc.setFontSize(9.5); doc.setTextColor(...C.muted);
        doc.text(latinSafe(p.english), M + 3, y + 7.5, { maxWidth: CW - 6 });
        doc.setFont("helvetica","bold"); doc.setFontSize(10); doc.setTextColor(...C.body);
        const tx = latinSafe(p.translation) || `[${emergencyCountry.language} script — show in app]`;
        doc.text(tx, M + 3, y + 12.5, { maxWidth: CW - 6 });
        if (p.phonetic) {
          doc.setFont("helvetica","normal"); doc.setFontSize(8.5); doc.setTextColor(...C.muted);
          doc.text(`Pronunciation: ${latinSafe(p.phonetic)}`, M + 3, y + 17, { maxWidth: CW - 6 });
        }
        y += (p.phonetic ? 22 : 16);
      });
      y += 2;
    }

    // ── Saved venues ───────────────────────────────────────────────────────────
    const restaurants = savedRest.filter(s => slugVenueType(s.restaurant_id) === "restaurant");
    const bars        = savedRest.filter(s => slugVenueType(s.restaurant_id) === "bar");
    const pharmacies  = savedRest.filter(s => slugVenueType(s.restaurant_id) === "pharmacy");
    const shops       = savedRest.filter(s => slugVenueType(s.restaurant_id) === "shop");

    const venueGroup = (list: typeof savedRest, title: string, sub: string, col: [number,number,number]) => {
      if (!list.length) return;
      sectionTitle(title, col, sub);
      list.forEach((s, i) => {
        const info = decodeAISlug(s.restaurant_id);
        if (!info) return;
        venueRow(i + 1, info.name, [info.city, info.country].filter(Boolean).join(", "), col);
      });
      y += 4;
    };

    if (savedRest.length) newPage();
    venueGroup(restaurants, "Restaurants",  `${restaurants.length} saved · verify each before visiting`, C.green);
    venueGroup(bars,        "Bars & Cafés", `${bars.length} saved`, C.amber);
    venueGroup(pharmacies,  "Pharmacies",   `${pharmacies.length} saved · GF products available`, C.blue);
    venueGroup(shops,       "Shops & Supermarkets", `${shops.length} saved · stock up on staples`, C.teal);

    // ── Translation cards (user) ───────────────────────────────────────────────
    if (cards.length) {
      sectionTitle("Your Translation Cards", C.primary, "Saved from the in-app generator");
      cards.slice(0, 5).forEach((c) => {
        const safe = latinSafe(c.body || "");
        const lines = doc.splitTextToSize(safe || "[Non-Latin script — show in app]", CW - 10);
        const h = 10 + lines.length * 5;
        guard(h + 4);
        doc.setFillColor(...C.lightBg);
        doc.roundedRect(M, y, CW, h, 2, 2, "F");
        doc.setDrawColor(...C.grayLn); doc.setLineWidth(0.2);
        doc.roundedRect(M, y, CW, h, 2, 2, "S");
        doc.setFont("helvetica","bold"); doc.setFontSize(8.5); doc.setTextColor(...C.primary);
        doc.text((c.language_label || c.language || "").toUpperCase(), M + 4, y + 5);
        doc.setFont("helvetica","normal"); doc.setFontSize(9.5); doc.setTextColor(...C.body);
        doc.text(lines, M + 4, y + 10);
        y += h + 3;
      });
    }

    // ── Travel checklist ───────────────────────────────────────────────────────
    if (items.length) {
      newPage();
      const done = items.filter(i => i.is_completed).length;
      const pct = items.length ? Math.round((done / items.length) * 100) : 0;
      sectionTitle("Travel Checklist", C.primary, `${done} of ${items.length} packed · ${pct}% complete`);

      // progress bar
      doc.setFillColor(235, 240, 235);
      doc.roundedRect(M, y, CW, 4, 2, 2, "F");
      if (pct > 0) {
        doc.setFillColor(...C.green);
        doc.roundedRect(M, y, (CW * pct) / 100, 4, 2, 2, "F");
      }
      y += 9;

      items.forEach(item => {
        guard(8);
        if (item.is_completed) {
          doc.setFillColor(...C.green);
          doc.roundedRect(M, y - 3.5, 4.8, 4.8, 1, 1, "F");
          doc.setDrawColor(...C.white); doc.setLineWidth(0.6);
          doc.line(M + 1.3, y - 1, M + 2.2, y + 0);
          doc.line(M + 2.2, y + 0, M + 3.7, y - 2.5);
        } else {
          doc.setDrawColor(...C.grayLn); doc.setLineWidth(0.4);
          doc.roundedRect(M, y - 3.5, 4.8, 4.8, 1, 1, "S");
        }
        doc.setFont("helvetica","normal"); doc.setFontSize(10);
        const c = item.is_completed ? 140 : 30;
        doc.setTextColor(c, c, c);
        doc.text(latinSafe(item.label), M + 8, y, { maxWidth: CW - 12 });
        y += 7;
      });
      y += 4;
    }

    // ── Cross-contamination quick reference ────────────────────────────────────
    newPage();
    sectionTitle("Cross-Contamination Quick Reference", C.amber, "Hidden sources of gluten — show waiters if unsure");
    const ccItems = [
      { t: "Shared fryers", d: "Fries, tempura and donuts cooked with breaded items pick up gluten." },
      { t: "Wooden utensils & boards", d: "They absorb flour. Ask for clean stainless steel tools." },
      { t: "Pasta water", d: "Re-used water from wheat pasta contaminates GF pasta." },
      { t: "Bread baskets on table", d: "Crumbs travel — ask staff to remove them." },
      { t: "Toasters", d: "Always cross-contaminated. Request a clean pan or grill." },
      { t: "Soy sauce", d: "Most contain wheat. Ask for tamari (GF soy sauce)." },
      { t: "Sauces & gravies", d: "Often thickened with flour or contain soy sauce/malt." },
      { t: "Oats", d: "Cross-contaminated unless explicitly labelled GF (certified)." },
      { t: "Beer & malt drinks", d: "Barley- or wheat-based. Choose certified GF beer, cider or spirits." },
      { t: "Communion wafers, meds, lipstick", d: "All can contain hidden gluten — check labels." },
    ];
    ccItems.forEach(it => {
      guard(11);
      doc.setFillColor(...C.amberBg);
      doc.roundedRect(M, y - 2, CW, 9, 1.5, 1.5, "F");
      doc.setFont("helvetica","bold"); doc.setFontSize(9.5); doc.setTextColor(...C.amber);
      doc.text(latinSafe(it.t), M + 3, y + 1.5);
      doc.setFont("helvetica","normal"); doc.setFontSize(9); doc.setTextColor(...C.body);
      doc.text(latinSafe(it.d), M + 3, y + 5.5, { maxWidth: CW - 6 });
      y += 11;
    });
    y += 4;

    // ── Pre-departure essentials ───────────────────────────────────────────────
    sectionTitle("Pre-Departure Essentials", C.blue, "What every celiac should pack and arrange");
    const essentials = [
      "Medical letter from your GP confirming celiac disease (in English).",
      "Translation cards in destination language + English backup.",
      "GF snacks for travel days: certified bars, crackers, nuts.",
      "Emergency GF meal: instant pasta, cup-noodles, or oat-free porridge.",
      "Travel insurance that explicitly covers chronic conditions.",
      "Pharmacy list near accommodation for digestive aids.",
      "Charged phone with the GlutenGo app offline + downloaded country guide.",
      "Reusable cutlery + a small cutting mat for picnics if you're prone to reactions.",
      "Anti-cramp / anti-nausea meds you usually use after a glutening.",
      "Backup payment card in case you need a last-minute hotel meal.",
    ];
    essentials.forEach(e => bullet(e, C.blue));

    // ── Safety reminder ────────────────────────────────────────────────────────
    y += 4;
    guard(36);
    doc.setFillColor(...C.amberBg); doc.roundedRect(M, y, CW, 32, 3, 3, "F");
    doc.setDrawColor(...C.amberBdr); doc.setLineWidth(0.5); doc.roundedRect(M, y, CW, 32, 3, 3, "S");
    doc.setFont("helvetica","bold"); doc.setFontSize(11); doc.setTextColor(146, 64, 14);
    doc.text("Important safety reminder", M + 6, y + 8);
    doc.setFont("helvetica","normal"); doc.setFontSize(9.2); doc.setTextColor(...C.body);
    doc.text("This pack is a planning tool — not medical advice. Always confirm gluten-free preparation with kitchen staff", M + 6, y + 15, { maxWidth: CW - 10 });
    doc.text("on arrival, show your translation card, and verify allergen menus. AI research helps shortlist venues, but it", M + 6, y + 20, { maxWidth: CW - 10 });
    doc.text("does not replace direct confirmation. In an emergency, call the numbers listed and seek medical help immediately.", M + 6, y + 25, { maxWidth: CW - 10 });

    // ── Notes ──────────────────────────────────────────────────────────────────
    if (notes?.trim()) {
      newPage();
      sectionTitle("Personal Notes", C.primary, "Reminders, bookings, recommendations");
      doc.setFont("helvetica","normal"); doc.setFontSize(10.5); doc.setTextColor(...C.body);
      const lines = doc.splitTextToSize(latinSafe(notes.trim()), CW);
      lines.forEach((line: string) => { guard(6); doc.text(line, M, y); y += 5.6; });
    }

    footer();

    // Re-run footer on every page (cover excluded)
    const pageCount = (doc.internal as any).getNumberOfPages();
    for (let p = 2; p <= pageCount; p++) {
      doc.setPage(p);
      // Already drawn by newPage(); ensure last page has it too — guard above ensures
    }

    const fname = `glutengo-${latinSafe(tripTitle).toLowerCase().replace(/[^a-z0-9]+/g, "-")}-travel-pack.pdf`;
    doc.save(fname);
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
