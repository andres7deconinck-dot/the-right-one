import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — Celiac Travel Stories from Real Travelers | GlutenGo" },
      { name: "description", content: "Real stories, hotel & restaurant tips and country guides written by gluten-free travelers around the world." },
      { property: "og:title", content: "GlutenGo Blog — Celiac travel stories from real travelers" },
      { property: "og:description", content: "Verified gluten-free travel stories, hotel tips and country guides — written by the community." },
      { property: "og:url", content: "https://glutengo.app/blog" },
    ],
  }),
  component: () => (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <Outlet />
      <SiteFooter />
    </div>
  ),
});
