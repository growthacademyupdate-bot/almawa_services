"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Users,
  Briefcase,
  Layers,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ServiceSummary {
  name: string;
  title: string;
  slug: string;
  clients: number;
  projects: number;
  offerings: number;
}

interface ServicesSummaryProps {
  services: ServiceSummary[];
  hideHeader?: boolean;
  enableNavigation?: boolean;
}

export function ServicesSummary({
  services,
  hideHeader = false,
  enableNavigation = !hideHeader,
}: ServicesSummaryProps) {
  const router = useRouter();
  const [selectedService, setSelectedService] =
    useState<ServiceSummary | null>(null);

  return (
    <>
      {/* SERVICES CARD */}
      <div className="admin-card h-full flex flex-col">
        {!hideHeader && (
          <div className="admin-card-header mb-4">
            <div className="admin-card-title">
              <span className="title-dot" />
              Services Performance
            </div>

            {enableNavigation && (
              <button
                type="button"
                onClick={() => router.push("/admin/services")}
                className="text-sm font-semibold text-[#ff5a1f] hover:underline"
              >
                View All
              </button>
            )}
          </div>
        )}

        {/* SERVICE GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
          {services.length > 0 ? (
            services.map((service, index) => (
              <div
                key={`${service.slug || service.title || "service"}-${index}`}
                className="p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/60 transition-colors group"
              >
                <h4
                  className="font-semibold text-sm mb-3 group-hover:text-[#ff5a1f] transition-colors line-clamp-1"
                  title={service.title || service.name}
                >
                  {service.title || service.name}
                </h4>

                <div className="grid grid-cols-3 gap-3">
                  {/* CLIENTS */}
                  <div>
                    <Users className="w-4 h-4 text-blue-500 mb-1" />

                    <p className="text-xl font-bold font-display">
                      {service.clients}
                    </p>

                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Clients
                    </p>
                  </div>

                  {/* PROJECTS */}
                  <div>
                    <Briefcase className="w-4 h-4 text-emerald-500 mb-1" />

                    <p className="text-xl font-bold font-display">
                      {service.projects}
                    </p>

                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Projects
                    </p>
                  </div>

                  {/* OFFERINGS */}
                  <div>
                    <Layers className="w-4 h-4 text-purple-500 mb-1" />

                    <p className="text-xl font-bold font-display">
                      {service.offerings}
                    </p>

                    <p className="text-[10px] text-muted-foreground uppercase tracking-wide">
                      Offerings
                    </p>
                  </div>
                </div>

                {/* VIEW DETAILS */}
                <button
                  type="button"
                  onClick={() => setSelectedService(service)}
                  className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg bg-background border border-border hover:border-[#ff5a1f] hover:text-[#ff5a1f] transition-colors"
                >
                  View Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))
          ) : (
            <div className="col-span-full py-10 text-center text-sm text-muted-foreground">
              No services found.
            </div>
          )}
        </div>
      </div>

      {/* SERVICE DETAILS DIALOG */}
      <Dialog
        open={Boolean(selectedService)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedService(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-sm p-4">
          <DialogHeader>
            <DialogTitle className="text-base">
              {selectedService?.title || selectedService?.name}
            </DialogTitle>

            <DialogDescription className="text-xs">
              Service performance details.
            </DialogDescription>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-2">
              {/* CLIENTS */}
              <div className="rounded-md border border-border bg-secondary/40 px-3 py-2">
                <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                  Clients
                </p>

                <p className="mt-0.5 text-lg font-bold">
                  {selectedService.clients}
                </p>
              </div>

              {/* PROJECTS */}
              <div className="rounded-md border border-border bg-secondary/40 px-3 py-2">
                <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                  Projects
                </p>

                <p className="mt-0.5 text-lg font-bold">
                  {selectedService.projects}
                </p>
              </div>

              {/* OFFERINGS */}
              <div className="rounded-md border border-border bg-secondary/40 px-3 py-2">
                <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
                  Offerings
                </p>

                <p className="mt-0.5 text-lg font-bold">
                  {selectedService.offerings}
                </p>
              </div>

              {enableNavigation && (
                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      `/admin/services?search=${encodeURIComponent(
                        selectedService.title,
                      )}`,
                    )
                  }
                  className="admin-btn-primary mt-2 w-full"
                >
                  View Service Page
                </button>
              )}

            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}