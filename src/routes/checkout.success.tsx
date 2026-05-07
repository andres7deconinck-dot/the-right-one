import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/checkout/success")({
  head: () => ({ meta: [{ title: "Welcome — GlutenGo" }, { name: "robots", content: "noindex" }] }),
  component: SuccessPage,
});

function SuccessPage() {
  const { user, loading: authLoading } = useAuth();
  const { isActive, planName, refetch, loading } = useSubscription();
  const navigate = useNavigate();
  const [waited, setWaited] = useState(0);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate({ to: "/auth" }); return; }
    if (isActive) return;
    const t = setInterval(() => { refetch(); setWaited((w) => w + 1); }, 2000);
    return () => clearInterval(t);
  }, [user, authLoading, isActive, refetch, navigate]);

  return (
    <div className="grid min-h-screen place-items-center bg-hero px-5">
      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-10 text-center shadow-soft">
        {isActive ? (
          <>
            <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
            <h1 className="mt-5 font-display text-3xl">Welcome to {planName === "family" ? "Family" : "Traveler"}!</h1>
            <p className="mt-3 text-muted-foreground">Your subscription is active. Unlimited cards, languages and AI assistance — bon voyage.</p>
            <Link to="/dashboard"><Button className="mt-7 w-full">Go to dashboard</Button></Link>
          </>
        ) : (
          <>
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <h1 className="mt-5 font-display text-2xl">Activating your subscription…</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              {loading || waited < 5
                ? "This usually takes a few seconds."
                : "Still working on it. You can safely refresh this page or head to the dashboard — your access will appear shortly."}
            </p>
            <Link to="/dashboard"><Button variant="outline" className="mt-6 w-full">Continue to dashboard</Button></Link>
          </>
        )}
      </div>
    </div>
  );
}
