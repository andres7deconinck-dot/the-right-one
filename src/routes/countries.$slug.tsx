import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, ChevronLeft, ExternalLink, Lightbulb, MapPin, Search, ShieldCheck, ShoppingBag, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { COUNTRIES } from "@/data/countries";

export const Route = createFileRoute("/countries/$slug")({
  loader: ({ params }) => {
    const country = COUNTRIES.find((c) => c.slug === params.slug);
    if (!country) throw notFound();
    return country;
  },
  head: ({ loaderData: c }) => ({
    meta: [
      { title: `${c?.name ?? "Country"} Gluten-Free Travel Guide — Safe Foods, Brands & Phrases` },
      { name: "description", content: `Celiac travel guide for ${c?.name}: safe dishes, foods to avoid, trusted GF supermarket brands and an emergency phrase in ${c?.emergencyPhrase?.lang ?? "local language"}. ${c?.certBody ? `Certified by ${c.certBody}.` : ""}` },
      { name: "keywords", content: `gluten-free ${c?.name}, celiac travel ${c?.name}, coeliac ${c?.name}, gluten-free food ${c?.name}, ${c?.name} celiac guide, gluten-free restaurants ${c?.capital}` },
      { property: "og:title", content: `${c?.name} Gluten-Free Guide — Celiac Travel Tips` },
      { property: "og:description", content: `Safe foods, brands and emergency phrases for celiac travelers in ${c?.name}. ${c?.certBody ? `Certified by ${c.certBody}.` : ""}` },
      { property: "og:url", content: `https://glutengo.app/countries/${c?.slug}` },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${c?.name} Gluten-Free Travel Guide` },
      { name: "twitter:description", content: `Safe foods, brands and emergency phrases for celiacs in ${c?.name}.` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": `${c?.name} Gluten-Free Travel Guide`,
          "description": c?.intro,
          "url": `https://glutengo.app/countries/${c?.slug}`,
          "publisher": { "@type": "Organization", "name": "GlutenGo", "url": "https://glutengo.app" },
          "about": { "@type": "Country", "name": c?.name },
        }),
      },
    ],
  }),
  notFoundComponent: () => <div className="p-10 text-center">Country not found.</div>,
  errorComponent: ({ error }) => <div className="p-10 text-center text-destructive">{error.message}</div>,
  component: CountryDetail,
});

const AWARENESS_META = {
  high:   { label: "High celiac awareness", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  medium: { label: "Medium celiac awareness", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-400" },
  low:    { label: "Low celiac awareness", badge: "bg-rose-100 text-rose-700", dot: "bg-rose-500" },
};

function CountryDetail() {
  const c = Route.useLoaderData() as (typeof COUNTRIES)[number];
  const awareness = AWARENESS_META[c.awareness];

  return (
    <div>
      {/* Hero */}
      <div className={`bg-gradient-to-br ${c.hero}`}>
        <div className="mx-auto max-w-5xl px-5 py-16">
          <Link to="/countries" className="inline-flex items-center text-sm text-foreground/70 hover:text-foreground">
            <ChevronLeft className="mr-1 h-4 w-4" /> All guides
          </Link>
          <div className="mt-6 flex flex-wrap items-start gap-6">
            <span className="text-7xl md:text-8xl">{c.flag}</span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="font-display text-5xl md:text-6xl">{c.name}</h1>
                <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${awareness.badge}`}>
                  <span className={`h-2 w-2 rounded-full ${awareness.dot}`} />
                  {awareness.label}
                </span>
              </div>
              {c.certBody && (
                <p className="mt-2 flex items-center gap-1.5 text-sm text-foreground/70">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Certified by: <span className="font-medium text-foreground">{c.certBody}</span>
                </p>
              )}
              <p className="mt-3 max-w-xl text-foreground/80">{c.intro}</p>
            </div>
          </div>

          {/* Quick action CTAs */}
          <div className="mt-6 flex flex-wrap gap-3">
            <Link to="/restaurants">
              <Button className="gap-2">
                <Search className="h-4 w-4" /> Find GF spots in {c.capital}
              </Button>
            </Link>
            <Link to="/cards">
              <Button variant="outline" className="gap-2 bg-white/60 hover:bg-white/80">
                <Sparkles className="h-4 w-4" /> Generate translation card
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="mx-auto grid max-w-5xl gap-6 px-5 py-12 md:grid-cols-2">
        <Section icon={Check} title="Generally safer choices" accent="emerald">
          <ul className="space-y-2">
            {c.safe.map((s) => (
              <li key={s} className="flex gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {s}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={X} title="Avoid or verify carefully" accent="rose">
          <ul className="space-y-2">
            {c.avoid.map((s) => (
              <li key={s} className="flex gap-2 text-sm">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" /> {s}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={ShoppingBag} title="Trusted GF brands in stores" accent="primary">
          <ul className="grid grid-cols-2 gap-2">
            {c.brands.map((b) => (
              <li key={b} className="rounded-xl bg-muted px-3 py-2 text-sm font-medium">{b}</li>
            ))}
          </ul>
        </Section>

        <Section icon={Lightbulb} title="Celiac travel tips" accent="amber">
          <ul className="space-y-3">
            {c.tips.map((s) => (
              <li key={s} className="flex gap-2 text-sm">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" /> {s}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Emergency phrase */}
      <div className="mx-auto max-w-5xl px-5 pb-6">
        <div className="rounded-3xl border-2 border-rose-200 bg-rose-50 p-6">
          <div className="flex items-center gap-2 text-rose-700">
            <span className="text-xl">⚠️</span>
            <h3 className="font-display text-lg">Emergency phrase — {c.emergencyPhrase.lang}</h3>
          </div>
          <p className="mt-3 text-pretty text-xl leading-relaxed text-foreground">{c.emergencyPhrase.text}</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Show this to the waiter or chef. Generate a full translation card for fullscreen restaurant mode.
          </p>
          <Link to="/cards" className="mt-3 inline-block">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Generate a full card
            </Button>
          </Link>
        </div>
      </div>

      {/* Restaurant finder CTA */}
      <div className="mx-auto max-w-5xl px-5 pb-16">
        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-display text-xl">Find gluten-free venues in {c.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                AI-researched restaurants, coffee bars, supermarkets and pharmacies in {c.capital} and beyond.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Link to="/restaurants">
                <Button className="gap-2">
                  <MapPin className="h-4 w-4" /> Search in {c.capital}
                </Button>
              </Link>
              {(() => {
                const nearby = COUNTRIES.filter(
                  (x) => x.slug !== c.slug && x.awareness === "high"
                ).slice(0, 2);
                return nearby.length > 0 ? (
                  <div className="flex gap-2">
                    {nearby.map((n) => (
                      <Link key={n.slug} to="/countries/$slug" params={{ slug: n.slug }}>
                        <Button variant="outline" size="sm" className="gap-1">
                          {n.flag} {n.name}
                        </Button>
                      </Link>
                    ))}
                  </div>
                ) : null;
              })()}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

function Section({ icon: Icon, title, accent, children }: { icon: React.ElementType; title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <h2 className="flex items-center gap-2 font-display text-xl">
        <Icon className={`h-5 w-5 text-${accent}-600`} /> {title}
      </h2>
      <div className="mt-4 text-foreground/90">{children}</div>
    </section>
  );
}
