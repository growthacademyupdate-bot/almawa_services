"use client";

import {
  Calendar,
  Mail,
  Plus,
  Users,
  Briefcase,
  Download,
  X,
  Save,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

import { StatCard } from "@/components/admin/StatCard";
import { LeadsChart } from "@/components/admin/LeadsChart";
import { RecentLeadsTable } from "@/components/admin/RecentLeadsTable";
import { ConsultationTable } from "@/components/admin/ConsultationTable";
import { ServicesSummary } from "@/components/admin/ServicesSummary";
import { RecentActivityTimeline } from "@/components/admin/RecentActivityTimeline";

import { useApp } from "@/context/AppContext";

type LeadForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  stage: string;
  message: string;
};

const EMPTY_LEAD: LeadForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  service: "",
  stage: "Idea Stage",
  message: "",
};

function getIcon(title: string) {
  switch (title) {
    case "Total Leads":
      return Users;

    case "Consultations":
      return Calendar;

    case "Contact Messages":
      return Mail;

    case "Active Services":
      return Briefcase;

    default:
      return Users;
  }
}

function formatAdminDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value || "—";
  }

  return `${String(date.getUTCDate()).padStart(2, "0")}/${String(
    date.getUTCMonth() + 1,
  ).padStart(2, "0")}/${date.getUTCFullYear()}`;
}

export default function AdminDashboardPage() {
  const {
    leads,
    consultations,
    services,
    addLead,
  } = useApp();

  const [dashboardSearch, setDashboardSearch] =
    useState("");

  const [showAddLead, setShowAddLead] =
    useState(false);

  const [leadForm, setLeadForm] =
    useState<LeadForm>(EMPTY_LEAD);

  const [leadError, setLeadError] =
    useState("");

  /* =====================================================
     SEARCH
  ===================================================== */

  const searchQuery = dashboardSearch
    .trim()
    .toLowerCase();

  const matchesDashboardSearch = (
    text: string,
    categories: string[] = [],
  ) =>
    !searchQuery ||
    categories.includes(searchQuery) ||
    text.includes(searchQuery);

  /* =====================================================
     STATS
  ===================================================== */

  const stats = useMemo(() => {
    return [
      {
        title: "Total Leads",
        value: leads.length.toString(),
        change: "Live",
        trend: "up" as const,
      },
      {
        title: "Consultations",
        value: consultations.length.toString(),
        change: "Live",
        trend: "up" as const,
      },
      {
        title: "Contact Messages",
        value: leads.length.toString(),
        change: "Live",
        trend: "up" as const,
      },
      {
        title: "Active Services",
        value: services.length.toString(),
        change: "Live",
        trend: "up" as const,
      },
    ];
  }, [
    leads,
    consultations,
    services,
  ]);

  /* =====================================================
     CHART DATA
  ===================================================== */

  const chartData = useMemo(() => {
    const now = new Date();

    const result: {
      name: string;
      leads: number;
      consultations: number;
      conversions: number;
    }[] = [];

    for (
      let monthOffset = 5;
      monthOffset >= 0;
      monthOffset--
    ) {
      const date = new Date(
        now.getFullYear(),
        now.getMonth() - monthOffset,
        1,
      );

      const year = date.getFullYear();
      const month = date.getMonth();

      const monthName = date.toLocaleString(
        "en-US",
        {
          month: "short",
        },
      );

      const leadsInMonth = leads.filter(
        (lead) => {
          const leadDate =
            new Date(lead.date);

          return (
            leadDate.getFullYear() === year &&
            leadDate.getMonth() === month
          );
        },
      );

      const consultationsInMonth =
        consultations.filter(
          (consultation) => {
            const consultationDate =
              new Date(consultation.date);

            return (
              consultationDate.getFullYear() ===
                year &&
              consultationDate.getMonth() ===
                month
            );
          },
        );

      const conversions =
        leadsInMonth.filter(
          (lead) =>
            lead.status === "converted",
        ).length;

      result.push({
        name: monthName,
        leads: leadsInMonth.length,
        consultations:
          consultationsInMonth.length,
        conversions,
      });
    }

    return result;
  }, [
    leads,
    consultations,
  ]);

  /* =====================================================
     RECENT LEADS
  ===================================================== */

  const recentLeads = useMemo(() => {
    return [...leads]
      .filter((lead) => {
        if (!searchQuery) {
          return true;
        }

        const text = [
          lead.firstName,
          lead.lastName,
          lead.email,
          lead.phone,
          lead.service,
          lead.stage,
          lead.status,
          lead.message,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return matchesDashboardSearch(text, ["lead", "leads"]);
      })
      .sort(
        (a, b) =>
          new Date(b.date).getTime() -
          new Date(a.date).getTime(),
      )
      .slice(0, 5);
  }, [
    leads,
    searchQuery,
  ]);

  /* =====================================================
     RECENT CONSULTATIONS
  ===================================================== */

  const recentConsultations =
    useMemo(() => {
      return [...consultations]
        .filter((consultation) => {
          if (!searchQuery) {
            return true;
          }

          const text = [
            consultation.client,
            consultation.company,
            consultation.service,
            consultation.email,
            consultation.phone,
            consultation.status,
            consultation.message,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return matchesDashboardSearch(text, [
            "consultation",
            "consultations",
          ]);
        })
        .sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime(),
        )
        .slice(0, 5);
    }, [
      consultations,
      searchQuery,
    ]);

  /* =====================================================
     SERVICES
  ===================================================== */

  const servicesPerformance = useMemo(() => {
    return services
      .filter((service) => {
        if (!searchQuery) {
          return true;
        }

        const offeringText = (
          service.offerings ?? []
        ).join(" ");

        const text = [
          service.title,
          service.slug,
          offeringText,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return matchesDashboardSearch(text, ["service", "services"]);
      })
      .map((service) => ({
        name: service.title,
        title: service.title,
        slug: service.slug,
        clients: service.clients ?? 0,
        projects: service.projects ?? 0,
        offerings:
          service.offerings?.length ?? 0,
      }));
  }, [
    services,
    searchQuery,
  ]);

  /* =====================================================
     RECENT ACTIVITY
  ===================================================== */

  const recentActivities =
    useMemo(() => {
      const activities: {
        id: string;
        title: string;
        description: string;
        date: string;
        type: string;
      }[] = [];

      leads
        .filter((lead) => {
          if (!searchQuery) {
            return true;
          }

          const text = [
            lead.firstName,
            lead.lastName,
            lead.email,
            lead.phone,
            lead.service,
            lead.stage,
            lead.status,
            lead.message,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return matchesDashboardSearch(text, ["lead", "leads"]);
        })
        .slice(0, 5)
        .forEach((lead) => {
          activities.push({
            id: `lead-${lead.id}`,
            title: "New lead received",
            description: `${lead.firstName} ${lead.lastName} submitted a consultation request.`,
            date: lead.date,
            type: "lead",
          });
        });

      consultations
        .filter((consultation) => {
          if (!searchQuery) {
            return true;
          }

          const text = [
            consultation.client,
            consultation.company,
            consultation.service,
            consultation.email,
            consultation.phone,
            consultation.status,
            consultation.message,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return matchesDashboardSearch(text, [
            "consultation",
            "consultations",
          ]);
        })
        .slice(0, 5)
        .forEach(
          (consultation) => {
            activities.push({
              id: `consultation-${consultation.id}`,
              title: "Consultation request",
              description: `${consultation.client} requested a consultation.`,
              date: consultation.createdAt ?? consultation.date,
              type: "consultation",
            });
          },
        );

      services
        .filter((service) => {
          if (!service.createdAt) {
            return false;
          }

          const text = [
            service.title,
            service.slug,
            ...(service.offerings ?? []),
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return matchesDashboardSearch(text, ["service", "services"]);
        })
        .slice(0, 5)
        .forEach((service) => {
          activities.push({
            id: `service-${service.slug}`,
            title: "New service added",
            description: `${service.title} was added to your services.`,
            date: service.createdAt ?? new Date().toISOString(),
            type: "service",
          });
        });

      return activities
        .sort(
          (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime(),
        )
        .slice(0, 8);
    }, [
      leads,
      consultations,
      services,
      searchQuery,
    ]);

  /* =====================================================
     ADD LEAD
  ===================================================== */

  const updateLeadForm = (
    field: keyof LeadForm,
    value: string,
  ) => {
    setLeadForm((current) => ({
      ...current,
      [field]: value,
    }));

    setLeadError("");
  };

  const openAddLead = () => {
    setLeadForm({
      ...EMPTY_LEAD,
    });

    setLeadError("");
    setShowAddLead(true);
  };

  const closeAddLead = () => {
    setShowAddLead(false);

    setLeadForm({
      ...EMPTY_LEAD,
    });

    setLeadError("");
  };

  const saveLead = () => {
    if (
      !leadForm.firstName.trim() ||
      !leadForm.lastName.trim() ||
      !leadForm.email.trim() ||
      !leadForm.phone.trim() ||
      !leadForm.service.trim() ||
      !leadForm.message.trim()
    ) {
      setLeadError(
        "Please fill in all required fields.",
      );

      return;
    }

    addLead({
      firstName:
        leadForm.firstName.trim(),

      lastName:
        leadForm.lastName.trim(),

      email:
        leadForm.email.trim(),

      phone:
        leadForm.phone.trim(),

      service:
        leadForm.service.trim(),

      stage:
        leadForm.stage,

      message:
        leadForm.message.trim(),
    });

    closeAddLead();
  };

  /* =====================================================
     EXPORT REPORT
  ===================================================== */

  const generateReport = () => {
    const rows = [
      [
        "Type",
        "Name",
        "Company",
        "Service",
        "Status",
        "Date",
      ],

      ...leads.map((lead) => [
        "Lead",
        `${lead.firstName} ${lead.lastName}`,
        "",
        lead.service,
        lead.status,
        lead.date,
      ]),

      ...consultations.map(
        (consultation) => [
          "Consultation",
          consultation.client,
          consultation.company,
          consultation.service,
          consultation.status,
          consultation.date,
        ],
      ),
    ];

    const csv = rows
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(
                value,
              ).replaceAll(
                '"',
                '""',
              )}"`,
          )
          .join(","),
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      },
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;
    link.download =
      "almawa-dashboard-report.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">
            Dashboard Overview
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            Monitor your business website and client activity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          {/* SEARCH */}
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <input
              type="text"
              value={dashboardSearch}
              onChange={(event) =>
                setDashboardSearch(
                  event.target.value,
                )
              }
              placeholder="Search leads, services..."
              className="w-full h-10 bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-10 pr-10 text-sm outline-none transition-all"
            />

            {dashboardSearch && (
              <button
                type="button"
                onClick={() =>
                  setDashboardSearch("")
                }
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* REPORT */}
          <button
            type="button"
            onClick={generateReport}
            className="admin-btn-secondary h-10 px-4 whitespace-nowrap"
          >
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </button>

          {/* ADD LEAD */}
          <button
            type="button"
            onClick={openAddLead}
            className="admin-btn-primary h-10 px-4 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Lead
          </button>
        </div>
      </div>

      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          Showing {recentLeads.length} leads, {recentConsultations.length} consultations, and {servicesPerformance.length} services matching &quot;{dashboardSearch}&quot;.
        </p>
      )}

      {/* =================================================
          STATS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(
          (stat, index) => (
            <div
              key={stat.title}
              className="admin-animate-in"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <StatCard
                title={stat.title}
                value={stat.value}
                change={stat.change}
                trend={stat.trend}
                icon={getIcon(
                  stat.title,
                )}
              />
            </div>
          ),
        )}
      </div>

      {/* =================================================
          CHART + ACTIVITY
      ================================================= */}

      <div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 admin-animate-in"
        style={{
          animationDelay: "200ms",
        }}
      >
        <div className="lg:col-span-2">
          <LeadsChart
            data={chartData}
          />
        </div>

        <div className="lg:col-span-1">
          <RecentActivityTimeline
            activities={
              recentActivities
            }
          />
        </div>
      </div>

      {/* =================================================
          RECENT LEADS
      ================================================= */}

      <div
        className="admin-animate-in"
        style={{
          animationDelay: "300ms",
        }}
      >
        <RecentLeadsTable
          leads={recentLeads}
        />
      </div>

      {/* =================================================
          CONSULTATIONS + SERVICES
      ================================================= */}

      <div
        className="grid grid-cols-1 xl:grid-cols-2 gap-6 admin-animate-in"
        style={{
          animationDelay: "400ms",
        }}
      >
        <ConsultationTable
          consultations={
            recentConsultations
          }
        />

        <ServicesSummary
          services={
            servicesPerformance
          }
        />
      </div>

      {/* =================================================
          ADD LEAD MODAL
      ================================================= */}

      {showAddLead && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
          onMouseDown={(event) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              closeAddLead();
            }
          }}
        >
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-background border border-border shadow-2xl">

            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="text-lg font-bold font-display">
                  Add New Lead
                </h3>

                <p className="text-xs text-muted-foreground mt-1">
                  Create a lead manually.
                </p>
              </div>

              <button
                type="button"
                onClick={closeAddLead}
                className="p-2 rounded-lg hover:bg-secondary"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* FORM */}
            <div className="p-6 space-y-4">

              <div>
                <label className="admin-label">
                  First Name
                </label>

                <input
                  className="admin-input"
                  value={
                    leadForm.firstName
                  }
                  onChange={(event) =>
                    updateLeadForm(
                      "firstName",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div>
                <label className="admin-label">
                  Last Name
                </label>

                <input
                  className="admin-input"
                  value={
                    leadForm.lastName
                  }
                  onChange={(event) =>
                    updateLeadForm(
                      "lastName",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div>
                <label className="admin-label">
                  Email
                </label>

                <input
                  type="email"
                  className="admin-input"
                  value={leadForm.email}
                  onChange={(event) =>
                    updateLeadForm(
                      "email",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div>
                <label className="admin-label">
                  Phone
                </label>

                <input
                  className="admin-input"
                  value={leadForm.phone}
                  onChange={(event) =>
                    updateLeadForm(
                      "phone",
                      event.target.value,
                    )
                  }
                />
              </div>

              <div>
                <label className="admin-label">
                  Service
                </label>

                <input
                  className="admin-input"
                  value={leadForm.service}
                  onChange={(event) =>
                    updateLeadForm(
                      "service",
                      event.target.value,
                    )
                  }
                  placeholder="Business Consulting"
                />
              </div>

              <div>
                <label className="admin-label">
                  Stage
                </label>

                <select
                  className="admin-input"
                  value={leadForm.stage}
                  onChange={(event) =>
                    updateLeadForm(
                      "stage",
                      event.target.value,
                    )
                  }
                >
                  <option>
                    Idea Stage
                  </option>

                  <option>
                    Early Startup
                  </option>

                  <option>
                    Existing Business
                  </option>

                  <option>
                    MSME / SME
                  </option>
                </select>
              </div>

              <div>
                <label className="admin-label">
                  Message
                </label>

                <textarea
                  className="admin-input min-h-28 resize-none"
                  value={
                    leadForm.message
                  }
                  onChange={(event) =>
                    updateLeadForm(
                      "message",
                      event.target.value,
                    )
                  }
                />
              </div>

              {leadError && (
                <p className="text-sm text-red-500">
                  {leadError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={
                    closeAddLead
                  }
                  className="admin-btn-secondary"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveLead}
                  className="admin-btn-primary"
                >
                  <Save className="w-4 h-4" />
                  Add Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}