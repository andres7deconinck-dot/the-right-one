import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Sparkles } from "lucide-react";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog — GlutenGo" },
      { name: "description", content: "Travel stories, country deep-dives and tips for celiac travelers — coming soon." },
    ],
  }),
  component: BlogPage,
});

function BlogPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <main className="mx-auto flex max-w-3xl flex-1 flex-col items-center justify-center px-5 py-24 text-center">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary"><Sparkles className="h-7 w-7" /></span>
        <h1 className="mt-6 font-display text-5xl">Stories coming soon</h1>
        <p className="mt-4 max-w-lg text-muted-foreground">
          We're collecting travel deep-dives, country-by-country safety guides, and reader stories. Want to be first to read them? Sign up — we'll only email you when there's something worth your time.
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
