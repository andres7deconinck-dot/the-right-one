import { createFileRoute, Link } from "@tanstack/react-router";
import { Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — GlutenGo" },
      { name: "description", content: "Free, Traveler €9/month, Family €19/month. Cancel anytime." },
    ],
  }),
  component: PricingPage,
});

const PLANS = [
  { name: "Free", price: "€0", desc: "Try it before your next trip.", cta: "Start free", highlight: false, features: ["3 translation cards / month", "Basic country guides", "Limited restaurant search"] },
  { name: "Traveler", price: "€9", desc: "Everything you need on the road.", cta: "Start Traveler", highlight: true, features: ["Unlimited translation cards", "AI travel assistant", "All country guides", "Saved trips & emergency phrases", "Offline access"] },
  { name: "Family", price: "€19", desc: "Up to 5 travelers.", cta: "Start Family", highlight: false, features: ["Everything in Traveler", "Up to 5 user profiles", "Shared trips", "Child allergy profiles", "Collaborative planning"] },
];

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-hero">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground"><Sparkles className="h-3.5 w-3.5 text-accent" /> Cancel anytime</span>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">Simple pricing for safer travel</h1>
          <p className="mt-4 text-muted-foreground">Start free. Upgrade only when you fly.</p>
        </div>
      </section>
      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-12 md:grid-cols-3">
        {PLANS.map((p) => (
          <div key={p.name} className={`relative rounded-3xl border p-7 shadow-soft transition ${p.highlight ? "border-primary bg-card shadow-glow scale-[1.02]" : "border-border bg-card"}`}>
            {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">Most popular</span>}
            <h2 className="font-display text-2xl">{p.name}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
            <div className="mt-5 flex items-baseline gap-1">
              <span className="font-display text-5xl">{p.price}</span>
              {p.price !== "€0" && <span className="text-sm text-muted-foreground">/month</span>}
            </div>
            <Link to="/auth"><Button className="mt-6 w-full" variant={p.highlight ? "default" : "outline"}>{p.cta}</Button></Link>
            <ul className="mt-6 space-y-3 text-sm">
              {p.features.map((f) => (
                <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {f}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mb-12 text-center text-xs text-muted-foreground">Stripe checkout coming soon — early users get founding pricing locked in.</p>
      <SiteFooter />
    </div>
  );
}
