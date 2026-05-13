import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Plane, Luggage, Heart, Lightbulb, Globe2, Shield, FileText, CreditCard, Stethoscope, Info, ChevronRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/i18n";
import { RESOURCES_TR } from "@/lib/resourcesTranslations";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Celiac Rights & Travel Resources | GlutenGo" },
      { name: "description", content: "Celiac rights worldwide: free extra baggage, tax deductions in 8 countries, travel insurance tips, must-have doctor's certificate. Plus tips and trusted websites." },
      { name: "keywords", content: "celiac rights travel, gluten-free extra baggage, celiac tax deduction, celiac travel insurance, celiac doctor certificate, gluten-free travel tips worldwide" },
      { property: "og:title", content: "Celiac Rights & Travel Resources — Worldwide" },
      { property: "og:description", content: "Free baggage, tax benefits, insurance and travel tips for celiac patients worldwide." },
      { property: "og:url", content: "https://glutengo.app/resources" },
    ],
  }),
  component: ResourcesPage,
});

const USEFUL_SITES = [
  {
    catKey: "orgs" as const,
    icon: Heart,
    color: "bg-rose-50 text-rose-600 border-rose-200",
    sites: [
      { name: "Coeliac UK", url: "https://www.coeliac.org.uk", desc: "World's largest celiac organisation. Free travel cards downloadable in multiple languages." },
      { name: "Celiac Disease Foundation", url: "https://celiac.org", desc: "Science-based updates, diet advice and global travel resources." },
      { name: "AOECS", url: "https://aoecs.eu", desc: "Association of European Coeliac Societies — coordinates the EU gluten-free licensing system." },
      { name: "Coeliakie België", url: "https://www.coeliakie.be", desc: "Official Belgian celiac association — product lists, recipes and news." },
      { name: "Nederlandse Coeliakie Vereniging", url: "https://www.glutenvrij.nl", desc: "NCV (Netherlands): certification, reimbursements and travel info." },
    ],
  },
  {
    catKey: "travel" as const,
    icon: Globe2,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    sites: [
      { name: "Find Me Gluten Free", url: "https://www.findmeglutenfree.com", desc: "User reviews of gluten-free restaurants worldwide." },
      { name: "Gluten Free Passport", url: "https://glutenfreepassport.com", desc: "Travel cards and country sheets in multiple languages." },
      { name: "Triumph Dining", url: "https://www.triumphdining.com", desc: "Gluten-free dining cards for 80+ countries, paid but high quality." },
      { name: "iEatOut Gluten Free", url: "https://www.ieatout.com.au", desc: "App and website for restaurants with gluten-free options." },
      { name: "AllergyEats", url: "https://www.allergyeats.com", desc: "US-focused allergy-friendly restaurant finder with user ratings." },
    ],
  },
  {
    catKey: "science" as const,
    icon: Stethoscope,
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    sites: [
      { name: "Beyond Celiac", url: "https://www.beyondceliac.org", desc: "Scientific research, clinical trials and patient advocacy." },
      { name: "University of Chicago Celiac Center", url: "https://www.cureceliacdisease.org", desc: "Medical knowledge centre with free patient brochures." },
      { name: "Celiac.com", url: "https://www.celiac.com", desc: "Forum, news and product updates — one of the oldest online sources." },
    ],
  },
];

const AIRLINES = [
  { name: "Emirates / Qatar Airways", note: "Medical meals on request. Extra medical food in hand luggage allowed with certificate." },
  { name: "British Airways / Virgin Atlantic", note: "Order GFML (Gluten Free Meal) when booking. Extra medical food allowed with certificate." },
  { name: "Lufthansa / Air France / KLM", note: "GFML bookable at reservation. Extra medical food with medical certificate." },
  { name: "United / Delta / American", note: "Request gluten-free meal option when booking. Policies vary by route." },
  { name: "Singapore Airlines / Cathay Pacific", note: "Gluten-free meal available on long-haul. Pre-order required." },
  { name: "Ryanair / EasyJet", note: "No special meals, but bringing own food on board is always allowed." },
];

const DID_YOU_KNOW = [
  { fact: "1 in 100 people has celiac disease, but only 1 in 4 is officially diagnosed.", source: "Beyond Celiac" },
  { fact: "The global gluten-free market was worth over €6 billion in 2023 and is growing 9% per year.", source: "Statista" },
  { fact: "Finnish and Italian children have the highest celiac disease prevalence in the world.", source: "European Journal of Gastroenterology" },
  { fact: "A gluten-free diet must be followed for life. Even without symptoms, intestinal villi only recover after 1–2 years.", source: "Celiac Disease Foundation" },
  { fact: "Oats are naturally gluten-free but are almost always contaminated during harvest or processing. Always choose certified GF oats.", source: "Coeliac UK" },
  { fact: "In Italy every officially diagnosed celiac patient receives a monthly state reimbursement for gluten-free food.", source: "Italian Ministry of Health" },
  { fact: "Many airlines serve gluten-free special meals before other passengers, to ensure the right tray reaches the right person.", source: "Coeliac UK" },
  { fact: "Celiac disease is the only autoimmune disease where the environmental trigger (gluten) is fully known and avoidable.", source: "NIH" },
];

function ResourcesPage() {
  const { lang } = useLanguage();
  const tr = RESOURCES_TR[lang] ?? RESOURCES_TR.en;

  const RIGHTS = [
    {
      title: tr.baggageTitle,
      icon: Luggage,
      color: "border-emerald-200 bg-emerald-50",
      badge: tr.baggageBadge,
      badgeColor: "bg-emerald-100 text-emerald-700",
      content: tr.baggageContent,
      airlines: AIRLINES,
    },
    {
      title: tr.taxTitle,
      icon: CreditCard,
      color: "border-blue-200 bg-blue-50",
      badge: tr.taxBadge,
      badgeColor: "bg-blue-100 text-blue-700",
      content: tr.taxContent,
    },
    {
      title: tr.insuranceTitle,
      icon: Shield,
      color: "border-amber-200 bg-amber-50",
      badge: tr.insuranceBadge,
      badgeColor: "bg-amber-100 text-amber-700",
      content: tr.insuranceContent,
    },
    {
      title: tr.certTitle,
      icon: FileText,
      color: "border-purple-200 bg-purple-50",
      badge: tr.certBadge,
      badgeColor: "bg-purple-100 text-purple-700",
      content: tr.certContent,
    },
  ];

  const catLabels: Record<string, string> = {
    orgs: tr.sitesCatOrgs,
    travel: tr.sitesCatTravel,
    science: tr.sitesCatScience,
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-hero">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Lightbulb className="h-3.5 w-3.5 text-accent" /> {tr.heroBadge}
          </span>
          <h1 className="mt-5 font-display text-5xl leading-tight md:text-6xl">{tr.heroTitle}</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">{tr.heroSubtitle}</p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-16 space-y-20">

        {/* Quick tips grid */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary"><Lightbulb className="h-5 w-5" /></span>
            <div>
              <h2 className="font-display text-3xl">{tr.sectionTips}</h2>
              <p className="text-sm text-muted-foreground">{tr.sectionTipsSub}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {tr.tips.map((tip) => (
              <div key={tip.title} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start gap-3">
                  <div>
                    <p className="font-semibold text-sm">{tip.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{tip.text}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Rechten, bagage & vergoedingen */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><Shield className="h-5 w-5" /></span>
            <div>
              <h2 className="font-display text-3xl">{tr.sectionRights}</h2>
              <p className="text-sm text-muted-foreground">{tr.sectionRightsSub}</p>
            </div>
          </div>
          <div className="space-y-5">
            {RIGHTS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className={`rounded-3xl border p-6 ${item.color}`}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl bg-white/60">
                        <Icon className="h-5 w-5" />
                      </span>
                      <h3 className="font-display text-xl">{item.title}</h3>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${item.badgeColor}`}>{item.badge}</span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-foreground/80">{item.content}</p>
                  {"airlines" in item && item.airlines && (
                    <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {item.airlines.map((a) => (
                        <div key={a.name} className="rounded-xl bg-white/50 px-4 py-2.5 text-sm">
                          <p className="font-medium">{a.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{a.note}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Handige websites */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-100 text-blue-700"><Globe2 className="h-5 w-5" /></span>
            <div>
              <h2 className="font-display text-3xl">{tr.sectionSites}</h2>
              <p className="text-sm text-muted-foreground">{tr.sectionSitesSub}</p>
            </div>
          </div>
          <div className="space-y-8">
            {USEFUL_SITES.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <div key={cat.catKey}>
                  <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${cat.color}`}>
                    <CatIcon className="h-4 w-4" />
                    {catLabels[cat.catKey]}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {cat.sites.map((site) => (
                      <a
                        key={site.name}
                        href={site.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group rounded-2xl border border-border bg-card p-4 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow hover:border-primary/30"
                      >
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

        {/* Weetjes */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-amber-100 text-amber-700"><Info className="h-5 w-5" /></span>
            <div>
              <h2 className="font-display text-3xl">{tr.sectionFacts}</h2>
              <p className="text-sm text-muted-foreground">{tr.sectionFactsSub}</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {DID_YOU_KNOW.map((item, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start gap-3">
                  <span className="font-display text-3xl text-primary/30 leading-none">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-sm leading-relaxed">{item.fact}</p>
                    <p className="mt-2 text-xs text-muted-foreground">{tr.factsSource}: {item.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-10 text-center">
          <Plane className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 font-display text-3xl">{tr.ctaTitle}</h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">{tr.ctaSub}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/cards">
              <Button size="lg" className="rounded-full px-7">
                <CreditCard className="mr-2 h-4 w-4" /> {tr.ctaPrimary}
              </Button>
            </Link>
            <Link to="/countries">
              <Button size="lg" variant="outline" className="rounded-full px-7">
                {tr.ctaSecondary} <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

      </div>

      <SiteFooter />
    </div>
  );
}
