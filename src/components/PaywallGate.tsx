import { Lock, Sparkles, Check } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useSubscription } from "@/hooks/useSubscription";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  /** Plans that have access. Defaults to paid only. */
  allow?: Array<"free" | "traveler" | "family">;
  /** Headline shown on the lock card. */
  title?: string;
  /** Sub-copy shown on the lock card. */
  description?: string;
  /** Optional list of perks unlocked by upgrading. */
  perks?: string[];
  /** Height of the blurred teaser preview (px). */
  teaserHeight?: number;
};

/**
 * Renders children when the current user's plan is allowed.
 * Otherwise shows a blurred teaser with a lock + upgrade CTA.
 */
export function PaywallGate({
  children,
  allow = ["traveler", "family"],
  title = "Unlock the full guide",
  description = "This section is part of GlutenGo Traveler. Upgrade to read the complete guide, get all country information and unlimited translation cards.",
  perks = [
    "All country guides — full content",
    "Unlimited translation cards in 16 languages",
    "Unlimited AI travel assistant",
    "Offline access & PDF travel pack",
  ],
  teaserHeight = 220,
}: Props) {
  const { user } = useAuth();
  const { planName, loading } = useSubscription();

  // While loading, show children optimistically to avoid flash.
  if (loading) return <>{children}</>;

  const hasAccess = allow.includes(planName);
  if (hasAccess) return <>{children}</>;

  return (
    <div className="relative">
      {/* Blurred teaser */}
      <div
        className="pointer-events-none overflow-hidden select-none"
        style={{ maxHeight: teaserHeight }}
        aria-hidden="true"
      >
        <div className="blur-md opacity-60">{children}</div>
      </div>

      {/* Fade overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-3/4 bg-gradient-to-b from-transparent via-background/80 to-background" />

      {/* Lock card */}
      <div className="relative -mt-24 mx-auto max-w-2xl rounded-3xl border-2 border-primary/30 bg-card p-7 shadow-glow">
        <div className="flex items-start gap-4">
          <div className="rounded-2xl bg-primary/10 p-3">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-display text-2xl">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>

            <ul className="mt-4 grid gap-2 sm:grid-cols-2">
              {perks.map((p) => (
                <li key={p} className="flex items-start gap-2 text-sm">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/pricing">
                <Button className="gap-2">
                  <Sparkles className="h-4 w-4" /> Upgrade to Traveler
                </Button>
              </Link>
              {!user && (
                <Link to="/auth">
                  <Button variant="outline">Sign in</Button>
                </Link>
              )}
              <Link to="/pricing">
                <Button variant="ghost">Compare plans</Button>
              </Link>
            </div>

            <p className="mt-3 text-xs text-muted-foreground">
              30-day money-back guarantee · Cancel anytime
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
