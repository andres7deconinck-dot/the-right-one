import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { Loader2, Send, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const Route = createFileRoute("/assistant")({
  head: () => ({ meta: [{ title: "AI Travel Assistant — GlutenGo" }] }),
  component: () => (
    <div className="flex min-h-screen flex-col bg-background">
      <SiteHeader />
      <div className="flex-1"><Assistant /></div>
      <SiteFooter />
    </div>
  ),
});

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "What can I eat safely in Tokyo?",
  "Safe gluten-free snacks in Spain?",
  "How do I explain cross-contamination in Thai?",
  "What should I avoid in Italy?",
];

function Assistant() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || loading) return;
    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/travel-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) {
        if (res.status === 429) toast.error("Rate limit reached, try again shortly.");
        else if (res.status === 402) toast.error("AI credits exhausted.");
        else toast.error("Assistant unavailable.");
        setLoading(false); return;
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "", soFar = "", done = false;
      setMessages((p) => [...p, { role: "assistant", content: "" }]);

      while (!done) {
        const { done: d, value } = await reader.read();
        if (d) break;
        buf += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, idx); buf = buf.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") { done = true; break; }
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              soFar += delta;
              setMessages((p) => p.map((m, i) => i === p.length - 1 ? { ...m, content: soFar } : m));
              scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
            }
          } catch { buf = line + "\n" + buf; break; }
        }
      }
    } catch (e: any) {
      toast.error(e.message || "Network error");
    } finally { setLoading(false); }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-200px)] max-w-3xl flex-col px-5 py-8">
      <div className="mb-4">
        <h1 className="font-display text-3xl">Travel Assistant</h1>
        <p className="text-sm text-muted-foreground">Calm, structured, safety-first answers.</p>
      </div>
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto rounded-3xl border border-border bg-card-soft p-5">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <Sparkles className="h-10 w-10 text-primary/60" />
            <p className="mt-3 text-muted-foreground">Ask anything about traveling gluten-free.</p>
            <div className="mt-6 grid w-full gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((s) => (
                <button key={s} onClick={() => send(s)} className="rounded-2xl border border-border bg-background px-4 py-3 text-left text-sm hover:border-primary hover:bg-card">{s}</button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-3 text-sm leading-relaxed ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-card border border-border"}`}>{m.content || "…"}</div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={(e) => { e.preventDefault(); send(); }} className="mt-3 flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about a country, dish, or phrase…" className="flex-1 rounded-full border border-border bg-card px-5 py-3 text-sm outline-none focus:border-primary" />
        <Button type="submit" size="icon" className="h-12 w-12 rounded-full" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}</Button>
      </form>
    </div>
  );
}
