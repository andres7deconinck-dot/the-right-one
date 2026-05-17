import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Wheat, Globe2, MessagesSquare, Map, Shield, Sparkles, Star, CreditCard, ScanLine, Lock, Zap, CheckCircle2, XCircle, AlertTriangle, Loader2, ChevronRight } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import heroImg from "@/assets/hero.jpg";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { COUNTRIES } from "@/data/countries";
import { useLanguage } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GlutenGo: Gluten-Free Travel App for Celiac Travelers" },
      { name: "description", content: "Find gluten-free restaurants in any city, generate celiac translation cards in 30+ languages, and explore country guides. The #1 travel app for celiacs." },
      { name: "keywords", content: "gluten-free travel app, celiac disease travel, gluten-free restaurants worldwide, celiac translation card, coeliac travel toolkit" },
      { property: "og:title", content: "GlutenGo: Gluten-Free Travel App for Celiac Travelers" },
      { property: "og:description", content: "Find gluten-free restaurants in any city, generate celiac translation cards in 30+ languages, and explore country guides. Free to start." },
      { property: "og:url", content: "https://glutengo.app/" },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

function Landing() {
  const { t } = useLanguage();

  const featureIcons = [
    { icon: CreditCard, to: "/cards" },
    { icon: Map, to: "/countries" },
    { icon: MessagesSquare, to: "/assistant" },
    { icon: Shield, to: "/travel-mode" },
    { icon: ScanLine, to: "/ingredient-analyzer" },
    { icon: Globe2, to: "/emergency" },
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> {t.hero.badge}
            </span>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] tracking-tight text-foreground text-balance md:text-7xl">
              {t.hero.titleLine1} <em className="not-italic text-primary">{t.hero.titleHighlight}</em>{t.hero.titleLine2}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground text-pretty">
              {t.hero.subtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth" search={{} as any}><Button size="lg" className="rounded-full px-7 shadow-elegant">{t.hero.ctaPrimary} <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              <Link to="/countries"><Button size="lg" variant="outline" className="rounded-full px-7">{t.hero.ctaSecondary}</Button></Link>
            </div>
            <div className="mt-8 flex items-center gap-5 text-xs text-muted-foreground">
              <div className="flex -space-x-2">
                {["bg-primary","bg-accent","bg-success","bg-primary-soft"].map((c,i)=>(
                  <span key={i} className={`h-7 w-7 rounded-full border-2 border-background ${c}`}/>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-medium text-foreground">4.9</span> {t.hero.rating}
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-accent/10 blur-2xl" />
            <img src={heroImg} alt="Person enjoying a gluten-free meal at a Mediterranean cafe" width={1600} height={1200} className="relative aspect-[4/3] w-full rounded-[2rem] object-cover shadow-elegant" />
            <div className="absolute -bottom-6 -left-6 hidden w-72 rounded-2xl bg-card p-4 shadow-glow md:block">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-success/15 text-success"><Shield className="h-5 w-5" /></span>
                <div>
                  <p className="text-xs text-muted-foreground">Allergy Card · Italian</p>
                  <p className="text-sm font-medium">Sono celiaco/a, preparare separatamente</p>
                </div>
              </div>
            </div>
            <div className="absolute -right-4 top-8 hidden w-56 animate-float rounded-2xl bg-card p-4 shadow-glow md:block">
              <p className="text-xs text-muted-foreground">Tokyo · Safe to eat</p>
              <p className="mt-1 text-sm font-medium">Sashimi with tamari ✓</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl tracking-tight md:text-5xl">{t.features.title}</h2>
          <p className="mt-4 text-muted-foreground">{t.features.subtitle}</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {t.features.items.map((f, i) => {
            const meta = featureIcons[i];
            return (
              <Link key={f.title} to={meta.to} className="group rounded-3xl border border-border/60 bg-card-soft p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow hover:border-primary/30">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <meta.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 font-display text-xl">{f.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  {t.common.openFeature} <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-cream/50 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="font-display text-center text-4xl md:text-5xl">{t.howItWorks.title}</h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {t.howItWorks.steps.map((s, i) => (
              <div key={i} className="rounded-3xl bg-card p-8 shadow-soft">
                <span className="font-display text-5xl text-primary/40">0{i + 1}</span>
                <h3 className="mt-3 font-display text-2xl">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Teasers */}
      <FeatureTeasers />

      {/* Resources highlight */}
      <ResourcesHighlight />

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <h2 className="text-center font-display text-4xl md:text-5xl">{t.testimonials.title}</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { q: "Tokyo without GlutenGo would have been impossible. The Japanese card got me a completely separate kitchen.", a: "Sara, diagnosed celiac" },
            { q: "Italy felt manageable for the first time. I used the AI assistant in Naples and it flagged a hidden risk I never would have noticed.", a: "Marco, celiac since age 12" },
            { q: "Finally an app that takes this seriously. The tone is calm, clear and never condescending.", a: "Lena, family of 4" },
          ].map((t) => (
            <figure key={t.a} className="rounded-3xl border border-border/60 bg-card p-6 shadow-soft">
              <div className="flex gap-1 text-accent">{Array.from({length:5}).map((_,i)=><Star key={i} className="h-4 w-4 fill-current" />)}</div>
              <blockquote className="mt-4 text-pretty text-foreground">"{t.q}"</blockquote>
              <figcaption className="mt-4 text-xs text-muted-foreground">{t.a}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="bg-forest text-primary-foreground" style={{background: "var(--forest)"}}>
        <div className="mx-auto max-w-5xl px-5 py-20 text-center">
          <Wheat className="mx-auto h-10 w-10 opacity-80" />
          <h2 className="mt-4 font-display text-4xl md:text-5xl">{t.pricing.title}</h2>
          <p className="mx-auto mt-4 max-w-xl opacity-80">{t.pricing.subtitle}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/pricing"><Button size="lg" variant="secondary" className="rounded-full px-7">{t.pricing.seePlans}</Button></Link>
            <Link to="/auth" search={{} as any}><Button size="lg" className="rounded-full bg-accent px-7 text-accent-foreground hover:opacity-90">{t.pricing.createAccount}</Button></Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-20">
        <h2 className="text-center font-display text-4xl md:text-5xl">{t.faq.title}</h2>
        <Accordion type="single" collapsible className="mt-10">
          {[
            { q: "Is GlutenGo medical advice?", a: "No. GlutenGo provides translation tools and travel guides for information purposes only. Always confirm preparation with restaurant staff. When in doubt, do not eat it." },
            { q: "Which languages are supported for translation cards?", a: "English, French, Spanish, Italian, German, Japanese, Thai, Dutch, Portuguese, Greek, Turkish, Polish, Korean, Chinese (Simplified), Arabic and Hindi. New languages are added regularly." },
            { q: "Does it work offline?", a: "Yes. On the Traveler and Family plans you can save translation cards and country guides for offline use. Perfect for destinations with limited connectivity." },
            { q: "Can I cancel anytime?", a: "Yes. Cancel from your account settings at any time. You keep full access until the end of your paid period." },
            { q: "How accurate are the translations?", a: "We use a medically tuned system specifically built for celiac disease and gluten intolerance, with phonetic guides for languages like Japanese and Thai. For critical trips we recommend having a native speaker review the card as well." },
            { q: "What if I am intolerant and not celiac?", a: "When you create your account you can specify whether you have celiac disease, intolerance or an allergy. Translation cards and warnings adapt to your severity level." },
            { q: "Is there a free plan?", a: "GlutenGo is free forever with 3 translation cards per month. The Traveler plan includes a 30-day money-back guarantee." },
            { q: "How does the Family plan work?", a: "The Family plan supports up to 5 user profiles. Each person has their own allergy profile, translation cards and saved restaurants. You can plan trips together and share checklists." },
          ].map((f, i) => (
            <AccordionItem value={`i${i}`} key={i}>
              <AccordionTrigger className="text-left font-medium">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* Reddit community */}
      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="relative overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 via-rose-50 to-amber-50 p-8 md:p-12">
          <div className="relative flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-[#FF4500] shadow-lg">
              <svg viewBox="0 0 20 20" className="h-11 w-11 fill-white" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 5.522 4.477 10 10 10s10-4.478 10-10zm-2.647-1.273a1.44 1.44 0 00-1.44 1.44c0 .19.038.372.105.537a8.252 8.252 0 01-4.787-1.576l.862-4.058 2.82.593a1.022 1.022 0 101.02-1.101 1.022 1.022 0 00-.969.7l-3.138-.66-.984 4.632a8.267 8.267 0 01-4.794 1.59 1.44 1.44 0 10.159 2.868c.188 0 .367-.037.532-.104.312 1.887 2.354 3.312 4.761 3.312 2.408 0 4.45-1.425 4.762-3.312.165.067.344.104.532.104a1.44 1.44 0 000-2.88 1.44 1.44 0 00-1.441 1.44c0 .003 0 .006.001.01-.313.957-1.586 1.662-3.094 1.662-1.508 0-2.781-.705-3.093-1.663l.001-.01a1.44 1.44 0 00-1.44-1.44 1.44 1.44 0 00-.159 2.869 8.267 8.267 0 004.794 1.59 8.252 8.252 0 004.787-1.576 1.44 1.44 0 001.44-1.44z"/>
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-orange-600">Community</p>
              <h2 className="mt-1 font-display text-3xl md:text-4xl">Join us on Reddit</h2>
              <p className="mt-2 max-w-lg text-muted-foreground">
                Share your gluten-free travel experiences, ask questions and connect with fellow celiac travelers in the <span className="font-medium text-foreground">r/GlutenGo</span> community.
              </p>
            </div>
            <a
              href="https://www.reddit.com/r/GlutenGo/"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0"
            >
              <Button size="lg" className="rounded-full bg-[#FF4500] px-8 text-white hover:bg-[#e03d00]">
                r/GlutenGo
                <svg viewBox="0 0 20 20" className="ml-2 h-4 w-4 fill-white" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 5.522 4.477 10 10 10s10-4.478 10-10zm-2.647-1.273a1.44 1.44 0 00-1.44 1.44c0 .19.038.372.105.537a8.252 8.252 0 01-4.787-1.576l.862-4.058 2.82.593a1.022 1.022 0 101.02-1.101 1.022 1.022 0 00-.969.7l-3.138-.66-.984 4.632a8.267 8.267 0 01-4.794 1.59 1.44 1.44 0 10.159 2.868c.188 0 .367-.037.532-.104.312 1.887 2.354 3.312 4.761 3.312 2.408 0 4.45-1.425 4.762-3.312.165.067.344.104.532.104a1.44 1.44 0 000-2.88 1.44 1.44 0 00-1.441 1.44c0 .003 0 .006.001.01-.313.957-1.586 1.662-3.094 1.662-1.508 0-2.781-.705-3.093-1.663l.001-.01a1.44 1.44 0 00-1.44-1.44 1.44 1.44 0 00-.159 2.869 8.267 8.267 0 004.794 1.59 8.252 8.252 0 004.787-1.576 1.44 1.44 0 001.44-1.44z"/>
                </svg>
              </Button>
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}

// ─── Resources Highlight ─────────────────────────────────────────────────────

function ResourcesHighlight() {
  const { lang } = useLanguage();
  const c = getResourcesContent(lang);
  const { rights, facts, badge, title, subtitle, seeAll } = c.homeHighlight;

  return (
    <section className="bg-cream/50 py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            <Shield className="h-3.5 w-3.5" /> {badge}
          </span>
          <h2 className="mt-4 font-display text-4xl tracking-tight md:text-5xl">{title}</h2>
          <p className="mt-4 text-muted-foreground text-lg">{subtitle}</p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-3">
          {facts.map((f) => (
            <div key={f.number} className="rounded-2xl border border-border bg-card p-5 text-center shadow-soft">
              <p className="font-display text-4xl text-primary">{f.number}</p>
              <p className="mt-2 text-sm text-muted-foreground">{f.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {rights.map((r) => (
            <div key={r.title} className="rounded-3xl border border-border bg-card p-6 shadow-soft">
              <div className="flex items-start justify-between gap-2">
                <span className="text-3xl">{r.emoji}</span>
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${r.tagColor}`}>{r.tag}</span>
              </div>
              <h3 className="mt-4 font-display text-lg">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{r.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/resources">
            <Button size="lg" variant="outline" className="rounded-full px-8">
              {seeAll}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Teaser data ─────────────────────────────────────────────────────────────

const CARD_PREVIEWS = [
  {
    code: "it", flag: "🇮🇹", name: "Italian",
    card: "Sono celiaco/a. Anche piccole tracce di glutine mi fanno stare male. Vi chiedo di preparare il mio piatto separatamente, con utensili puliti e su superfici non contaminate dal glutine.",
    phonetic: "So-no cheh-LEE-ah-ko. An-keh PEE-ko-leh TRAH-cheh dee gloo-TEE-neh mee FAN-no STAH-reh MAH-leh.",
  },
  {
    code: "ja", flag: "🇯🇵", name: "Japanese",
    card: "私はセリアック病です。小麦・大麦・ライ麦は一切食べられません。少量でも重い症状が出ます。別の鍋と調理器具で、別々に調理してください。",
    phonetic: "Watashi wa seriakku-byō desu. Komugi, ōmugi, raimugi wa issai taberaremasen.",
  },
  {
    code: "es", flag: "🇪🇸", name: "Spanish",
    card: "Soy celíaco/a. Incluso cantidades mínimas de gluten me causan una reacción grave. Por favor, prepare mi plato en una superficie limpia con utensilios separados y sin contaminación cruzada.",
    phonetic: "Soy seh-LEE-ah-ko. In-KLOU-so kan-tee-DAH-des MEE-nee-mas de gloo-TEN me KOW-san una reh-ak-SYON GRA-veh.",
  },
  {
    code: "th", flag: "🇹🇭", name: "Thai",
    card: "ฉันเป็นโรคเซลิแอค แม้กลูเตนเพียงเล็กน้อยก็ทำให้ฉันป่วยหนักมาก กรุณาทำอาหารของฉันแยกต่างหากด้วยอุปกรณ์ที่สะอาด และหลีกเลี่ยงการปนเปื้อน",
    phonetic: "Chăn bpen rôhk celiac. Maeh gluten piang lek nói gôr tam hâi chăn bpùay nàk mâak.",
  },
];

const INGREDIENT_RESULTS = [
  { name: "Wheat flour", status: "danger" as const, reason: "Direct gluten source" },
  { name: "Barley malt extract", status: "danger" as const, reason: "Contains gluten (barley)" },
  { name: "Oat bran", status: "warning" as const, reason: "Often cross-contaminated" },
  { name: "Modified starch", status: "warning" as const, reason: "Source unclear, may be wheat" },
  { name: "Water", status: "safe" as const, reason: "Safe" },
  { name: "Salt", status: "safe" as const, reason: "Safe" },
  { name: "Yeast", status: "safe" as const, reason: "Safe (check if malt-based)" },
  { name: "Sunflower oil", status: "safe" as const, reason: "Safe" },
];

const SAMPLE_INGREDIENTS = "Wheat flour, water, yeast, salt, barley malt extract, sunflower oil, oat bran, modified starch, natural flavors";

const TEASER_COUNTRIES = COUNTRIES.slice(0, 3);

// ─── FeatureTeasers section ───────────────────────────────────────────────────

function FeatureTeasers() {
  const [tab, setTab] = useState(0);
  const { t } = useLanguage();

  const tabs = [
    { icon: CreditCard, label: t.teasers.tabCard },
    { icon: ScanLine, label: t.teasers.tabIngredient },
    { icon: Map, label: t.teasers.tabCountry },
  ];

  return (
    <section className="bg-gradient-to-b from-cream/60 to-background py-24">
      <div className="mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Zap className="h-3.5 w-3.5" /> {t.teasers.badge}
          </span>
          <h2 className="mt-4 font-display text-4xl tracking-tight md:text-5xl">{t.teasers.title}</h2>
          <p className="mt-3 text-muted-foreground">{t.teasers.subtitle}</p>
        </div>

        {/* Tab switcher */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {tabs.map((t, i) => (
            <button
              key={i}
              onClick={() => setTab(i)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${tab === i ? "bg-primary text-primary-foreground shadow-soft" : "border border-border bg-card hover:border-primary/40 hover:bg-muted"}`}
            >
              <t.icon className="h-4 w-4" />
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-10">
          {tab === 0 && <TranslationCardTeaser />}
          {tab === 1 && <IngredientTeaser />}
          {tab === 2 && <CountryGuideTeaser />}
        </div>
      </div>
    </section>
  );
}

// ─── Translation Card Teaser ──────────────────────────────────────────────────

function TranslationCardTeaser() {
  const [selected, setSelected] = useState(0);
  const { t } = useLanguage();
  const card = CARD_PREVIEWS[selected];

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Left: controls */}
      <div className="flex flex-col justify-center gap-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.teasers.pickLanguage}</p>
          <div className="mt-3 grid grid-cols-2 gap-2">
            {CARD_PREVIEWS.map((c, i) => (
              <button
                key={c.code}
                onClick={() => setSelected(i)}
                className={`flex items-center gap-3 rounded-2xl border p-3 text-left transition-all ${selected === i ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-card hover:border-primary/40"}`}
              >
                <span className="text-2xl">{c.flag}</span>
                <span className="text-sm font-medium">{c.name}</span>
                {selected === i && <CheckCircle2 className="ml-auto h-4 w-4 text-primary" />}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">{t.teasers.freePlan}</p>
          <p className="mt-1">{t.teasers.freePlanDesc}</p>
          <Link to="/pricing" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            {t.teasers.seePlans} <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Right: card preview */}
      <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-glow">
        {/* Card header */}
        <div className="border-b border-border bg-primary px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{card.flag}</span>
            <div>
              <p className="text-xs font-medium text-primary-foreground/70">Medical Allergy Card · {card.name}</p>
              <p className="text-sm font-semibold text-primary-foreground">Celiac Disease: Gluten-Free Required</p>
            </div>
          </div>
        </div>

        {/* Card body */}
        <div className="p-6">
          <p className="font-display text-lg leading-relaxed text-foreground">{card.card}</p>
          <div className="mt-4 rounded-xl bg-muted/60 px-4 py-3">
            <p className="text-xs font-semibold text-muted-foreground">Phonetic guide</p>
            <p className="mt-1 text-sm italic text-foreground/80">{card.phonetic}</p>
          </div>

          {/* Blurred locked section */}
          <div className="relative mt-4">
            <div className="select-none blur-sm" aria-hidden="true">
              <div className="mt-2 flex flex-wrap gap-2">
                {["No wheat", "No barley", "No rye", "Separate utensils", "Clean surface", "No shared fryer"].map(t => (
                  <span key={t} className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">{t}</span>
                ))}
              </div>
              <div className="mt-3 rounded-xl bg-muted p-3 text-sm text-muted-foreground">Severity level: Celiac (medical) · Cross-contamination note · QR code link · PDF ready</div>
            </div>
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-card/80 backdrop-blur-[2px]">
              <Lock className="h-6 w-6 text-muted-foreground" />
              <p className="text-center text-sm font-medium">Severity labels, QR code & PDF export</p>
              <Link to="/auth" search={{} as any}>
                <Button size="sm" className="rounded-full px-5">{t.teasers.unlockCard}</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Ingredient Analyzer Teaser ───────────────────────────────────────────────

const VISIBLE = 4;

function IngredientTeaser() {
  const [value, setValue] = useState(SAMPLE_INGREDIENTS);
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t } = useLanguage();

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  const analyze = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setLoading(true);
    setAnalyzed(false);
    timerRef.current = setTimeout(() => { setLoading(false); setAnalyzed(true); }, 1400);
  };

  const statusIcon = (s: "danger" | "warning" | "safe") =>
    s === "danger" ? <XCircle className="h-4 w-4 text-destructive" />
    : s === "warning" ? <AlertTriangle className="h-4 w-4 text-warning" />
    : <CheckCircle2 className="h-4 w-4 text-success" />;

  const statusBg = (s: "danger" | "warning" | "safe") =>
    s === "danger" ? "border-destructive/20 bg-destructive/5"
    : s === "warning" ? "border-warning/20 bg-warning/5"
    : "border-success/20 bg-success/5";

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Left: input */}
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.teasers.pasteIngredients}</p>
          <textarea
            value={value}
            onChange={e => setValue(e.target.value)}
            rows={5}
            className="mt-3 w-full resize-none rounded-2xl border border-border bg-card p-4 text-sm text-foreground outline-none focus:border-primary"
          />
        </div>
        <Button onClick={analyze} disabled={loading || !value.trim()} className="rounded-full" size="lg">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {t.teasers.analyzing}</> : <><ScanLine className="mr-2 h-4 w-4" /> {t.teasers.checkGluten}</>}
        </Button>
        <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm">
          <p className="font-medium text-foreground">{t.teasers.freeIngredient}</p>
          <p className="mt-1 text-muted-foreground">{t.teasers.freeIngredientDesc}</p>
          <Link to="/pricing" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            {t.teasers.comparePlans} <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Right: results */}
      <div className="relative rounded-3xl border border-border bg-card shadow-glow overflow-hidden">
        <div className="border-b border-border px-6 py-4 flex items-center gap-2">
          <ScanLine className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold">Analysis results</span>
          {analyzed && <span className="ml-auto rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-medium text-destructive">{t.teasers.notSafe}</span>}
        </div>
        <div className="p-4 flex flex-col gap-2">
          {!analyzed && !loading && (
            <div className="flex h-48 flex-col items-center justify-center text-center text-muted-foreground">
              <ScanLine className="h-10 w-10 opacity-30" />
              <p className="mt-3 text-sm">Paste ingredients and click "Check for gluten"</p>
            </div>
          )}
          {loading && (
            <div className="flex h-48 flex-col items-center justify-center gap-3 text-muted-foreground">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm">Scanning for gluten & hidden risks…</p>
            </div>
          )}
          {analyzed && (
            <>
              {INGREDIENT_RESULTS.slice(0, VISIBLE).map((r) => (
                <div key={r.name} className={`flex items-center gap-3 rounded-xl border p-3 ${statusBg(r.status)}`}>
                  {statusIcon(r.status)}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.reason}</p>
                  </div>
                </div>
              ))}
              {/* Blurred locked results */}
              <div className="relative">
                <div className="select-none blur-sm pointer-events-none flex flex-col gap-2" aria-hidden="true">
                  {INGREDIENT_RESULTS.slice(VISIBLE).map((r) => (
                    <div key={r.name} className={`flex items-center gap-3 rounded-xl border p-3 ${statusBg(r.status)}`}>
                      {statusIcon(r.status)}
                      <div>
                        <p className="text-sm font-medium">{r.name}</p>
                        <p className="text-xs text-muted-foreground">{r.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card/80 backdrop-blur-[2px]">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <p className="text-xs font-medium text-center">{t.common.lockedContent}</p>
                  <Link to="/auth" search={{} as any}>
                    <Button size="sm" variant="outline" className="rounded-full px-4">{t.teasers.upgradeUnlock}</Button>
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Country Guide Teaser ─────────────────────────────────────────────────────

function CountryGuideTeaser() {
  const [idx, setIdx] = useState(0);
  const { t } = useLanguage();
  const country = TEASER_COUNTRIES[idx];

  const awarenessColor = country.awareness === "high" ? "text-success bg-success/10" : country.awareness === "medium" ? "text-warning bg-warning/10" : "text-destructive bg-destructive/10";
  const awarenessLabel = country.awareness === "high" ? "High celiac awareness" : country.awareness === "medium" ? "Medium awareness" : "Low awareness, extra care needed";

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      {/* Left: country picker */}
      <div className="flex flex-col gap-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.teasers.chooseDestination}</p>
        {TEASER_COUNTRIES.map((c, i) => (
          <button
            key={c.slug}
            onClick={() => setIdx(i)}
            className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition-all ${idx === i ? "border-primary bg-primary/5 shadow-soft" : "border-border bg-card hover:border-primary/40"}`}
          >
            <span className="text-3xl">{c.flag}</span>
            <div>
              <p className="font-semibold">{c.name}</p>
              <p className={`mt-0.5 rounded-full px-2 py-0.5 text-xs font-medium inline-block ${idx === i ? awarenessColor : "text-muted-foreground"}`}>
                {c.awareness} awareness
              </p>
            </div>
          </button>
        ))}
        <div className="rounded-2xl border border-dashed border-primary/30 bg-primary/5 p-4 text-sm">
          <p className="font-medium text-foreground">{t.teasers.previewCountries}</p>
          <p className="mt-1 text-muted-foreground">{t.teasers.previewCountriesDesc}</p>
          <Link to="/pricing" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
            {t.teasers.unlockGuides} <ChevronRight className="h-3 w-3" />
          </Link>
        </div>
      </div>

      {/* Right: guide preview */}
      <div className="rounded-3xl border border-border bg-card shadow-glow overflow-hidden">
        {/* Header */}
        <div className={`bg-gradient-to-r ${country.hero} px-6 py-5`}>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{country.flag}</span>
            <div>
              <h3 className="font-display text-2xl font-semibold">{country.name}</h3>
              <span className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${awarenessColor}`}>
                {awarenessLabel}
              </span>
            </div>
          </div>
          <p className="mt-3 text-sm text-foreground/80 leading-relaxed">{country.intro}</p>
        </div>

        <div className="grid gap-0 divide-y divide-border sm:grid-cols-2 sm:divide-x sm:divide-y-0">
          {/* Safe foods */}
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-success">✓ Generally safe</p>
            <ul className="mt-3 space-y-1.5">
              {country.safe.slice(0, 3).map(s => (
                <li key={s} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-success" />
                  {s}
                </li>
              ))}
            </ul>
          </div>
          {/* Avoid */}
          <div className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-destructive">✗ Usually avoid</p>
            <ul className="mt-3 space-y-1.5">
              {country.avoid.slice(0, 3).map(a => (
                <li key={a} className="flex items-start gap-2 text-sm">
                  <XCircle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destructive" />
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Emergency phrase preview */}
        <div className="border-t border-border px-5 py-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Emergency phrase · {country.emergencyPhrase.lang}</p>
          <p className="mt-2 text-sm leading-relaxed">{country.emergencyPhrase.text}</p>
        </div>

        {/* Blurred: safe brands + tips */}
        <div className="relative border-t border-border">
          <div className="select-none blur-sm pointer-events-none px-5 py-4" aria-hidden="true">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Safe brands · Local tips · Full avoid list · Offline access</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {country.brands.map(b => (
                <span key={b} className="rounded-full border border-border bg-muted px-3 py-1 text-xs">{b}</span>
              ))}
            </div>
            <ul className="mt-3 space-y-1">
              {country.tips.map(t => (
                <li key={t} className="text-xs text-muted-foreground">• {t}</li>
              ))}
            </ul>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-card/80 backdrop-blur-[2px]">
            <Lock className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm font-medium">{t.teasers.unlockFull}</p>
            <Link to="/auth" search={{} as any}>
              <Button size="sm" className="rounded-full px-5">{t.teasers.getFullGuide}</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
