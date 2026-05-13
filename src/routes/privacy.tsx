import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — GlutenGo" },
      { name: "description", content: "How GlutenGo collects, uses and protects your data. GDPR-compliant." },
      { property: "og:title", content: "Privacy Policy — GlutenGo" },
      { property: "og:description", content: "How GlutenGo collects, uses and protects your data. GDPR-compliant, no ads, no data selling." },
      { property: "og:url", content: "https://glutengo.app/privacy" },
    ],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <article className="prose prose-stone mx-auto max-w-3xl px-5 py-16">
        <h1 className="font-display text-5xl">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: May 2026</p>

        <h2 className="mt-10 font-display text-2xl">Who we are</h2>
        <p className="text-muted-foreground">GlutenGo provides travel tools for people with celiac disease and gluten intolerance. We are the data controller for any personal data you provide.</p>

        <h2 className="mt-8 font-display text-2xl">What we collect</h2>
        <ul className="list-disc space-y-1 pl-6 text-muted-foreground">
          <li>Account data: email, name, optional avatar.</li>
          <li>Usage data: translation cards you generate, trips you save, AI assistant messages.</li>
          <li>Billing data: handled by our payment provider — we never see your card details.</li>
          <li>Technical data: device, browser and basic logs to keep the service reliable.</li>
        </ul>

        <h2 className="mt-8 font-display text-2xl">What we don't do</h2>
        <p className="text-muted-foreground">We do not sell your data to advertisers. We do not run ad networks. We do not share your medical preferences with third parties.</p>

        <h2 className="mt-8 font-display text-2xl">Your rights (GDPR)</h2>
        <p className="text-muted-foreground">You can request a copy of your data, ask us to correct or delete it, or withdraw consent at any time. Email <a href="mailto:privacy@glutengo.app" className="text-primary underline">privacy@glutengo.app</a>.</p>

        <h2 className="mt-8 font-display text-2xl">Cookies</h2>
        <p className="text-muted-foreground">We use functional cookies for sign-in and preferences. Optional analytics cookies require your consent.</p>

        <h2 className="mt-8 font-display text-2xl">Contact</h2>
        <p className="text-muted-foreground">Questions? <a href="mailto:privacy@glutengo.app" className="text-primary underline">privacy@glutengo.app</a></p>
      </article>
      <SiteFooter />
    </div>
  );
}
