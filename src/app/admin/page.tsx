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
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { StatCard } from "@/components/admin/StatCard";
import { LeadsChart } from "@/components/admin/LeadsChart";
import { RecentLeadsTable } from "@/components/admin/RecentLeadsTable";
import { ConsultationTable } from "@/components/admin/ConsultationTable";
import { ServicesSummary } from "@/components/admin/ServicesSummary";
import { RecentActivityTimeline } from "@/components/admin/RecentActivityTimeline";

import {
  useApp,
  type Lead,
  type Consultation,
} from "@/context/AppContext";

type LeadForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  service: string;
  stage: string;
  message: string;
};

type DashboardService = {
  id?: string;
  slug: string;
  title: string;
  category?: string;
  status?: string;
  displayOrder?: number;
  shortDescription?: string;
  createdAt?: string;
  updatedAt?: string;
  clients?: number;
  projects?: number;
  offerings?: string[];
};

type ContactMessage = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  phone: string;
  country: string;
  subjects: string;
  msg: string;
  status?: string;
  createdAt?: string;
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

function normalizeLead(
  raw: Record<string, unknown>,
): Lead {
  return {
    id: String(
      raw._id ??
        raw.id ??
        "",
    ),

    firstName:
      typeof raw.firstName === "string"
        ? raw.firstName
        : "",

    lastName:
      typeof raw.lastName === "string"
        ? raw.lastName
        : "",

    email:
      typeof raw.email === "string"
        ? raw.email
        : "",

    mobile:
      typeof raw.mobile === "string"
        ? raw.mobile
        : undefined,

    phone:
      typeof raw.phone === "string"
        ? raw.phone
        : "",

    country:
      typeof raw.country === "string"
        ? raw.country
        : undefined,

    subject:
      typeof raw.subject === "string"
        ? raw.subject
        : undefined,

    service:
      typeof raw.service === "string"
        ? raw.service
        : "",

    stage:
      typeof raw.stage === "string"
        ? raw.stage
        : "",

    message:
      typeof raw.message === "string"
        ? raw.message
        : "",

    date:
      typeof raw.createdAt === "string"
        ? raw.createdAt
        : typeof raw.date === "string"
          ? raw.date
          : new Date().toISOString(),

    status:
      raw.status === "contacted" ||
      raw.status === "qualified" ||
      raw.status === "converted" ||
      raw.status === "closed"
        ? raw.status
        : "new",
  };
}

function normalizeConsultation(
  raw: Record<string, unknown>,
): Consultation {
  const clientFromNames =
    `${typeof raw.firstName === "string" ? raw.firstName : ""} ${
      typeof raw.lastName === "string" ? raw.lastName : ""
    }`.trim();

  const status =
    raw.status === "confirmed" ||
    raw.status === "completed" ||
    raw.status === "cancelled"
      ? raw.status
      : "pending";

  return {
    id: String(
      raw._id ??
        raw.id ??
        "",
    ),

    createdAt:
      typeof raw.createdAt === "string"
        ? raw.createdAt
        : undefined,

    client:
      typeof raw.client === "string"
        ? raw.client
        : clientFromNames,

    company:
      typeof raw.company === "string"
        ? raw.company
        : "",

    service:
      typeof raw.service === "string"
        ? raw.service
        : typeof raw.subject === "string"
          ? raw.subject
          : "",

    date:
      typeof raw.date === "string"
        ? raw.date
        : typeof raw.preferredDate === "string"
          ? raw.preferredDate
          : typeof raw.createdAt === "string"
            ? raw.createdAt
            : new Date().toISOString(),

    status,

    email:
      typeof raw.email === "string"
        ? raw.email
        : undefined,

    phone:
      typeof raw.phone === "string"
        ? raw.phone
        : typeof raw.mobile === "string"
          ? raw.mobile
          : undefined,

    message:
      typeof raw.message === "string"
        ? raw.message
        : undefined,
  };
}

function normalizeService(
  raw: Record<string, unknown>,
): DashboardService {
  return {
    id:
      typeof raw.id === "string"
        ? raw.id
        : raw._id
          ? String(raw._id)
          : undefined,

    slug:
      typeof raw.slug === "string"
        ? raw.slug
        : "",

    title:
      typeof raw.title === "string"
        ? raw.title
        : typeof raw.name === "string"
          ? raw.name
          : "Service",

    category:
      typeof raw.category === "string"
        ? raw.category
        : "",

    status:
      typeof raw.status === "string"
        ? raw.status
        : "Active",

    displayOrder:
      typeof raw.displayOrder === "number"
        ? raw.displayOrder
        : 0,

    shortDescription:
      typeof raw.shortDescription === "string"
        ? raw.shortDescription
        : "",

    createdAt:
      typeof raw.createdAt === "string"
        ? raw.createdAt
        : undefined,

    updatedAt:
      typeof raw.updatedAt === "string"
        ? raw.updatedAt
        : undefined,

    clients:
      typeof raw.clients === "number"
        ? raw.clients
        : 0,

    projects:
      typeof raw.projects === "number"
        ? raw.projects
        : 0,

    offerings:
      Array.isArray(raw.offerings)
        ? raw.offerings.map((item) =>
            String(item),
          )
        : [],

  };
}

function countInPeriod(
  dates: string[],
  start: number,
  end: number,
) {
  return dates.filter((value) => {
    const time = new Date(value).getTime();
    return Number.isFinite(time) && time >= start && time < end;
  }).length;
}

function normalizeContactMessage(
  raw: Record<string, unknown>,
): ContactMessage {
  return {
    _id: String(
      raw._id ?? "",
    ),

    firstname:
      typeof raw.firstname === "string"
        ? raw.firstname
        : "",

    lastname:
      typeof raw.lastname === "string"
        ? raw.lastname
        : "",

    email:
      typeof raw.email === "string"
        ? raw.email
        : "",

    mobile:
      typeof raw.mobile === "string"
        ? raw.mobile
        : "",

    phone:
      typeof raw.phone === "string"
        ? raw.phone
        : "",

    country:
      typeof raw.country === "string"
        ? raw.country
        : "",

    subjects:
      typeof raw.subjects === "string"
        ? raw.subjects
        : "",

    msg:
      typeof raw.msg === "string"
        ? raw.msg
        : "",

    status:
      typeof raw.status === "string"
        ? raw.status
        : "new",

    createdAt:
      typeof raw.createdAt === "string"
        ? raw.createdAt
        : undefined,
  };
}

export default function AdminDashboardPage() {
  const {
    addLead,
  } = useApp();

  /* =====================================================
     LIVE DATA
  ===================================================== */

  const [leads, setLeads] = useState<Lead[]>(
    [],
  );

  const [
    consultations,
    setConsultations,
  ] = useState<Consultation[]>(
    [],
  );

  const [
    services,
    setServices,
  ] = useState<DashboardService[]>(
    [],
  );

  const [
    contactMessages,
    setContactMessages,
  ] = useState<ContactMessage[]>(
    [],
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    dashboardError,
    setDashboardError,
  ] = useState("");

  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  /* =====================================================
     UI STATE
  ===================================================== */

  const [
    dashboardSearch,
    setDashboardSearch,
  ] = useState("");

  const [
    showAddLead,
    setShowAddLead,
  ] = useState(false);

  const [
    leadForm,
    setLeadForm,
  ] = useState<LeadForm>(
    EMPTY_LEAD,
  );

  const [
    leadError,
    setLeadError,
  ] = useState("");

  /* =====================================================
     LOAD LIVE DATA
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    const loadDashboardData =
      async () => {
        try {
          const [
            leadsResponse,
            consultationsResponse,
            servicesResponse,
            messagesResponse,
          ] = await Promise.all([
            fetch(
              "/api/leads",
              {
                cache: "no-store",
              },
            ),

            fetch(
              "/api/consultations",
              {
                cache: "no-store",
              },
            ),

            fetch(
              "/api/admin/services",
              {
                cache: "no-store",
              },
            ),

            fetch(
              "/api/contact",
              {
                cache: "no-store",
              },
            ),
          ]);

          if (cancelled) {
            return;
          }

          /* =========================
             LEADS
          ========================= */

          if (leadsResponse.ok) {
            const leadsData =
              await leadsResponse.json();

            if (
              Array.isArray(
                leadsData,
              )
            ) {
              setLeads(
                leadsData.map(
                  (item) =>
                    normalizeLead(
                      item,
                    ),
                ),
              );
            }
          }

          /* =========================
             CONSULTATIONS
          ========================= */

          if (
            consultationsResponse.ok
          ) {
            const consultationsData =
              await consultationsResponse.json();

            if (
              Array.isArray(
                consultationsData,
              )
            ) {
              setConsultations(
                consultationsData.map(
                  (item) =>
                    normalizeConsultation(
                      item,
                    ),
                ),
              );
            }
          }

          /* =========================
             SERVICES
          ========================= */

          if (
            servicesResponse.ok
          ) {
            const servicesData =
              await servicesResponse.json();

            const serviceItems = (
              Array.isArray(servicesData)
                ? servicesData
                : Array.isArray(servicesData.data)
                  ? servicesData.data
                  : []
            ) as Record<string, unknown>[];

            setServices(
              serviceItems.map(
                (item: Record<string, unknown>) =>
                  normalizeService(
                    item,
                  ),
              ),
            );
          }

          /* =========================
             CONTACT MESSAGES
          ========================= */

          if (
            messagesResponse.ok
          ) {
            const messagesData =
              await messagesResponse.json();

            if (
              Array.isArray(
                messagesData,
              )
            ) {
              setContactMessages(
                messagesData.map(
                  (item) =>
                    normalizeContactMessage(
                      item,
                    ),
                ),
              );
            }
          }

          setDashboardError("");
          setLastUpdated(new Date());
        } catch (error) {
          console.error(
            "Failed to load live dashboard data:",
            error,
          );

          if (!cancelled) {
            setDashboardError(
              "Unable to load live dashboard data.",
            );
          }
        } finally {
          if (!cancelled) {
            setLoading(false);
          }
        }
      };

    void loadDashboardData();

    /* Refresh every 5 seconds */
    const interval =
      window.setInterval(
        () => {
          void loadDashboardData();
        },
        5000,
      );

    /* Refresh when tab becomes active */
    const handleVisibility =
      () => {
        if (
          document.visibilityState ===
          "visible"
        ) {
          void loadDashboardData();
        }
      };

    document.addEventListener(
      "visibilitychange",
      handleVisibility,
    );

    return () => {
      cancelled = true;

      window.clearInterval(
        interval,
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibility,
      );
    };
  }, []);

  /* =====================================================
     SEARCH
  ===================================================== */

  const searchQuery =
    dashboardSearch
      .trim()
      .toLowerCase();

  const matchesDashboardSearch =
    (
      text: string,
      categories: string[] = [],
    ) =>
      !searchQuery ||
      categories.includes(
        searchQuery,
      ) ||
      text.includes(
        searchQuery,
      );

  /* =====================================================
     STATS
  ===================================================== */

  const stats = useMemo(() => {
    const now = Date.now();
    const currentStart = now - 30 * 24 * 60 * 60 * 1000;
    const previousStart = now - 60 * 24 * 60 * 60 * 1000;
    const currentPeriod = (dates: string[]) =>
      countInPeriod(dates, currentStart, now);
    const previousPeriod = (dates: string[]) =>
      countInPeriod(dates, previousStart, currentStart);
    const formatChange = (current: number, previous: number) => {
      if (current === 0 && previous === 0) return "No change";
      if (previous === 0) return "New";
      const percent = Math.round(((current - previous) / previous) * 100);
      return `${percent >= 0 ? "+" : ""}${percent}% / 30d`;
    };
    const trend = (current: number, previous: number) =>
      current >= previous ? "up" as const : "down" as const;
    const leadDates = leads.map((lead) => lead.date);
    const consultationDates = consultations.map((item) => item.createdAt ?? item.date);
    const messageDates = contactMessages.map((item) => item.createdAt ?? "");
    const currentLeads = currentPeriod(leadDates);
    const previousLeads = previousPeriod(leadDates);
    const currentConsultations = currentPeriod(consultationDates);
    const previousConsultations = previousPeriod(consultationDates);
    const currentMessages = currentPeriod(messageDates);
    const previousMessages = previousPeriod(messageDates);

    return [
      {
        title: "Total Leads",
        value:
          leads.length.toString(),
        change: loading ? "Loading" : formatChange(currentLeads, previousLeads),
        trend: trend(currentLeads, previousLeads),
      },

      {
        title: "Consultations",
        value:
          consultations.length.toString(),
        change: loading ? "Loading" : formatChange(currentConsultations, previousConsultations),
        trend: trend(currentConsultations, previousConsultations),
      },

      {
        title:
          "Contact Messages",
        value:
          contactMessages.length.toString(),
        change: loading ? "Loading" : formatChange(currentMessages, previousMessages),
        trend: trend(currentMessages, previousMessages),
      },

      {
        title:
          "Active Services",
        value:
          services.filter((service) => service.status?.toLowerCase() === "active").length.toString(),
        change: loading ? "Loading" : "Current",
        trend: "up" as const,
      },
    ];
  }, [
    leads,
    consultations,
    contactMessages,
    services,
    loading,
  ]);

  /* =====================================================
     CHART DATA
  ===================================================== */

  const chartData = useMemo(() => {
    const now =
      new Date();

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
      const date =
        new Date(
          now.getFullYear(),
          now.getMonth() -
            monthOffset,
          1,
        );

      const year =
        date.getFullYear();

      const month =
        date.getMonth();

      const monthName =
        date.toLocaleString(
          "en-US",
          {
            month: "short",
          },
        );

      const leadsInMonth =
        leads.filter(
          (lead) => {
            const leadDate =
              new Date(
                lead.date,
              );

            return (
              leadDate.getFullYear() ===
                year &&
              leadDate.getMonth() ===
                month
            );
          },
        );

      const consultationsInMonth =
        consultations.filter(
          (
            consultation,
          ) => {
            const consultationDate =
              new Date(
                consultation.date,
              );

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
            lead.status ===
            "converted",
        ).length;

      result.push({
        name:
          monthName,

        leads:
          leadsInMonth.length,

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

  const recentLeads =
    useMemo(() => {
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

          return matchesDashboardSearch(
            text,
            [
              "lead",
              "leads",
            ],
          );
        })
        .sort(
          (a, b) =>
            new Date(
              b.date,
            ).getTime() -
            new Date(
              a.date,
            ).getTime(),
        )
        .slice(
          0,
          5,
        );
    }, [
      leads,
      searchQuery,
    ]);

  /* =====================================================
     RECENT CONSULTATIONS
  ===================================================== */

  const recentConsultations =
    useMemo(() => {
      return [
        ...consultations,
      ]
        .filter(
          (
            consultation,
          ) => {
            if (
              !searchQuery
            ) {
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

            return matchesDashboardSearch(
              text,
              [
                "consultation",
                "consultations",
              ],
            );
          },
        )
        .sort(
          (a, b) =>
            new Date(
              b.date,
            ).getTime() -
            new Date(
              a.date,
            ).getTime(),
        )
        .slice(
          0,
          5,
        );
    }, [
      consultations,
      searchQuery,
    ]);

  /* =====================================================
     SERVICES
  ===================================================== */

  const servicesPerformance =
    useMemo(() => {
      return services
        .filter((service) => {
          if (!searchQuery) {
            return true;
          }

          const offeringText =
            (
              service.offerings ??
              []
            ).join(" ");

          const text = [
            service.title,
            service.slug,
            offeringText,
          ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

          return matchesDashboardSearch(
            text,
            [
              "service",
              "services",
            ],
          );
        })
        .map(
          (service) => ({
            name:
              service.title,

            title:
              service.title,

            slug:
              service.slug,

            clients:
              service.clients ??
              0,

            projects:
              service.projects ??
              0,

            offerings:
              service.offerings
                ?.length ?? 0,

            category:
              typeof service.category === "string"
                ? service.category
                : "",

            status:
              service.status ?? "Active",

            displayOrder:
              typeof service.displayOrder === "number"
                ? service.displayOrder
                : 0,

            shortDescription:
              typeof service.shortDescription === "string"
                ? service.shortDescription
                : "",

            createdAt:
              service.createdAt ?? "",
          }),
        );
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

      /* LEADS */

      [...leads]
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

          return matchesDashboardSearch(
            text,
            [
              "lead",
              "leads",
            ],
          );
        })
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(
          0,
          5,
        )
        .forEach(
          (lead) => {
            activities.push({
              id:
                `lead-${lead.id}`,

              title:
                "New lead received",

              description:
                `${lead.firstName} ${lead.lastName} submitted a consultation request.`,

              date:
                lead.date,

              type:
                "lead",
            });
          },
        );

      /* CONSULTATIONS */

      [...consultations]
        .filter(
          (
            consultation,
          ) => {
            if (
              !searchQuery
            ) {
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

            return matchesDashboardSearch(
              text,
              [
                "consultation",
                "consultations",
              ],
            );
          },
        )
        .sort((a, b) => new Date(b.createdAt ?? b.date).getTime() - new Date(a.createdAt ?? a.date).getTime())
        .slice(
          0,
          5,
        )
        .forEach(
          (
            consultation,
          ) => {
            activities.push({
              id:
                `consultation-${consultation.id}`,

              title:
                "Consultation request",

              description:
                `${consultation.client} requested a consultation.`,

              date:
                consultation.createdAt ??
                consultation.date,

              type:
                "consultation",
            });
          },
        );

      /* CONTACT MESSAGES */

      [...contactMessages]
        .sort((a, b) => new Date(b.createdAt ?? "").getTime() - new Date(a.createdAt ?? "").getTime())
        .slice(
          0,
          5,
        )
        .forEach(
          (message) => {
            activities.push({
              id:
                `message-${message._id}`,

              title:
                "New contact message",

              description:
                `${message.firstname} ${message.lastname} sent an enquiry.`,

              date:
                message.createdAt ??
                new Date().toISOString(),

              type:
                "message",
            });
          },
        );

      /* SERVICES */

      [...services]
        .filter(
          (service) =>
            Boolean(
              service.createdAt,
            ),
        )
        .filter(
          (service) => {
            const text = [
              service.title,
              service.slug,
              ...(service.offerings ??
                []),
            ]
              .filter(Boolean)
              .join(" ")
              .toLowerCase();

            return matchesDashboardSearch(
              text,
              [
                "service",
                "services",
              ],
            );
          },
        )
        .sort((a, b) => new Date(b.updatedAt ?? b.createdAt ?? "").getTime() - new Date(a.updatedAt ?? a.createdAt ?? "").getTime())
        .slice(
          0,
          5,
        )
        .forEach(
          (service) => {
            activities.push({
              id:
                `service-${service.slug}`,

              title:
                "Service updated",

              description:
                `${service.title} is available in your services.`,

              date:
                service.updatedAt ??
                service.createdAt ??
                new Date().toISOString(),

              type:
                "service",
            });
          },
        );

      return activities
        .sort(
          (a, b) =>
            new Date(
              b.date,
            ).getTime() -
            new Date(
              a.date,
            ).getTime(),
        )
        .slice(
          0,
          8,
        );
    }, [
      leads,
      consultations,
      contactMessages,
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
    setLeadForm(
      (current) => ({
        ...current,
        [field]:
          value,
      }),
    );

    setLeadError("");
  };

  const openAddLead =
    () => {
      setLeadForm({
        ...EMPTY_LEAD,
      });

      setLeadError("");
      setShowAddLead(true);
    };

  const closeAddLead =
    () => {
      setShowAddLead(false);

      setLeadForm({
        ...EMPTY_LEAD,
      });

      setLeadError("");
    };

  const saveLead =
    () => {
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

  const generateReport =
    () => {
      const rows = [
        [
          "Type",
          "Name",
          "Company",
          "Service",
          "Status",
          "Date",
        ],

        ...leads.map(
          (lead) => [
            "Lead",
            `${lead.firstName} ${lead.lastName}`,
            "",
            lead.service,
            lead.status,
            lead.date,
          ],
        ),

        ...consultations.map(
          (
            consultation,
          ) => [
            "Consultation",
            consultation.client,
            consultation.company,
            consultation.service,
            consultation.status,
            consultation.date,
          ],
        ),

        ...contactMessages.map(
          (message) => [
            "Contact Message",
            `${message.firstname} ${message.lastname}`,
            "",
            message.subjects,
            message.status ??
              "new",
            message.createdAt ??
              "",
          ],
        ),
      ];

      const csv =
        rows
          .map(
            (row) =>
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

      const blob =
        new Blob(
          [csv],
          {
            type:
              "text/csv;charset=utf-8;",
          },
        );

      const url =
        URL.createObjectURL(
          blob,
        );

      const link =
        document.createElement(
          "a",
        );

      link.href =
        url;

      link.download =
        "almawa-dashboard-report.csv";

      document.body.appendChild(
        link,
      );

      link.click();

      document.body.removeChild(
        link,
      );

      URL.revokeObjectURL(
        url,
      );
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

          <div className="mt-2 inline-flex items-center gap-2 text-xs text-muted-foreground">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Live data · refreshes automatically
            {lastUpdated && (
              <span>
                · updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
              </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          {/* SEARCH */}

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <input
              type="text"
              value={
                dashboardSearch
              }
              onChange={(
                event,
              ) =>
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
                  setDashboardSearch(
                    "",
                  )
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
            onClick={
              generateReport
            }
            className="admin-btn-secondary h-10 px-4 whitespace-nowrap"
          >
            <Download className="w-4 h-4 mr-2" />
            Generate Report
          </button>

          {/* ADD LEAD */}

          <button
            type="button"
            onClick={
              openAddLead
            }
            className="admin-btn-primary h-10 px-4 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Lead
          </button>
        </div>
      </div>

      {dashboardError && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {dashboardError}
        </div>
      )}

      {searchQuery && (
        <p className="text-sm text-muted-foreground">
          Showing{" "}
          {recentLeads.length}{" "}
          leads,{" "}
          {recentConsultations.length}{" "}
          consultations, and{" "}
          {servicesPerformance.length}{" "}
          services matching &quot;
          {dashboardSearch}
          &quot;.
        </p>
      )}

      {/* =================================================
          STATS
      ================================================= */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(
          (
            stat,
            index,
          ) => (
            <div
              key={
                stat.title
              }
              className="admin-animate-in"
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <StatCard
                title={
                  stat.title
                }
                value={
                  stat.value
                }
                change={
                  stat.change
                }
                trend={
                  stat.trend
                }
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
          animationDelay:
            "200ms",
        }}
      >
        <div className="lg:col-span-2">
          <LeadsChart
            data={
              chartData
            }
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
          animationDelay:
            "300ms",
        }}
      >
        <RecentLeadsTable
          leads={
            recentLeads
          }
        />
      </div>

      {/* =================================================
          CONSULTATIONS + SERVICES
      ================================================= */}

      <div
        className="grid grid-cols-1 xl:grid-cols-2 gap-6 admin-animate-in"
        style={{
          animationDelay:
            "400ms",
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
          onMouseDown={(
            event,
          ) => {
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
                onClick={
                  closeAddLead
                }
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
                  onChange={(
                    event,
                  ) =>
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
                  onChange={(
                    event,
                  ) =>
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
                  value={
                    leadForm.email
                  }
                  onChange={(
                    event,
                  ) =>
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
                  value={
                    leadForm.phone
                  }
                  onChange={(
                    event,
                  ) =>
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
                  value={
                    leadForm.service
                  }
                  onChange={(
                    event,
                  ) =>
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
                  value={
                    leadForm.stage
                  }
                  onChange={(
                    event,
                  ) =>
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
                  onChange={(
                    event,
                  ) =>
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
                  onClick={
                    saveLead
                  }
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