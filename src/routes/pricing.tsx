import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Check, Minus, Sparkles, Shield, CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { usePaddleCheckout } from "@/hooks/usePaddleCheckout";
import { useAuth } from "@/lib/auth";
import { useSubscription } from "@/hooks/useSubscription";
import { toast } from "sonner";

export const Route = createFileRoute("/pricing")({
  head: () => ({
    meta: [
      { title: "Pricing — GlutenGo" },
      { name: "description", content: "Free forever, Traveler from €12.99/month, Family from €24.99/month. Cancel anytime, 30-day money-back guarantee." },
    ],
  }),
  component: PricingPage,
});

type Billing = "monthly" | "yearly";

const PLANS: Array<{
  id: "free" | "traveler" | "family";
  name: string;
  desc: string;
  cta: string;
  highlight: boolean;
  monthly: number;
  yearly: number;
  features: string[];
}> = [
  {
    id: "free",
    name: "Free",
    desc: "Try it before your next trip.",
    cta: "Start free",
    highlight: false,
    monthly: 0,
    yearly: 0,
    features: ["3 translation cards / month", "5 supported languages", "Limited country guides", "Basic AI assistant"],
  },
  {
    id: "traveler",
    name: "Traveler",
    desc: "Everything you need on the road.",
    cta: "Start Traveler",
    highlight: true,
    monthly: 12.99,
    yearly: 119,
    features: ["Unlimited translation cards", "16 supported languages", "Unlimited AI assistant", "All country guides", "Offline access", "PDF travel pack"],
  },
  {
    id: "family",
    name: "Family",
    desc: "Up to 5 travelers.",
    cta: "Start Family",
    highlight: false,
    monthly: 24.99,
    yearly: 229,
    features: ["Everything in Traveler", "Up to 5 user profiles", "Child allergy profiles", "Shared trips & checklists", "Priority support"],
  },
];

const COMPARE: Array<{ label: string; free: string | boolean; traveler: string | boolean; family: string | boolean }> = [
  { label: "Translation cards / month", free: "3", traveler: "Unlimited", family: "Unlimited" },
  { label: "Supported languages", free: "5", traveler: "16", family: "16" },
  { label: "AI travel assistant", free: "10 / month", traveler: "Unlimited", family: "Unlimited" },
  { label: "Restaurant search", free: "5 / day", traveler: "Unlimited", family: "Unlimited" },
  { label: "Country guides", free: "3 countries", traveler: "All", family: "All" },
  { label: "Trip planner", free: "1 trip", traveler: "Unlimited", family: "Unlimited" },
  { label: "Offline access", free: false, traveler: true, family: true },
  { label: "PDF travel pack", free: false, traveler: true, family: true },
  { label: "QR-code sharing", free: false, traveler: true, family: true },
  { label: "Family profiles", free: "—", traveler: "—", family: "5 users" },
  { label: "Child profiles", free: "—", traveler: "—", family: true },
  { label: "Shared trips", free: "—", traveler: "—", family: true },
  { label: "Priority support", free: false, traveler: true, family: true },
];

const FAQS = [
  { q: "When am I charged?", a: "Right at first payment, then on the same date every month — or every year if you choose annual billing." },
  { q: "Can I upgrade or downgrade?", a: "Yes, anytime. Upgrades are pro-rated. Downgrades take effect at the end of your current period." },
  { q: "Which payment methods do you accept?", a: "All major credit cards (Visa, Mastercard, Amex), iDEAL, Bancontact, SEPA Direct Debit, Apple Pay and Google Pay — handled securely by our payment provider." },
  { q: "Do I get invoices?", a: "Yes. After every payment you receive an invoice by email and you can download all invoices as PDF from your account settings." },
];

function priceLabel(plan: typeof PLANS[number], billing: Billing) {
  if (plan.monthly === 0) return { big: "€0", small: "" };
  if (billing === "monthly") return { big: `€${plan.monthly}`, small: "/month" };
  const monthlyEquiv = (plan.yearly / 12).toFixed(2).replace(/\.00$/, "");
  return { big: `€${monthlyEquiv}`, small: "/month, billed yearly" };
}

function Cell({ v }: { v: string | boolean }) {
  if (v === true) return <Check className="mx-auto h-5 w-5 text-success" />;
  if (v === false) return <Minus className="mx-auto h-5 w-5 text-muted-foreground/50" />;
  return <span className="text-sm">{v}</span>;
}

function PricingPage() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { openCheckout, loading } = usePaddleCheckout();
  const { isActive, planName } = useSubscription();
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);

  const handleCta = async (plan: typeof PLANS[number]) => {
    if (plan.id === "free") return;
    if (!user) {
      navigate({ to: "/auth", search: { redirect: "/pricing" } as any });
      return;
    }
    if (isActive && planName === plan.id) {
      navigate({ to: "/dashboard" });
      return;
    }
    const priceId = `${plan.id}_${billing === "monthly" ? "monthly" : "yearly"}`;
    setPendingPlan(plan.id);
    try {
      await openCheckout({
        priceId,
        customerEmail: user.email,
        customData: { userId: user.id },
        successUrl: `${window.location.origin}/checkout/success`,
      });
    } catch (e: any) {
      toast.error(e?.message || "Could not open checkout. Please try again.");
    } finally {
      setPendingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-hero">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-accent" /> 30-day money-back guarantee
          </span>
          <h1 className="mt-4 font-display text-5xl md:text-6xl">Simple pricing for safer travel</h1>
          <p className="mt-4 text-muted-foreground">Start free. Upgrade only when you fly. Cancel anytime — no hidden fees.</p>

          <div className="mt-8 inline-flex items-center rounded-full border border-border bg-card p-1 text-sm shadow-soft">
            <button
              onClick={() => setBilling("monthly")}
              className={`rounded-full px-4 py-2 transition ${billing === "monthly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling("yearly")}
              className={`rounded-full px-4 py-2 transition ${billing === "yearly" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Yearly <span className="ml-1 rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">2 months free</span>
            </button>
          </div>
        </div>
      </section>

      <div className="mx-auto grid max-w-6xl gap-6 px-5 py-12 md:grid-cols-3">
        {PLANS.map((p) => {
          const label = priceLabel(p, billing);
          const saving = billing === "yearly" && p.monthly > 0 ? Math.round(p.monthly * 12 - p.yearly) : 0;
          const isPending = pendingPlan === p.id && loading;
          return (
            <div key={p.id} className={`relative rounded-3xl border p-7 shadow-soft transition ${p.highlight ? "border-primary bg-card shadow-glow scale-[1.02]" : "border-border bg-card"}`}>
              {p.highlight && <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">Most popular</span>}
              <h2 className="font-display text-2xl">{p.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{p.desc}</p>
              <div className="mt-5 flex items-baseline gap-1">
                <span className="font-display text-5xl">{label.big}</span>
                {label.small && <span className="text-sm text-muted-foreground">{label.small}</span>}
              </div>
              {saving > 0 && (
                <p className="mt-1 text-xs text-success">Save €{saving} / year vs monthly</p>
              )}
              {p.id === "free" ? (
                <Link to="/auth"><Button className="mt-6 w-full" variant="outline">{p.cta}</Button></Link>
              ) : !user ? (
                <Link to="/auth">
                  <Button className="mt-6 w-full" variant={p.highlight ? "default" : "outline"}>
                    Sign in to {p.cta.toLowerCase()}
                  </Button>
                </Link>
              ) : (
                <Button
                  className="mt-6 w-full"
                  variant={p.highlight ? "default" : "outline"}
                  onClick={() => handleCta(p)}
                  disabled={isPending}
                >
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : p.cta}
                </Button>
              )}
              <ul className="mt-6 space-y-3 text-sm">
                {p.features.map((f) => (
                  <li key={f} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-success" /> {f}</li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="mx-auto mb-8 flex max-w-6xl flex-wrap items-center justify-center gap-x-8 gap-y-3 px-5 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2"><Shield className="h-4 w-4 text-success" /> 30-day money-back guarantee</span>
        <span className="inline-flex items-center gap-2"><CreditCard className="h-4 w-4 text-primary" /> Visa · Mastercard · iDEAL · Bancontact · SEPA</span>
        <span>No hidden fees. Cancel anytime.</span>
      </div>

      {/* Comparison table */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <h2 className="text-center font-display text-3xl md:text-4xl">Compare plans</h2>
        <div className="mt-8 overflow-x-auto rounded-3xl border border-border bg-card shadow-soft">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-card-soft">
                <th className="px-5 py-4 text-left font-medium text-muted-foreground">Feature</th>
                <th className="px-5 py-4 text-center font-display text-base">Free</th>
                <th className="px-5 py-4 text-center font-display text-base text-primary">Traveler</th>
                <th className="px-5 py-4 text-center font-display text-base">Family</th>
              </tr>
            </thead>
            <tbody>
              {COMPARE.map((row, i) => (
                <tr key={row.label} className={i % 2 === 0 ? "bg-background/30" : ""}>
                  <td className="px-5 py-3 text-foreground">{row.label}</td>
                  <td className="px-5 py-3 text-center"><Cell v={row.free} /></td>
                  <td className="px-5 py-3 text-center"><Cell v={row.traveler} /></td>
                  <td className="px-5 py-3 text-center"><Cell v={row.family} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-16">
        <h2 className="text-center font-display text-3xl md:text-4xl">Pricing questions</h2>
        <Accordion type="single" collapsible className="mt-8">
          {FAQS.map((f, i) => (
            <AccordionItem value={`p${i}`} key={i}>
              <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      <SiteFooter />
    </div>
  );
}
