import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const Route = createFileRoute("/refund")({
  head: () => ({
    meta: [
      { title: "Refund Policy — GlutenGo" },
      { name: "description", content: "GlutenGo offers a 30-day money-back guarantee on all subscriptions. No questions asked." },
      { property: "og:title", content: "Refund Policy — GlutenGo" },
      { property: "og:url", content: "https://glutengo.be/refund" },
    ],
  }),
  component: RefundPage,
});

function RefundPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <article className="prose prose-stone mx-auto max-w-3xl px-5 py-16">
        <h1 className="font-display text-5xl">Refund Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: May 2026</p>

        <h2 className="mt-10 font-display text-2xl">30-day money-back guarantee</h2>
        <p className="text-muted-foreground">
          We offer a 30-day money-back guarantee on all GlutenGo subscriptions. If you are not satisfied for any reason,
          contact us within 30 days of your purchase and we will issue a full refund — no questions asked.
        </p>

        <h2 className="mt-8 font-display text-2xl">How to request a refund</h2>
        <p className="text-muted-foreground">
          Send an email to <a href="mailto:hello@glutengo.app" className="text-primary underline">hello@glutengo.app</a> with
          the subject line "Refund request" and include the email address associated with your account.
          We will process your refund within 5 business days.
        </p>

        <h2 className="mt-8 font-display text-2xl">Operator</h2>
        <p className="text-muted-foreground">
          GlutenGo is operated by <strong>Andres Deconinck</strong>, Belgium.
          Payments are processed by Paddle.com Market Ltd, our authorised reseller and Merchant of Record.
        </p>

        <h2 className="mt-8 font-display text-2xl">Contact</h2>
        <p className="text-muted-foreground">
          Questions? <a href="mailto:hello@glutengo.app" className="text-primary underline">hello@glutengo.app</a>
        </p>
      </article>
      <SiteFooter />
    </div>
  );
}
