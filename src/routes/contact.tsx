import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mail, Clock, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — GlutenGo" },
      { name: "description", content: "Get in touch with the GlutenGo team. We typically reply within 24 hours." },
      { property: "og:title", content: "Contact GlutenGo — We Reply Within 24 Hours" },
      { property: "og:description", content: "Questions, feedback, partnerships? Reach the GlutenGo team — most replies within 24 hours." },
      { property: "og:url", content: "https://glutengo.app/contact" },
    ],
  }),
  component: ContactPage,
});

const CONTACT_EMAIL = "info.deconinckdigital@gmail.com";

const CATEGORY_LABELS: Record<string, string> = {
  tech: "Technical issue",
  billing: "Billing question",
  translation: "Report a translation error",
  restaurant: "Report a restaurant error",
  partnership: "Partnership",
  question: "Other question",
};

function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("question");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const subject = encodeURIComponent(`[GlutenGo] ${CATEGORY_LABELS[category]} — from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nCategory: ${CATEGORY_LABELS[category]}\n\n${message}`
    );
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;

    setTimeout(() => {
      setSubmitting(false);
      setName(""); setEmail(""); setCategory("question"); setMessage("");
      toast.success("Your email client should open — just hit Send to reach us.");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="bg-hero">
        <div className="mx-auto max-w-3xl px-5 py-16 text-center">
          <h1 className="font-display text-5xl md:text-6xl">Get in touch</h1>
          <p className="mt-4 text-muted-foreground">We read every message. Most replies within 24 hours.</p>
        </div>
      </section>

      <div className="mx-auto grid max-w-5xl gap-10 px-5 py-12 md:grid-cols-[1fr_320px]">
        <form
          onSubmit={handleSubmit}
          className="rounded-3xl border border-border/60 bg-card p-7 shadow-soft"
        >
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" required value={name} onChange={e => setName(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1.5" />
            </div>
            <div>
              <Label htmlFor="cat">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="cat" className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="tech">Technical issue</SelectItem>
                  <SelectItem value="billing">Billing question</SelectItem>
                  <SelectItem value="translation">Report a translation error</SelectItem>
                  <SelectItem value="restaurant">Report a restaurant error</SelectItem>
                  <SelectItem value="partnership">Partnership</SelectItem>
                  <SelectItem value="question">Other question</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="msg">Message</Label>
              <Textarea id="msg" required rows={6} value={message} onChange={e => setMessage(e.target.value)} className="mt-1.5" />
            </div>
            <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Opening email…" : "Send message"}</Button>
          </div>
        </form>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-border/60 bg-card-soft p-5">
            <Clock className="h-5 w-5 text-primary" />
            <p className="mt-2 text-sm font-medium">Reply within 24 hours</p>
            <p className="mt-1 text-xs text-muted-foreground">Mon–Fri, faster on the Traveler & Family plans.</p>
          </div>
          <div className="rounded-2xl border border-border/60 bg-card-soft p-5">
            <Mail className="h-5 w-5 text-primary" />
            <p className="mt-2 text-sm font-medium">info.deconinckdigital@gmail.com</p>
            <p className="mt-1 text-xs text-muted-foreground">Or use the form — both reach the same inbox.</p>
          </div>
          <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-5">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            <p className="mt-2 text-sm font-medium">For medical emergencies</p>
            <p className="mt-1 text-xs text-muted-foreground">Call your local emergency number (112 in the EU, 911 in the US).</p>
          </div>
        </aside>
      </div>

      <SiteFooter />
    </div>
  );
}
