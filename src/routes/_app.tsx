import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";

// Auth is handled client-side in each child component via useRequireAuth().
// This layout always renders <Outlet /> to prevent SSR hydration mismatches.
export const Route = createFileRoute("/_app")({
  component: () => (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  ),
});
