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

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "GlutenGo — Travel the world gluten-free, without the stress" },
      { name: "description", content: "AI-powered travel toolkit for celiac and gluten-intolerant travelers: translation cards, safe restaurants, country guides and a smart chat assistant." },
      { property: "og:title", content: "GlutenGo — Travel the world gluten-free, without the stress" },
      { property: "og:description", content: "AI-powered travel toolkit for celiac and gluten-intolerant travelers: translation cards, safe restaurants, country guides and a smart chat assistant." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "GlutenGo — Travel the world gluten-free, without the stress" },
      { name: "twitter:description", content: "AI-powered travel toolkit for celiac and gluten-intolerant travelers: translation cards, safe restaurants, country guides and a smart chat assistant." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a6706554-d91b-4275-975f-d2711314496e/id-preview-1d6b7013--67dc511f-998f-4c49-8788-6950d0e7222a.lovable.app-1778154395131.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a6706554-d91b-4275-975f-d2711314496e/id-preview-1d6b7013--67dc511f-998f-4c49-8788-6950d0e7222a.lovable.app-1778154395131.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap" },
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
