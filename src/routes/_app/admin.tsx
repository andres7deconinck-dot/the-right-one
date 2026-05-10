import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Download, Mail, Shield, Users, TrendingUp, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";
import { useRequireAuth } from "@/hooks/useRequireAuth";

const ADMIN_EMAIL = "info.neurixx@gmail.com";

export const Route = createFileRoute("/_app/admin")({
  head: () => ({ meta: [{ title: "Admin — GlutenGo" }] }),
  component: AdminPage,
});

function AdminPage() {
  const { user, loading: authLoading } = useRequireAuth();

  const { data: subscribers, isLoading, error: fetchError } = useQuery({
    queryKey: ["admin-subscribers"],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke("admin-subscribers");
      if (error) throw error;
      return (data?.data || []) as { id: string; email: string | null; full_name: string | null; plan: string | null; created_at: string }[];
    },
    enabled: !!user && user.email === ADMIN_EMAIL,
  });

  if (authLoading) return null;

  if (!user || user.email !== ADMIN_EMAIL) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20 text-center">
        <Shield className="mx-auto h-10 w-10 text-muted-foreground/40" />
        <h1 className="mt-4 font-display text-3xl">Geen toegang</h1>
        <p className="mt-2 text-muted-foreground">Deze pagina is alleen toegankelijk voor de beheerder.</p>
        <Link to="/dashboard" className="mt-6 inline-block">
          <Button variant="outline">Terug naar dashboard</Button>
        </Link>
      </div>
    );
  }

  const total = subscribers?.length ?? 0;
  const paid = subscribers?.filter((s) => s.plan !== "free").length ?? 0;
  const thisMonth = subscribers?.filter((s) => {
    const d = new Date(s.created_at);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length ?? 0;

  const exportCSV = () => {
    if (!subscribers) return;
    const header = "Email,Naam,Plan,Aangemeld op\n";
    const rows = subscribers.map((s) =>
      [
        s.email ?? "",
        s.full_name ?? "",
        s.plan ?? "free",
        s.created_at ? new Date(s.created_at).toLocaleDateString("nl-BE") : "",
      ]
        .map((v) => `"${v.replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = header + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `glutengo-subscribers-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-5xl px-5 py-10">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <h1 className="font-display text-3xl">Admin</h1>
          </div>
          <p className="mt-1 text-muted-foreground">Alle geregistreerde gebruikers van GlutenGo.</p>
        </div>
        <Button onClick={exportCSV} disabled={!subscribers || total === 0} variant="outline" className="gap-2">
          <Download className="h-4 w-4" /> Exporteer CSV
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="text-sm">Totaal geregistreerd</span>
          </div>
          <p className="mt-2 font-display text-4xl">{isLoading ? "…" : total}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span className="text-sm">Nieuwe deze maand</span>
          </div>
          <p className="mt-2 font-display text-4xl">{isLoading ? "…" : thisMonth}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 text-muted-foreground">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm">Betaald plan</span>
          </div>
          <p className="mt-2 font-display text-4xl">{isLoading ? "…" : paid}</p>
          {total > 0 && !isLoading && (
            <p className="text-xs text-muted-foreground">{Math.round((paid / total) * 100)}% conversie</p>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 rounded-2xl border border-border bg-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium text-sm">Subscribers</span>
          </div>
          <span className="text-xs text-muted-foreground">{total} totaal</span>
        </div>

        {fetchError ? (
          <div className="px-5 py-8 text-center text-sm text-rose-600">
            Fout bij laden: {(fetchError as Error).message}
          </div>
        ) : isLoading ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-5 w-16 ml-auto" />
              </div>
            ))}
          </div>
        ) : total === 0 ? (
          <div className="py-16 text-center text-muted-foreground text-sm">
            Nog geen registraties.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {subscribers!.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-3.5 hover:bg-muted/30 transition-colors">
                <div className="flex-1 min-w-[200px]">
                  <p className="text-sm font-medium">{s.email || <span className="text-muted-foreground italic">geen email</span>}</p>
                  {s.full_name && <p className="text-xs text-muted-foreground">{s.full_name}</p>}
                </div>
                <p className="text-xs text-muted-foreground shrink-0">
                  {s.created_at ? new Date(s.created_at).toLocaleDateString("nl-BE", { day: "2-digit", month: "short", year: "numeric" }) : ""}
                </p>
                <Badge
                  className={`shrink-0 text-xs ${
                    s.plan === "free"
                      ? "bg-muted text-muted-foreground"
                      : "bg-emerald-100 text-emerald-700"
                  }`}
                >
                  {s.plan ?? "free"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Emails worden automatisch verzameld bij registratie (email/wachtwoord en Google). Alle data staat in Supabase.
      </p>
    </div>
  );
}
