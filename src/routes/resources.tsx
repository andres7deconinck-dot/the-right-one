import { createFileRoute, Link } from "@tanstack/react-router";
import { ExternalLink, Plane, Luggage, Heart, Lightbulb, Globe2, Shield, FileText, CreditCard, Stethoscope, Info, ChevronRight } from "lucide-react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/resources")({
  head: () => ({
    meta: [
      { title: "Handige Tips & Links voor Coeliakiepatiënten | GlutenGo" },
      { name: "description", content: "Alles wat je moet weten als coeliakiepatiënt op reis: extra bagage rechten, belastingvoordelen, handige websites, verzekeringen en reisTips." },
      { name: "keywords", content: "coeliakie reistips, extra bagage coeliakie, auto-immuunziekte vergoeding, glutenvrij reizen tips, coeliakie rechten vliegtuig" },
      { property: "og:title", content: "Handige Tips & Links voor Coeliakiepatiënten" },
      { property: "og:description", content: "Extra bagage, belastingvoordelen, handige sites en reisTips voor coeliakiepatiënten." },
      { property: "og:url", content: "https://glutengo.app/resources" },
    ],
  }),
  component: ResourcesPage,
});

const USEFUL_SITES = [
  {
    category: "Coeliakie organisaties",
    icon: Heart,
    color: "bg-rose-50 text-rose-600 border-rose-200",
    sites: [
      { name: "Coeliakie België", url: "https://www.coeliakie.be", desc: "Officiële Belgische coeliakie organisatie, productenlijsten, recepten en nieuws." },
      { name: "Nederlandse Coeliakie Vereniging", url: "https://www.glutenvrij.nl", desc: "NCV: erkenning, vergoedingen en reisinfo voor Nederland." },
      { name: "Coeliac UK", url: "https://www.coeliac.org.uk", desc: "Grootste coeliakie organisatie ter wereld. Gratis reiskaarten downloadbaar." },
      { name: "Celiac Disease Foundation", url: "https://celiac.org", desc: "Wetenschappelijke updates, dieetadvies en reisbronnen." },
      { name: "Association of European Coeliac Societies", url: "https://aoecs.eu", desc: "AOECS coördineert het Europese licentiesysteem voor glutenvrije producten." },
    ],
  },
  {
    category: "Reis & eten",
    icon: Globe2,
    color: "bg-blue-50 text-blue-600 border-blue-200",
    sites: [
      { name: "Find Me Gluten Free", url: "https://www.findmeglutenfree.com", desc: "Gebruikersreviews van glutenvrije restaurants wereldwijd." },
      { name: "Gluten Free Passport", url: "https://glutenfreepassport.com", desc: "Reiskaarten en fiches per land in meerdere talen." },
      { name: "Triumph Dining", url: "https://www.triumphdining.com", desc: "Glutenvrije reiskaarten voor 80+ landen, betaald maar kwalitatief." },
      { name: "iEatOut Gluten Free", url: "https://www.ieatout.com.au", desc: "App en website voor restaurants met glutenvrije opties." },
      { name: "AllergyEats", url: "https://www.allergyeats.com", desc: "VS-gerichte allergiefriendly restaurant zoeker met gebruikersbeoordelingen." },
    ],
  },
  {
    category: "Wetenschap & gezondheid",
    icon: Stethoscope,
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    sites: [
      { name: "Beyond Celiac", url: "https://www.beyondceliac.org", desc: "Wetenschappelijk onderzoek, klinische studies en patiëntenadvocacy." },
      { name: "University of Chicago Celiac Center", url: "https://www.cureceliacdisease.org", desc: "Medisch kenniscentrum met gratis patiëntenbrochures." },
      { name: "Celiac.com", url: "https://www.celiac.com", desc: "Forum, nieuws en productupdates. Een van de oudste bronnen online." },
    ],
  },
];

const BAGGAGE_TIPS = [
  {
    title: "Medisch voedsel = gratis extra bagage",
    icon: Luggage,
    color: "border-emerald-200 bg-emerald-50",
    badge: "Luchtvaart",
    badgeColor: "bg-emerald-100 text-emerald-700",
    content: `Veel luchtvaartmaatschappijen staan toe dat je glutenvrij voedsel meeneemt als medische noodzaak, bovenop de normale bagagelimieten. Vraag dit aan bij het inchecken of via de klantenservice van de luchtvaartmaatschappij.

Bewijs dat helpt: een doktersattest of diagnosebrief van je arts (bij voorkeur in het Engels), samen met de AOECS glutenvrij licentienummers van je producten.`,
    airlines: [
      { name: "Brussels Airlines", note: "Vraag 'medical meal' bij boeking + melding bij check-in." },
      { name: "Lufthansa", note: "Glutenvrije maaltijd gratis bestellen, extra medisch voedsel in handbagage toegestaan met attest." },
      { name: "KLM", note: "Special Meals optie 'Gluten Intolerant Meal' (GFML) bij boeking." },
      { name: "Ryanair / EasyJet", note: "Geen speciale maaltijden, maar eigen eten aan boord altijd toegestaan." },
    ],
  },
  {
    title: "Belastingvoordeel op glutenvrije producten",
    icon: CreditCard,
    color: "border-blue-200 bg-blue-50",
    badge: "Financieel",
    badgeColor: "bg-blue-100 text-blue-700",
    content: `In België en Nederland kun je een deel van de meerkosten van glutenvrije producten recupereren via de belastingen, op voorwaarde dat je een officiële coeliakie-diagnose hebt.

In België gaat dit via de FOD Financiën als buitengewone beroepskosten of ziekte-uitgaven, via de aangifte personenbelasting.

In Nederland is er een specifieke zorgkosten-aftrek via de belastingaangifte. De NCV publiceert jaarlijks de geldende meerkosten-bedragen.`,
    links: [
      { name: "NCV: Belastinginfo", url: "https://www.glutenvrij.nl/belasting" },
      { name: "FOD Financiën België", url: "https://financien.belgium.be" },
    ],
  },
  {
    title: "Verzekering voor coeliakie op reis",
    icon: Shield,
    color: "border-amber-200 bg-amber-50",
    badge: "Verzekering",
    badgeColor: "bg-amber-100 text-amber-700",
    content: `Standaard reisverzekeringen dekken niet altijd coeliakie-gerelateerde incidenten. Vraag altijd expliciet of je gedekt bent voor ziekenhuisopname door glutenbesmetting in het buitenland, annulering door medische complicaties en repatriëring.

Meld coeliakie altijd bij het afsluiten van een verzekering. Verzekeraars die hier goed mee omgaan zijn onder meer Europ Assistance, Allianz Travel en AXA Travel.`,
    links: [],
  },
  {
    title: "Medisch attest: altijd meenemen",
    icon: FileText,
    color: "border-purple-200 bg-purple-50",
    badge: "Document",
    badgeColor: "bg-purple-100 text-purple-700",
    content: `Een doktersattest in het Engels (en liefst ook in de lokale taal) is je beste reisdocument. Het helpt bij toegang tot speciale vliegtuigmaaltijden, extra bagageruimte voor medisch voedsel, douane bij grote hoeveelheden glutenvrij voedsel en medische hulp in het buitenland.

Vraag je huisarts om een brief met je diagnose, de datum, de ernst van de aandoening (coeliakie is een auto-immuunziekte) en een bevestiging dat een glutenvrij dieet medisch noodzakelijk is.`,
    links: [],
  },
];

const QUICK_TIPS = [
  {
    emoji: "✈️",
    title: "Bestel altijd een speciale maaltijd",
    text: "Bij de meeste luchtvaartmaatschappijen kun je 24-72u voor vertrek een GFML (Gluten Free Meal) bestellen via je boeking. Gratis, en veiliger dan de standaardmaaltijd.",
  },
  {
    emoji: "🏨",
    title: "Bel je hotel altijd op voorhand",
    text: "Bel liever dan mail. Vraag expliciet of het ontbijt glutenvrij kan, en of er een aparte broodrooster of werkoppervlak is. Bevestig de dag voor aankomst.",
  },
  {
    emoji: "🛒",
    title: "Zoek een lokale supermarkt op dag 1",
    text: "Vind direct bij aankomst de dichtstbijzijnde supermarkt en sla glutenvrije basisproducten in. Rijstwafels, fruit, noten en yoghurt redden menige noodsituatie.",
  },
  {
    emoji: "📱",
    title: "Download offline kaarten",
    text: "Download Google Maps offline voor je bestemming. Zoek op 'gluten free' of 'coeliac' in de stad, veel restaurants taggen zichzelf. Geen wifi nodig.",
  },
  {
    emoji: "🌿",
    title: "Landen met van nature glutenvrije keukens",
    text: "Japan (rijst, vis), Mexico (maïstortillas), India (rijst, linzen, dal), Thailand (rijst, noodles met tamari) en Ethiopië (teff-injera) zijn van nature veelal glutenvrij. Vraag wel altijd naar sojasaus en marinades.",
  },
  {
    emoji: "🚨",
    title: "Stel een noodplan op",
    text: "Ken het dichtstbijzijnde ziekenhuis, weet hoe je 'allergische reactie' zegt in de lokale taal, en heb altijd een noodsnack bij. GlutenGo's Emergency Phrases helpen je het juiste te zeggen.",
  },
  {
    emoji: "🍷",
    title: "Alcohol en bier: let op",
    text: "Wijn en sterke drank (whisky, vodka op aardappel) zijn vaak veilig. Gewoon bier bevat gluten. Kies glutenvrij bier of cider. Sommige amandellikeur en speciale dranken kunnen ook problematisch zijn.",
  },
  {
    emoji: "💊",
    title: "Neem je eigen enzymen mee",
    text: "Gluten-digestieve enzymen (zoals GluteGuard of AN-PEP-enzymen) beschermen niet volledig, maar kunnen bij kleine besmettingen helpen als back-up. Raadpleeg eerst je arts.",
  },
  {
    emoji: "🌐",
    title: "Leer de lokale taal voor 'tarwe'",
    text: "Tarwe heet: wheat (EN), blé (FR), Weizen (DE), grano/frumento (IT), trigo (ES/PT), コムギ komugi (JA), ข้าวสาลี khao sali (TH). Ken het woord, dan kun je menukaarten zelf lezen.",
  },
  {
    emoji: "📋",
    title: "Eetdagboek bijhouden op reis",
    text: "Noteer wat je gegeten hebt en waar. Bij een reactie kun je zo veel sneller achterhalen wat de oorzaak was, handig voor jezelf en voor je arts.",
  },
];

const DID_YOU_KNOW = [
  { fact: "1 op 100 mensen heeft coeliakie, maar slechts 1 op 4 is officieel gediagnosticeerd.", source: "Beyond Celiac" },
  { fact: "Het glutenvrije markt was in 2023 wereldwijd meer dan €6 miljard waard, en groeit jaarlijks 9%.", source: "Statista" },
  { fact: "Finse en Italiaanse kinderen hebben de hoogste coeliakie-prevalentie ter wereld.", source: "European Journal of Gastroenterology" },
  { fact: "Een glutenvrij dieet moet levenslang gevolgd worden. Ook bij geen symptomen herstelt de darmvlokken pas na 1-2 jaar.", source: "Celiac Disease Foundation" },
  { fact: "Havermout is van nature glutenvrij, maar wordt bijna altijd besmet tijdens de oogst of verwerking. Kies altijd gecertificeerde GF-haver.", source: "Coeliakie België" },
  { fact: "In Italië krijgt elke officieel gediagnosticeerde coeliakiepatiënt een maandelijkse vergoeding van de staat voor glutenvrije voedingsproducten.", source: "Italian Ministry of Health" },
  { fact: "Veel vliegmaatschappijen serveren glutenvrije speciale maaltijden vóór andere passagiers, zodat je er zeker van bent dat het juiste bord bij jou terechtkomt.", source: "Coeliac UK" },
  { fact: "Coeliakie is de enige auto-immuunziekte waarbij de omgevingstrigger (gluten) volledig bekend én vermijdbaar is.", source: "NIH" },
];

function ResourcesPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Hero */}
      <section className="bg-hero">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Lightbulb className="h-3.5 w-3.5 text-accent" /> Handige informatie
          </span>
          <h1 className="mt-5 font-display text-5xl leading-tight md:text-6xl">
            Alles wat je moet weten
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            Handige websites, reisrechten, belastingvoordelen, tips en weetjes voor coeliakiepatiënten die reizen.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-5xl px-5 py-16 space-y-20">

        {/* Quick tips grid */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary/10 text-primary"><Lightbulb className="h-5 w-5" /></span>
            <div>
              <h2 className="font-display text-3xl">Reiswetjes & tips</h2>
              <p className="text-sm text-muted-foreground">Praktische kennis voor onderweg</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {QUICK_TIPS.map((tip) => (
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

        {/* Rechten, bagage & vergoedingen */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-100 text-emerald-700"><Shield className="h-5 w-5" /></span>
            <div>
              <h2 className="font-display text-3xl">Rechten & vergoedingen</h2>
              <p className="text-sm text-muted-foreground">Extra bagage, belastingvoordelen en verzekering</p>
            </div>
          </div>
          <div className="space-y-5">
            {BAGGAGE_TIPS.map((item) => {
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
                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed whitespace-pre-line text-foreground/80">
                    {item.content}
                  </p>
                  {"airlines" in item && item.airlines && (
                    <div className="mt-4 grid gap-2 sm:grid-cols-2">
                      {item.airlines.map((a) => (
                        <div key={a.name} className="rounded-xl bg-white/50 px-4 py-2.5 text-sm">
                          <p className="font-medium">{a.name}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{a.note}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {"links" in item && item.links && item.links.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.links.map((l) => (
                        <a
                          key={l.name}
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full border border-current/20 bg-white/60 px-4 py-1.5 text-xs font-medium hover:bg-white/80 transition-colors"
                        >
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

        {/* Handige websites */}
        <section>
          <div className="flex items-center gap-3 mb-8">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-100 text-blue-700"><Globe2 className="h-5 w-5" /></span>
            <div>
              <h2 className="font-display text-3xl">Handige websites</h2>
              <p className="text-sm text-muted-foreground">Betrouwbare bronnen voor coeliakie en glutenvrij reizen</p>
            </div>
          </div>
          <div className="space-y-8">
            {USEFUL_SITES.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <div key={cat.category}>
                  <div className={`mb-4 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${cat.color}`}>
                    <CatIcon className="h-4 w-4" />
                    {cat.category}
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
              <h2 className="font-display text-3xl">Wist je dat…</h2>
              <p className="text-sm text-muted-foreground">Interessante feiten over coeliakie en glutenvrij leven</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {DID_YOU_KNOW.map((item, i) => (
              <div key={i} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-start gap-3">
                  <span className="font-display text-3xl text-primary/30 leading-none">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <p className="text-sm leading-relaxed">{item.fact}</p>
                    <p className="mt-2 text-xs text-muted-foreground">Bron: {item.source}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-10 text-center">
          <Plane className="mx-auto h-10 w-10 text-primary" />
          <h2 className="mt-4 font-display text-3xl">Klaar voor je reis?</h2>
          <p className="mt-3 text-muted-foreground max-w-md mx-auto">
            Genereer je glutenvrij vertaalkaart, zoek restaurants en bekijk onze landengidsen, alles in één app.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/cards">
              <Button size="lg" className="rounded-full px-7">
                <CreditCard className="mr-2 h-4 w-4" /> Maak een vertaalkaart
              </Button>
            </Link>
            <Link to="/countries">
              <Button size="lg" variant="outline" className="rounded-full px-7">
                Landengidsen bekijken <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>

      </div>

      <SiteFooter />
    </div>
  );
}
