import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COUNTRIES } from "@/data/countries";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/useRequireAuth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/trips/new")({
  head: () => ({ meta: [{ title: "New trip — GlutenGo" }] }),
  component: NewTrip,
});

function NewTrip() {
  const { user, loading } = useRequireAuth();
  const nav = useNavigate();
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorText, setErrorText] = useState("");

  if (loading || !user) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-10">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
        <div className="mt-8 h-96 animate-pulse rounded-3xl bg-muted" />
      </div>
    );
  }

  const submit = async () => {
    if (!country.trim()) {
      toast.error("Vul een bestemming in");
      setErrorText("Vul een bestemmingsland in.");
      return;
    }
    setErrorText("");
    setSaving(true);
    try {
      const { data, error } = await supabase
        .from("trips")
        .insert({
          user_id: user!.id,
          title: title.trim() || null,
          destination: country.trim(),
          destination_country: country.trim(),
          destination_city: city.trim() || null,
          start_date: start || null,
          end_date: end || null,
          notes: notes.trim() || null,
          status: "planning",
        })
        .select("id")
        .single();

      if (error) {
        toast.error(error.message);
        setErrorText(error.message);
        return;
      }
      toast.success("Reis aangemaakt!");
      nav({ to: "/trips/$id", params: { id: data.id } });
    } catch (e: any) {
      toast.error(e.message || "Er ging iets mis");
      setErrorText(e.message || "Er ging iets mis");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <Link
        to="/trips"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Terug naar reizen
      </Link>
      <h1 className="mt-4 font-display text-4xl">Plan een nieuwe reis</h1>

      <div className="mt-8 space-y-5 rounded-3xl border border-border bg-card-soft p-6">
        {errorText && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700" role="alert">
            {errorText}
          </div>
        )}

        <div>
          <Label htmlFor="country">Bestemmingsland *</Label>
          <Input
            id="country"
            list="countries-list"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="bv. Italië, Japan, Thailand…"
            className="mt-1.5"
            autoComplete="off"
          />
          <datalist id="countries-list">
            {COUNTRIES.map((c) => (
              <option key={c.slug} value={c.name} />
            ))}
          </datalist>
        </div>

        <div>
          <Label htmlFor="city">Stad</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="bv. Tokio"
            className="mt-1.5"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="start">Vertrekdatum</Label>
            <Input
              id="start"
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="end">Terugkeerdatum</Label>
            <Input
              id="end"
              type="date"
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className="mt-1.5"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="trip-name">Naam van de reis (optioneel)</Label>
          <Input
            id="trip-name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="bv. Japan april 2026"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="notes">Notities (optioneel)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Dieetwensen, hotel, must-see plekken…"
            className="mt-1.5"
          />
        </div>

        <Button onClick={submit} disabled={saving} className="w-full" size="lg">
          {saving ? "Reis aanmaken…" : "Reis aanmaken"}
        </Button>
      </div>
    </div>
  );
}
