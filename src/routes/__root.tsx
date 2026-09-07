import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  useRouterState,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";

import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppProvider } from "../context/AppContext";
import { Navbar } from "../components/site/Navbar";
import { Footer } from "../components/site/Footer";
import { ConsultationModal } from "../components/site/ConsultationModal";
import { AdminLoginModal } from "../components/site/AdminLoginModal";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-black text-gradient">404</h1>
        <h2 className="mt-4 text-xl font-semibold">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center rounded-full gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Something went wrong. Try refreshing or go home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="rounded-full gradient-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Try again
          </button>
          <a href="/" className="rounded-full border border-input px-5 py-2.5 text-sm font-semibold">
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Almawa Services — Business Consulting, Incorporation & Fund Raising" },
      {
        name: "description",
        content:
          "Pan-India business consulting for startups and MSMEs — incorporation, certifications, company profiling, fund raising and digital marketing.",
      },
      { name: "author", content: "Almawa Services" },
      {
        property: "og:title",
        content: "Almawa Services — Business Consulting, Incorporation & Fund Raising",
      },
      {
        property: "og:description",
        content:
          "Pan-India business consulting for startups and MSMEs — incorporation, certifications, company profiling, fund raising and digital marketing.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Almawa Services — Business Consulting, Incorporation & Fund Raising" },
      { name: "twitter:description", content: "Pan-India business consulting for startups and MSMEs — incorporation, certifications, company profiling, fund raising and digital marketing." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f27f66d0-bc24-4cca-84b7-7acca27f453f/id-preview-9b5592bd--c7ec9878-211d-4256-aa96-ab8575d892cc.lovable.app-1783501275333.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f27f66d0-bc24-4cca-84b7-7acca27f453f/id-preview-9b5592bd--c7ec9878-211d-4256-aa96-ab8575d892cc.lovable.app-1783501275333.png" },
    ],
    links: [
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
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
      <AppProvider>
        <Shell />
      </AppProvider>
    </QueryClientProvider>
  );
}

function Shell() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = pathname.startsWith("/admin");
  return (
    <div className="min-h-screen flex flex-col">
      {!isAdmin && <Navbar />}
      <main className={`flex-1 ${!isAdmin ? "" : "bg-secondary/40"}`}>
        <Outlet />
      </main>
      {!isAdmin && <Footer />}
      <ConsultationModal />
      <AdminLoginModal />
    </div>
  );
}
