import { createFileRoute } from "@tanstack/react-router";
import TravelMode from "@/components/TravelMode";

export const Route = createFileRoute("/_app/travel-mode")({
  head: () => ({ meta: [{ title: "Travel Mode — GlutenGo" }] }),
  component: TravelMode,
});
