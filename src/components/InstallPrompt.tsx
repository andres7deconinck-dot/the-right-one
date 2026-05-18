import { useEffect, useState } from "react";
import { X, Download, Share } from "lucide-react";

type Platform = "android" | "ios" | null;

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  return null;
}

function isInStandaloneMode(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in navigator && (navigator as { standalone?: boolean }).standalone === true)
  );
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> } | null>(null);
  const [show, setShow] = useState(false);
  const [platform, setPlatform] = useState<Platform>(null);
  const [iosGuide, setIosGuide] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isInStandaloneMode()) return;
    if (sessionStorage.getItem("pwa-dismissed")) return;

    const p = detectPlatform();
    setPlatform(p);

    if (p === "android") {
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as typeof deferredPrompt);
        setShow(true);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }

    if (p === "ios") {
      // Show iOS guide after a 3-second delay so it doesn't appear immediately
      const t = setTimeout(() => setShow(true), 3000);
      return () => clearTimeout(t);
    }
  }, []);

  const dismiss = () => {
    sessionStorage.setItem("pwa-dismissed", "1");
    setDismissed(true);
    setShow(false);
  };

  const installAndroid = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShow(false);
    setDeferredPrompt(null);
  };

  if (!show || dismissed) return null;

  if (platform === "ios") {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl border border-border bg-card p-4 shadow-xl">
        <button onClick={dismiss} className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted">
          <X className="h-4 w-4" />
        </button>
        {!iosGuide ? (
          <div className="flex items-start gap-3">
            <img src="/favicon-192x192.png" alt="GlutenGo" className="h-12 w-12 rounded-xl" />
            <div className="flex-1 pr-4">
              <p className="font-semibold text-foreground">Install GlutenGo</p>
              <p className="mt-0.5 text-xs text-muted-foreground">Add to your home screen for quick access offline.</p>
              <button
                onClick={() => setIosGuide(true)}
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground"
              >
                <Share className="h-3.5 w-3.5" /> How to install
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p className="font-semibold text-foreground">How to install GlutenGo</p>
            <ol className="mt-2 space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">1</span>
                Tap the <Share className="mx-1 inline h-4 w-4 text-primary" /> <strong>Share</strong> button in Safari's toolbar
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">2</span>
                Scroll down and tap <strong>"Add to Home Screen"</strong>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-white">3</span>
                Tap <strong>"Add"</strong> — done!
              </li>
            </ol>
            <button onClick={dismiss} className="mt-3 text-xs text-muted-foreground underline">
              Got it
            </button>
          </div>
        )}
      </div>
    );
  }

  if (platform === "android" && deferredPrompt) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 rounded-2xl border border-border bg-card p-4 shadow-xl">
        <button onClick={dismiss} className="absolute right-3 top-3 rounded-full p-1 text-muted-foreground hover:bg-muted">
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3">
          <img src="/favicon-192x192.png" alt="GlutenGo" className="h-12 w-12 rounded-xl" />
          <div className="flex-1 pr-4">
            <p className="font-semibold text-foreground">Install GlutenGo</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Quick access, works offline for guides and emergency phrases.</p>
          </div>
        </div>
        <div className="mt-3 flex gap-2">
          <button
            onClick={installAndroid}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary py-2 text-sm font-medium text-primary-foreground"
          >
            <Download className="h-4 w-4" /> Install
          </button>
          <button onClick={dismiss} className="rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">
            Not now
          </button>
        </div>
      </div>
    );
  }

  return null;
}
