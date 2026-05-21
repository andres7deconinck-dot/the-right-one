import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Lock, ShoppingBag, Beer, Store, Globe, Truck, Star, Lightbulb, Crown, ArrowLeft, CheckCircle2, Package, ExternalLink, Building2, Award } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SHOPPING_COUNTRIES } from "@/data/shopping";
import { useSubscription } from "@/hooks/useSubscription";

export const Route = createFileRoute("/_app/shopping/$slug")({
  head: ({ params }) => {
    const c = SHOPPING_COUNTRIES.find((x) => x.slug === params.slug);
    if (!c) return {};
    return {
      meta: [
        { title: `${c.name} Shopping Guide — Supermarkets, GF Brands & Beer | GlutenGo` },
        { name: "description", content: `Discover the best supermarkets, ecommerce sites, gluten-free products and beer brands in ${c.name}. Premium shopping intelligence for celiac travelers and expats.` },
        { property: "og:title", content: `${c.name} Shopping Guide — GlutenGo Premium` },
        { property: "og:url", content: `https://glutengo.be/shopping/${c.slug}` },
      ],
    };
  },
  loader: ({ params }) => {
    const country = SHOPPING_COUNTRIES.find((c) => c.slug === params.slug);
    if (!country) throw notFound();
    return { country };
  },
  component: ShoppingCountryPage,
});

const FREE_SLUGS = new Set(["italy", "belgium", "germany"]);

function PremiumLock({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-primary/30 bg-primary/5 px-6 py-10 text-center">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/60" />
      <div className="relative">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Lock className="h-5 w-5 text-primary" />
        </div>
        <p className="mt-3 text-sm font-semibold text-foreground">Premium content locked</p>
        <p className="mt-1 text-xs text-muted-foreground">Upgrade to Traveler to unlock this section</p>
        <Button size="sm" className="mt-4 rounded-full px-6" onClick={onUpgrade}>
          <Crown className="mr-1.5 h-3.5 w-3.5" /> Unlock — €12.99/month
        </Button>
      </div>
    </div>
  );
}

function Section({ icon: Icon, title, color = "text-primary", children }: {
  icon: React.ElementType; title: string; color?: string; children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <div className="flex items-center gap-2.5">
        <span className={`flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 ${color}`}>
          <Icon className="h-5 w-5" />
        </span>
        <h2 className="font-display text-xl font-semibold">{title}</h2>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

const RESOURCE_COLORS: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  "celiac-org": { bg: "bg-blue-50 border-blue-200/60", text: "text-blue-700", icon: Building2 },
  "gf-shop": { bg: "bg-success/5 border-success/20", text: "text-success", icon: ShoppingBag },
  "app": { bg: "bg-purple-50 border-purple-200/60", text: "text-purple-700", icon: Star },
  "certification": { bg: "bg-yellow-50 border-yellow-200/60", text: "text-yellow-700", icon: Award },
};

function ShoppingCountryPage() {
  const { country } = Route.useLoaderData();
  const { isActive, loading } = useSubscription();

  const isFree = FREE_SLUGS.has(country.slug);
  const hasAccess = isActive || isFree;

  const goUpgrade = () => { window.location.href = "/pricing"; };

  const gfBeers = country.beerBrands.filter((b) => b.gf);
  const gfBrands = country.brands.filter((b) => b.gf);
  const gfSpecialties = country.specialties.filter((s) => !s.includes("NOT GF") && !s.includes("not GF"));

  return (
    <div className="min-h-screen bg-background">

      {/* Hero */}
      <section className={`bg-gradient-to-br ${country.hero} border-b border-border px-5 py-12`}>
        <div className="mx-auto max-w-5xl">
          <Link to="/shopping/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> All countries
          </Link>
          <div className="mt-4 flex items-center gap-4">
            <span className="text-6xl">{country.flag}</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-4xl md:text-5xl">{country.name}</h1>
                {hasAccess && !loading && (
                  <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-semibold text-yellow-700">
                    <Crown className="mr-1 inline h-3 w-3" />Premium
                  </span>
                )}
              </div>
              <p className="mt-2 max-w-xl text-muted-foreground">{country.tagline}</p>
            </div>
          </div>

          {/* Stats bar */}
          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            {[
              { label: "Ecommerce sites", value: country.ecommerce.length },
              { label: "Supermarkets", value: country.supermarkets.length },
              { label: "GF products", value: country.gfProducts.length },
              { label: "Beer brands", value: country.beerBrands.length },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-border bg-card/60 px-4 py-2 backdrop-blur">
                <span className="font-display text-xl font-semibold text-primary">{s.value}</span>
                <span className="ml-1.5 text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-5xl space-y-5 px-5 py-10">

        {/* Useful Resources — always visible for free countries, locked for premium */}
        {country.resources.length > 0 && (
          <Section icon={Building2} title="Useful resources & celiac organisations" color="text-blue-600">
            {hasAccess || loading ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {country.resources.map((r) => {
                  const style = RESOURCE_COLORS[r.type] ?? RESOURCE_COLORS["gf-shop"];
                  const Icon = style.icon;
                  return (
                    <a
                      key={r.name}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-start gap-3 rounded-xl border ${style.bg} px-4 py-3 transition-opacity hover:opacity-80`}
                    >
                      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${style.text}`} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className={`text-sm font-semibold ${style.text} truncate`}>{r.name}</p>
                          <ExternalLink className={`h-3 w-3 shrink-0 ${style.text}`} />
                        </div>
                        <p className="text-xs text-muted-foreground">{r.note}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            ) : (
              <PremiumLock onUpgrade={goUpgrade} />
            )}
          </Section>
        )}

        {/* Ecommerce — always visible teaser */}
        <Section icon={Globe} title="Top ecommerce websites">
          <div className="space-y-2">
            {country.ecommerce.slice(0, hasAccess ? undefined : 2).map((site) => (
              <div key={site.name} className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
                <ShoppingBag className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div className="flex-1 min-w-0">
                  {site.url ? (
                    <a href={site.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold hover:underline">
                      {site.name} <ExternalLink className="h-3 w-3 text-muted-foreground" />
                    </a>
                  ) : (
                    <p className="text-sm font-semibold">{site.name}</p>
                  )}
                  <p className="text-xs text-muted-foreground">{site.note}</p>
                </div>
                {site.gf && <span className="ml-auto shrink-0 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">GF filter</span>}
              </div>
            ))}
          </div>
          {!hasAccess && !loading && (
            <div className="mt-3">
              <div className="mb-2 select-none blur-sm pointer-events-none space-y-2" aria-hidden>
                {country.ecommerce.slice(2).map((site) => (
                  <div key={site.name} className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
                    <ShoppingBag className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <div><p className="text-sm font-semibold">{site.name}</p><p className="text-xs text-muted-foreground">{site.note}</p></div>
                  </div>
                ))}
              </div>
              <PremiumLock onUpgrade={goUpgrade} />
            </div>
          )}
        </Section>

        {/* Supermarkets */}
        <Section icon={Store} title="Best supermarkets" color="text-emerald-600">
          {hasAccess || loading ? (
            <div className="space-y-2">
              {country.supermarkets.map((s) => (
                <div key={s.name} className="flex items-start gap-3 rounded-xl border border-border bg-muted/30 px-4 py-3">
                  <Store className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                  <div className="flex-1">
                    {s.url ? (
                      <a href={s.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm font-semibold hover:underline">
                        {s.name} <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      </a>
                    ) : (
                      <p className="text-sm font-semibold">{s.name}</p>
                    )}
                    <p className="text-xs text-muted-foreground">{s.note}</p>
                  </div>
                  {s.gf && <span className="shrink-0 rounded-full bg-success/10 px-2 py-0.5 text-[10px] font-medium text-success">GF friendly</span>}
                </div>
              ))}
            </div>
          ) : (
            <PremiumLock onUpgrade={goUpgrade} />
          )}
        </Section>

        {/* GF Products */}
        <Section icon={Package} title="Best gluten-free products" color="text-success">
          {hasAccess || loading ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {country.gfProducts.map((p) => (
                <div key={p.name} className="flex items-start gap-3 rounded-xl border border-success/20 bg-success/5 px-4 py-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <div>
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.note}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <PremiumLock onUpgrade={goUpgrade} />
          )}
        </Section>

        {/* GF brands only */}
        {gfBrands.length > 0 && (
          <Section icon={Star} title="Trusted gluten-free local brands" color="text-success">
            {hasAccess || loading ? (
              <div className="grid gap-2 sm:grid-cols-2">
                {gfBrands.map((b) => (
                  <div key={b.name} className="flex items-start gap-3 rounded-xl border border-success/20 bg-success/5 px-4 py-3">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <div>
                      <p className="text-sm font-semibold">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <PremiumLock onUpgrade={goUpgrade} />
            )}
          </Section>
        )}

        {/* GF Beer only */}
        <Section icon={Beer} title="Gluten-free beer options" color="text-success">
          {hasAccess || loading ? (
            gfBeers.length > 0 ? (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {gfBeers.map((b) => (
                  <div key={b.name} className="flex items-start gap-3 rounded-xl border border-success/20 bg-success/5 px-4 py-3">
                    <Beer className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-sm font-semibold truncate">{b.name}</p>
                        <span className="shrink-0 rounded-full bg-success/10 px-1.5 py-0.5 text-[10px] font-medium text-success">GF</span>
                      </div>
                      <p className="text-xs text-muted-foreground">{b.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="rounded-xl border border-border bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
                No dedicated GF beer available in {country.name} — look for local ciders or GF imports.
              </p>
            )
          ) : (
            <PremiumLock onUpgrade={goUpgrade} />
          )}
        </Section>

        {/* Delivery */}
        <Section icon={Truck} title="Food delivery apps" color="text-blue-500">
          {hasAccess || loading ? (
            <div className="flex flex-wrap gap-2">
              {country.delivery.map((d) => (
                <span key={d} className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium">
                  <Truck className="h-3.5 w-3.5 text-blue-500" /> {d}
                </span>
              ))}
            </div>
          ) : (
            <PremiumLock onUpgrade={goUpgrade} />
          )}
        </Section>

        {/* GF specialties only */}
        <Section icon={Star} title="Local specialties safe for celiacs" color="text-rose-500">
          {hasAccess || loading ? (
            <div className="flex flex-wrap gap-2">
              {gfSpecialties.map((s) => (
                <span key={s} className="rounded-full border border-success/30 bg-success/10 px-4 py-2 text-sm font-medium text-success">
                  {s.replace(" (GF)", "").replace(" (GF!)", "")}
                </span>
              ))}
            </div>
          ) : (
            <PremiumLock onUpgrade={goUpgrade} />
          )}
        </Section>

        {/* Insider tips */}
        <Section icon={Lightbulb} title="Insider tips" color="text-yellow-500">
          {hasAccess || loading ? (
            <div className="space-y-3">
              {country.insiderTips.map((tip, i) => (
                <div key={i} className="flex gap-3 rounded-xl border border-yellow-200/60 bg-yellow-50/50 px-4 py-3">
                  <span className="font-display text-lg font-bold text-yellow-400">0{i + 1}</span>
                  <p className="text-sm leading-relaxed text-foreground">{tip}</p>
                </div>
              ))}
            </div>
          ) : (
            <PremiumLock onUpgrade={goUpgrade} />
          )}
        </Section>

        {/* Upgrade CTA */}
        {!hasAccess && !loading && (
          <div className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-8 text-center text-white">
            <Crown className="mx-auto h-8 w-8 text-yellow-400" />
            <h2 className="mt-3 font-display text-2xl">Unlock {country.name}'s full guide</h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-white/70">
              Get access to all supermarkets, GF brands, beer brands, delivery apps, local specialties and 5 insider tips for {country.name} — plus all {SHOPPING_COUNTRIES.length} countries in our database.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/pricing">
                <Button size="lg" className="rounded-full bg-primary px-8">
                  <Crown className="mr-2 h-4 w-4" /> Upgrade to Traveler — €12.99/month
                </Button>
              </Link>
            </div>
            <p className="mt-3 text-xs text-white/40">30-day money-back guarantee · Cancel anytime</p>
          </div>
        )}

        {/* Related countries */}
        <div>
          <h2 className="font-display text-xl">Explore other countries</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {SHOPPING_COUNTRIES.filter((c) => c.slug !== country.slug).slice(0, 6).map((c) => (
              <Link key={c.slug} to="/shopping/$slug" params={{ slug: c.slug }} className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary/40 hover:bg-muted transition-colors">
                <span>{c.flag}</span> {c.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
