import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_app")({
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) throw redirect({ to: "/auth" });
  },
  component: () => (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1"><Outlet /></main>
      <SiteFooter />
    </div>
  ),
});
