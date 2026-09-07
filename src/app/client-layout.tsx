"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { usePathname } from "next/navigation";

import { AppProvider } from "@/context/AppContext";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { ConsultationModal } from "@/components/site/ConsultationModal";
import { AdminLoginModal } from "@/components/site/AdminLoginModal";
import { Toaster } from "@/components/ui/sonner";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <div className="min-h-screen flex flex-col">
          {!isAdmin && <Navbar />}
          <main className={`flex-1 ${!isAdmin ? "" : "bg-secondary/40"}`}>
            {children}
          </main>
          {!isAdmin && <Footer />}
          <ConsultationModal />
          <AdminLoginModal />
        </div>
        <Toaster />
      </AppProvider>
    </QueryClientProvider>
  );
}
