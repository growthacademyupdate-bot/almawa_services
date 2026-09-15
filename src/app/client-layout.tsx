"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ConsultationModal } from "@/components/site/ConsultationModal";
import { AdminLoginModal } from "@/components/site/AdminLoginModal";
import { Toaster } from "@/components/ui/sonner";

function MaintenanceGate({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [checkingMaintenance, setCheckingMaintenance] = useState(true);

  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    let cancelled = false;

    const checkMaintenanceMode = async () => {
      try {
        const response = await fetch("/api/settings", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error("Failed to check maintenance mode");
        }

        const data = await response.json();

        if (!cancelled) {
          setMaintenanceMode(data.maintenanceMode === true);
        }
      } catch (error) {
        console.error(
          "Failed to check maintenance mode:",
          error,
        );

        if (!cancelled) {
          setMaintenanceMode(false);
        }
      } finally {
        if (!cancelled) {
          setCheckingMaintenance(false);
        }
      }
    };

    void checkMaintenanceMode();

    return () => {
      cancelled = true;
    };
  }, []);

  // Never block the admin panel.
  if (isAdmin) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 bg-secondary/40">
          {children}
        </main>

        <Toaster />
      </div>
    );
  }

  // Wait until the backend check finishes.
  if (checkingMaintenance) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-muted border-t-[#ff5a1f]" />

          <p className="text-sm text-muted-foreground">
            Loading...
          </p>
        </div>

        <Toaster />
      </div>
    );
  }

  // Public website is disabled.
  if (maintenanceMode) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <div className="w-full max-w-xl text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#ff5a1f]/10">
            <svg
              className="h-10 w-10 text-[#ff5a1f]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.42 3.83 4.4 16.08a1.5 1.5 0 0 0 1.3 2.25h16.6a1.5 1.5 0 0 0 1.3-2.25L16.58 3.83a3 3 0 0 0-5.16 0ZM12 9v4m0 4h.01"
              />
            </svg>
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#ff5a1f]">
            Almawa Services
          </p>

          <h1 className="font-display text-4xl font-bold text-foreground sm:text-5xl">
            Website Under Maintenance
          </h1>

          <p className="mx-auto mt-5 max-w-lg text-base leading-7 text-muted-foreground">
            We are currently performing maintenance to improve our
            website and services. Please check back shortly.
          </p>

          <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-2 text-sm text-muted-foreground">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5a1f]" />
            We&apos;ll be back soon
          </div>
        </div>

        <Toaster />
      </div>
    );
  }

  // Normal public website.
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      <Footer />

      <ConsultationModal />
      <AdminLoginModal />

      <Toaster />
    </div>
  );
}

export function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [queryClient] = useState(
    () => new QueryClient(),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <MaintenanceGate>
          {children}
        </MaintenanceGate>
      </AppProvider>
    </QueryClientProvider>
  );
}