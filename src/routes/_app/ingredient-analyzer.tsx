import { createFileRoute } from "@tanstack/react-router";
import IngredientAnalyzer from "@/components/IngredientAnalyzer";

export const Route = createFileRoute("/_app/ingredient-analyzer")({
  head: () => ({ meta: [{ title: "Ingredient Analyzer — GlutenGo" }] }),
  component: IngredientAnalyzer,
});
