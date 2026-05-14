import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Copy, Maximize2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { EMERGENCY_COUNTRIES, EMERGENCY_NUMBERS, type EmergencyCountry, type Phrase } from "@/data/emergencyPhrases";
import { toast } from "sonner";

export const Route = createFileRoute("/emergency")({
  head: () => ({
    meta: [
      { title: "Celiac Emergency Phrases in 30+ Languages — GlutenGo" },
      { name: "description", content: "Gluten-free emergency phrases for celiac travelers in Japanese, Thai, Italian, Spanish, French and 25+ more languages. Works offline. Show to waiters instantly." },
      { name: "keywords", content: "celiac emergency phrase, gluten-free phrase foreign language, I have celiac disease translation, coeliac phrase Japanese, gluten-free waiter card" },
      { property: "og:title", content: "Celiac Emergency Phrases in 30+ Languages" },
      { property: "og:description", content: "Show your waiter exactly what you cannot eat — in their language. Works offline. 30+ languages covered." },
      { property: "og:url", content: "https://glutengo.app/emergency" },
    ],
  }),
  component: EmergencyPage,
});

function EmergencyPage() {
  const [country, setCountry] = useState<EmergencyCountry | null>(null);
  const [fullscreen, setFullscreen] = useState<Phrase | null>(null);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <div className="mx-auto max-w-5xl px-5 py-10">
          <h1 className="font-display text-4xl">Emergency Phrases</h1>
          <p className="mt-2 text-muted-foreground">The phrases you need when things go wrong. Tap to copy or show.</p>

          {!country ? (
            <div className="mt-8">
              <h2 className="font-display text-xl">Choose a country</h2>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {EMERGENCY_COUNTRIES.map((c) => (
                  <button key={c.code} onClick={() => setCountry(c)} className="rounded-2xl border border-border bg-card p-5 text-center shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow">
                    <div className="text-4xl">{c.flag}</div>
                    <div className="mt-2 font-display">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.language}</div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-8">
              <button onClick={() => setCountry(null)} className="text-sm text-muted-foreground hover:text-foreground">← Choose another country</button>
              <h2 className="mt-3 font-display text-2xl">{country.flag} {country.name}</h2>

              {country.scriptNote && (
                <div className="mt-4 flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <span className="text-lg leading-none mt-0.5">💡</span>
                  <p className="text-sm text-amber-900 leading-relaxed">{country.scriptNote}</p>
                </div>
              )}

              <div className="mt-5 space-y-3">
                {country.phrases.map((p, i) => (
                  <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                    <p className="text-xs font-semibold uppercase tracking-wider text-primary">{p.category}</p>
                    <p className="mt-2 text-sm font-medium text-foreground">🇧🇪 {p.dutch}</p>
                    <p className="mt-1 text-xs text-muted-foreground italic">🇬🇧 {p.english}</p>
                    <p className="mt-3 font-display text-xl leading-relaxed" lang={country.code}>{p.translation}</p>
                    {p.phonetic && (
                      <div className="mt-2 flex items-baseline gap-2">
                        <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">Say it:</span>
                        <p className="text-sm italic text-muted-foreground">{p.phonetic}</p>
                      </div>
                    )}
                    <div className="mt-3 flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => copy(p.translation)}><Copy className="mr-1.5 h-3.5 w-3.5" /> Copy</Button>
                      <Button variant="outline" size="sm" onClick={() => setFullscreen(p)}><Maximize2 className="mr-1.5 h-3.5 w-3.5" /> Show fullscreen</Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 rounded-3xl border border-border bg-card p-6">
            <h2 className="font-display text-xl">In emergency, call:</h2>
            <table className="mt-4 w-full text-sm">
              <thead><tr className="text-left text-muted-foreground"><th className="py-2">Country</th><th>Emergency</th><th>Ambulance</th></tr></thead>
              <tbody>
                {EMERGENCY_NUMBERS.map((n) => (
                  <tr key={n.region} className="border-t border-border"><td className="py-2 font-medium">{n.region}</td><td>{n.emergency}</td><td>{n.ambulance}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
      <SiteFooter />

      {fullscreen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-white p-6 md:p-12" onClick={() => setFullscreen(null)}>
          <button className="ml-auto" aria-label="Close"><X className="h-6 w-6" /></button>
          <div className="my-auto mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive">{fullscreen.category}</div>
            <p className="text-base text-muted-foreground mb-4">{fullscreen.dutch}</p>
            <p className="font-display text-3xl leading-relaxed text-foreground md:text-5xl">{fullscreen.translation}</p>
            {fullscreen.phonetic && (
              <div className="mt-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/50 mb-1">Pronunciation</p>
                <p className="text-xl italic text-muted-foreground">{fullscreen.phonetic}</p>
              </div>
            )}
            <p className="mt-10 text-sm text-muted-foreground">Tap anywhere to close</p>
          </div>
        </div>
      )}
    </div>
  );
}
