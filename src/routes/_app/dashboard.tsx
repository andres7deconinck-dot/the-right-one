import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Globe2, Map, MessagesSquare, Plus, Sparkles, Settings, Loader2, UtensilsCrossed, Plane, Lightbulb } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useSubscription } from "@/hooks/useSubscription";
import { createCustomerPortalUrl } from "@/utils/payments.functions";
import { tipOfTheDay } from "@/data/tips";
import { COUNTRIES } from "@/data/countries";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — GlutenGo" }] }),
  component: Dashboard,
});

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

function flagFor(country?: string | null) {
  const c = COUNTRIES.find((x) => x.name.toLowerCase() === (country || "").toLowerCase());
  return c?.flag ?? "🌍";
}

function Dashboard() {
  const { user } = useAuth();
  const { isActive, planName, subscription } = useSubscription();
  const [portalLoading, setPortalLoading] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
      return data;
    },
  });
  const { data: recent } = useQuery({
    queryKey: ["recent-cards", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase.from("translation_cards").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(3);
      return data || [];
    },
  });
  const { data: tripInfo } = useQuery({
    queryKey: ["dashboard-active-trip", user?.id],
    enabled: !!user,
    queryFn: async () => {
      if (!user) return { activeTrip: null, savedCount: 0 };
      const { data } = await supabase.from("trips").select("*").eq("user_id", user.id).order("start_date", { ascending: true });
      const activeTrip = (data || []).find((x) => x.status === "active") || (data || [])[0] || null;
      if (!activeTrip) return { activeTrip: null, savedCount: 0 };
      const { count } = await supabase.from("saved_restaurants").select("*", { count: "exact", head: true }).eq("trip_id", activeTrip.id);
      return { activeTrip, savedCount: count || 0 };
    },
  });
  const activeTrip = tripInfo?.activeTrip || null;
  const savedCount = tripInfo?.savedCount || 0;

  const used = profile?.cards_used_this_month ?? 0;
  const cardsLimit = planName === "free" ? 3 : Infinity;

  const openPortal = async () => {
    setPortalLoading(true);
    try {
      const { url } = await createCustomerPortalUrl();
      window.open(url, "_blank", "noopener,noreferrer");
    } catch (e: any) { toast.error(e?.message || "Could not open billing portal"); }
    finally { setPortalLoading(false); }
  };

  const tip = tipOfTheDay();
  const recommendedGuide = activeTrip ? COUNTRIES.find((c) => c.name.toLowerCase() === (activeTrip.destination_country || "").toLowerCase()) : null;
  const daysToDeparture = activeTrip?.start_date ? Math.ceil((new Date(activeTrip.start_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24)) : null;

  return (
    <div className="mx-auto max-w-7xl px-5 py-10">
      <div>
        <p className="text-sm text-muted-foreground">{greeting()},</p>
        <h1 className="font-display text-4xl">{profile?.full_name || user?.email?.split("@")[0]} 👋</h1>
        <p className="mt-1 text-muted-foreground">Your next destination is ready.</p>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { to: "/cards", icon: Globe2, label: "New translation card" },
          { to: "/restaurants", icon: UtensilsCrossed, label: "Find restaurants" },
          { to: "/countries", icon: Map, label: "Country guides" },
          { to: "/assistant", icon: MessagesSquare, label: "Ask the AI" },
        ].map((a) => (
          <Link key={a.to} to={a.to} className="group flex items-center gap-3 rounded-2xl border border-border bg-card-soft p-5 shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow">
            <a.icon className="h-6 w-6 text-primary" />
            <span className="font-medium">{a.label}</span>
          </Link>
        ))}
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl">Active trip</h2>
          {activeTrip ? (
            <div className="mt-3">
              <p className="font-display text-2xl">{flagFor(activeTrip.destination_country)} {activeTrip.title || activeTrip.destination_city || activeTrip.destination_country}</p>
              <p className="text-sm text-muted-foreground">
                {activeTrip.start_date ? new Date(activeTrip.start_date).toLocaleDateString() : "—"} → {activeTrip.end_date ? new Date(activeTrip.end_date).toLocaleDateString() : "—"}
              </p>
              <p className="mt-2 text-sm">{savedCount} restaurants saved{daysToDeparture !== null && daysToDeparture >= 0 ? ` · departs in ${daysToDeparture} days` : ""}</p>
              <div className="mt-4 flex gap-2">
                <Link to="/trips/$id" params={{ id: activeTrip.id }}><Button size="sm">Open trip</Button></Link>
                <Link to="/trips"><Button variant="outline" size="sm">All trips</Button></Link>
              </div>
            </div>
          ) : (
            <div className="mt-3">
              <p className="text-muted-foreground">No trips planned yet.</p>
              <Link to="/trips/new"><Button size="sm" className="mt-3"><Plus className="mr-1.5 h-4 w-4" /> Plan your first trip</Button></Link>
            </div>
          )}
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl">Plan</h2>
          {isActive ? (
            <>
              <p className="mt-2 text-sm">✅ <span className="capitalize font-medium">{planName}</span> — active</p>
              {subscription?.current_period_end && (
                <p className="text-xs text-muted-foreground">Renews {new Date(subscription.current_period_end).toLocaleDateString()}</p>
              )}
              {subscription?.cancel_at_period_end && <p className="mt-2 text-xs text-orange-600">Cancels on period end</p>}
              <Button variant="outline" size="sm" onClick={openPortal} disabled={portalLoading} className="mt-3">
                {portalLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Settings className="mr-2 h-4 w-4" />} Manage billing
              </Button>
            </>
          ) : (
            <>
              <p className="mt-2 text-sm">Free plan</p>
              <div className="mt-3">
                <p className="text-xs text-muted-foreground">Cards: {used}/{cardsLimit === Infinity ? "∞" : cardsLimit}</p>
                <Progress value={cardsLimit === Infinity ? 100 : (used / (cardsLimit as number)) * 100} className="mt-1.5 h-2" />
              </div>
              <Link to="/pricing"><Button size="sm" className="mt-4 w-full"><Sparkles className="mr-1.5 h-4 w-4" /> Upgrade for unlimited</Button></Link>
            </>
          )}
        </div>
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl">Recent cards</h2>
          <Link to="/cards" className="text-sm text-primary hover:underline">All cards →</Link>
        </div>
        {(recent || []).length === 0 ? (
          <div className="mt-4 rounded-3xl border border-dashed border-border bg-cream/40 p-8 text-center text-muted-foreground">
            No cards yet. <Link to="/cards" className="font-medium text-primary hover:underline">Create your first one →</Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            {(recent || []).map((c) => (
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

      <div className="mt-10 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 to-accent/10 p-6">
          <Lightbulb className="h-6 w-6 text-primary" />
          <h3 className="mt-3 font-display text-lg">Tip of the day</h3>
          <p className="mt-2 text-sm">{tip}</p>
        </div>
        {recommendedGuide ? (
          <Link to="/countries/$slug" params={{ slug: recommendedGuide.slug }} className="rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:shadow-glow">
            <Plane className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-lg">Recommended for your trip</h3>
            <p className="mt-2 text-sm">{recommendedGuide.flag} {recommendedGuide.name} guide — {recommendedGuide.intro.slice(0, 100)}...</p>
          </Link>
        ) : (
          <Link to="/countries" className="rounded-3xl border border-border bg-card p-6 shadow-soft transition hover:shadow-glow">
            <Map className="h-6 w-6 text-primary" />
            <h3 className="mt-3 font-display text-lg">Browse country guides</h3>
            <p className="mt-2 text-sm">Curated safe foods and risks per country.</p>
          </Link>
        )}
      </div>
    </div>
  );
}
