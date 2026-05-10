import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowRight, Search, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { COUNTRIES } from "@/data/countries";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const Route = createFileRoute("/countries")({
  head: () => ({
    meta: [
      { title: "Gluten-Free Country Guides — Celiac Travel Tips for 19 Countries" },
      { name: "description", content: "Celiac-safe country guides for Italy, Japan, Belgium, Spain and 15+ more. Safe foods, dishes to avoid, supermarket brands and emergency phrases in the local language." },
      { name: "keywords", content: "gluten-free country guide, celiac travel Italy, coeliac travel Japan, gluten-free Spain, celiac travel tips, safe foods abroad, gluten-free emergency phrase" },
      { property: "og:title", content: "Gluten-Free Country Guides — Celiac Travel Tips Worldwide" },
      { property: "og:description", content: "Honest, celiac-first travel guides for 19 countries. Safe foods, real risks, supermarket brands and emergency phrases." },
      { property: "og:url", content: "https://glutengo.app/countries" },
      { property: "og:type", content: "website" },
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

type AwarenessFilter = "all" | "high" | "medium" | "low";

const AWARENESS_META: Record<string, { label: string; dot: string; badge: string }> = {
  high:   { label: "High awareness",   dot: "bg-emerald-500", badge: "bg-emerald-100 text-emerald-700" },
  medium: { label: "Medium awareness", dot: "bg-amber-400",   badge: "bg-amber-100 text-amber-700" },
  low:    { label: "Low awareness",    dot: "bg-rose-500",    badge: "bg-rose-100 text-rose-700" },
};

function CountriesPage() {
  const [query, setQuery] = useState("");
  const [awareness, setAwareness] = useState<AwarenessFilter>("all");

  const featured = COUNTRIES.filter((c) => c.awareness === "high").slice(0, 3);

  const visible = COUNTRIES.filter((c) => {
    const matchesSearch = !query || c.name.toLowerCase().includes(query.toLowerCase());
    const matchesAwareness = awareness === "all" || c.awareness === awareness;
    return matchesSearch && matchesAwareness;
  });

  return (
    <div className="mx-auto max-w-7xl px-5 py-16">
      {/* Header */}
      <div className="max-w-2xl">
        <h1 className="font-display text-5xl">Country Guides</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Celiac-first travel guidance for {COUNTRIES.length} countries — safe foods, real risks, brands to find in supermarkets, and emergency phrases in the local language.
        </p>
      </div>

      {/* Featured: high-awareness countries */}
      <div className="mt-10">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Top destinations for celiacs</p>
        <div className="grid gap-4 sm:grid-cols-3">
          {featured.map((c) => (
            <Link
              key={c.slug}
              to="/countries/$slug"
              params={{ slug: c.slug }}
              className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-glow"
            >
              <div className={`flex aspect-[5/2] items-center justify-center bg-gradient-to-br ${c.hero}`}>
                <span className="text-6xl">{c.flag}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-xl">{c.name}</h3>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${AWARENESS_META[c.awareness].badge}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${AWARENESS_META[c.awareness].dot}`} />
                    {AWARENESS_META[c.awareness].label}
                  </span>
                </div>
                {c.certBody && <p className="mt-1 text-xs text-muted-foreground">{c.certBody}</p>}
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.intro}</p>
                <span className="mt-3 inline-flex items-center text-sm font-medium text-primary">
                  Read guide <ArrowRight className="ml-1 h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Search & filter */}
      <div className="mt-12 flex flex-wrap items-center gap-3">
        <div className="relative min-w-[240px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search countries…"
            className="pl-9"
          />
        </div>
        <div className="flex gap-2">
          {(["all", "high", "medium", "low"] as AwarenessFilter[]).map((a) => (
            <button
              key={a}
              onClick={() => setAwareness(a)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                awareness === a
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:bg-muted"
              }`}
            >
              {a !== "all" && <span className={`h-2 w-2 rounded-full ${AWARENESS_META[a].dot}`} />}
              {a === "all" ? "All" : AWARENESS_META[a].label}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p className="mt-4 text-sm text-muted-foreground">
        <span className="font-medium text-foreground">{visible.length}</span> {visible.length === 1 ? "country" : "countries"}
        {awareness !== "all" && ` with ${awareness} celiac awareness`}
        {query && ` matching "${query}"`}
      </p>

      {/* Grid */}
      <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {visible.map((c) => {
          const meta = AWARENESS_META[c.awareness];
          return (
            <Link
              key={c.slug}
              to="/countries/$slug"
              params={{ slug: c.slug }}
              className="group overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition hover:-translate-y-1 hover:shadow-glow"
            >
              <div className={`flex aspect-[5/3] items-center justify-center bg-gradient-to-br ${c.hero}`}>
                <span className="text-7xl">{c.flag}</span>
              </div>
              <div className="p-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl">{c.name}</h3>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.badge}`}>
                    <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </span>
                </div>
                {c.certBody && (
                  <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                    <ShieldCheck className="h-3 w-3 text-primary" /> {c.certBody}
                  </p>
                )}
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{c.intro}</p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {c.brands.slice(0, 3).map((b) => (
                    <span key={b} className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">{b}</span>
                  ))}
                </div>
                <span className="mt-3 inline-flex items-center text-sm font-medium text-primary">
                  Read guide <ArrowRight className="ml-1 h-3.5 w-3.5 transition group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {visible.length === 0 && (
        <div className="mt-12 rounded-3xl border border-dashed border-border p-12 text-center text-muted-foreground">
          No countries match your search. <button onClick={() => { setQuery(""); setAwareness("all"); }} className="underline">Clear filters</button>
        </div>
      )}
    </div>
  );
}
