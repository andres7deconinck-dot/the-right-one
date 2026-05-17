import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Plane, Luggage, Heart, Lightbulb, Globe2, Shield, FileText, CreditCard, Stethoscope, Info, ChevronRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { getResourcesContent } from "@/data/resourcesContent";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Helpful Tips & Links for People with Celiac Disease | GlutenGo" },
      { name: "description", content: "Everything you need to know as a celiac traveler: extra baggage rights, tax benefits, useful websites, insurance and travel tips." },
      { property: "og:title", content: "Helpful Tips & Links for People with Celiac Disease" },
      { property: "og:description", content: "Extra baggage, tax benefits, useful sites and travel tips for people with celiac disease." },
      { property: "og:url", content: "https://www.glutengo.be/resources" },
    ],
    links: [{ rel: "canonical", href: "https://www.glutengo.be/resources" }],
  }),
  component: ResourcesPage,
});

const BAGGAGE_ICONS = [Luggage, CreditCard, Shield, FileText];
const BAGGAGE_COLORS = [
  { card: "border-emerald-200 bg-emerald-50", badge: "bg-emerald-100 text-emerald-700" },
  { card: "border-blue-200 bg-blue-50", badge: "bg-blue-100 text-blue-700" },
  { card: "border-amber-200 bg-amber-50", badge: "bg-amber-100 text-amber-700" },
  { card: "border-purple-200 bg-purple-50", badge: "bg-purple-100 text-purple-700" },
];
const SITE_CAT_COLORS = [
  "bg-rose-50 text-rose-600 border-rose-200",
  "bg-blue-50 text-blue-600 border-blue-200",
  "bg-emerald-50 text-emerald-600 border-emerald-200",
];
const SITE_CAT_ICONS = [Heart, Globe2, Stethoscope];

function ResourcesPage() {
  const { lang } = useLanguage();
  const c = getResourcesContent(lang);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-hero">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Lightbulb className="h-3.5 w-3.5 text-accent" /> {c.hero.badge}
          </span>
          <h1 className="mt-5 font-display text-5xl leading-tight md:text-6xl">{c.hero.title}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">{c.hero.subtitle}</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-16 space-y-20">
        {/* Quick tips */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary"><Lightbulb className="h-5 w-5" /></span>
            <div>
              <h2 className="font-display text-3xl">{c.sections.quickTips.title}</h2>
              <p className="text-sm text-muted-foreground">{c.sections.quickTips.subtitle}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {c.quickTips.map((tip) => (
              <div key={tip.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start gap-3">
                  <span className="text-2xl mt-0.5">{tip.emoji}</span>
                  <div>
                    <p className="font-semibold text-sm">{tip.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{tip.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rights & benefits */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><Shield className="h-5 w-5" /></span>
            <div>
              <h2 className="font-display text-3xl">{c.sections.rightsBenefits.title}</h2>
              <p className="text-sm text-muted-foreground">{c.sections.rightsBenefits.subtitle}</p>
            </div>
          </div>
          <div className="space-y-5">
            {c.baggageTips.map((item, idx) => {
              const Icon = BAGGAGE_ICONS[idx] ?? Info;
              const col = BAGGAGE_COLORS[idx] ?? BAGGAGE_COLORS[0];
              return (
                <div key={item.title} className={`rounded-3xl border p-6 ${col.card}`}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/60">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="font-display text-xl">{item.title}</h3>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${col.badge}`}>{item.badge}</span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-foreground/80">{item.content}</p>
                  {item.airlines && (
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {item.airlines.map((a) => (
                        <div key={a.name} className="rounded-xl bg-white/50 px-4 py-2.5 text-sm">
                          <p className="font-medium">{a.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{a.note}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {item.links && item.links.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.links.map((l) => (
                        <a key={l.name} href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 rounded-full border border-current/20 bg-white/60 px-4 py-1.5 text-xs font-medium hover:bg-white/80 transition-colors">
                          {l.name} <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Rights per country */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-rose-100 text-rose-700"><Globe2 className="h-5 w-5" /></span>
            <div>
              <h2 className="font-display text-3xl">{c.sections.rightsByCountry.title}</h2>
              <p className="text-sm text-muted-foreground">{c.sections.rightsByCountry.subtitle}</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {c.countryRights.map((cr) => (
              <div key={cr.country} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{cr.flag}</span>
                  <h3 className="font-display text-xl">{cr.country}</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700 mb-1">{c.labels.financial}</p>
                    <p className="text-sm text-foreground/80 leading-relaxed">{cr.benefit}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-700 mb-1">{c.labels.legal}</p>
                    <p className="text-sm text-foreground/80 leading-relaxed">{cr.legal}</p>
                  </div>
                </div>
                <a href={cr.link.url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline">
                  {cr.link.name} <ExternalLink className="h-3 w-3" />
                </a>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground italic">{c.sections.rightsByCountry.disclaimer}</p>
        </section>

        {/* Useful sites */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-100 text-blue-700"><Globe2 className="h-5 w-5" /></span>
            <div>
              <h2 className="font-display text-3xl">{c.sections.usefulSites.title}</h2>
              <p className="text-sm text-muted-foreground">{c.sections.usefulSites.subtitle}</p>
            </div>
          </div>
          <div className="space-y-8">
            {c.usefulSites.map((cat, idx) => {
              const CatIcon = SITE_CAT_ICONS[idx] ?? Heart;
              const color = SITE_CAT_COLORS[idx] ?? SITE_CAT_COLORS[0];
              return (
                <div key={cat.category}>
                  <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${color}`}>
                    <CatIcon className="h-4 w-4" />
                    {cat.category}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {cat.sites.map((site) => (
                      <a key={site.name} href={site.url} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-border bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow hover:border-primary/30">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-semibold text-sm group-hover:text-primary transition-colors">{site.name}</p>
                          <ExternalLink className="h-3.5 w-3.5 shrink-0 text-muted-foreground mt-0.5" />
                        </div>
                        <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">{site.desc}</p>
                      </a>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Did you know */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-100 text-amber-700"><Info className="h-5 w-5" /></span>
            <div>
              <h2 className="font-display text-3xl">{c.sections.didYouKnow.title}</h2>
              <p className="text-sm text-muted-foreground">{c.sections.didYouKnow.subtitle}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {c.didYouKnow.map((item, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start gap-3">
                  <span className="font-display text-3xl text-primary/30 leading-none">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-sm leading-relaxed">{item.fact}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{c.labels.source}: {item.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-10 text-center">
          <Plane className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 font-display text-3xl">{c.sections.cta.title}</h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">{c.sections.cta.subtitle}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/cards">
              <Button size="lg" className="rounded-full px-7">
                <CreditCard className="mr-2 h-4 w-4" /> {c.sections.cta.cards}
              </Button>
            </Link>
            <Link to="/countries">
              <Button size="lg" variant="outline" className="rounded-full px-7">
                {c.sections.cta.countries} <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}
