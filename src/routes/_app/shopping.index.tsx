import { createFileRoute, Link } from "@tanstack/react-router";
import { Lock, ShoppingBag, Beer, Store, Sparkles, ArrowRight, CheckCircle2, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { SHOPPING_COUNTRIES } from "@/data/shopping";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/_app/shopping/")({
  head: () => ({
    meta: [
      { title: "Country Shopping & Brand Discovery — GlutenGo Premium" },
      { name: "description", content: "Discover the best supermarkets, GF brands, ecommerce sites and beer brands in 15+ countries. Premium gluten-free shopping intelligence for celiacs and expats." },
      { property: "og:title", content: "Country Shopping & Brand Discovery — GlutenGo Premium" },
      { property: "og:url", content: "https://glutengo.be/shopping" },
    ],
  }),
  component: ShoppingPage,
});

const FREE_SLUGS = new Set(["italy", "belgium", "germany"]);

const CATEGORY_BADGES = [
  { icon: Store, label: "Supermarkets" },
  { icon: ShoppingBag, label: "Ecommerce" },
  { icon: Beer, label: "Beer brands" },
];

function ShoppingPage() {
  const { isActive, loading } = useSubscription();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-5 py-20 text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium backdrop-blur">
            <Crown className="h-3.5 w-3.5 text-yellow-400" /> Premium Feature · Traveler & Family Plans
          </span>
          <h1 className="mt-6 font-display text-4xl leading-tight tracking-tight md:text-6xl">
            Shop smarter in <span className="text-primary">every country</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/70">
            Discover the best supermarkets, ecommerce sites, gluten-free brands, local specialties and beer brands for {SHOPPING_COUNTRIES.length} countries. Built for celiac travelers, expats and food lovers.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-sm text-white/60">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> {SHOPPING_COUNTRIES.length} countries</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> GF brands & products</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Insider tips</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Beer brands per country</span>
          </div>
          {!isActive && !loading && (
            <div className="mt-8">
              <Link to="/pricing">
                <Button size="lg" className="rounded-full bg-primary px-8 shadow-glow">
                  <Crown className="mr-2 h-4 w-4" /> Unlock all countries — from €12.99/month
                </Button>
              </Link>
              <p className="mt-3 text-xs text-white/40">3 countries free to preview · Cancel anytime</p>
            </div>
          )}
        </div>
      </section>

      {/* Country grid */}
      <section className="mx-auto max-w-7xl px-5 py-16">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Premium database</p>
            <h2 className="mt-1 font-display text-3xl">Choose your destination</h2>
          </div>
          {!isActive && (
            <Link to="/pricing" className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex">
              Unlock all <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {SHOPPING_COUNTRIES.map((country) => {
            const isFree = FREE_SLUGS.has(country.slug);
            const hasAccess = isActive || isFree;

            return (
              <Link
                key={country.slug}
                to="/shopping/$slug"
                params={{ slug: country.slug }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow hover:border-primary/30"
              >
                {/* Lock overlay for premium */}
                {!hasAccess && !loading && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-3xl bg-background/80 backdrop-blur-sm">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                      <Lock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-xs font-medium text-muted-foreground">Premium</p>
                  </div>
                )}

                <div className={`bg-gradient-to-br ${country.hero} px-5 pt-5 pb-3`}>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl">{country.flag}</span>
                    {isFree && (
                      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">Free preview</span>
                    )}
                    {isActive && (
                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-[10px] font-semibold text-yellow-700">
                        <Crown className="mr-0.5 inline h-2.5 w-2.5" /> Premium
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3 font-display text-xl font-semibold">{country.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{country.tagline}</p>
                </div>

                <div className="px-5 py-4">
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORY_BADGES.map((b) => (
                      <span key={b.label} className="flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                        <b.icon className="h-2.5 w-2.5" /> {b.label}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 text-xs font-medium text-primary">
                    {hasAccess ? (
                      <>View guide <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" /></>
                    ) : (
                      <><Lock className="h-3 w-3" /> Unlock with Traveler</>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Paywall CTA — only for free users */}
      {!isActive && !loading && (
        <section className="mx-auto max-w-4xl px-5 pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-center text-white">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-primary/30 via-transparent to-transparent" />
            <div className="relative">
              <Crown className="mx-auto h-10 w-10 text-yellow-400" />
              <h2 className="mt-4 font-display text-3xl md:text-4xl">Unlock all {SHOPPING_COUNTRIES.length} countries</h2>
              <p className="mx-auto mt-3 max-w-lg text-white/70">
                Get full access to supermarkets, ecommerce sites, GF brands, beer brands, local specialties and insider tips for every country in our database.
              </p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                {["Supermarkets", "GF brands", "Beer brands", "Insider tips"].map((f) => (
                  <div key={f} className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-white/80">{f}</div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {!user ? (
                  <Link to="/auth" search={{ redirect: "/shopping" } as any}>
                    <Button size="lg" className="rounded-full bg-primary px-8">Start free · 3 countries preview</Button>
                  </Link>
                ) : null}
                <Link to="/pricing">
                  <Button size="lg" variant="outline" className="rounded-full border-white/20 bg-white/10 px-8 text-white hover:bg-white/20">
                    <Crown className="mr-2 h-4 w-4 text-yellow-400" /> Upgrade to Traveler — €12.99/month
                  </Button>
                </Link>
              </div>
              <p className="mt-4 text-xs text-white/40">30-day money-back guarantee · Cancel anytime</p>
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  );
}
