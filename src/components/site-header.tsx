import { Link, useNavigate } from "@tanstack/react-router";
import { Wheat, Menu, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

export function SiteHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { to: "/restaurants", label: "Restaurants" },
    { to: "/trips", label: "Trips" },
    { to: "/cards", label: "Cards" },
    { to: "/countries", label: "Countries" },
    { to: "/emergency", label: "Emergency" },
    { to: "/pricing", label: "Pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-soft">
            <Wheat className="h-5 w-5" strokeWidth={2.2} />
          </span>
          <span className="font-display text-xl font-semibold tracking-tight">GlutenGo</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="text-sm text-muted-foreground transition-colors hover:text-foreground" activeProps={{ className: "text-foreground font-medium" }}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <Button variant="ghost" onClick={() => navigate({ to: "/dashboard" })}>Dashboard</Button>
              <Button variant="outline" onClick={() => signOut()}>Sign out</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate({ to: "/auth" })}>Sign in</Button>
              <Button onClick={() => navigate({ to: "/auth", search: { mode: "signup" } as any })}>Start free</Button>
            </>
          )}
        </div>
        <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 p-4">
            {links.map((l) => (
              <Link key={l.to} to={l.to} className="rounded-lg px-3 py-2 text-sm hover:bg-muted" onClick={() => setOpen(false)}>
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex gap-2">
              {user ? (
                <>
                  <Button className="flex-1" onClick={() => { setOpen(false); navigate({ to: "/dashboard" }); }}>Dashboard</Button>
                  <Button variant="outline" className="flex-1" onClick={() => signOut()}>Sign out</Button>
                </>
              ) : (
                <>
                  <Button variant="outline" className="flex-1" onClick={() => { setOpen(false); navigate({ to: "/auth" }); }}>Sign in</Button>
                  <Button className="flex-1" onClick={() => { setOpen(false); navigate({ to: "/auth" }); }}>Start free</Button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-cream/40">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground"><Wheat className="h-4 w-4" /></span>
            <span className="font-display text-lg font-semibold">GlutenGo</span>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">Travel the world gluten-free, without the stress.</p>
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
          <h4 className="mb-3 text-sm font-semibold">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/restaurants" className="hover:text-foreground">Restaurant Finder</Link></li>
            <li><Link to="/trips" className="hover:text-foreground">Trip Planner</Link></li>
            <li><Link to="/cards" className="hover:text-foreground">Translation Cards</Link></li>
            <li><Link to="/countries" className="hover:text-foreground">Country Guides</Link></li>
            <li><Link to="/emergency" className="hover:text-foreground">Emergency Phrases</Link></li>
            <li><Link to="/pricing" className="hover:text-foreground">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">About</Link></li>
            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
            <li><Link to="/blog" className="hover:text-foreground">Blog</Link></li>
            <li><Link to="/privacy" className="hover:text-foreground">Privacy</Link></li>
            <li><Link to="/terms" className="hover:text-foreground">Terms</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Safety</h4>
          <p className="text-sm text-muted-foreground">GlutenGo provides translation tools and information. Always confirm preparation with restaurant staff. This is not medical advice.</p>
        </div>
      </div>
      <div className="border-t border-border/60 px-5 py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} GlutenGo. Made with care for celiac travelers.</div>
    </footer>
  );
}
