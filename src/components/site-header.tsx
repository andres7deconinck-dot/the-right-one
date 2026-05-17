import { Link, useNavigate } from "@tanstack/react-router";
import { Wheat, Menu, X, ChevronDown, CreditCard, Sparkles, Smartphone, AlertCircle, Shield, Utensils, Wine, Pill, ShoppingBag, Plane, Map } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useLanguage } from "@/lib/i18n";
import type { LangCode } from "@/lib/translations";
import { getNavExtras } from "@/lib/navExtras";
import { checkIsAdmin } from "@/lib/blog.functions";

const SITE_LANGUAGES = [
  { code: "en", flag: "🇬🇧", name: "English" },
  { code: "nl", flag: "🇳🇱", name: "Nederlands" },
  { code: "fr", flag: "🇫🇷", name: "Français" },
];

function LanguageSelector() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { lang, setLang } = useLanguage();
  const selected = SITE_LANGUAGES.find(l => l.code === lang) ?? SITE_LANGUAGES[0];

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const select = (l: typeof SITE_LANGUAGES[0]) => {
    setLang(l.code as LangCode);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 py-1.5 text-sm transition-colors hover:bg-muted"
        aria-label="Select language"
      >
        <span className="text-base leading-none">{selected.flag}</span>
        <ChevronDown className={`h-3 w-3 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-48 overflow-hidden rounded-2xl border border-border bg-card shadow-glow">
          <div className="grid grid-cols-1 divide-y divide-border/50 max-h-80 overflow-y-auto">
            {SITE_LANGUAGES.map(l => (
              <button
                key={l.code}
                onClick={() => select(l)}
                className={`flex w-full items-center gap-3 px-3 py-2.5 text-sm transition-colors hover:bg-muted ${selected.code === l.code ? "text-primary font-medium bg-primary/5" : "text-foreground"}`}
              >
                <span className="text-xl">{l.flag}</span>
                <span>{l.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const SPOTS_BASE = [
  { to: "/restaurants", icon: Utensils, key: "restaurants" as const },
  { to: "/bars", icon: Wine, key: "bars" as const },
  { to: "/pharmacies", icon: Pill, key: "pharmacies" as const },
  { to: "/shops", icon: ShoppingBag, key: "shops" as const },
] as const;

const TOOL_BASE = [
  { to: "/cards", icon: CreditCard, descKey: "cards" as const },
  { to: "/assistant", icon: Sparkles, descKey: "assistant" as const },
  { to: "/travel-mode", icon: Smartphone, descKey: "travelMode" as const },
  { to: "/trips", icon: Plane, descKey: "trips" as const },
  { to: "/ingredient-analyzer", icon: Shield, descKey: "ingredient" as const },
  { to: "/emergency", icon: AlertCircle, descKey: "emergency" as const },
] as const;

export function SiteHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { t, lang } = useLanguage();
  const nx = getNavExtras(lang);
  const [open, setOpen] = useState(false);
  const [spotsOpen, setSpotsOpen] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const checkAdmin = useServerFn(checkIsAdmin);
  const { data: adminMeta } = useQuery({
    queryKey: ["check-admin-nav", user?.id],
    queryFn: () => checkAdmin({}),
    enabled: !!user,
    staleTime: 60_000,
  });

  const staticLinks = [
    { to: "/countries", label: t.nav.countries },
    { to: "/blog", label: "Blog" },
    { to: "/pricing", label: t.nav.pricing },
    ...(adminMeta?.isAdmin ? [{ to: "/admin", label: "Admin" }] : []),
  ];

  const SPOTS_META = SPOTS_BASE.map((s) => ({
    ...s,
    label: nx.spots[s.key].label,
    desc: nx.spots[s.key].desc,
  }));

  const TOOL_LABELS = [t.nav.translationCards, t.nav.aiAssistant, t.nav.travelMode, t.nav.trips, t.nav.ingredientAnalyzer, t.nav.emergencyPhrases];
  const toolLinks = TOOL_BASE.map((meta, i) => ({
    ...meta,
    label: TOOL_LABELS[i],
    desc: nx.tools[meta.descKey],
  }));

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            <Wheat className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">GlutenGo</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 md:flex">
          {/* Trips */}
          <Link to="/trips" className="text-sm text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground font-medium" }}>
            {t.nav.trips}
          </Link>

          {/* Find Spots dropdown */}
          <div className="relative" onMouseEnter={() => setSpotsOpen(true)} onMouseLeave={() => setSpotsOpen(false)}>
            <button className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground" aria-haspopup="true" aria-expanded={spotsOpen}>
              {nx.findSpots} <ChevronDown className={`h-3.5 w-3.5 transition-transform ${spotsOpen ? "rotate-180" : ""}`} />
            </button>
            {spotsOpen && (
              <div className="absolute left-1/2 top-full z-50 w-64 -translate-x-1/2 pt-2">
                <div className="rounded-2xl border border-border bg-card p-2 shadow-glow">
                  {SPOTS_META.map((s) => (
                    <Link
                      key={s.to}
                      to={s.to}
                      className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted"
                      onClick={() => setSpotsOpen(false)}
                    >
                      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <s.icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{s.label}</p>
                        <p className="text-xs text-muted-foreground">{s.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Countries, Blog, Pricing, Admin */}
          {staticLinks.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground font-medium" }}>
              {l.label}
            </Link>
          ))}

          {/* Tools dropdown */}
          <div className="relative" onMouseEnter={() => setToolsOpen(true)} onMouseLeave={() => setToolsOpen(false)}>
            <button className="flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground" aria-haspopup="true" aria-expanded={toolsOpen}>
              {t.nav.tools} <ChevronDown className={`h-3.5 w-3.5 transition-transform ${toolsOpen ? "rotate-180" : ""}`} />
            </button>
            {toolsOpen && (
              <div className="absolute left-1/2 top-full z-50 w-72 -translate-x-1/2 pt-2">
                <div className="rounded-2xl border border-border bg-card p-2 shadow-glow">
                  {toolLinks.map((tl) => (
                    <Link
                      key={tl.to}
                      to={tl.to}
                      className="flex items-start gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-muted"
                      onClick={() => setToolsOpen(false)}
                    >
                      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                        <tl.icon className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground">{tl.label}</p>
                        <p className="text-xs text-muted-foreground">{tl.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <LanguageSelector />
          {user ? (
            <>
              <Button variant="ghost" onClick={() => navigate({ to: "/dashboard" })}>{t.nav.dashboard}</Button>
              <Button variant="outline" onClick={() => signOut()}>{t.nav.signOut}</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate({ to: "/auth", search: {} as any })}>{t.nav.signIn}</Button>
              <Button onClick={() => navigate({ to: "/auth", search: { mode: "signup" } as any })}>{t.nav.startFree}</Button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 p-4">
            <Link to="/trips" className="rounded-lg px-3 py-2 text-sm hover:bg-muted" onClick={() => setOpen(false)}>
              {t.nav.trips}
            </Link>
            <p className="mt-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Find Spots</p>
            {SPOTS_META.map((s) => (
              <Link key={s.to} to={s.to} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted" onClick={() => setOpen(false)}>
                <s.icon className="h-4 w-4 text-primary" />
                {s.label}
              </Link>
            ))}
            {staticLinks.map((l) => (
              <Link key={l.to} to={l.to} className="rounded-lg px-3 py-2 text-sm hover:bg-muted" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <p className="mt-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{t.nav.tools}</p>
            {toolLinks.map((tl) => (
              <Link key={tl.to} to={tl.to} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-muted" onClick={() => setOpen(false)}>
                <tl.icon className="h-4 w-4 text-primary" />
                {tl.label}
              </Link>
            ))}
            <div className="mt-2 flex items-center gap-2">
              <LanguageSelector />
              <div className="flex flex-1 gap-2">
                {user ? (
                  <>
                    <Button className="flex-1" onClick={() => { setOpen(false); navigate({ to: "/dashboard" }); }}>{t.nav.dashboard}</Button>
                    <Button variant="outline" className="flex-1" onClick={() => signOut()}>{t.nav.signOut}</Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" className="flex-1" onClick={() => { setOpen(false); navigate({ to: "/auth", search: {} as any }); }}>{t.nav.signIn}</Button>
                    <Button className="flex-1" onClick={() => { setOpen(false); navigate({ to: "/auth", search: {} as any }); }}>{t.nav.startFree}</Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="border-t border-border/60 bg-cream/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Wheat className="h-4 w-4" /></span>
            <span className="font-display text-lg font-semibold">GlutenGo</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">{t.footer.tagline}</p>
          <div className="mt-4 flex gap-3 text-muted-foreground">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram" className="hover:text-foreground">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer" aria-label="X" className="hover:text-foreground">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2H21l-6.52 7.45L22 22h-6.83l-4.78-6.26L4.8 22H2l7-7.99L1.5 2h6.99l4.32 5.71L18.244 2zm-2.39 18h1.86L7.25 4H5.27l10.585 16z"/></svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook" className="hover:text-foreground">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 22v-8h3l1-4h-4V7.5C13 6.6 13.5 6 14.7 6H17V2.2C16.6 2.1 15.3 2 14 2c-3 0-5 1.8-5 5v3H6v4h3v8h4z"/></svg>
            </a>
            <a href="https://tiktok.com" target="_blank" rel="noreferrer" aria-label="TikTok" className="hover:text-foreground">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19.6 6.3a5.7 5.7 0 0 1-3.4-1.1 5.7 5.7 0 0 1-2.2-3.7H10v13.4a2.7 2.7 0 1 1-2.7-2.7c.3 0 .6 0 .9.1V8.6a6.3 6.3 0 1 0 5.8 6.3V9.4a8.7 8.7 0 0 0 5.6 1.9V7.4a5.7 5.7 0 0 1 0-1.1z"/></svg>
            </a>
          </div>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">{t.footer.product}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/restaurants" className="hover:text-foreground">Restaurant Finder</Link></li>
            <li><Link to="/trips" className="hover:text-foreground">Trip Planner</Link></li>
            <li><Link to="/cards" className="hover:text-foreground">Translation Cards</Link></li>
            <li><Link to="/countries" className="hover:text-foreground">Country Guides</Link></li>
            <li><Link to="/assistant" className="hover:text-foreground">AI Assistant</Link></li>
            <li><Link to="/travel-mode" className="hover:text-foreground">Travel Mode</Link></li>
            <li><Link to="/ingredient-analyzer" className="hover:text-foreground">Ingredient Analyzer</Link></li>
            <li><Link to="/emergency" className="hover:text-foreground">Emergency Phrases</Link></li>
            <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">{t.footer.company}</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/resources" className="hover:text-foreground">Tips & Links</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
            <li><Link to="/privacy" className="hover:text-foreground">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">{t.footer.safety}</h4>
          <p className="text-sm text-muted-foreground">{t.footer.safetyText}</p>
        </div>
      </div>
      <div className="border-t border-border/60 px-5 py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} GlutenGo. {t.footer.copyright}</div>
    </footer>
  );
}
