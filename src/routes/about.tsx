import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Heart, Globe2, Shield, Users } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — GlutenGo" },
      { name: "description", content: "Built by celiac travelers, for celiac travelers. Our mission is calm, accurate gluten-free travel." },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-hero">
        <div className="mx-auto max-w-3xl px-5 py-20 text-center">
          <h1 className="font-display text-5xl md:text-6xl">Built by someone who gets it.</h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
            GlutenGo started after a bad night in Osaka. The translation app failed, the chef misunderstood, the trip was ruined. Every celiac traveler deserves trust, not anxiety.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-5 py-16">
        <div className="grid gap-6 md:grid-cols-3">
          {[
            { icon: Heart, title: "Medical first", text: "Every translation is tuned for medical clarity, not tourist politeness." },
            { icon: Shield, title: "Honest about risk", text: "We tell you when a country or dish is risky — even if it's uncomfortable." },
            { icon: Users, title: "Your data is yours", text: "We don't sell data to advertisers. Ever." },
          ].map((p) => (
            <div key={p.title} className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><p.icon className="h-6 w-6" /></span>
              <h3 className="mt-5 font-display text-xl">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-cream/50 py-16">
        <div className="mx-auto max-w-5xl px-5">
          <h2 className="text-center font-display text-4xl">By the numbers</h2>
          <div className="mt-10 grid grid-cols-2 gap-6 md:grid-cols-4">
            {[
              { n: "12,000+", l: "Active travelers" },
              { n: "40+", l: "Countries covered" },
              { n: "16", l: "Translation languages" },
              { n: "4.9 / 5", l: "Average rating" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl bg-card p-6 text-center shadow-soft">
                <p className="font-display text-3xl text-primary">{s.n}</p>
                <p className="mt-1 text-xs text-muted-foreground">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-5 py-20 text-center">
        <Globe2 className="mx-auto h-10 w-10 text-primary" />
        <h2 className="mt-4 font-display text-4xl">Join the community</h2>
        <p className="mt-3 text-muted-foreground">Free forever to start. Upgrade when you fly.</p>
        <Link to="/auth"><Button size="lg" className="mt-6 rounded-full px-7">Create free account</Button></Link>
      </section>

      <SiteFooter />
    </div>
  );
}
