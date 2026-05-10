import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { COUNTRIES } from "@/data/countries";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/trips/new")({
  head: () => ({ meta: [{ title: "New trip — GlutenGo" }] }),
  component: NewTrip,
});

function NewTrip() {
  const { user, loading: authLoading } = useAuth();
  const nav = useNavigate();
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [saving, setSaving] = useState(false);
  const [errorText, setErrorText] = useState("");

  const submit = async () => {
    if (!user) {
      toast.error("Sign in to save trips");
      setErrorText("You need to be signed in to save a trip.");
      return;
    }
    if (!country.trim()) {
      toast.error("Pick a destination");
      setErrorText("Please enter a destination country.");
      return;
    }
    setErrorText("");
    setSaving(true);
    const { data, error } = await supabase.from("trips").insert({
      user_id: user.id,
      title: title.trim() || null,
      destination: country.trim(),
      destination_country: country.trim(),
      destination_city: city.trim() || null,
      start_date: start || null,
      end_date: end || null,
      notes: notes.trim() || null,
      status: "planning",
    }).select("id").single();
    setSaving(false);
    if (error) {
      toast.error(error.message);
      setErrorText(error.message);
      return;
    }
    toast.success("Trip created!");
    nav({ to: "/trips/$id", params: { id: data.id } });
  };

  if (authLoading) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-10">
        <div className="h-8 w-32 animate-pulse rounded-lg bg-muted" />
        <div className="mt-8 h-64 animate-pulse rounded-3xl bg-muted" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <Link to="/trips" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to trips
      </Link>
      <h1 className="mt-4 font-display text-4xl">Plan a new trip</h1>

      {!user && (
        <div className="mt-4 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
          <Info className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <p className="font-semibold">Sign in to save trips</p>
            <p className="mt-0.5 opacity-80">Fill out the form below, then sign in to save your trip.</p>
            <Link to="/auth" search={{ redirect: "/trips/new" } as any} className="mt-2 inline-block font-semibold underline">
              Create free account →
            </Link>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-5 rounded-3xl border border-border bg-card-soft p-6">
        {errorText && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700" role="alert">
            {errorText}
          </div>
        )}

        <div>
          <Label htmlFor="country">Destination country *</Label>
          <Input
            id="country"
            list="countries-list"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="e.g. Italy, Japan, Thailand…"
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
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g. Tokyo"
            className="mt-1.5"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label htmlFor="start">Departure date</Label>
            <Input
              id="start"
              type="date"
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className="mt-1.5"
            />
          </div>
          <div>
            <Label htmlFor="end">Return date</Label>
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
          <Label htmlFor="trip-name">Trip name (optional)</Label>
          <Input
            id="trip-name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Tokyo April 2026"
            className="mt-1.5"
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Dietary notes, hotel, must-see spots…"
            className="mt-1.5"
          />
        </div>

        <Button onClick={submit} disabled={saving} className="w-full">
          {saving ? "Creating trip…" : "Create trip"}
        </Button>
      </div>
    </div>
  );
}
