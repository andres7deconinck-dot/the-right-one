import { useState } from "react";

// ─── Detection engine ─────────────────────────────────────────────────────────
// Each entry is a tuple: [keyword, reason]. Matching is bidirectional:
// the ingredient OR the keyword must contain the other as a word/substring.

type Risk = "unsafe" | "hidden" | "uncertain" | "safe";

const UNSAFE: [string, string][] = [
  ["wheat", "Wheat — direct gluten source"],
  ["barley", "Barley — direct gluten source"],
  ["rye", "Rye — direct gluten source"],
  ["spelt", "Spelt — ancient wheat, contains gluten"],
  ["kamut", "Kamut/Khorasan wheat — contains gluten"],
  ["triticale", "Triticale — wheat/rye hybrid"],
  ["semolina", "Semolina — durum wheat"],
  ["farro", "Farro — ancient wheat"],
  ["einkorn", "Einkorn — ancient wheat"],
  ["emmer", "Emmer — ancient wheat"],
  ["bulgur", "Bulgur — cracked wheat"],
  ["durum", "Durum wheat"],
  ["couscous", "Couscous — made from wheat"],
  ["wheat flour", "Wheat flour — direct gluten"],
  ["bread flour", "Bread flour — wheat"],
  ["all-purpose flour", "All-purpose flour — wheat"],
  ["plain flour", "Plain flour — wheat"],
  ["self-raising flour", "Self-raising flour — wheat"],
  ["wholemeal flour", "Wholemeal flour — wheat"],
  ["wheat starch", "Wheat starch — contains gluten"],
  ["wheat protein", "Wheat protein / vital wheat gluten"],
  ["vital wheat gluten", "Vital wheat gluten"],
  ["wheat germ", "Wheat germ — gluten source"],
  ["wheat bran", "Wheat bran — gluten source"],
  ["glutinous", "Contains gluten (despite 'glutinous rice' being GF, check context)"],
  ["malt", "Malt — typically from barley"],
  ["malted barley", "Malted barley — gluten"],
  ["malt flour", "Malt flour — barley based"],
  ["beer", "Beer — brewed from barley/wheat"],
  ["ale", "Ale — brewed from barley"],
  ["lager", "Lager — brewed from barley"],
  ["stout", "Stout — brewed from barley"],
];

const HIDDEN: [string, string][] = [
  ["soy sauce", "Soy sauce — usually contains wheat"],
  ["shoyu", "Shoyu (Japanese soy sauce) — contains wheat"],
  ["teriyaki", "Teriyaki sauce — contains soy sauce (wheat)"],
  ["hoisin", "Hoisin sauce — contains wheat"],
  ["oyster sauce", "Oyster sauce — often contains wheat starch"],
  ["worcestershire", "Worcestershire sauce — may contain malt vinegar"],
  ["malt vinegar", "Malt vinegar — made from barley"],
  ["malt extract", "Malt extract — from barley"],
  ["malt flavoring", "Malt flavoring — from barley"],
  ["malt syrup", "Malt syrup — from barley"],
  ["barley malt", "Barley malt — gluten source"],
  ["modified starch", "Modified starch — source often unspecified; may be wheat"],
  ["modified food starch", "Modified food starch — may be wheat-based"],
  ["food starch", "Food starch — source may be wheat"],
  ["hydrolyzed wheat protein", "Hydrolyzed wheat protein — contains gluten"],
  ["hydrolyzed vegetable protein", "HVP — may contain wheat"],
  ["hvp", "HVP (hydrolyzed vegetable protein) — may contain wheat"],
  ["textured vegetable protein", "TVP — may contain wheat"],
  ["tvp", "TVP — may contain wheat"],
  ["seitan", "Seitan — pure wheat gluten"],
  ["fu", "Fu (Japanese wheat gluten product)"],
  ["caramel color", "Caramel color — may be wheat-based (especially class III/IV)"],
  ["caramel colouring", "Caramel colouring — may be wheat-based"],
  ["dextrin", "Dextrin — may be derived from wheat"],
  ["maltodextrin", "Maltodextrin — usually from corn/rice but can be wheat in EU"],
  ["glucose syrup", "Glucose syrup — can be from wheat (check label)"],
  ["wheat glucose syrup", "Wheat glucose syrup — direct gluten risk"],
  ["natural flavor", "Natural flavoring — source unspecified; may include barley malt"],
  ["natural flavoring", "Natural flavoring — source unspecified"],
  ["artificial flavor", "Artificial flavoring — source unspecified"],
  ["seasoning", "Seasoning blends — often contain wheat-based fillers"],
  ["spice blend", "Spice blends — may use wheat flour as anti-caking agent"],
  ["brewer's yeast", "Brewer's yeast — typically grown on barley, contains gluten"],
  ["brewers yeast", "Brewer's yeast — typically grown on barley"],
  ["yeast extract", "Yeast extract — often from brewer's yeast (barley)"],
  ["autolyzed yeast", "Autolyzed yeast — may be from barley"],
  ["gravy", "Gravy — typically thickened with wheat flour"],
  ["roux", "Roux — made from wheat flour and butter"],
  ["crouton", "Croutons — bread-based, contains gluten"],
  ["breadcrumb", "Breadcrumbs — wheat-based"],
  ["panko", "Panko breadcrumbs — wheat-based"],
  ["soy protein", "Soy protein isolates — may contain wheat"],
  ["licorice extract", "Licorice/liquorice root — sometimes contains wheat"],
  ["liquorice", "Liquorice — sometimes wheat-based carriers"],
];

const UNCERTAIN: [string, string][] = [
  ["oat", "Oats — naturally GF but often cross-contaminated; only certified GF oats are safe"],
  ["oats", "Oats — naturally GF but often cross-contaminated"],
  ["rolled oats", "Rolled oats — cross-contamination risk"],
  ["oat flour", "Oat flour — cross-contamination risk unless certified GF"],
  ["vinegar", "Vinegar — usually safe (except malt vinegar); distilled vinegar is GF"],
  ["vanilla extract", "Vanilla extract — may use alcohol from grain; usually GF"],
  ["yeast", "Yeast — baker's yeast is GF; check it's not brewer's yeast"],
  ["corn starch", "Corn starch — usually GF but verify source"],
  ["cornstarch", "Cornstarch — usually GF but verify source"],
  ["rice flour", "Rice flour — usually GF; confirm no co-processing with wheat"],
  ["buckwheat", "Buckwheat — despite the name, naturally GF; cross-contamination risk"],
  ["quinoa", "Quinoa — naturally GF; cross-contamination possible"],
  ["amaranth", "Amaranth — naturally GF; cross-contamination possible"],
  ["tapioca", "Tapioca — usually GF; verify processing"],
  ["arrowroot", "Arrowroot — usually GF"],
  ["xanthan gum", "Xanthan gum — typically GF; derived from fermentation"],
  ["guar gum", "Guar gum — usually GF"],
  ["potato starch", "Potato starch — usually GF; verify shared lines"],
  ["sorghum", "Sorghum — naturally GF; cross-contamination possible"],
  ["teff", "Teff — naturally GF; cross-contamination possible"],
  ["millet", "Millet — naturally GF; cross-contamination possible"],
  ["rice syrup", "Rice syrup — usually GF; check processing"],
  ["brown rice syrup", "Brown rice syrup — sometimes processed with barley enzyme"],
  ["distilled", "Distilled ingredients — typically GF; verify label"],
  ["starch", "Starch — source unspecified; could be wheat"],
  ["flour", "Flour — source unspecified; could be wheat"],
  ["cereal", "Cereal — may contain gluten; check specific grain"],
  ["grain", "Grain — verify it's not a gluten-containing grain"],
  ["soy", "Soy — pure soy is GF; soy sauce is not"],
  ["tofu", "Tofu — usually GF; check for added sauces or marinades"],
  ["tempeh", "Tempeh — usually GF; check for wheat in marinade"],
  ["fried", "Fried items — cross-contamination risk from shared fryer"],
  ["imitation crab", "Imitation crab/surimi — often contains wheat starch"],
  ["surimi", "Surimi — often contains wheat starch"],
  ["e1404", "E1404 (oxidised starch) — may be wheat-derived"],
  ["e1410", "E1410 (monostarch phosphate) — may be wheat-derived"],
  ["e1412", "E1412 (distarch phosphate) — may be wheat-derived"],
  ["e1414", "E1414 — may be wheat-derived"],
  ["e1420", "E1420 — may be wheat-derived"],
  ["e1422", "E1422 — may be wheat-derived"],
  ["e1440", "E1440 — may be wheat-derived"],
  ["e1442", "E1442 — may be wheat-derived"],
  ["e1450", "E1450 — may be wheat-derived"],
];

function tokenize(s: string): string[] {
  return s.toLowerCase().split(/[\s,\-\/\(\)]+/).filter(Boolean);
}

function matches(ingredient: string, keyword: string): boolean {
  const ing = ingredient.toLowerCase();
  const kw = keyword.toLowerCase();
  // Direct substring match (bidirectional)
  if (ing.includes(kw) || kw.includes(ing)) return true;
  // Word-level match: any token from ingredient in keyword tokens and vice versa
  const ingTokens = tokenize(ing);
  const kwTokens = tokenize(kw);
  return ingTokens.some(t => t.length > 2 && kwTokens.includes(t));
}

interface IngredientResult {
  original: string;
  risk: Risk;
  reason: string;
}

function analyzeIngredients(raw: string): IngredientResult[] {
  const items = raw
    .split(/[,\n;]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);

  return items.map(original => {
    const item = original.toLowerCase().trim();

    // 1. Check unsafe (direct gluten sources)
    for (const [keyword, reason] of UNSAFE) {
      if (matches(item, keyword)) {
        return { original, risk: "unsafe", reason };
      }
    }

    // 2. Check hidden risks
    for (const [keyword, reason] of HIDDEN) {
      if (matches(item, keyword)) {
        return { original, risk: "hidden", reason };
      }
    }

    // 3. Check uncertain
    for (const [keyword, reason] of UNCERTAIN) {
      if (matches(item, keyword)) {
        return { original, risk: "uncertain", reason };
      }
    }

    return { original, risk: "safe", reason: "No known gluten sources detected — verify manufacturing practices" };
  });
}

const RISK_CONFIG: Record<Risk, { bg: string; text: string; border: string; label: string; icon: string }> = {
  unsafe:    { bg: "#fee2e2", text: "#7f1d1d", border: "#fca5a5", label: "Not safe — contains gluten",  icon: "✕" },
  hidden:    { bg: "#fef3c7", text: "#78350f", border: "#fcd34d", label: "Hidden risk — likely contains gluten", icon: "⚠" },
  uncertain: { bg: "#f3f4f6", text: "#374151", border: "#d1d5db", label: "Uncertain — verify with manufacturer", icon: "?" },
  safe:      { bg: "#d1fae5", text: "#065f46", border: "#6ee7b7", label: "No gluten detected",      icon: "✓" },
};

const EXAMPLE = `Wheat flour, water, yeast, salt, barley malt extract, sunflower oil, oat bran, modified food starch, natural flavoring, caramel color, yeast extract, soy sauce`;

// ─── Main Component ───────────────────────────────────────────────────────────
export default function IngredientAnalyzer() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<IngredientResult[]>([]);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = () => {
    if (!input.trim()) return;
    setResults(analyzeIngredients(input));
    setAnalyzed(true);
  };

  const counts = {
    unsafe: results.filter(r => r.risk === "unsafe").length,
    hidden: results.filter(r => r.risk === "hidden").length,
    uncertain: results.filter(r => r.risk === "uncertain").length,
    safe: results.filter(r => r.risk === "safe").length,
  };

  const notSafe = counts.unsafe > 0 || counts.hidden > 0;
  const overallLabel = notSafe
    ? `✕ Not safe — ${counts.unsafe + counts.hidden} gluten risk${counts.unsafe + counts.hidden > 1 ? "s" : ""} found`
    : counts.uncertain > 0
      ? `⚠ Possibly safe — ${counts.uncertain} ingredient${counts.uncertain > 1 ? "s" : ""} need verification`
      : "✓ No direct gluten sources detected";

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", background: "#f9fafb", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", padding: "20px 16px 16px", borderBottom: "1px solid #f3f4f6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 26 }}>🔍</span>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111827" }}>Ingredient Analyzer</h1>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>Strict gluten detection for celiac disease — paste any ingredient list</p>
      </div>

      <div style={{ padding: "16px 16px 80px" }}>
        {/* Warning banner */}
        <div style={{ background: "#fff7ed", borderRadius: 12, border: "1px solid #fdba74", padding: "10px 12px", marginBottom: 12 }}>
          <p style={{ margin: 0, fontSize: 12, color: "#9a3412", lineHeight: 1.5 }}>
            <strong>⚕️ Celiac-grade strictness.</strong> This tool flags direct gluten sources, hidden risks (sauces, starches, malt), and uncertain ingredients. "No gluten detected" does not equal "certified gluten-free" — always verify manufacturing lines with the brand.
          </p>
        </div>

        {/* Input */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 16, marginBottom: 12 }}>
          <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "#374151" }}>Paste ingredient list (comma or line separated)</p>
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); setAnalyzed(false); }}
            placeholder="e.g. Water, Sugar, Wheat Flour, Soy Sauce, Modified Food Starch..."
            rows={5}
            style={{ width: "100%", borderRadius: 10, border: "1px solid #d1d5db", padding: "10px 12px", fontSize: 13, color: "#374151", resize: "vertical", boxSizing: "border-box", outline: "none" }}
          />
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <button
              onClick={() => { setInput(EXAMPLE); setAnalyzed(false); }}
              style={{ flex: 1, padding: "10px 0", borderRadius: 10, background: "#f3f4f6", border: "none", color: "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
            >
              Load example
            </button>
            <button
              onClick={handleAnalyze}
              disabled={!input.trim()}
              style={{ flex: 2, padding: "10px 0", borderRadius: 10, background: input.trim() ? "#dc2626" : "#e5e7eb", border: "none", color: input.trim() ? "#fff" : "#9ca3af", fontWeight: 700, fontSize: 14, cursor: input.trim() ? "pointer" : "not-allowed" }}
            >
              🔍 Analyze strictly
            </button>
          </div>
        </div>

        {/* Results */}
        {analyzed && results.length > 0 && (
          <>
            {/* Summary banner */}
            <div style={{
              background: notSafe ? "#fee2e2" : counts.uncertain > 0 ? "#fef3c7" : "#d1fae5",
              borderRadius: 14,
              border: `1px solid ${notSafe ? "#fca5a5" : counts.uncertain > 0 ? "#fcd34d" : "#6ee7b7"}`,
              padding: "14px 16px",
              marginBottom: 16
            }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: notSafe ? "#7f1d1d" : counts.uncertain > 0 ? "#78350f" : "#065f46" }}>
                {overallLabel}
              </p>
              {notSafe && (
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#b91c1c" }}>
                  Do NOT consume this product if you have celiac disease or gluten intolerance.
                </p>
              )}
              {!notSafe && counts.uncertain > 0 && (
                <p style={{ margin: "4px 0 0", fontSize: 13, color: "#92400e" }}>
                  Contact the manufacturer to confirm gluten-free status and shared production lines.
                </p>
              )}
            </div>

            {/* Stat pills */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {(["unsafe", "hidden", "uncertain", "safe"] as Risk[]).map(risk => {
                const s = RISK_CONFIG[risk];
                const count = counts[risk];
                if (count === 0) return null;
                return (
                  <div key={risk} style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}`, borderRadius: 99, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>
                    {count}× {s.icon} {risk === "unsafe" ? "Unsafe" : risk === "hidden" ? "Hidden risk" : risk === "uncertain" ? "Uncertain" : "Safe"}
                  </div>
                );
              })}
            </div>

            {/* Grouped ingredient list */}
            {(["unsafe", "hidden", "uncertain", "safe"] as Risk[]).map(risk => {
              const group = results.filter(r => r.risk === risk);
              if (group.length === 0) return null;
              const s = RISK_CONFIG[risk];
              return (
                <div key={risk} style={{ marginBottom: 14 }}>
                  <p style={{ margin: "0 0 8px", fontSize: 11, fontWeight: 800, color: s.text, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    {s.icon} {s.label}
                  </p>
                  {group.map((item, i) => (
                    <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: "10px 12px", marginBottom: 6 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: s.text }}>{item.original}</p>
                      <p style={{ margin: "3px 0 0", fontSize: 12, color: s.text, opacity: 0.85 }}>{item.reason}</p>
                    </div>
                  ))}
                </div>
              );
            })}

            {/* Disclaimer */}
            <div style={{ background: "#f9fafb", borderRadius: 12, border: "1px solid #e5e7eb", padding: "12px 14px" }}>
              <p style={{ margin: 0, fontSize: 11, color: "#6b7280", lineHeight: 1.6 }}>
                <strong>Limitations:</strong> This tool detects ~100 known gluten sources but cannot detect all formulations or "may contain" warnings from shared manufacturing lines. Always verify with the manufacturer for certified GF status.
              </p>
            </div>
          </>
        )}

        {/* Empty state */}
        {!analyzed && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
            <span style={{ fontSize: 40 }}>🌾</span>
            <p style={{ margin: "12px 0 4px", fontSize: 15, fontWeight: 600, color: "#374151" }}>Paste any ingredient list</p>
            <p style={{ margin: 0, fontSize: 13 }}>We check for 100+ gluten sources including hidden risks, malt variants, and ambiguous starches</p>
          </div>
        )}
      </div>
    </div>
  );
}
