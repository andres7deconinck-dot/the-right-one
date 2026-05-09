import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { COUNTRIES } from "@/data/countries";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

export const Route = createFileRoute("/_app/trips/new")({
  head: () => ({ meta: [{ title: "New trip — GlutenGo" }] }),
  component: NewTrip,
});

function NewTrip() {
  const { user } = useAuth();
  const nav = useNavigate();
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [start, setStart] = useState<Date>();
  const [end, setEnd] = useState<Date>();
  const [saving, setSaving] = useState(false);
  const [errorText, setErrorText] = useState<string>("");

  const submit = async () => {
    if (!user || !country) { toast.error("Pick a country"); setErrorText("Please pick a destination country."); return; }
    setErrorText("");
    setSaving(true);
    const { data, error } = await supabase.from("trips").insert({
      user_id: user.id,
      title: title || null,
      destination: country,
      destination_country: country,
      destination_city: city || null,
      start_date: start ? start.toISOString().slice(0, 10) : null,
      end_date: end ? end.toISOString().slice(0, 10) : null,
      notes: notes || null,
      status: "planning",
    }).select("id").single();
    setSaving(false);
    if (error) { toast.error(error.message); setErrorText(error.message); return; }
    toast.success("Trip created");
    nav({ to: "/trips/$id", params: { id: data.id } });
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-10">
      <Link to="/trips" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to trips
      </Link>
      <h1 className="mt-4 font-display text-4xl">Plan a new trip</h1>
      <div className="mt-8 space-y-5 rounded-3xl border border-border bg-card-soft p-6">
        {errorText && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700" role="alert" aria-live="polite">
            {errorText}
            <Button variant="outline" size="sm" className="ml-3" onClick={submit}>Retry</Button>
          </div>
        )}
        <div>
          <Label>Destination country *</Label>
          <Select value={country} onValueChange={setCountry}>
            <SelectTrigger className="mt-1.5"><SelectValue placeholder="Choose a country" /></SelectTrigger>
            <SelectContent>{COUNTRIES.map((c) => <SelectItem key={c.slug} value={c.name}>{c.flag} {c.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <Label>City</Label>
          <Input value={city} onChange={(e) => setCity(e.target.value)} placeholder="e.g. Tokyo" className="mt-1.5" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { label: "Departure date", value: start, set: setStart },
            { label: "Return date", value: end, set: setEnd },
          ].map((d) => (
            <div key={d.label}>
              <Label>{d.label}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("mt-1.5 w-full justify-start text-left font-normal", !d.value && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {d.value ? format(d.value, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={d.value} onSelect={(x) => d.set(x as Date)} initialFocus className={cn("p-3 pointer-events-auto")} />
                </PopoverContent>
              </Popover>
            </div>
          ))}
        </div>
        <div>
          <Label>Trip name (optional)</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Tokyo April 2026" className="mt-1.5" />
        </div>
        <div>
          <Label>Notes (optional)</Label>
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="mt-1.5" />
        </div>
        <Button onClick={submit} disabled={saving} className="w-full">{saving ? "Creating..." : "Create trip"}</Button>
      </div>
    </div>
  );
}
