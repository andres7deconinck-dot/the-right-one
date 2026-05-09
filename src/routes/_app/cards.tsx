import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, Maximize2, Sparkles, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_app/cards")({
  head: () => ({ meta: [{ title: "Translation Cards — GlutenGo" }] }),
  component: CardsPage,
});

const LANGS = [
  { code: "en", label: "English" }, { code: "fr", label: "French" },
  { code: "es", label: "Spanish" }, { code: "it", label: "Italian" },
  { code: "de", label: "German" }, { code: "ja", label: "Japanese" },
  { code: "th", label: "Thai" },
];

function CardsPage() {
  const { user } = useAuth();
  const [language, setLanguage] = useState("it");
  const [severity, setSeverity] = useState("celiac");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [cards, setCards] = useState<any[]>([]);
  const [fullscreen, setFullscreen] = useState<any | null>(null);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("translation_cards").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    setCards(data || []);
  };
  useEffect(() => { load(); }, [user]);

  const generate = async () => {
    setLoading(true);
    try {
      const sel = LANGS.find((l) => l.code === language)!;
      const { data, error } = await supabase.functions.invoke("generate-card", {
        body: { language, languageLabel: sel.label, severity, context },
      });
      if (error) {
        const msg = (error as any)?.context?.body ? "" : error.message;
        throw new Error(msg || "Could not generate card");
      }
      if (data?.error) throw new Error(data.message || data.error);
      toast.success("Card generated");
      setContext("");
      load();
    } catch (e: any) {
      toast.error(e.message || "Generation failed");
    } finally { setLoading(false); }
  };

  const remove = async (id: string) => {
    await supabase.from("translation_cards").delete().eq("id", id);
    load();
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="max-w-2xl">
        <h1 className="font-display text-4xl">Translation Cards</h1>
        <p className="mt-2 text-muted-foreground">Generate medical-grade gluten allergy cards in 7 languages. Tap any card for fullscreen restaurant mode.</p>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div className="rounded-3xl border border-border bg-card-soft p-6 shadow-soft">
          <h2 className="font-display text-xl">Create a new card</h2>
          <div className="mt-5 space-y-4">
            <div>
              <Label>Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{LANGS.map((l) => <SelectItem key={l.code} value={l.code}>{l.label}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Severity</Label>
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="celiac">Celiac disease (strict)</SelectItem>
                  <SelectItem value="intolerant">Severe intolerance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Extra context (optional)</Label>
              <Textarea value={context} onChange={(e) => setContext(e.target.value)} placeholder="e.g. also dairy-free, dining at sushi restaurant..." rows={3} className="mt-1.5" />
            </div>
            <Button onClick={generate} disabled={loading} className="w-full">
              {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating</> : <><Sparkles className="mr-2 h-4 w-4" /> Generate card</>}
            </Button>
          </div>
        </div>

        <div>
          {cards.length === 0 ? (
            <div className="grid h-full place-items-center rounded-3xl border border-dashed border-border bg-cream/40 p-12 text-center text-muted-foreground">
              Your cards appear here. Generate your first one →
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {cards.map((c) => (
                <article key={c.id} className="group relative rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:shadow-glow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-primary">{c.language_label}</p>
                      <h3 className="mt-1 font-display text-lg">{c.title}</h3>
                    </div>
                    <button onClick={() => remove(c.id)} className="opacity-0 transition group-hover:opacity-100" aria-label="Delete">
                      <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                    </button>
                  </div>
                  <p className="mt-4 text-pretty text-foreground/90" lang={c.language}>{c.body}</p>
                  <Button variant="outline" size="sm" className="mt-5 rounded-full" onClick={() => setFullscreen(c)}>
                    <Maximize2 className="mr-1.5 h-3.5 w-3.5" /> Show to restaurant
                  </Button>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      {fullscreen && (
        <div role="dialog" aria-modal="true" aria-label="Fullscreen translation card" className="fixed inset-0 z-50 flex flex-col bg-background p-6 md:p-12" onClick={() => setFullscreen(null)}>
          <button className="ml-auto" onClick={() => setFullscreen(null)} aria-label="Close fullscreen card"><X className="h-6 w-6" /></button>
          <div className="my-auto mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive">
              ⚠ {fullscreen.title}
            </div>
            <p className="font-display text-3xl leading-relaxed text-foreground md:text-5xl" lang={fullscreen.language}>{fullscreen.body}</p>
            <p className="mt-8 text-sm text-muted-foreground">Tap anywhere to close · {fullscreen.language_label}</p>
          </div>
        </div>
      )}
    </div>
  );
}
