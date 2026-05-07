import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, ChevronLeft, ShoppingBag, X, Lightbulb, AlertTriangle } from "lucide-react";
import { COUNTRIES } from "@/data/countries";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const Route = createFileRoute("/countries/$slug")({
  loader: ({ params }) => {
    const country = COUNTRIES.find((c) => c.slug === params.slug);
    if (!country) throw notFound();
    return country;
  },
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.name ?? "Country"} Gluten-Free Travel Guide — GlutenGo` },
      { name: "description", content: loaderData?.intro ?? "" },
      { property: "og:title", content: `${loaderData?.name} Gluten-Free Guide` },
      { property: "og:description", content: loaderData?.intro ?? "" },
    ],
  }),
  notFoundComponent: () => <div className="p-10 text-center">Country not found.</div>,
  errorComponent: ({ error }) => <div className="p-10 text-center text-destructive">{error.message}</div>,
  component: CountryDetail,
});

function CountryDetail() {
  const c = Route.useLoaderData() as (typeof COUNTRIES)[number];
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className={`bg-gradient-to-br ${c.hero}`}>
        <div className="mx-auto max-w-5xl px-5 py-16">
          <Link to="/countries" className="inline-flex items-center text-sm text-foreground/70 hover:text-foreground"><ChevronLeft className="mr-1 h-4 w-4" /> All guides</Link>
          <div className="mt-6 flex items-center gap-5">
            <span className="text-7xl md:text-8xl">{c.flag}</span>
            <div>
              <h1 className="font-display text-5xl md:text-6xl">{c.name}</h1>
              <p className="mt-2 text-foreground/80 max-w-xl">{c.intro}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl gap-8 px-5 py-12 md:grid-cols-2">
        <Section icon={Check} color="success" title="Generally safer choices">
          <ul className="space-y-2">{c.safe.map((s) => <li key={s} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {s}</li>)}</ul>
        </Section>
        <Section icon={X} color="destructive" title="Avoid or verify carefully">
          <ul className="space-y-2">{c.avoid.map((s) => <li key={s} className="flex gap-2"><X className="mt-0.5 h-4 w-4 shrink-0 text-destructive" /> {s}</li>)}</ul>
        </Section>
        <Section icon={ShoppingBag} color="primary" title="Trusted GF brands">
          <ul className="grid grid-cols-2 gap-2">{c.brands.map((b) => <li key={b} className="rounded-lg bg-muted px-3 py-1.5 text-sm">{b}</li>)}</ul>
        </Section>
        <Section icon={Lightbulb} color="accent" title="Local tips">
          <ul className="space-y-2">{c.tips.map((s) => <li key={s} className="flex gap-2 text-sm"><Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" /> {s}</li>)}</ul>
        </Section>
      </div>

      <div className="mx-auto max-w-5xl px-5 pb-16">
        <div className="rounded-3xl border-2 border-destructive/30 bg-destructive/5 p-6">
          <div className="flex items-center gap-2 text-destructive"><AlertTriangle className="h-5 w-5" /><h3 className="font-display text-lg">Emergency phrase ({c.emergencyPhrase.lang})</h3></div>
          <p className="mt-3 text-pretty text-xl leading-relaxed text-foreground" lang={c.slug === "japan" ? "ja" : c.slug === "thailand" ? "th" : undefined}>{c.emergencyPhrase.text}</p>
          <p className="mt-3 text-xs text-muted-foreground">Tap a translation card from your library for fullscreen restaurant mode.</p>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

function Section({ icon: Icon, color, title, children }: any) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <h2 className="flex items-center gap-2 font-display text-xl"><Icon className={`h-5 w-5 text-${color}`} /> {title}</h2>
      <div className="mt-4 text-sm text-foreground/90">{children}</div>
    </section>
  );
}
