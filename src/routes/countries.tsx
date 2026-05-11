import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const Route = createFileRoute("/countries")({
  component: () => (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </div>
  ),
});
