import { useState } from "react";

// ─── Gluten detection logic ───────────────────────────────────────────────────
const GLUTEN_SOURCES = {
  unsafe: [
    "wheat", "barley", "rye", "spelt", "kamut", "triticale", "semolina", "farro",
    "durum", "einkorn", "emmer", "bulgur", "malt", "brewer's yeast", "wheat starch",
    "wheat flour", "bread flour", "all-purpose flour", "plain flour",
  ],
  hidden: [
    "soy sauce", "shoyu", "teriyaki", "hoisin", "oyster sauce", "worcestershire",
    "modified starch", "hydrolyzed vegetable protein", "hvp", "maltodextrin",
    "caramel color", "dextrin", "glucose syrup", "starch", "natural flavor",
    "natural flavoring", "artificial flavor", "seasoning", "spice blend",
    "malt extract", "malt flavoring", "malt vinegar", "beer", "ale", "lager",
  ],
  uncertain: [
    "oats", "oat", "vinegar", "vanilla extract", "yeast", "yeast extract",
    "corn starch", "rice flour", "buckwheat", "quinoa", "amaranth",
    "tapioca", "arrowroot", "xanthan gum", "guar gum",
  ],
};

type Risk = "unsafe" | "hidden" | "uncertain" | "safe";

interface IngredientResult {
  name: string;
  risk: Risk;
  reason: string;
}

function analyzeIngredients(raw: string): IngredientResult[] {
  const items = raw
    .split(/[,\n;]+/)
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  return items.map(item => {
    const unsafe = GLUTEN_SOURCES.unsafe.find(g => item.includes(g));
    if (unsafe) return { name: item, risk: "unsafe", reason: `Contains ${unsafe} — a direct gluten source` };

    const hidden = GLUTEN_SOURCES.hidden.find(g => item.includes(g));
    if (hidden) return { name: item, risk: "hidden", reason: `"${hidden}" often contains hidden gluten` };

    const uncertain = GLUTEN_SOURCES.uncertain.find(g => item.includes(g));
    if (uncertain) return { name: item, risk: "uncertain", reason: `"${uncertain}" may be GF or may be contaminated — verify the source` };

    return { name: item, risk: "safe", reason: "No known gluten sources detected" };
  });
}

const RISK_STYLE: Record<Risk, { bg: string; text: string; border: string; label: string; icon: string }> = {
  unsafe:    { bg: "#fee2e2", text: "#7f1d1d", border: "#fca5a5", label: "Unsafe",    icon: "✕" },
  hidden:    { bg: "#fef3c7", text: "#78350f", border: "#fcd34d", label: "Hidden Risk", icon: "⚠" },
  uncertain: { bg: "#f3f4f6", text: "#374151", border: "#d1d5db", label: "Uncertain", icon: "?" },
  safe:      { bg: "#d1fae5", text: "#065f46", border: "#6ee7b7", label: "Safe",      icon: "✓" },
};

const EXAMPLE = `Water, Sugar, Modified Starch, Soy Sauce, Wheat Flour, Salt, Natural Flavoring, Malt Extract, Oats, Caramel Color, Yeast Extract, Vinegar, Sunflower Oil`;

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

  const overallSafe = counts.unsafe === 0 && counts.hidden === 0;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", background: "#f9fafb", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", padding: "20px 16px 16px", borderBottom: "1px solid #f3f4f6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
          <span style={{ fontSize: 26 }}>🔍</span>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111827" }}>Ingredient Analyzer</h1>
        </div>
        <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>Paste an ingredient list to check for hidden gluten</p>
      </div>

      <div style={{ padding: "16px 16px 80px" }}>
        {/* Input */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: 16, marginBottom: 12 }}>
          <p style={{ margin: "0 0 8px", fontSize: 13, fontWeight: 600, color: "#374151" }}>Paste ingredients below</p>
          <textarea
            value={input}
            onChange={e => { setInput(e.target.value); setAnalyzed(false); }}
            placeholder="e.g. Water, Sugar, Wheat Flour, Soy Sauce, Modified Starch..."
            rows={5}
            style={{ width: "100%", borderRadius: 10, border: "1px solid #d1d5db", padding: "10px 12px", fontSize: 13, color: "#374151", resize: "none", boxSizing: "border-box", outline: "none" }}
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
              style={{ flex: 2, padding: "10px 0", borderRadius: 10, background: input.trim() ? "#10b981" : "#e5e7eb", border: "none", color: input.trim() ? "#fff" : "#9ca3af", fontWeight: 700, fontSize: 14, cursor: input.trim() ? "pointer" : "not-allowed" }}
            >
              Analyze
            </button>
          </div>
        </div>

        {/* Results */}
        {analyzed && results.length > 0 && (
          <>
            {/* Summary */}
            <div style={{ background: overallSafe ? "#d1fae5" : "#fee2e2", borderRadius: 14, border: `1px solid ${overallSafe ? "#6ee7b7" : "#fca5a5"}`, padding: "14px 16px", marginBottom: 16 }}>
              <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: overallSafe ? "#065f46" : "#7f1d1d" }}>
                {overallSafe ? "✓ No direct gluten sources found" : "✕ Gluten detected in this ingredient list"}
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 13, color: overallSafe ? "#059669" : "#dc2626" }}>
                {overallSafe
                  ? counts.uncertain > 0 ? `${counts.uncertain} ingredient(s) need verification` : "Looks safe — verify manufacturing practices"
                  : `${counts.unsafe} unsafe · ${counts.hidden} hidden risk · ${counts.uncertain} uncertain`}
              </p>
            </div>

            {/* Stat pills */}
            <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
              {(["unsafe", "hidden", "uncertain", "safe"] as Risk[]).map(risk => {
                const s = RISK_STYLE[risk];
                const count = counts[risk];
                if (count === 0) return null;
                return (
                  <div key={risk} style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}`, borderRadius: 99, padding: "4px 12px", fontSize: 12, fontWeight: 700 }}>
                    {count} {s.label}
                  </div>
                );
              })}
            </div>

            {/* Ingredient list */}
            {(["unsafe", "hidden", "uncertain", "safe"] as Risk[]).map(risk => {
              const group = results.filter(r => r.risk === risk);
              if (group.length === 0) return null;
              const s = RISK_STYLE[risk];
              return (
                <div key={risk} style={{ marginBottom: 12 }}>
                  <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: s.text, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {s.icon} {s.label}
                  </p>
                  {group.map((item, i) => (
                    <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: 10, padding: "10px 12px", marginBottom: 6 }}>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 13, color: s.text, textTransform: "capitalize" }}>{item.name}</p>
                      <p style={{ margin: "3px 0 0", fontSize: 12, color: s.text, opacity: 0.8 }}>{item.reason}</p>
                    </div>
                  ))}
                </div>
              );
            })}

            {/* Disclaimer */}
            <div style={{ background: "#f9fafb", borderRadius: 12, border: "1px solid #e5e7eb", padding: "12px 14px", marginTop: 8 }}>
              <p style={{ margin: 0, fontSize: 11, color: "#6b7280", lineHeight: 1.6 }}>
                <strong>Note:</strong> This tool detects common gluten sources. Always confirm with the manufacturer for certified gluten-free status, especially for "may contain" warnings and shared manufacturing lines.
              </p>
            </div>
          </>
        )}

        {/* Empty state */}
        {!analyzed && (
          <div style={{ textAlign: "center", padding: "40px 20px", color: "#9ca3af" }}>
            <span style={{ fontSize: 40 }}>🌾</span>
            <p style={{ margin: "12px 0 4px", fontSize: 15, fontWeight: 600, color: "#374151" }}>Paste any ingredient list</p>
            <p style={{ margin: 0, fontSize: 13 }}>We'll flag unsafe, hidden, and uncertain gluten sources instantly</p>
          </div>
        )}
      </div>
    </div>
  );
}
