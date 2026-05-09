import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
interface SafetyFactor {
  label: string;
  value: boolean | null;
  weight: number;
  icon: string;
  description: string;
}

interface Review {
  id: string;
  author: string;
  badge: "verified-celiac" | "frequent-reviewer" | "local-expert" | "trusted-contributor";
  date: string;
  feltSafe: boolean;
  staffKnowledge: boolean;
  dedicatedFryer: boolean | null;
  ccDiscussed: boolean;
  hadSymptoms: boolean;
  wouldReturn: boolean;
  comment: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
const RESTAURANT = {
  name: "Osteria della Salute",
  city: "Florence, Italy",
  cuisine: "Italian · Trattoria",
  address: "Via dei Servi 12, 50122 Firenze FI",
  phone: "+39 055 123 456",
  hours: "12:00–15:00, 19:00–22:30",
  image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80",
  safetyScore: 88,
  lastVerified: "2026-04-18",
  certification: "AIC Certified",
  totalReviews: 47,
  safetyFactors: [
    { label: "Dedicated Kitchen", value: true, weight: 25, icon: "🍳", description: "Completely separate preparation area for gluten-free meals" },
    { label: "Separate Fryer", value: true, weight: 20, icon: "🛢️", description: "Dedicated fryer used exclusively for GF items" },
    { label: "Cross-contamination Protocol", value: true, weight: 20, icon: "🛡️", description: "Staff follows documented CC prevention procedures" },
    { label: "Staff Training", value: true, weight: 15, icon: "🎓", description: "All kitchen staff trained on celiac safety" },
    { label: "GF Certification", value: true, weight: 10, icon: "✅", description: "AIC (Italian Celiac Association) certified" },
    { label: "Recent Verification", value: null, weight: 10, icon: "📋", description: "Verified within the last 6 months" },
  ] as SafetyFactor[],
  reviews: [
    {
      id: "1",
      author: "Sara M.",
      badge: "verified-celiac",
      date: "2026-04-20",
      feltSafe: true,
      staffKnowledge: true,
      dedicatedFryer: true,
      ccDiscussed: true,
      hadSymptoms: false,
      wouldReturn: true,
      comment: "Staff immediately understood when I mentioned celiac. They brought out the chef who explained exactly how they handle GF orders. Felt completely safe — no symptoms at all.",
    },
    {
      id: "2",
      author: "Marco T.",
      badge: "local-expert",
      date: "2026-03-15",
      feltSafe: true,
      staffKnowledge: true,
      dedicatedFryer: null,
      ccDiscussed: true,
      hadSymptoms: false,
      wouldReturn: true,
      comment: "Been here four times. Consistent and reliable. They note your celiac on the order ticket — the kitchen takes it very seriously.",
    },
    {
      id: "3",
      author: "Lena V.",
      badge: "trusted-contributor",
      date: "2026-02-08",
      feltSafe: true,
      staffKnowledge: false,
      dedicatedFryer: null,
      ccDiscussed: false,
      hadSymptoms: false,
      wouldReturn: true,
      comment: "Food was good and I felt fine. One server didn't fully understand celiac at first, but the manager stepped in and handled it well.",
    },
  ] as Review[],
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getScoreColor(score: number) {
  if (score >= 90) return { bg: "#d1fae5", text: "#065f46", border: "#6ee7b7", label: "Very Safe" };
  if (score >= 70) return { bg: "#fef3c7", text: "#92400e", border: "#fcd34d", label: "Moderate Risk" };
  return { bg: "#fee2e2", text: "#7f1d1d", border: "#fca5a5", label: "Potential Risk" };
}

function getBadgeStyle(badge: Review["badge"]) {
  const map = {
    "verified-celiac": { label: "Verified Celiac", bg: "#eff6ff", text: "#1e40af", icon: "🩺" },
    "frequent-reviewer": { label: "Frequent Reviewer", bg: "#f5f3ff", text: "#5b21b6", icon: "✍️" },
    "local-expert": { label: "Local Expert", bg: "#ecfdf5", text: "#065f46", icon: "📍" },
    "trusted-contributor": { label: "Trusted Contributor", bg: "#fff7ed", text: "#9a3412", icon: "⭐" },
  };
  return map[badge];
}

function SafetyPill({ value }: { value: boolean | null }) {
  if (value === true) return <span style={{ background: "#d1fae5", color: "#065f46", borderRadius: 99, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>Yes</span>;
  if (value === false) return <span style={{ background: "#fee2e2", color: "#7f1d1d", borderRadius: 99, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>No</span>;
  return <span style={{ background: "#f3f4f6", color: "#6b7280", borderRadius: 99, padding: "2px 10px", fontSize: 12, fontWeight: 600 }}>Unknown</span>;
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function SafetyScoreCard({ score, factors }: { score: number; factors: SafetyFactor[] }) {
  const colors = getScoreColor(score);
  const [expanded, setExpanded] = useState(false);

  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e5e7eb", overflow: "hidden", marginBottom: 16 }}>
      {/* Header */}
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #f3f4f6" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.05em" }}>Safety Score</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 4 }}>
              <span style={{ fontSize: 40, fontWeight: 800, color: colors.text, lineHeight: 1 }}>{score}</span>
              <span style={{ fontSize: 14, color: "#9ca3af" }}>/100</span>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}`, borderRadius: 8, padding: "6px 14px", fontWeight: 700, fontSize: 14 }}>
              {colors.label}
            </div>
            <p style={{ margin: "6px 0 0", fontSize: 11, color: "#9ca3af" }}>
              Last verified {new Date(RESTAURANT.lastVerified).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>
        {/* Progress bar */}
        <div style={{ marginTop: 14, background: "#f3f4f6", borderRadius: 99, height: 8, overflow: "hidden" }}>
          <div style={{ width: `${score}%`, height: "100%", background: score >= 90 ? "#10b981" : score >= 70 ? "#f59e0b" : "#ef4444", borderRadius: 99, transition: "width 0.6s ease" }} />
        </div>
      </div>

      {/* Factors */}
      <div style={{ padding: "0 20px" }}>
        {factors.slice(0, expanded ? factors.length : 4).map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < (expanded ? factors.length - 1 : 3) ? "1px solid #f9fafb" : "none" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 18 }}>{f.icon}</span>
              <div>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#111827" }}>{f.label}</p>
                <p style={{ margin: 0, fontSize: 11, color: "#9ca3af", marginTop: 1 }}>{f.description}</p>
              </div>
            </div>
            <SafetyPill value={f.value} />
          </div>
        ))}
      </div>

      {factors.length > 4 && (
        <button onClick={() => setExpanded(!expanded)} style={{ width: "100%", padding: "12px 20px", background: "#f9fafb", border: "none", borderTop: "1px solid #f3f4f6", cursor: "pointer", fontSize: 13, fontWeight: 600, color: "#3b82f6" }}>
          {expanded ? "Show less ↑" : `Show all ${factors.length} factors ↓`}
        </button>
      )}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const badge = getBadgeStyle(review.badge);
  return (
    <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "16px 18px", marginBottom: 12 }}>
      {/* Author */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "#e5e7eb", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: "#374151" }}>
            {review.author[0]}
          </div>
          <div>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#111827" }}>{review.author}</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, background: badge.bg, color: badge.text, borderRadius: 99, padding: "2px 8px", fontSize: 11, fontWeight: 600, marginTop: 2 }}>
              {badge.icon} {badge.label}
            </div>
          </div>
        </div>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>{new Date(review.date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>
      </div>

      {/* Safety grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, marginBottom: 12 }}>
        {[
          { label: "Felt safe", value: review.feltSafe },
          { label: "Staff knowledge", value: review.staffKnowledge },
          { label: "Dedicated fryer", value: review.dedicatedFryer },
          { label: "CC discussed", value: review.ccDiscussed },
          { label: "No symptoms", value: !review.hadSymptoms },
          { label: "Would return", value: review.wouldReturn },
        ].map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 13 }}>{item.value === true ? "✅" : item.value === false ? "❌" : "❓"}</span>
            <span style={{ fontSize: 12, color: "#374151" }}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Comment */}
      {review.comment && (
        <p style={{ margin: 0, fontSize: 13, color: "#4b5563", lineHeight: 1.6, borderTop: "1px solid #f3f4f6", paddingTop: 10 }}>
          "{review.comment}"
        </p>
      )}
    </div>
  );
}

function ReportModal({ onClose }: { onClose: () => void }) {
  const [selected, setSelected] = useState<string[]>([]);
  const options = [
    "Information appears outdated",
    "Unsafe gluten handling observed",
    "Fryer information is incorrect",
    "Misleading gluten-free claims",
    "Staff lacked celiac knowledge",
    "Other safety concern",
  ];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "flex-end" }}>
      <div style={{ background: "#fff", width: "100%", borderRadius: "20px 20px 0 0", padding: 24, maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>Report a Safety Concern</h3>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#6b7280" }}>Reports are reviewed by our safety team within 24h</p>
          </div>
          <button onClick={onClose} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
        {options.map((opt) => (
          <label key={opt} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: "1px solid #f3f4f6", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={selected.includes(opt)}
              onChange={() => setSelected(s => s.includes(opt) ? s.filter(x => x !== opt) : [...s, opt])}
              style={{ width: 18, height: 18, accentColor: "#ef4444" }}
            />
            <span style={{ fontSize: 14, color: "#374151" }}>{opt}</span>
          </label>
        ))}
        <button
          disabled={selected.length === 0}
          style={{ marginTop: 20, width: "100%", padding: "14px", borderRadius: 12, background: selected.length ? "#ef4444" : "#e5e7eb", color: selected.length ? "#fff" : "#9ca3af", border: "none", fontWeight: 700, fontSize: 15, cursor: selected.length ? "pointer" : "not-allowed" }}
        >
          Submit Report
        </button>
      </div>
    </div>
  );
}

// ─── Write Review Modal ────────────────────────────────────────────────────────
function WriteReviewModal({ onClose }: { onClose: () => void }) {
  const questions = [
    { key: "feltSafe", label: "Did you feel safe eating here?" },
    { key: "staffKnowledge", label: "Did staff understand celiac disease?" },
    { key: "dedicatedFryer", label: "Was there a dedicated fryer?" },
    { key: "ccDiscussed", label: "Was cross-contamination discussed?" },
    { key: "hadSymptoms", label: "Did you experience symptoms afterward?" },
    { key: "wouldReturn", label: "Would you trust this place again?" },
  ];
  const [answers, setAnswers] = useState<Record<string, boolean | null>>({});
  const [comment, setComment] = useState("");

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "flex-end" }}>
      <div style={{ background: "#fff", width: "100%", borderRadius: "20px 20px 0 0", padding: 24, maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <h3 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: "#111827" }}>Safety Review</h3>
          <button onClick={onClose} style={{ background: "#f3f4f6", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 16 }}>✕</button>
        </div>
        <p style={{ margin: "0 0 20px", fontSize: 13, color: "#6b7280" }}>Help the celiac community — answer these 6 safety questions</p>

        {questions.map((q) => (
          <div key={q.key} style={{ marginBottom: 16 }}>
            <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 600, color: "#374151" }}>{q.label}</p>
            <div style={{ display: "flex", gap: 8 }}>
              {["Yes", "No", "Not sure"].map((opt) => {
                const val = opt === "Yes" ? true : opt === "No" ? false : null;
                const active = answers[q.key] === val;
                return (
                  <button
                    key={opt}
                    onClick={() => setAnswers(a => ({ ...a, [q.key]: val }))}
                    style={{ flex: 1, padding: "10px 0", borderRadius: 10, border: `2px solid ${active ? "#3b82f6" : "#e5e7eb"}`, background: active ? "#eff6ff" : "#fff", color: active ? "#1d4ed8" : "#374151", fontWeight: 600, fontSize: 13, cursor: "pointer" }}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: "0 0 8px", fontSize: 14, fontWeight: 600, color: "#374151" }}>Additional safety notes (optional)</p>
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            placeholder="What should other celiac travelers know about this restaurant?"
            rows={4}
            style={{ width: "100%", borderRadius: 10, border: "1px solid #d1d5db", padding: "10px 12px", fontSize: 13, color: "#374151", resize: "none", boxSizing: "border-box" }}
          />
        </div>

        <button style={{ width: "100%", padding: 14, borderRadius: 12, background: "#10b981", color: "#fff", border: "none", fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
          Submit Safety Review
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RestaurantDetail() {
  const [showReport, setShowReport] = useState(false);
  const [showReview, setShowReview] = useState(false);

  const r = RESTAURANT;

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", background: "#f9fafb", minHeight: "100vh", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Hero image */}
      <div style={{ position: "relative", height: 220 }}>
        <img src={r.image} alt={r.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.6) 100%)" }} />
        {/* Back button */}
        <button style={{ position: "absolute", top: 16, left: 16, background: "rgba(255,255,255,0.9)", border: "none", borderRadius: 10, padding: "8px 12px", cursor: "pointer", fontWeight: 600, fontSize: 13 }}>
          ← Back
        </button>
        {/* Certification badge */}
        {r.certification && (
          <div style={{ position: "absolute", top: 16, right: 16, background: "#10b981", color: "#fff", borderRadius: 8, padding: "6px 10px", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
            ✅ {r.certification}
          </div>
        )}
        {/* Name overlay */}
        <div style={{ position: "absolute", bottom: 16, left: 16, right: 16 }}>
          <h1 style={{ margin: 0, color: "#fff", fontSize: 24, fontWeight: 800, lineHeight: 1.2 }}>{r.name}</h1>
          <p style={{ margin: "4px 0 0", color: "rgba(255,255,255,0.8)", fontSize: 13 }}>{r.cuisine} · {r.city}</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "16px 16px 100px" }}>
        {/* Quick info strip */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "14px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between" }}>
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" }}>{r.safetyScore}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>Safety Score</p>
          </div>
          <div style={{ width: 1, background: "#f3f4f6" }} />
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 20, fontWeight: 800, color: "#111827" }}>{r.totalReviews}</p>
            <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>Reviews</p>
          </div>
          <div style={{ width: 1, background: "#f3f4f6" }} />
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: "#10b981" }}>Verified</p>
            <p style={{ margin: 0, fontSize: 11, color: "#6b7280" }}>Apr 2026</p>
          </div>
        </div>

        {/* Safety Score Card */}
        <SafetyScoreCard score={r.safetyScore} factors={r.safetyFactors} />

        {/* Restaurant Card in fullscreen mode info */}
        <div style={{ background: "#eff6ff", borderRadius: 14, border: "1px solid #bfdbfe", padding: "14px 16px", marginBottom: 16, display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 24 }}>📋</span>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontWeight: 700, fontSize: 14, color: "#1e40af" }}>Show staff your safety card</p>
            <p style={{ margin: "2px 0 0", fontSize: 12, color: "#3b82f6" }}>Tap to open fullscreen translation card</p>
          </div>
          <button style={{ background: "#3b82f6", color: "#fff", border: "none", borderRadius: 8, padding: "8px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer", whiteSpace: "nowrap" }}>
            Open Card
          </button>
        </div>

        {/* Address / Hours */}
        <div style={{ background: "#fff", borderRadius: 14, border: "1px solid #e5e7eb", padding: "14px 16px", marginBottom: 16 }}>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>📍</span>
            <span style={{ fontSize: 13, color: "#374151" }}>{r.address}</span>
          </div>
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <span style={{ fontSize: 16 }}>🕐</span>
            <span style={{ fontSize: 13, color: "#374151" }}>{r.hours}</span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <span style={{ fontSize: 16 }}>📞</span>
            <a href={`tel:${r.phone}`} style={{ fontSize: 13, color: "#3b82f6", textDecoration: "none" }}>{r.phone}</a>
          </div>
        </div>

        {/* Reviews section */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <div>
              <h2 style={{ margin: 0, fontSize: 17, fontWeight: 800, color: "#111827" }}>Safety Reviews</h2>
              <p style={{ margin: "2px 0 0", fontSize: 12, color: "#6b7280" }}>{r.totalReviews} verified celiac reports</p>
            </div>
            <button
              onClick={() => setShowReview(true)}
              style={{ background: "#10b981", color: "#fff", border: "none", borderRadius: 10, padding: "8px 14px", fontWeight: 700, fontSize: 13, cursor: "pointer" }}
            >
              + Review
            </button>
          </div>
          {r.reviews.map(rev => <ReviewCard key={rev.id} review={rev} />)}
        </div>

        {/* Report button */}
        <button
          onClick={() => setShowReport(true)}
          style={{ width: "100%", padding: "12px", borderRadius: 12, background: "#fff", border: "1px solid #fca5a5", color: "#dc2626", fontWeight: 600, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
        >
          ⚠️ Report a Safety Concern
        </button>
      </div>

      {/* Modals */}
      {showReport && <ReportModal onClose={() => setShowReport(false)} />}
      {showReview && <WriteReviewModal onClose={() => setShowReview(false)} />}
    </div>
  );
}
