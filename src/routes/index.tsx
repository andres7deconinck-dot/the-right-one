import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Wheat, Globe2, MessagesSquare, Map, Shield, Sparkles, Check, Star } from "lucide-react";
import heroImg from "@/assets/hero.jpg";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GlutenGo — Travel gluten-free without the stress" },
      { name: "description", content: "AI translation cards, safe restaurants, country guides and a travel assistant for celiac and gluten-intolerant travelers." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      {/* Hero */}
      <section className="relative overflow-hidden bg-hero">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 md:grid-cols-2 md:py-24">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/60 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> Built with celiac travelers
            </span>
            <h1 className="mt-5 font-display text-5xl leading-[1.05] tracking-tight text-foreground text-balance md:text-7xl">
              Travel the world <em className="not-italic text-primary">gluten-free</em>, without the stress.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground text-pretty">
              AI-powered travel tools for people with celiac disease and gluten intolerance. Translation cards, safe restaurants, country guides — in your pocket.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/auth"><Button size="lg" className="rounded-full px-7 shadow-elegant">Start traveling safely <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              <Link to="/countries"><Button size="lg" variant="outline" className="rounded-full px-7">Explore country guides</Button></Link>
            </div>
            <div className="mt-8 flex items-center gap-5 text-xs text-muted-foreground">
              <div className="flex -space-x-2">
                {["bg-primary","bg-accent","bg-success","bg-primary-soft"].map((c,i)=>(
                  <span key={i} className={`h-7 w-7 rounded-full border-2 border-background ${c}`}/>
                ))}
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-accent text-accent" />
                <span className="font-medium text-foreground">4.9</span> from 1,200+ celiac travelers
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
                  <p className="text-sm font-medium">Sono celiaco/a — preparare separatamente</p>
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
          <h2 className="font-display text-4xl tracking-tight md:text-5xl">Everything you need to eat safely abroad</h2>
          <p className="mt-4 text-muted-foreground">Four tools that replace a dozen apps, sticky notes and panic-Googling at the table.</p>
        </div>
        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Globe2, title: "Translation Cards", text: "Generate medical-grade allergy cards in 7 languages. Show, share, save offline." },
            { icon: Map, title: "Country Guides", text: "Safe foods, risks, brands, and emergency phrases curated per destination." },
            { icon: MessagesSquare, title: "AI Travel Assistant", text: "Ask anything: 'What can I eat in Tokyo?' Get calm, structured, safety-first answers." },
            { icon: Shield, title: "Restaurant Mode", text: "One tap → fullscreen card for staff. Cross-contamination, severity, thank you." },
          ].map((f) => (
            <div key={f.title} className="group rounded-3xl border border-border/60 bg-card-soft p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-glow">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <f.icon className="h-6 w-6" />
              </span>
              <h3 className="mt-5 font-display text-xl">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-cream/50 py-20">
        <div className="mx-auto max-w-7xl px-5">
          <h2 className="font-display text-center text-4xl md:text-5xl">How it works</h2>
          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              { n: "01", t: "Pick your destination", d: "Browse country-specific guides written for celiac travelers, not tourists." },
              { n: "02", t: "Generate your cards", d: "Tap the language. Our AI writes a calm, accurate medical card you can show staff." },
              { n: "03", t: "Travel with confidence", d: "Offline access, AI assistant, and emergency phrases — always one tap away." },
            ].map((s) => (
              <div key={s.n} className="rounded-3xl bg-card p-8 shadow-soft">
                <span className="font-display text-5xl text-primary/40">{s.n}</span>
                <h3 className="mt-3 font-display text-2xl">{s.t}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-5 py-20">
        <h2 className="text-center font-display text-4xl md:text-5xl">Loved by travelers who can't afford mistakes</h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            { q: "Tokyo without GlutenGo would've been impossible. The Japanese card actually got me a separate kitchen.", a: "Sara · Diagnosed celiac" },
            { q: "Italy felt easy — but I used the assistant in Naples and it caught a hidden risk in fritto misto.", a: "Marco · Celiac since 12" },
            { q: "Finally one app that takes us seriously. The tone is calm, not gimmicky.", a: "Lena · Family of 4" },
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
          <h2 className="mt-4 font-display text-4xl md:text-5xl">Start free. Upgrade when you fly.</h2>
          <p className="mx-auto mt-4 max-w-xl opacity-80">3 cards/month free, forever. €9/month for unlimited everything.</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/pricing"><Button size="lg" variant="secondary" className="rounded-full px-7">See plans</Button></Link>
            <Link to="/auth"><Button size="lg" className="rounded-full bg-accent px-7 text-accent-foreground hover:opacity-90">Create account</Button></Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-20">
        <h2 className="text-center font-display text-4xl md:text-5xl">Questions, answered</h2>
        <Accordion type="single" collapsible className="mt-10">
          {[
            { q: "Is GlutenGo medical advice?", a: "No. GlutenGo provides translation tools and travel guides for information only. Always confirm preparation with restaurant staff. When in doubt, don't eat it." },
            { q: "Which languages are supported for translation cards?", a: "English, French, Spanish, Italian, German, Japanese, Thai, Dutch, Portuguese, Greek, Turkish, Polish, Korean, Chinese (Simplified), Arabic and Hindi. New languages are added regularly." },
            { q: "Does it work offline?", a: "Yes. On the Traveler and Family plans you can save translation cards and country guides for offline use — perfect when you don't have data abroad." },
            { q: "Can I cancel anytime?", a: "Yes. Cancel from your account settings whenever you want. You keep access until the end of your paid period." },
            { q: "How accurate are the translations?", a: "We use a medically-tuned prompt specifically built for celiac disease and gluten intolerance, with phonetic guides for languages like Japanese and Thai. For critical trips we still recommend having a native speaker double-check the card." },
            { q: "What if I'm intolerant and not celiac?", a: "When you create your account you can specify whether you have celiac disease, intolerance or an allergy. Translation cards and warnings adapt to your severity level." },
            { q: "Is there a free trial for paid plans?", a: "GlutenGo is free forever with 3 translation cards per month. For the Traveler plan we offer a 30-day money-back guarantee — no questions asked." },
            { q: "How does the Family plan work?", a: "The Family plan supports up to 5 user profiles. Each person has their own allergy profiles, translation cards and saved restaurants. You can plan trips together and share checklists." },
          ].map((f, i) => (
            <AccordionItem value={`i${i}`} key={i}>
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
