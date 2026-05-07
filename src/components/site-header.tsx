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
    { to: "/cards", label: "Translation Cards" },
    { to: "/countries", label: "Country Guides" },
    { to: "/assistant", label: "AI Assistant" },
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
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Product</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/cards">Translation Cards</Link></li>
            <li><Link to="/countries">Country Guides</Link></li>
            <li><Link to="/assistant">AI Assistant</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>About</li><li>Contact</li><li>Blog</li>
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-sm font-semibold">Safety</h4>
          <p className="text-sm text-muted-foreground">GlutenGo provides translation tools and guidance. Always confirm preparation with restaurant staff.</p>
        </div>
      </div>
      <div className="border-t border-border/60 px-5 py-4 text-center text-xs text-muted-foreground">© {new Date().getFullYear()} GlutenGo. Made with care for celiac travelers.</div>
    </footer>
  );
}
