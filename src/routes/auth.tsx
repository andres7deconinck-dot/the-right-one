import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Wheat } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — GlutenGo" },
      { name: "description", content: "Sign in or create your free GlutenGo account to save trips, generate celiac translation cards and access the AI travel assistant." },
      { property: "og:title", content: "Sign in to GlutenGo" },
      { property: "og:description", content: "Sign in or create your free GlutenGo account — save trips, generate translation cards and use the AI travel assistant." },
      { property: "og:url", content: "https://glutengo.app/auth" },
    ],
  }),
  validateSearch: (s: Record<string, unknown>) => ({ redirect: typeof s.redirect === "string" ? s.redirect : undefined }),
  component: AuthPage,
});

function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();
  const search = Route.useSearch();
  const dest = (search.redirect && search.redirect.startsWith("/")) ? search.redirect : "/dashboard";

  useEffect(() => { if (user) navigate({ to: dest as any }); }, [user, navigate, dest]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: window.location.origin + "/dashboard", data: { full_name: name } },
        });
        if (error) throw error;
        toast.success("Account created! Check your email to confirm.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Welcome back!");
        navigate({ to: dest as any });
      }
    } catch (e: any) {
      toast.error(e.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin + "/dashboard" });
    if (result.error) { toast.error("Google sign-in failed"); setLoading(false); return; }
    if (result.redirected) return;
    navigate({ to: dest as any });
  };

  const handleApple = async () => {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("apple", { redirect_uri: window.location.origin + "/dashboard" });
    if (result.error) { toast.error("Apple sign-in failed"); setLoading(false); return; }
    if (result.redirected) return;
    navigate({ to: dest as any });
  };

  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden bg-hero md:flex md:flex-col md:justify-between md:p-12">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground"><Wheat className="h-5 w-5" /></span>
          <span className="font-display text-xl">GlutenGo</span>
        </Link>
        <div>
          <h2 className="font-display text-5xl leading-tight">Your safest travel companion.</h2>
          <p className="mt-4 max-w-md text-muted-foreground">Generate medical-grade gluten allergy cards in seconds. Trusted by celiac travelers in 40+ countries.</p>
        </div>
        <p className="text-xs text-muted-foreground">© GlutenGo</p>
      </div>
      <div className="flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl">{mode === "signin" ? "Welcome back" : "Create your account"}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{mode === "signin" ? "Sign in to access your cards and trips." : "Start with 3 free translation cards."}</p>

          <Button type="button" variant="outline" className="mt-6 w-full" onClick={handleGoogle} disabled={loading}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Continue with Google
          </Button>

          <Button type="button" variant="outline" className="mt-3 w-full" onClick={handleApple} disabled={loading}>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M16.365 1.43c0 1.14-.42 2.21-1.13 3-.77.85-2.04 1.51-3.08 1.43-.13-1.1.42-2.26 1.1-3.04.77-.86 2.07-1.5 3.11-1.39zM20.5 17.06c-.56 1.29-.83 1.87-1.55 3.01-1 1.59-2.4 3.57-4.13 3.58-1.54.02-1.93-1-4.02-.99-2.09.01-2.52 1.01-4.06.99-1.74-.02-3.06-1.81-4.06-3.4C.41 15.18-.55 9.97 1.79 7.04c1.32-1.65 3.41-2.61 5.37-2.61 2 0 3.26 1.1 4.91 1.1 1.6 0 2.58-1.1 4.89-1.1 1.74 0 3.59.95 4.91 2.59-4.31 2.36-3.61 8.5-1.37 10.04z"/></svg>
            Continue with Apple
          </Button>

          <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground"><div className="h-px flex-1 bg-border" />or<div className="h-px flex-1 bg-border" /></div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Traveler" required />
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>{loading ? "..." : mode === "signin" ? "Sign in" : "Create account"}</Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            {mode === "signin" ? "New here?" : "Already have an account?"}{" "}
            <button onClick={() => setMode(mode === "signin" ? "signup" : "signin")} className="font-medium text-primary hover:underline">
              {mode === "signin" ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
