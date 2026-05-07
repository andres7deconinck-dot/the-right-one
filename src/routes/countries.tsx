import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { COUNTRIES } from "@/data/countries";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const Route = createFileRoute("/countries")({
  head: () => ({
    meta: [
      { title: "Country Guides — GlutenGo" },
      { name: "description", content: "Curated gluten-free travel guides for celiac travelers: safe foods, dishes to avoid, supermarket brands and emergency phrases." },
    ],
  }),
  component: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <CountriesPage />
      <SiteFooter />
    </div>
  ),
});

function CountriesPage() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      <div className="max-w-2xl">
        <h1 className="font-display text-5xl">Country Guides</h1>
        <p className="mt-3 text-lg text-muted-foreground">Honest, celiac-first travel guidance. Safe foods, real risks, brands you'll find in supermarkets, and the one phrase you need in an emergency.</p>
      </div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {COUNTRIES.map((c) => (
          <Link key={c.slug} to="/countries/$slug" params={{ slug: c.slug }} className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-glow">
            <div className={`flex aspect-[5/3] items-center justify-center bg-gradient-to-br ${c.hero}`}>
              <span className="text-7xl">{c.flag}</span>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-2xl">{c.name}</h3>
                <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium ${c.awareness === "high" ? "bg-success/15 text-success" : c.awareness === "medium" ? "bg-warning/15 text-warning-foreground" : "bg-destructive/10 text-destructive"}`}>
                  <ShieldCheck className="h-3 w-3" /> {c.awareness} awareness
                </span>
              </div>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.intro}</p>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-primary">Read guide <ArrowRight className="ml-1 h-3.5 w-3.5 transition group-hover:translate-x-1" /></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
