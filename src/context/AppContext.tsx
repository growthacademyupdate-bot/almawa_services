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

const KEY = "almawa_state_v1";

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
  status: "new" | "contacted";
}

export interface Testimonial {
  id: string;
  name: string;
  company: string;
  rating: number;
  comment: string;
  image: string;
  status: "pending" | "approved" | "rejected";
  date: string;
}

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

export interface HeroSlide {
  id: string;
  enabled: boolean;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
}

export interface Settings {
  companyName: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  social: { linkedin: string; twitter: string; facebook: string; instagram: string };
  seoTitle: string;
  seoDescription: string;
}

interface State {
  hero: HeroSlide[];
  services: ServiceItem[];
  blogs: Blog[];
  testimonials: Testimonial[];
  leads: Lead[];
  gallery: string[];
  settings: Settings;
  isAdmin: boolean;
  visitors: number;
}

interface Ctx extends State {
  login: (email: string, password: string) => boolean;
  logout: () => void;
  addLead: (l: Omit<Lead, "id" | "date" | "status">) => void;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  deleteLead: (id: string) => void;
  addTestimonial: (t: Omit<Testimonial, "id" | "date" | "status">) => void;
  setTestimonialStatus: (id: string, status: Testimonial["status"]) => void;
  deleteTestimonial: (id: string) => void;
  upsertHero: (slide: HeroSlide) => void;
  deleteHero: (id: string) => void;
  upsertBlog: (b: Blog) => void;
  deleteBlog: (id: string) => void;
  upsertService: (s: ServiceItem) => void;
  deleteService: (slug: string) => void;
  addGallery: (url: string) => void;
  deleteGallery: (url: string) => void;
  updateSettings: (patch: Partial<Settings>) => void;
  openConsultation: (service?: string) => void;
  closeConsultation: () => void;
  consultationOpen: boolean;
  preselectedService: string | undefined;
  openAdminLogin: () => void;
  closeAdminLogin: () => void;
  adminLoginOpen: boolean;
}

const AppContext = createContext<Ctx | null>(null);

const initialState = (): State => ({
  hero: heroSeed,
  services: servicesSeed,
  blogs: blogsSeed,
  testimonials: testimonialsSeed,
  leads: [],
  gallery: gallerySeed,
  settings: defaultSettings,
  isAdmin: false,
  visitors: 12480,
});

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initialState);
  const [hydrated, setHydrated] = useState(false);
  const [consultationOpen, setConsultationOpen] = useState(false);
  const [preselectedService, setPreselectedService] = useState<string | undefined>();
  const [adminLoginOpen, setAdminLoginOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;
        setState((s) => ({ ...s, ...parsed, isAdmin: false }));
      }
    } catch {}
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      const { isAdmin: _skip, ...persist } = state;
      localStorage.setItem(KEY, JSON.stringify(persist));
    } catch {}
  }, [state, hydrated]);

  const patch = useCallback((fn: (s: State) => State) => setState(fn), []);

  const value: Ctx = useMemo(
    () => ({
      ...state,
      consultationOpen,
      preselectedService,
      adminLoginOpen,
      login: (email, password) => {
        if (email === "admin@almawaservices.com" && password === "admin123") {
          setState((s) => ({ ...s, isAdmin: true }));
          return true;
        }
        return false;
      },
      logout: () => setState((s) => ({ ...s, isAdmin: false })),
      addLead: (l) =>
        patch((s) => ({
          ...s,
          leads: [
            {
              ...l,
              id: crypto.randomUUID(),
              date: new Date().toISOString(),
              status: "new",
            },
            ...s.leads,
          ],
        })),
      updateLead: (id, p) =>
        patch((s) => ({
          ...s,
          leads: s.leads.map((x) => (x.id === id ? { ...x, ...p } : x)),
        })),
      deleteLead: (id) =>
        patch((s) => ({ ...s, leads: s.leads.filter((x) => x.id !== id) })),
      addTestimonial: (t) =>
        patch((s) => ({
          ...s,
          testimonials: [
            {
              ...t,
              id: crypto.randomUUID(),
              date: new Date().toISOString(),
              status: "pending",
            },
            ...s.testimonials,
          ],
        })),
      setTestimonialStatus: (id, status) =>
        patch((s) => ({
          ...s,
          testimonials: s.testimonials.map((x) =>
            x.id === id ? { ...x, status } : x,
          ),
        })),
      deleteTestimonial: (id) =>
        patch((s) => ({
          ...s,
          testimonials: s.testimonials.filter((x) => x.id !== id),
        })),
      upsertHero: (slide) =>
        patch((s) => ({
          ...s,
          hero: s.hero.some((x) => x.id === slide.id)
            ? s.hero.map((x) => (x.id === slide.id ? slide : x))
            : [...s.hero, slide],
        })),
      deleteHero: (id) =>
        patch((s) => ({ ...s, hero: s.hero.filter((x) => x.id !== id) })),
      upsertBlog: (b) =>
        patch((s) => ({
          ...s,
          blogs: s.blogs.some((x) => x.id === b.id)
            ? s.blogs.map((x) => (x.id === b.id ? b : x))
            : [b, ...s.blogs],
        })),
      deleteBlog: (id) =>
        patch((s) => ({ ...s, blogs: s.blogs.filter((x) => x.id !== id) })),
      upsertService: (svc) =>
        patch((s) => ({
          ...s,
          services: s.services.some((x) => x.slug === svc.slug)
            ? s.services.map((x) => (x.slug === svc.slug ? svc : x))
            : [...s.services, svc],
        })),
      deleteService: (slug) =>
        patch((s) => ({
          ...s,
          services: s.services.filter((x) => x.slug !== slug),
        })),
      addGallery: (url) =>
        patch((s) => ({ ...s, gallery: [url, ...s.gallery] })),
      deleteGallery: (url) =>
        patch((s) => ({ ...s, gallery: s.gallery.filter((x) => x !== url) })),
      updateSettings: (p) =>
        patch((s) => ({ ...s, settings: { ...s.settings, ...p } })),
      openConsultation: (service) => {
        setPreselectedService(service);
        setConsultationOpen(true);
      },
      closeConsultation: () => setConsultationOpen(false),
      openAdminLogin: () => setAdminLoginOpen(true),
      closeAdminLogin: () => setAdminLoginOpen(false),
    }),
    [state, consultationOpen, preselectedService, adminLoginOpen, patch],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}
