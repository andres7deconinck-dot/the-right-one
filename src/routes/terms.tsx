import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms of Service — GlutenGo" },
      { name: "description", content: "The terms that govern your use of GlutenGo." },
      { property: "og:title", content: "Terms of Service — GlutenGo" },
      { property: "og:description", content: "The terms that govern your use of the GlutenGo gluten-free travel app." },
      { property: "og:url", content: "https://glutengo.app/terms" },
    ],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <article className="prose prose-stone mx-auto max-w-3xl px-5 py-16">
        <h1 className="font-display text-5xl">Terms of Service</h1>
        <p className="text-sm text-muted-foreground">Last updated: May 2026</p>

        <h2 className="mt-10 font-display text-2xl">1. Operator</h2>
        <p className="text-muted-foreground">GlutenGo is operated by <strong>Andres Deconinck</strong> ("we", "us", "our"). By using GlutenGo you agree to these terms.</p>

        <h2 className="mt-8 font-display text-2xl">2. The service</h2>
        <p className="text-muted-foreground">GlutenGo provides translation tools, country guides and AI-assisted travel guidance for people with celiac disease and gluten intolerance. The service is informational and does not replace medical advice.</p>

        <h2 className="mt-8 font-display text-2xl">3. Not medical advice</h2>
        <p className="text-muted-foreground">Always confirm preparation with restaurant staff. When in doubt, do not eat the food. Consult a qualified medical professional for medical decisions.</p>

        <h2 className="mt-8 font-display text-2xl">4. Account</h2>
        <p className="text-muted-foreground">You're responsible for keeping your login credentials safe. We may suspend accounts that violate these terms.</p>

        <h2 className="mt-8 font-display text-2xl">5. Plans and billing</h2>
        <p className="text-muted-foreground">Paid plans renew automatically until cancelled. You can cancel from your account settings at any time and keep access until the end of your billing period.</p>

        <h2 className="mt-8 font-display text-2xl">6. Refunds</h2>
        <p className="text-muted-foreground">We offer a 30-day money-back guarantee on all subscriptions. If you are not satisfied for any reason, contact us within 30 days of your purchase and we will issue a full refund, no questions asked.</p>

        <h2 className="mt-8 font-display text-2xl">7. Liability</h2>
        <p className="text-muted-foreground">To the maximum extent permitted by law, GlutenGo's total liability is limited to the amount you paid in the 12 months preceding the claim.</p>

        <h2 className="mt-8 font-display text-2xl">8. Contact</h2>
        <p className="text-muted-foreground">Questions? <a href="mailto:hello@glutengo.app" className="text-primary underline">hello@glutengo.app</a> — Andres Deconinck, Belgium.</p>
      </article>
      <SiteFooter />
    </div>
  );
}
