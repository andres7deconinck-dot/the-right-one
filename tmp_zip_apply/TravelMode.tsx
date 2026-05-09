import { useState } from "react";

// ─── Types & Data ─────────────────────────────────────────────────────────────
const TRANSLATIONS = [
  {
    lang: "Italian",
    flag: "🇮🇹",
    title: "Ho la celiachia",
    body: "Ho la celiachia e non posso mangiare glutine nemmeno in piccole quantità. Il glutine si trova nel grano, nell'orzo, nella segale e nel farro. La contaminazione incrociata è pericolosa per me. Per favore, preparate il mio pasto in una zona separata, con utensili puliti.",
    emergency: "Sono celiaco/a. Ho bisogno di assistenza medica.",
  },
  {
    lang: "Spanish",
    flag: "🇪🇸",
    title: "Tengo enfermedad celíaca",
    body: "Tengo enfermedad celíaca y no puedo comer gluten, ni siquiera en pequeñas cantidades. El gluten se encuentra en el trigo, cebada, centeno y espelta. La contaminación cruzada es peligrosa para mí. Por favor, prepara mi comida en una zona separada con utensilios limpios.",
    emergency: "Soy celíaco/a. Necesito asistencia médica.",
  },
  {
    lang: "French",
    flag: "🇫🇷",
    title: "Je suis cœliaque",
    body: "Je suis atteint(e) de la maladie cœliaque et je ne peux pas consommer de gluten, même en petites quantités. Le gluten est présent dans le blé, l'orge, le seigle et l'épeautre. La contamination croisée est dangereuse pour moi. Veuillez préparer mon repas dans un espace séparé avec des ustensiles propres.",
    emergency: "Je suis cœliaque. J'ai besoin d'une assistance médicale.",
  },
  {
    lang: "German",
    flag: "🇩🇪",
    title: "Ich habe Zöliakie",
    body: "Ich habe Zöliakie und kann kein Gluten essen, auch nicht in kleinen Mengen. Gluten ist in Weizen, Gerste, Roggen und Dinkel enthalten. Kreuzkontamination ist für mich gefährlich. Bitte bereiten Sie mein Essen in einem separaten Bereich mit sauberem Geschirr zu.",
    emergency: "Ich bin Zöliakie-Patient. Ich benötige medizinische Hilfe.",
  },
  {
    lang: "Japanese",
    flag: "🇯🇵",
    title: "私はセリアック病です",
    body: "私はセリアック病で、少量のグルテンでも食べることができません。グルテンは小麦、大麦、ライ麦、スペルト小麦に含まれています。交差汚染も危険です。別の調理器具と清潔な調理エリアで料理を作っていただけますか？醤油にも注意が必要です。",
    emergency: "私はセリアック病患者です。医療的な援助が必要です。",
  },
];

const CITY_TIPS = [
  {
    city: "Tokyo",
    flag: "🇯🇵",
    safeCount: 34,
    tip: "Soy sauce contains wheat. Ask for tamari-based GF soy sauce. Many ramen shops use wheat noodles — seek dedicated GF ramen spots.",
    risks: ["Soy sauce (shoyu)", "Tempura batter", "Miso (some brands)", "Ramen noodles"],
    safeFoods: ["Plain sushi rice + fresh fish", "Sashimi", "Yakitori (no tare)", "Plain edamame"],
  },
  {
    city: "Rome",
    flag: "🇮🇹",
    safeCount: 28,
    tip: "Italy has excellent celiac awareness thanks to AIC. Look for the AIC logo. Many restaurants offer dedicated GF pasta. Fritto misto often has hidden gluten.",
    risks: ["Fritto misto", "Shared pasta water", "Tiramisu", "Unlabeled breadcrumbs"],
    safeFoods: ["AIC-certified restaurants", "Fresh mozzarella", "Grilled meats", "GF pasta (dedicated pot)"],
  },
  {
    city: "Paris",
    flag: "🇫🇷",
    safeCount: 19,
    tip: "French cuisine relies heavily on wheat-based sauces (roux). Boulangeries rarely have GF options. Seek dedicated GF bakeries in the Marais district.",
    risks: ["Béchamel sauce", "Croissants & bread", "Crêpes", "French onion soup croutons"],
    safeFoods: ["Steak-frites (plain)", "Salade niçoise", "Bouillabaisse (check rouille)", "Dedicated GF patisseries"],
  },
];

// ─── Fullscreen Card Modal ─────────────────────────────────────────────────────
function FullscreenCard({ card, onClose }: { card: typeof TRANSLATIONS[0]; onClose: () => void }) {
  return (
    <div style={{ position: "fixed", inset: 0, background: "#fff", zIndex: 200, display: "flex", flexDirection: "column", padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
        <div>
          <span style={{ fontSize: 32 }}>{card.flag}</span>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#374151", marginLeft: 8 }}>{card.lang}</span>
        </div>
        <button onClick={onClose} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 600, cursor: "pointer" }}>Close</button>
      </div>

      {/* Medical card */}
      <div style={{ flex: 1, border: "3px solid #dc2626", borderRadius: 16, padding: 24, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: "#dc2626", color: "#fff", borderRadius: 8, padding: "8px 14px", display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "flex-start" }}>
          <span style={{ fontSize: 18 }}>⚕️</span>
          <span style={{ fontWeight: 700, fontSize: 14 }}>Medical Dietary Requirement</span>
        </div>

        <h2 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#111827" }}>{card.title}</h2>
        <p style={{ margin: 0, fontSize: 15, lineHeight: 1.7, color: "#374151" }}>{card.body}</p>

        <div style={{ marginTop: "auto", background: "#fff7ed", borderRadius: 10, padding: "12px 14px", border: "1px solid #fed7aa" }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "#9a3412", textTransform: "uppercase", letterSpacing: "0.05em" }}>Emergency phrase</p>
          <p style={{ margin: "4px 0 0", fontSize: 14, fontWeight: 600, color: "#c2410c" }}>{card.emergency}</p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Travel Mode Page ────────────────────────────────────────────────────
export default function TravelMode() {
  const [activeTab, setActiveTab] = useState<"cards" | "cities" | "tips">("cards");
  const [fullscreenCard, setFullscreenCard] = useState<typeof TRANSLATIONS[0] | null>(null);
  const [expandedCity, setExpandedCity] = useState<string | null>(null);

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", background: "#f9fafb", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", padding: "20px 16px 0", borderBottom: "1px solid #f3f4f6" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <span style={{ fontSize: 28 }}>✈️</span>
          <div>
            <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#111827" }}>Travel Mode</h1>
            <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>Your gluten-free travel assistant</p>
          </div>
        </div>
        {/* Tabs */}
        <div style={{ display: "flex", gap: 0 }}>
          {(["cards", "cities", "tips"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                flex: 1, padding: "10px 0", border: "none", background: "transparent", cursor: "pointer",
                fontSize: 13, fontWeight: 700, textTransform: "capitalize",
                color: activeTab === tab ? "#10b981" : "#6b7280",
                borderBottom: `2px solid ${activeTab === tab ? "#10b981" : "transparent"}`,
              }}
            >
              {tab === "cards" ? "🌍 Cards" : tab === "cities" ? "🗺️ Cities" : "💡 Tips"}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: "16px 16px 80px" }}>
        {/* TRANSLATION CARDS TAB */}
        {activeTab === "cards" && (
          <>
            <div style={{ background: "#eff6ff", borderRadius: 12, padding: "12px 14px", marginBottom: 16, border: "1px solid #bfdbfe" }}>
              <p style={{ margin: 0, fontSize: 13, color: "#1e40af", lineHeight: 1.5 }}>
                <strong>Show these cards to restaurant staff.</strong> They explain your celiac disease in their language. Works offline.
              </p>
            </div>
            {TRANSLATIONS.map((card) => (
              <div
                key={card.lang}
                style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "16px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 32 }}>{card.flag}</span>
                  <div>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: 15, color: "#111827" }}>{card.lang}</p>
                    <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>{card.title}</p>
                  </div>
                </div>
                <button
                  onClick={() => setFullscreenCard(card)}
                  style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: 10, padding: "10px 16px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
                >
                  Show
                </button>
              </div>
            ))}
          </>
        )}

        {/* CITIES TAB */}
        {activeTab === "cities" && (
          <>
            {CITY_TIPS.map((city) => (
              <div key={city.city} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", marginBottom: 12, overflow: "hidden" }}>
                <button
                  onClick={() => setExpandedCity(expandedCity === city.city ? null : city.city)}
                  style={{ width: "100%", padding: "16px", background: "transparent", border: "none", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "space-between", textAlign: "left" }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 28 }}>{city.flag}</span>
                    <div>
                      <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: "#111827" }}>{city.city}</p>
                      <p style={{ margin: "2px 0 0", fontSize: 12, color: "#10b981" }}>{city.safeCount} safe restaurants mapped</p>
                    </div>
                  </div>
                  <span style={{ color: "#6b7280", fontSize: 18 }}>{expandedCity === city.city ? "↑" : "↓"}</span>
                </button>

                {expandedCity === city.city && (
                  <div style={{ padding: "0 16px 16px", borderTop: "1px solid #f3f4f6" }}>
                    <p style={{ fontSize: 13, color: "#374151", lineHeight: 1.6, margin: "12px 0" }}>{city.tip}</p>

                    <div style={{ marginBottom: 12 }}>
                      <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "#dc2626", textTransform: "uppercase" }}>⚠️ Watch out for</p>
                      {city.risks.map(r => (
                        <div key={r} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
                          <span style={{ color: "#ef4444", fontSize: 14 }}>✕</span>
                          <span style={{ fontSize: 13, color: "#374151" }}>{r}</span>
                        </div>
                      ))}
                    </div>

                    <div>
                      <p style={{ margin: "0 0 8px", fontSize: 12, fontWeight: 700, color: "#065f46", textTransform: "uppercase" }}>✓ Generally safe</p>
                      {city.safeFoods.map(f => (
                        <div key={f} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0" }}>
                          <span style={{ color: "#10b981", fontSize: 14 }}>✓</span>
                          <span style={{ fontSize: 13, color: "#374151" }}>{f}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}

        {/* TIPS TAB */}
        {activeTab === "tips" && (
          <>
            {[
              { icon: "✈️", title: "At the airport", tips: ["Pack your own snacks for security", "Look for certified GF shops post-security", "Avoid shared serving tongs at buffets", "Download your translation cards before boarding"] },
              { icon: "🛒", title: "At the grocery store", tips: ["Look for local celiac association certified marks", "Oats are risky unless labelled certified GF", "Soy sauce nearly always contains wheat", "In Italy: look for the AIC logo (ear of wheat with a cross)"] },
              { icon: "🍽️", title: "At restaurants", tips: ["Call ahead during off-peak hours", "Speak to the chef, not just the waiter", "Ask about shared fryer explicitly", "Use your translation card and show it directly"] },
              { icon: "🚨", title: "If you're glutened", tips: ["Stay calm — symptoms peak at 2–4 hours", "Keep a list of local hospitals in your trip notes", "Carry antihistamines if your doctor recommends them", "Note what you ate for your next doctor visit"] },
            ].map((section) => (
              <div key={section.title} style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "16px", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                  <span style={{ fontSize: 22 }}>{section.icon}</span>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "#111827" }}>{section.title}</h3>
                </div>
                {section.tips.map((tip, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 0", borderTop: i > 0 ? "1px solid #f9fafb" : "none" }}>
                    <span style={{ color: "#10b981", fontWeight: 700, fontSize: 14, marginTop: 1 }}>·</span>
                    <span style={{ fontSize: 13, color: "#374151", lineHeight: 1.5 }}>{tip}</span>
                  </div>
                ))}
              </div>
            ))}
          </>
        )}
      </div>

      {fullscreenCard && <FullscreenCard card={fullscreenCard} onClose={() => setFullscreenCard(null)} />}
    </div>
  );
}
