import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/lib/auth";
import { LanguageProvider } from "@/lib/i18n";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-8xl text-primary">404</h1>
        <p className="mt-3 text-lg text-muted-foreground">This page wandered off the map.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90">
          Back home
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-3xl text-foreground">Something went wrong</h1>
        <p className="mt-3 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

const SITE_URL = "https://glutengo.app";
const OG_IMAGE = "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a6706554-d91b-4275-975f-d2711314496e/id-preview-1d6b7013--67dc511f-998f-4c49-8788-6950d0e7222a.lovable.app-1778154395131.png";

const ORG_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "GlutenGo",
  "url": SITE_URL,
  "logo": `${SITE_URL}/logo.png`,
  "description": "AI-powered gluten-free travel toolkit for celiac and gluten-intolerant travelers.",
  "sameAs": [],
});

const WEBSITE_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "GlutenGo",
  "url": SITE_URL,
  "description": "Gluten-free travel app: AI restaurant finder, translation cards, country guides for celiacs.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": { "@type": "EntryPoint", "urlTemplate": `${SITE_URL}/restaurants?q={search_term_string}` },
    "query-input": "required name=search_term_string",
  },
});

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GlutenGo — Gluten-Free Travel App for Celiac Travelers" },
      { name: "description", content: "Find gluten-free restaurants worldwide, generate celiac translation cards in 30+ languages, explore country guides and get AI travel help. Free to start." },
      { name: "keywords", content: "gluten-free travel, celiac travel app, gluten-free restaurants, celiac translation card, gluten intolerant travel, gluten-free country guide, coeliac travel" },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#16a34a" },
      { property: "og:site_name", content: "GlutenGo" },
      { property: "og:title", content: "GlutenGo — Gluten-Free Travel App for Celiac Travelers" },
      { property: "og:description", content: "Find gluten-free restaurants worldwide, generate celiac translation cards in 30+ languages, and explore country guides. AI-powered, free to start." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:image", content: OG_IMAGE },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:site", content: "@glutengoapp" },
      { name: "twitter:title", content: "GlutenGo — Gluten-Free Travel App for Celiac Travelers" },
      { name: "twitter:description", content: "Find gluten-free restaurants worldwide, generate celiac translation cards and explore country guides. AI-powered." },
      { name: "twitter:image", content: OG_IMAGE },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: SITE_URL },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" },
    ],
    scripts: [
      { type: "application/ld+json", children: ORG_SCHEMA },
      { type: "application/ld+json", children: WEBSITE_SCHEMA },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <LanguageProvider>
          <PaymentTestModeBanner />
          <Outlet />
          <Toaster richColors position="top-center" />
        </LanguageProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
