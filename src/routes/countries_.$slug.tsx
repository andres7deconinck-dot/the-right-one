import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  Flame,
  Globe2,
  Languages,
  Lightbulb,
  MapPin,
  MessageSquare,
  Phone,
  PhoneCall,
  Plane,
  Search,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Utensils,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { COUNTRIES } from "@/data/countries";
import { getLanguageInfo } from "@/data/languageInfo";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { PaywallGate } from "@/components/PaywallGate";

export const Route = createFileRoute("/countries_/$slug")({
  loader: ({ params }) => {
    const country = COUNTRIES.find((c) => c.slug === params.slug);
    if (!country) throw notFound();
    return country;
  },
  head: ({ loaderData: c }) => ({
    meta: [
      { title: `${c?.name ?? "Country"} Gluten-Free Travel Guide — Safe Foods, Brands & Phrases` },
      { name: "description", content: `Celiac travel guide for ${c?.name}: safe dishes, foods to avoid, label words, restaurant phrases, supermarket brands and an emergency phrase in ${c?.emergencyPhrase?.lang ?? "local language"}.` },
      { name: "keywords", content: `gluten-free ${c?.name}, celiac travel ${c?.name}, coeliac ${c?.name}, gluten-free food ${c?.name}, ${c?.name} celiac guide, gluten-free restaurants ${c?.capital}` },
      { property: "og:title", content: `${c?.name} Gluten-Free Guide — Celiac Travel Tips` },
      { property: "og:description", content: `Safe foods, label words, restaurant phrases and trusted brands for celiacs in ${c?.name}.` },
      { property: "og:url", content: `https://glutengo.app/countries/${c?.slug}` },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: `${c?.name} Gluten-Free Travel Guide` },
      { name: "twitter:description", content: `Safe foods, label words and emergency phrases for celiacs in ${c?.name}.` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Article",
          headline: `${c?.name} Gluten-Free Travel Guide`,
          description: c?.intro,
          url: `https://glutengo.app/countries/${c?.slug}`,
          dateModified: new Date().toISOString().split("T")[0],
          publisher: { "@type": "Organization", name: "GlutenGo", url: "https://glutengo.app" },
          about: { "@type": "Country", name: c?.name },
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            { "@type": "Question", name: `Is ${c?.name} safe for celiac disease?`, acceptedAnswer: { "@type": "Answer", text: c?.intro ?? "" } },
            { "@type": "Question", name: `What gluten-free foods are safe in ${c?.name}?`, acceptedAnswer: { "@type": "Answer", text: `Generally safer choices in ${c?.name}: ${(c?.safe ?? []).join(", ")}.` } },
            { "@type": "Question", name: `What should celiacs avoid in ${c?.name}?`, acceptedAnswer: { "@type": "Answer", text: `Avoid or verify carefully: ${(c?.avoid ?? []).join(", ")}.` } },
            { "@type": "Question", name: `Which GF certification should I look for in ${c?.name}?`, acceptedAnswer: { "@type": "Answer", text: c?.certBody ? `Look for the ${c.certBody} logo on restaurant windows and food packaging.` : "Look for international crossed-grain symbols and always ask staff about dedicated gluten-free preparation." } },
            { "@type": "Question", name: `How do I say gluten-free in ${c?.emergencyPhrase?.lang ?? "the local language"}?`, acceptedAnswer: { "@type": "Answer", text: c?.emergencyPhrase?.text ?? "Use a GlutenGo translation card to communicate your needs safely." } },
          ],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://glutengo.app" },
            { "@type": "ListItem", position: 2, name: "Country Guides", item: "https://glutengo.app/countries" },
            { "@type": "ListItem", position: 3, name: `${c?.name} Gluten-Free Guide`, item: `https://glutengo.app/countries/${c?.slug}` },
          ],
        }),
      },
    ],
  }),
  notFoundComponent: () => <div className="p-10 text-center">Country not found.</div>,
  errorComponent: ({ error }) => <div className="p-10 text-center text-destructive">{error.message}</div>,
  component: CountryDetail,
});

const AWARENESS_META = {
  high: { label: "High celiac awareness", badge: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500", desc: "Many certified venues, staff understand cross-contamination, GF products widely available." },
  medium: { label: "Medium celiac awareness", badge: "bg-amber-100 text-amber-700", dot: "bg-amber-400", desc: "Awareness growing in cities. Always verify with staff and bring a translation card." },
  low: { label: "Low celiac awareness", badge: "bg-rose-100 text-rose-700", dot: "bg-rose-500", desc: "Most staff don't know what celiac means. Translation card is essential, stick to naturally GF dishes." },
};

function CountryDetail() {
  const c = Route.useLoaderData() as (typeof COUNTRIES)[number];
  const awareness = AWARENESS_META[c.awareness];
  const lang = getLanguageInfo(c.emergencyPhrase.lang);

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

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

      {/* Quick facts */}
      <div className="mx-auto max-w-5xl px-5 pt-10">
        <div className="grid grid-cols-2 gap-3 rounded-3xl border border-border bg-card p-5 shadow-soft md:grid-cols-4">
          <Fact icon={MapPin} label="Capital" value={c.capital} />
          <Fact icon={Languages} label="Language" value={c.emergencyPhrase.lang} />
          <Fact icon={Globe2} label="Awareness" value={awareness.label.replace(" celiac awareness", "")} />
          <Fact icon={PhoneCall} label="Emergency" value={lang.emergencyNumber} />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">{awareness.desc}</p>
      </div>

      {/* Main content grid */}
      <div className="mx-auto grid max-w-5xl gap-6 px-5 py-10 md:grid-cols-2">
        <Section icon={Check} title="Generally safer choices" accent="text-emerald-600">
          <ul className="space-y-2">
            {c.safe.map((s) => (
              <li key={s} className="flex gap-2 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> {s}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={X} title="Avoid or verify carefully" accent="text-rose-500">
          <ul className="space-y-2">
            {c.avoid.map((s) => (
              <li key={s} className="flex gap-2 text-sm">
                <X className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" /> {s}
              </li>
            ))}
          </ul>
        </Section>

        {/* Free preview ends here. Paid sections below. */}
      </div>

      <div className="mx-auto max-w-5xl px-5">
        <PaywallGate
          title={`Unlock the full ${c.name} guide`}
          description={`You're seeing the free preview. Upgrade to Traveler to read the complete ${c.name} guide — and every other country — with brands, label words, restaurant phrases, cross-contamination flags, packing checklist and the emergency phrase card.`}
          perks={[
            "Trusted GF brands in supermarkets",
            "Label words in the local language",
            "Restaurant phrases & cross-contamination flags",
            "Emergency phrase card + packing checklist",
          ]}
        >
        <div className="grid gap-6 md:grid-cols-2 pb-6">
        <Section icon={ShoppingBag} title="Trusted GF brands in stores" accent="text-primary">
          <ul className="grid grid-cols-2 gap-2">
            {c.brands.map((b) => (
              <li key={b} className="rounded-xl bg-muted px-3 py-2 text-sm font-medium">{b}</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-muted-foreground">
            Look for these in the free-from / "sans gluten" / "glutenvrij" aisle, or in the diabetic / health section.
          </p>
        </Section>

        <Section icon={Lightbulb} title="Celiac travel tips" accent="text-amber-500">
          <ul className="space-y-3">
            {c.tips.map((s) => (
              <li key={s} className="flex gap-2 text-sm">
                <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" /> {s}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Label words */}
      <div className="mx-auto max-w-5xl px-5">
        <Section icon={Tag} title={`Words to scan on food labels (${c.emergencyPhrase.lang})`} accent="text-rose-500">
          <p className="text-sm text-muted-foreground">
            Avoid products listing any of these ingredients:
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {lang.avoidWords.map((w) => (
              <span key={w} className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-3 py-1 text-xs font-medium text-rose-700 ring-1 ring-inset ring-rose-200">
                <X className="h-3 w-3" /> {w}
              </span>
            ))}
          </div>
          <p className="mt-5 text-sm text-muted-foreground">Safe to look for on packaging:</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {lang.gfClaim.map((w) => (
              <span key={w} className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                <Check className="h-3 w-3" /> {w}
              </span>
            ))}
          </div>
        </Section>
      </div>

      {/* Restaurant phrases */}
      <div className="mx-auto max-w-5xl px-5 pt-6">
        <Section icon={MessageSquare} title={`How to order in a restaurant (${c.emergencyPhrase.lang})`} accent="text-primary">
          <div className="space-y-4">
            <Phrase label="Ask if it's gluten-free" text={lang.askGF} />
            <Phrase label="Ask about cross-contamination" text={lang.askCrossContamination} />
            <Phrase label="Say thank you" text={lang.thankYou} />
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Tip: show, don't tell. Generate a printable card and let the kitchen staff read it directly.
          </p>
          <Link to="/cards" className="mt-3 inline-block">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Generate a translation card
            </Button>
          </Link>
        </Section>
      </div>

      {/* Cross-contamination */}
      <div className="mx-auto max-w-5xl px-5 pt-6">
        <Section icon={Flame} title="Cross-contamination red flags" accent="text-rose-500">
          <ul className="grid gap-2 text-sm md:grid-cols-2">
            {[
              "Shared fryers (fries, tempura, calamari)",
              "Same toaster used for regular bread",
              "Shared pasta water or noodle broth",
              "Wooden spoons and rolling pins (porous, retain gluten)",
              "Pizza ovens dusted with semolina",
              "Sauces thickened with wheat flour (roux, gravy, bechamel)",
              "Soy sauce, oyster sauce and many marinades",
              "Buffet utensils swapped between dishes",
              "Bulk bins (cross-contact from scoops)",
              "Flour-dusted boards for cutting fruit or cheese",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rose-500" /> {item}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Travel essentials */}
      <div className="mx-auto max-w-5xl px-5 pt-6">
        <Section icon={Plane} title={`Pack this before flying to ${c.name}`} accent="text-primary">
          <ul className="grid gap-2 text-sm md:grid-cols-2">
            {[
              `Translation card in ${c.emergencyPhrase.lang}`,
              "GF snack bars / crackers for travel days",
              "Travel-size tamari packets (for soy sauce countries)",
              "List of certified restaurants near your hotel",
              `Photo of the ${c.certBody ?? "local celiac association"} logo so you recognise it`,
              "Doctor's note mentioning celiac disease (for customs / pharmacies)",
              "Address of the nearest hospital + emergency number saved offline",
              "Insurance card with celiac listed as a medical condition",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" /> {item}
              </li>
            ))}
          </ul>
        </Section>
      </div>

      {/* Eating out playbook */}
      <div className="mx-auto max-w-5xl px-5 pt-6">
        <Section icon={Utensils} title="Eating-out playbook" accent="text-amber-500">
          <ol className="space-y-3 text-sm">
            <Step n={1} title="Research before you go">
              Check Find Me Gluten Free, the local celiac association's restaurant finder, or our restaurant search for {c.capital}.
            </Step>
            <Step n={2} title="Call ahead for dinner">
              Reserve and mention celiac disease — kitchens that aren't equipped will tell you, and good ones will prep.
            </Step>
            <Step n={3} title="Show your card on arrival">
              Hand it to the waiter before ordering, ideally to the manager or chef.
            </Step>
            <Step n={4} title="Confirm preparation">
              Ask: clean utensils, separate pan, dedicated fryer, no shared sauces, no flour dusting.
            </Step>
            <Step n={5} title="Eat off-peak when possible">
              Lunches and early dinners reduce kitchen pressure and mistakes.
            </Step>
            <Step n={6} title="Keep evidence">
              Photo of menu / packaging. If you react, you can report cross-contact and warn other celiacs in reviews.
            </Step>
          </ol>
        </Section>
      </div>

      {/* Emergency phrase */}
      <div className="mx-auto max-w-5xl px-5 pt-6">
        <div className="rounded-3xl border-2 border-rose-200 bg-rose-50 p-6">
          <div className="flex items-center gap-2 text-rose-700">
            <span className="text-xl">⚠️</span>
            <h3 className="font-display text-lg">Emergency phrase — {c.emergencyPhrase.lang}</h3>
          </div>
          <p className="mt-3 text-pretty text-xl leading-relaxed text-foreground">{c.emergencyPhrase.text}</p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-2.5 py-1">
              <Phone className="h-3 w-3" /> Local emergency: <strong className="text-foreground">{lang.emergencyNumber}</strong>
            </span>
            <span>Show this to the waiter or chef.</span>
          </div>
          <Link to="/cards" className="mt-3 inline-block">
            <Button variant="outline" size="sm" className="gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Generate a full card
            </Button>
          </Link>
        </div>
      </div>

      {/* Restaurant finder CTA */}
      <div className="mx-auto max-w-5xl px-5 py-10">
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
            </div>
          </div>
        </div>
      </div>
        </PaywallGate>
      </div>

      {/* Related countries */}
      <div className="mx-auto max-w-5xl px-5 pb-16">
        <h3 className="font-display text-xl">Other country guides</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {COUNTRIES.filter((x) => x.slug !== c.slug)
            .slice(0, 8)
            .map((n) => (
              <Link
                key={n.slug}
                to="/countries/$slug"
                params={{ slug: n.slug }}
                className="group flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow"
              >
                <span className="text-3xl">{n.flag}</span>
                <div className="min-w-0">
                  <p className="truncate font-medium">{n.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{AWARENESS_META[n.awareness].label}</p>
                </div>
              </Link>
            ))}
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}

function Section({ icon: Icon, title, accent, children }: { icon: React.ElementType; title: string; accent: string; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border bg-card p-6 shadow-soft">
      <h2 className="flex items-center gap-2 font-display text-xl">
        <Icon className={`h-5 w-5 ${accent}`} /> {title}
      </h2>
      <div className="mt-4 text-foreground/90">{children}</div>
    </section>
  );
}

function Fact({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="rounded-xl bg-muted p-2">
        <Icon className="h-4 w-4 text-foreground/70" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function Phrase({ label, text }: { label: string; text: string }) {
  return (
    <div className="rounded-2xl bg-muted/60 p-4">
      <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-1 text-base leading-relaxed text-foreground">{text}</p>
    </div>
  );
}

function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <li className="flex gap-3">
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground">{n}</span>
      <div>
        <p className="font-medium text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{children}</p>
      </div>
    </li>
  );
}
