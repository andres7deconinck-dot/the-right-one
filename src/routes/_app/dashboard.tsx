import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Globe2, Map, MessagesSquare, Plus, Sparkles, Settings, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useSubscription } from "@/hooks/useSubscription";
import { createCustomerPortalUrl } from "@/utils/payments.functions";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — GlutenGo" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user } = useAuth();
  const { isActive, planName, subscription } = useSubscription();
  const [profile, setProfile] = useState<any>(null);
  const [recent, setRecent] = useState<any[]>([]);
  const [portalLoading, setPortalLoading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("id", user.id).single().then(({ data }) => setProfile(data));
    supabase.from("translation_cards").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(5).then(({ data }) => setRecent(data || []));
  }, [user]);

  const used = profile?.cards_used_this_month ?? 0;
  const limit = planName === "free" ? 3 : Infinity;

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) throw new Error("Please sign in again");
      const { url } = await createCustomerPortalUrl({ data: { accessToken: session.access_token } });
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e: any) {
      toast.error(e?.message || "Could not open billing portal");
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="font-display text-4xl">{profile?.full_name || user?.email?.split("@")[0]}</h1>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 text-accent" /> Plan: <span className="font-medium capitalize">{planName}</span>
            <span className="text-muted-foreground">· {used}{limit === Infinity ? "" : `/${limit}`} cards this month</span>
            {subscription?.cancel_at_period_end && (
              <span className="ml-1 rounded-full bg-orange-100 px-2 py-0.5 text-xs text-orange-800">Cancels {subscription.current_period_end ? new Date(subscription.current_period_end).toLocaleDateString() : ""}</span>
            )}
          </div>
          {isActive ? (
            <Button variant="outline" size="sm" onClick={openPortal} disabled={portalLoading}>
              {portalLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Settings className="mr-2 h-4 w-4" />}
              Manage billing
            </Button>
          ) : (
            <Link to="/pricing"><Button size="sm"><Sparkles className="mr-2 h-4 w-4" /> Upgrade</Button></Link>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-5 md:grid-cols-3">
        <Link to="/cards" className="group rounded-3xl border border-border bg-card-soft p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-glow">
          <Globe2 className="h-7 w-7 text-primary" />
          <h3 className="mt-4 font-display text-xl">Translation Cards</h3>
          <p className="mt-1 text-sm text-muted-foreground">Generate or open your safety cards.</p>
        </Link>
        <Link to="/countries" className="group rounded-3xl border border-border bg-card-soft p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-glow">
          <Map className="h-7 w-7 text-primary" />
          <h3 className="mt-4 font-display text-xl">Country Guides</h3>
          <p className="mt-1 text-sm text-muted-foreground">Curated safe foods and risks per country.</p>
        </Link>
        <Link to="/assistant" className="group rounded-3xl border border-border bg-card-soft p-6 shadow-soft transition hover:-translate-y-1 hover:shadow-glow">
          <MessagesSquare className="h-7 w-7 text-primary" />
          <h3 className="mt-4 font-display text-xl">AI Travel Assistant</h3>
          <p className="mt-1 text-sm text-muted-foreground">Ask anything about eating safely abroad.</p>
        </Link>
      </div>

      <div className="mt-12">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Recent cards</h2>
          <Link to="/cards"><Button variant="outline" size="sm"><Plus className="mr-1.5 h-4 w-4" /> New card</Button></Link>
        </div>
        {recent.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-dashed border-border bg-cream/40 p-10 text-center text-muted-foreground">
            No cards yet. <Link to="/cards" className="font-medium text-primary hover:underline">Create your first one →</Link>
          </div>
        ) : (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {recent.map((c) => (
              <div key={c.id} className="rounded-2xl border border-border bg-card p-5 shadow-soft">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-primary">{c.language_label}</span>
                  <span className="text-xs text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
                </div>
                <p className="mt-2 line-clamp-3 text-sm">{c.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
