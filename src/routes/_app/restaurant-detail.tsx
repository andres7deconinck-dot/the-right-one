import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_app/restaurant-detail")({
  head: () => ({ meta: [{ title: "Safety Notice — GlutenGo" }] }),
  component: DeprecatedRestaurantDetailRoute,
});

function DeprecatedRestaurantDetailRoute() {
  return (
    <div className="mx-auto max-w-2xl px-5 py-16">
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <AlertTriangle className="mx-auto h-8 w-8 text-amber-700" />
        <h1 className="mt-3 font-display text-3xl">Use verified restaurant pages</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This prototype screen is disabled in production to avoid confusion with verified AI research results.
        </p>
        <Link to="/restaurants" className="mt-5 inline-block">
          <Button>Go to restaurant finder</Button>
        </Link>
      </div>
    </div>
  );
}
