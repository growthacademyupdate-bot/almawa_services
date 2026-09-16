"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  blogsSeed,
  defaultSettings,
  gallerySeed,
  heroSlides as heroSeed,
  services as servicesSeed,
  testimonialsSeed,
  type ServiceItem,
} from "@/mock/data";
import {
  consultationRequests,
  recentLeads,
} from "@/lib/admin-data";

/* =========================================================
   STORAGE
========================================================= */

const KEY = "almawa_state_v1";

/* =========================================================
   LEAD
========================================================= */

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "converted"
  | "closed";

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  mobile?: string;
  phone: string;
  country?: string;
  subject?: string;
  service: string;
  stage: string;
  message: string;
  date: string;
  status: LeadStatus;
}

/* =========================================================
   CONSULTATION
========================================================= */

export type ConsultationStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

export interface Consultation {
  id: string;
  createdAt?: string;
  client: string;
  company: string;
  service: string;
  date: string;
  status: ConsultationStatus;
  email?: string;
  phone?: string;
  message?: string;
}

/* =========================================================
   TESTIMONIAL
========================================================= */

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  rating: number;
  comment: string;
  image: string;
  status:
    | "pending"
    | "approved"
    | "rejected";
  date: string;
}

/* =========================================================
   BLOG
========================================================= */

export interface Blog {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  date: string;
  image: string;
}

/* =========================================================
   HERO
========================================================= */

export interface HeroSlide {
  id: string;
  enabled: boolean;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
}

/* =========================================================
   SETTINGS
========================================================= */

export interface Settings {
  companyName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;

  social: {
    linkedin: string;
    twitter: string;
    facebook: string;
    instagram: string;
  };

  seoTitle: string;
  seoDescription: string;
  maintenanceMode: boolean;
}

/* =========================================================
   STATE
========================================================= */

interface State {
  hero: HeroSlide[];
  services: ServiceItem[];
  blogs: Blog[];
  testimonials: Testimonial[];
  leads: Lead[];
  consultations: Consultation[];
  gallery: string[];
  settings: Settings;
  isAdmin: boolean;
  visitors: number;
}

/* =========================================================
   CONTEXT API
========================================================= */

interface Ctx extends State {
  /* Admin */
  login: (
    email: string,
    password: string,
  ) => boolean;
  logout: () => void;

  /* Leads */
  addLead: (
    lead: Omit<
      Lead,
      "id" | "date" | "status"
    >,
  ) => void;

  updateLead: (
    id: string,
    patch: Partial<Lead>,
  ) => void;

  deleteLead: (
    id: string,
  ) => void;

  /* Consultations */
  addConsultation: (
    consultation: Omit<Consultation, "id">,
  ) => void;

  updateConsultation: (
    id: string,
    patch: Partial<Consultation>,
  ) => void;

  deleteConsultation: (
    id: string,
  ) => void;

  /* Testimonials */
  addTestimonial: (
    testimonial: Omit<
      Testimonial,
      "id" | "date" | "status"
    >,
  ) => void;

  setTestimonialStatus: (
    id: string,
    status: Testimonial["status"],
  ) => void;

  updateTestimonial: (
    id: string,
    patch: Partial<Testimonial>,
  ) => void;

  deleteTestimonial: (
    id: string,
  ) => void;

  /* Hero */
  upsertHero: (
    slide: HeroSlide,
  ) => void;

  deleteHero: (
    id: string,
  ) => void;

  /* Blog */
  upsertBlog: (
    blog: Blog,
  ) => void;

  deleteBlog: (
    id: string,
  ) => void;

  /* Services */
  upsertService: (
    service: ServiceItem,
  ) => void;

  deleteService: (
    slug: string,
  ) => void;

  /* Gallery */
  addGallery: (
    url: string,
  ) => void;

  deleteGallery: (
    url: string,
  ) => void;

  /* Settings */
  updateSettings: (
    patch: Partial<Settings>,
  ) => void;

  /* Consultation popup */
  openConsultation: (
    service?: string,
  ) => void;

  closeConsultation: () => void;

  consultationOpen: boolean;

  preselectedService:
    | string
    | undefined;

  /* Admin login popup */
  openAdminLogin: () => void;

  closeAdminLogin: () => void;

  adminLoginOpen: boolean;
}

/* =========================================================
   CONTEXT
========================================================= */

const AppContext =
  createContext<Ctx | null>(
    null,
  );

async function syncContent(
  collection: "services" | "blogs" | "testimonials",
  method: "POST" | "PATCH" | "DELETE",
  data: Record<string, unknown>,
) {
  const response = await fetch(`/api/admin/content/${collection}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`Unable to sync ${collection} with backend`);
  }
}

function mergeByKey<T extends object>(
  localItems: T[],
  backendItems: unknown,
  key: keyof T & string,
) {
  if (!Array.isArray(backendItems) || backendItems.length === 0) {
    return localItems;
  }

  const backendByKey = new Map(
    backendItems.map((item) => [String((item as T)[key]), item as T]),
  );
  const localKeys = new Set(localItems.map((item) => String(item[key])));
  const merged = localItems.map(
    (item) => backendByKey.get(String(item[key])) ?? item,
  );

  return [
    ...backendItems.filter(
      (item) => !localKeys.has(String((item as T)[key])),
    ),
    ...merged,
  ] as T[];
}

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState =
  (): State => ({
    hero: heroSeed,

    services: servicesSeed,

    blogs: blogsSeed,

    testimonials:
      testimonialsSeed,

    leads: recentLeads.map((lead) => ({
      id: String(lead.id),
      firstName: lead.name.split(" ")[0] ?? lead.name,
      lastName: lead.name.split(" ").slice(1).join(" "),
      email: lead.email,
      phone: "",
      company: lead.company,
      service: lead.service,
      stage: "Existing Business",
      message: "",
      date: lead.date,
      status: lead.status.toLowerCase() as LeadStatus,
    })),

    consultations: consultationRequests.map((consultation) => ({
      ...consultation,
      id: String(consultation.id),
      status: consultation.status.toLowerCase() as ConsultationStatus,
    })),

    gallery: gallerySeed,

    settings: defaultSettings,

    isAdmin: false,

    visitors: 12480,
  });

/* =========================================================
   PROVIDER
========================================================= */

export function AppProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] =
    useState<State>(
      initialState,
    );

  const [
    hydrated,
    setHydrated,
  ] = useState(false);

  const [
    consultationOpen,
    setConsultationOpen,
  ] = useState(false);

  const [
    preselectedService,
    setPreselectedService,
  ] = useState<
    string | undefined
  >();

  const [
    adminLoginOpen,
    setAdminLoginOpen,
  ] = useState(false);

  /* =======================================================
     LOAD LOCAL STORAGE
  ======================================================= */

  useEffect(() => {
    const loadBackendData = async () => {
      try {
        const [
          leadsResponse,
          consultationsResponse,
          servicesResponse,
          blogsResponse,
          testimonialsResponse,
        ] =
          await Promise.all([
            fetch("/api/leads"),
            fetch("/api/consultations"),
            fetch("/api/admin/content/services"),
            fetch("/api/admin/content/blogs"),
            fetch("/api/admin/content/testimonials"),
          ]);

        if (!leadsResponse.ok || !consultationsResponse.ok) {
          return;
        }

        const backendLeads = await leadsResponse.json();
        const backendConsultations =
          await consultationsResponse.json();
        const backendServices = servicesResponse.ok
          ? await servicesResponse.json()
          : [];
        const backendBlogs = blogsResponse.ok
          ? await blogsResponse.json()
          : [];
        const backendTestimonials = testimonialsResponse.ok
          ? await testimonialsResponse.json()
          : [];

        setState((current) => ({
          ...current,
          leads: Array.isArray(backendLeads)
            ? backendLeads.map((lead) => ({
                ...lead,
                id: String(lead._id ?? lead.id),
                date: lead.createdAt ?? lead.date,
              }))
            : current.leads,
          consultations: Array.isArray(backendConsultations)
            ? backendConsultations.map((consultation) => ({
                ...consultation,
                id: String(consultation._id ?? consultation.id),
                client:
                  consultation.client ??
                  `${consultation.firstName ?? ""} ${consultation.lastName ?? ""}`.trim(),
                date:
                  consultation.date ??
                  consultation.preferredDate ??
                  consultation.createdAt,
                status: consultation.status ?? "pending",
              }))
            : current.consultations,
          services: mergeByKey(current.services, backendServices, "slug"),
          blogs: mergeByKey(current.blogs, backendBlogs, "id"),
          testimonials:
            mergeByKey(current.testimonials, backendTestimonials, "id"),
        }));
      } catch (error) {
        console.error("Failed to load admin data from backend:", error);
      }
    };

    void loadBackendData();

    try {
      const raw =
        localStorage.getItem(
          KEY,
        );

      if (raw) {
        const parsed =
          JSON.parse(
            raw,
          ) as Partial<State>;

        setState(
          (current) => ({
            ...current,
            ...parsed,

            leads:
              parsed.leads?.length
                ? parsed.leads
                : current.leads,

            consultations:
              parsed.consultations?.length
                ? parsed.consultations
                : current.consultations,

            services:
              parsed.services?.length
                ? parsed.services
                : current.services,

            /*
             * Important:
             * Admin login should never be restored
             * from localStorage.
             */
            isAdmin: false,

          }),
        );
      }
    } catch (error) {
      console.error(
        "Failed to load Almawa state:",
        error,
      );
    }

    setHydrated(true);
  }, []);

  /* =======================================================
     SAVE LOCAL STORAGE
  ======================================================= */

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    try {
      const {
        isAdmin: _skip,
        ...persist
      } = state;

      localStorage.setItem(
        KEY,
        JSON.stringify(
          persist,
        ),
      );
    } catch (error) {
      console.error(
        "Failed to save Almawa state:",
        error,
      );
    }
  }, [
    state,
    hydrated,
  ]);

  /* =======================================================
     STATE PATCH HELPER
  ======================================================= */

  const patch = useCallback(
    (
      updater: (
        current: State,
      ) => State,
    ) => {
      setState(updater);
    },
    [],
  );

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const value: Ctx =
    useMemo(
      () => ({
        ...state,

        consultationOpen,

        preselectedService,

        adminLoginOpen,

        /* ================================================
           ADMIN LOGIN
        ================================================ */

        login: (
          email,
          password,
        ) => {
          const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || "admin@almawaservices.com";
          const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "admin123";

          if (
            email === adminEmail &&
            password === adminPassword
          ) {
            setState(
              (current) => ({
                ...current,
                isAdmin: true,
              }),
            );

            setAdminLoginOpen(
              false,
            );

            return true;
          }

          return false;
        },

        logout: () => {
          setState(
            (current) => ({
              ...current,
              isAdmin: false,
            }),
          );
        },

        /* ================================================
           LEADS
        ================================================ */

        addLead: (lead) => {
          void fetch("/api/leads", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(lead),
          }).catch((error) => {
            console.error("Failed to save lead to backend:", error);
          });

          patch((current) => ({
            ...current,
            leads: [
              {
                ...lead,
                id: crypto.randomUUID(),
                date: new Date().toISOString(),
                status: "new",
              },
              ...current.leads,
            ],
          }));
        },

        updateLead: (id, changes) => {
          void fetch(`/api/leads/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(changes),
          }).catch((error) => {
            console.error("Failed to update lead in backend:", error);
          });

          patch((current) => ({
            ...current,
            leads: current.leads.map((lead) =>
              lead.id === id ? { ...lead, ...changes } : lead,
            ),
          }));
        },

        deleteLead: (id) => {
          void fetch(`/api/leads/${id}`, {
            method: "DELETE",
          }).catch((error) => {
            console.error("Failed to delete lead from backend:", error);
          });

          patch((current) => ({
            ...current,
            leads: current.leads.filter((lead) => lead.id !== id),
          }));
        },

        /* ================================================
           CONSULTATIONS
        ================================================ */

        addConsultation: (consultation) => {
          const [firstName, ...lastNameParts] = consultation.client.split(" ");
          void fetch("/api/consultations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              firstName: firstName || consultation.client,
              lastName: lastNameParts.join(" ") || "Client",
              email: consultation.email || "admin@almawaservices.com",
              mobile: consultation.phone || "0000000000",
              phone: consultation.phone || "0000000000",
              country: "India",
              subject: consultation.service,
              service: consultation.service,
              stage: "Existing Business",
              message: consultation.message || "Scheduled consultation",
            }),
          }).catch((error) => {
            console.error("Failed to save consultation to backend:", error);
          });

          patch((current) => ({
            ...current,
            consultations: [
              {
                ...consultation,
                id: crypto.randomUUID(),
                createdAt: new Date().toISOString(),
              },
              ...current.consultations,
            ],
          }));
        },

        updateConsultation: (id, changes) => {
          void fetch(`/api/consultations/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(changes),
          }).catch((error) => {
            console.error("Failed to update consultation in backend:", error);
          });

          patch((current) => ({
            ...current,
            consultations: current.consultations.map((consultation) =>
              consultation.id === id
                ? { ...consultation, ...changes }
                : consultation,
            ),
          }));
        },

        deleteConsultation: (id) => {
          void fetch(`/api/consultations/${id}`, {
            method: "DELETE",
          }).catch((error) => {
            console.error("Failed to delete consultation from backend:", error);
          });

          patch((current) => ({
            ...current,
            consultations: current.consultations.filter(
              (consultation) => consultation.id !== id,
            ),
          }));
        },

        /* ================================================
           TESTIMONIALS
        ================================================ */

        addTestimonial: (
          testimonial,
        ) => {
          const created = {
            ...testimonial,
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            status: "pending" as const,
          };

          void syncContent("testimonials", "POST", created).catch((error) => {
            console.error("Failed to save testimonial to backend:", error);
          });

          patch((current) => ({
            ...current,
            testimonials: [created, ...current.testimonials],
          }));
        },

        setTestimonialStatus: (id, status) => {
          void syncContent("testimonials", "PATCH", { id, status }).catch(
            (error) => {
              console.error("Failed to update testimonial in backend:", error);
            },
          );

          patch((current) => ({
            ...current,
            testimonials: current.testimonials.map((testimonial) =>
              testimonial.id === id ? { ...testimonial, status } : testimonial,
            ),
          }));
        },

        updateTestimonial: (id, changes) => {
          void syncContent("testimonials", "PATCH", {
            id,
            ...changes,
          }).catch((error) => {
            console.error("Failed to update testimonial in backend:", error);
          });

          patch((current) => ({
            ...current,
            testimonials: current.testimonials.map((testimonial) =>
              testimonial.id === id
                ? { ...testimonial, ...changes }
                : testimonial,
            ),
          }));
        },

        deleteTestimonial: (id) => {
          void syncContent("testimonials", "DELETE", { id }).catch((error) => {
            console.error("Failed to delete testimonial from backend:", error);
          });

          patch((current) => ({
            ...current,
            testimonials: current.testimonials.filter(
              (testimonial) => testimonial.id !== id,
            ),
          }));
        },

        /* ================================================
           HERO
        ================================================ */

        upsertHero: (
          slide,
        ) =>
          patch(
            (current) => ({
              ...current,

              hero:
                current.hero.some(
                  (item) =>
                    item.id ===
                    slide.id,
                )
                  ? current.hero.map(
                      (item) =>
                        item.id ===
                        slide.id
                          ? slide
                          : item,
                    )
                  : [
                      ...current.hero,
                      slide,
                    ],
            }),
          ),

        deleteHero: (
          id,
        ) =>
          patch(
            (current) => ({
              ...current,

              hero:
                current.hero.filter(
                  (item) =>
                    item.id !== id,
                ),
            }),
          ),

        /* ================================================
           BLOG
        ================================================ */

        upsertBlog: (blog) => {
          const exists = state.blogs.some((item) => item.id === blog.id);
          void syncContent(
            "blogs",
            exists ? "PATCH" : "POST",
            blog as unknown as Record<string, unknown>,
          ).catch((error) => {
            console.error("Failed to save blog to backend:", error);
          });

          patch((current) => ({
            ...current,
            blogs: current.blogs.some((item) => item.id === blog.id)
              ? current.blogs.map((item) =>
                  item.id === blog.id ? blog : item,
                )
              : [blog, ...current.blogs],
          }));
        },

        deleteBlog: (id) => {
          void syncContent("blogs", "DELETE", { id }).catch((error) => {
            console.error("Failed to delete blog from backend:", error);
          });

          patch((current) => ({
            ...current,
            blogs: current.blogs.filter((blog) => blog.id !== id),
          }));
        },

        /* ================================================
           SERVICES
        ================================================ */

        upsertService: (service) => {
          const exists = state.services.some(
            (item) => item.slug === service.slug,
          );
          void syncContent(
            "services",
            exists ? "PATCH" : "POST",
            {
              ...service,
              id: service.slug,
            } as unknown as Record<string, unknown>,
          ).catch((error) => {
            console.error("Failed to save service to backend:", error);
          });

          patch((current) => ({
            ...current,
            services: current.services.some(
              (item) => item.slug === service.slug,
            )
              ? current.services.map((item) =>
                  item.slug === service.slug ? service : item,
                )
              : [service, ...current.services],
          }));
        },

        deleteService: (slug) => {
          void syncContent("services", "DELETE", { id: slug }).catch((error) => {
            console.error("Failed to delete service from backend:", error);
          });

          patch((current) => ({
            ...current,
            services: current.services.filter((service) => service.slug !== slug),
          }));
        },

        /* ================================================
           GALLERY
        ================================================ */

        addGallery: (
          url,
        ) =>
          patch(
            (current) => ({
              ...current,

              gallery: [
                url,
                ...current.gallery,
              ],
            }),
          ),

        deleteGallery: (
          url,
        ) =>
          patch(
            (current) => ({
              ...current,

              gallery:
                current.gallery.filter(
                  (item) =>
                    item !== url,
                ),
            }),
          ),

        /* ================================================
           SETTINGS
        ================================================ */

        updateSettings: (
          changes,
        ) =>
          patch(
            (current) => ({
              ...current,

              settings: {
                ...current.settings,
                ...changes,
              },
            }),
          ),

        /* ================================================
           CONSULTATION POPUP
        ================================================ */

        openConsultation: (
          service,
        ) => {
          setPreselectedService(
            service,
          );

          setConsultationOpen(
            true,
          );
        },

        closeConsultation: () => {
          setConsultationOpen(
            false,
          );

          setPreselectedService(
            undefined,
          );
        },

        /* ================================================
           ADMIN LOGIN POPUP
        ================================================ */

        openAdminLogin: () => {
          setAdminLoginOpen(
            true,
          );
        },

        closeAdminLogin: () => {
          setAdminLoginOpen(
            false,
          );
        },
      }),

      [
        state,
        consultationOpen,
        preselectedService,
        adminLoginOpen,
        patch,
      ],
    );

  return (
    <AppContext.Provider
      value={value}
    >
      {children}
    </AppContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useApp() {
  const context =
    useContext(
      AppContext,
    );

  if (!context) {
    throw new Error(
      "useApp must be used within AppProvider",
    );
  }

  return context;
}