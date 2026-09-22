"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Tag,
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
  category: string;
  status: string;
  displayOrder: number;
  shortDescription: string;
  createdAt: string;
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
              Recent Services
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

                <p className="min-h-10 text-xs leading-5 text-muted-foreground line-clamp-2">
                  {service.shortDescription || "No description available."}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1">
                    <Tag className="h-3 w-3" />
                    {service.category || "Uncategorized"}
                  </span>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${service.status.toLowerCase() === "active" ? "bg-emerald-500/10 text-emerald-700" : "bg-secondary"}`}>
                    <CheckCircle2 className="h-3 w-3" />
                    {service.status}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>Order {service.displayOrder}</span>
                  <span className="inline-flex items-center gap-1"><CalendarDays className="h-3 w-3" />{new Date(service.createdAt).toLocaleDateString()}</span>
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
              Service details.
            </DialogDescription>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-2">
              <div className="rounded-md border border-border bg-secondary/40 px-3 py-2">
                <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Category</p>
                <p className="mt-0.5 text-sm font-semibold">{selectedService.category || "Uncategorized"}</p>
              </div>

              <div className="rounded-md border border-border bg-secondary/40 px-3 py-2">
                <p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Description</p>
                <p className="mt-0.5 text-sm text-muted-foreground">{selectedService.shortDescription || "No description available."}</p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md border border-border bg-secondary/40 px-3 py-2"><p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Status</p><p className="mt-0.5 text-sm font-semibold">{selectedService.status}</p></div>
                <div className="rounded-md border border-border bg-secondary/40 px-3 py-2"><p className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">Order</p><p className="mt-0.5 text-sm font-semibold">{selectedService.displayOrder}</p></div>
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