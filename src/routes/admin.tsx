import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import {
  HiOutlineChartBar,
  HiOutlineLogout,
  HiOutlineExternalLink,
  HiOutlineInbox,
  HiOutlineChatAlt2,
  HiOutlineDocumentText,
  HiOutlineBriefcase,
  HiOutlinePhotograph,
  HiOutlineCog,
  HiOutlineViewBoards,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineX,
  HiOutlinePencil,
  HiOutlinePlus,
  HiOutlineEye,
  HiOutlineStar,
  HiOutlineMenu,
  HiOutlineChevronLeft,
  HiOutlineCloudUpload,
} from "react-icons/hi";
import { useApp } from "@/context/AppContext";
import type { Lead, Testimonial, Blog, HeroSlide, Settings } from "@/context/AppContext";
import type { ServiceItem } from "@/mock/data";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin — Almawa Services" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

type Section =
  | "dashboard"
  | "leads"
  | "testimonials"
  | "blogs"
  | "services"
  | "hero"
  | "gallery"
  | "settings";

const NAV_ITEMS: { key: Section; label: string; icon: ReactNode }[] = [
  { key: "dashboard", label: "Dashboard", icon: <HiOutlineChartBar /> },
  { key: "leads", label: "Leads", icon: <HiOutlineInbox /> },
  { key: "testimonials", label: "Testimonials", icon: <HiOutlineChatAlt2 /> },
  { key: "blogs", label: "Blogs", icon: <HiOutlineDocumentText /> },
  { key: "services", label: "Services", icon: <HiOutlineBriefcase /> },
  { key: "hero", label: "Hero Slider", icon: <HiOutlineViewBoards /> },
  { key: "gallery", label: "Gallery", icon: <HiOutlinePhotograph /> },
  { key: "settings", label: "Settings", icon: <HiOutlineCog /> },
];

/* ────────────────────────────────────────────────────────────────────── */
/*  Main Admin                                                          */
/* ────────────────────────────────────────────────────────────────────── */
function Admin() {
  const { isAdmin, openAdminLogin } = useApp();
  const [section, setSection] = useState<Section>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAdmin) openAdminLogin();
  }, [isAdmin, openAdminLogin]);

  if (!isAdmin) {
    return (
      <div className="min-h-screen grid place-items-center px-4">
        <div className="text-center max-w-md">
          <h1 className="text-3xl font-display font-bold">
            Admin access required
          </h1>
          <p className="mt-2 text-muted-foreground">
            Please sign in to access the dashboard.
          </p>
          <button
            onClick={openAdminLogin}
            className="mt-6 rounded-full gradient-primary text-primary-foreground px-6 py-3 text-sm font-bold shadow-elegant"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-secondary/40">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          style={{ animationDuration: "0.2s" }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-[100dvh] z-50 w-[260px] bg-[#0A0F1C] text-slate-300 flex flex-col transition-transform duration-300 lg:translate-x-0 lg:sticky lg:top-0 lg:z-auto border-r border-white/5 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-2xl lg:shadow-none`}
      >
        <div className="h-16 px-5 flex items-center gap-3 border-b border-white/5 shrink-0 bg-[#0A0F1C]">
          <div className="h-9 w-9 rounded-lg gradient-primary grid place-items-center text-primary-foreground font-black text-base shadow-lg shadow-primary/20">
            A
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-bold text-sm text-white truncate">Almawa Admin</div>
            <div className="text-[9px] uppercase tracking-wider text-primary/90 font-bold truncate">
              Control Panel
            </div>
          </div>
          <button
            className="lg:hidden ml-auto p-1.5 rounded-lg text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <HiOutlineX className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 py-4 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = section === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setSection(item.key);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-md shadow-primary/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className={`text-lg transition-colors ${isActive ? "text-primary-foreground" : "text-slate-500"}`}>
                  {item.icon}
                </span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2 shrink-0 bg-[#0A0F1C]/50">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <HiOutlineExternalLink className="text-lg text-slate-500" /> View Website
          </Link>
          <LogoutButton />
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background/80 backdrop-blur-lg border-b border-border px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-secondary"
            onClick={() => setSidebarOpen(true)}
          >
            <HiOutlineMenu className="h-5 w-5" />
          </button>
          <h1 className="text-lg font-display font-bold capitalize">
            {NAV_ITEMS.find((n) => n.key === section)?.label}
          </h1>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          {section === "dashboard" && <DashboardSection />}
          {section === "leads" && <LeadsSection />}
          {section === "testimonials" && <TestimonialsSection />}
          {section === "blogs" && <BlogsSection />}
          {section === "services" && <ServicesSection />}
          {section === "hero" && <HeroSection />}
          {section === "gallery" && <GallerySection />}
          {section === "settings" && <SettingsSection />}
        </main>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Logout Button                                                       */
/* ────────────────────────────────────────────────────────────────────── */
function LogoutButton() {
  const { logout } = useApp();
  const navigate = useNavigate();
  return (
    <button
      onClick={() => {
        logout();
        navigate({ to: "/" });
      }}
      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium bg-red-500/10 text-red-500 hover:bg-red-500/20 hover:text-red-400 transition-all"
    >
      <HiOutlineLogout className="text-lg" /> Logout
    </button>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Shared Components                                                   */
/* ────────────────────────────────────────────────────────────────────── */
function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-background p-5 shadow-card ${className}`}
    >
      {children}
    </div>
  );
}

function Badge({
  children,
  variant = "default",
}: {
  children: ReactNode;
  variant?: "default" | "success" | "warning" | "destructive" | "muted";
}) {
  const colors = {
    default: "bg-primary/10 text-primary",
    success: "bg-emerald-500/10 text-emerald-600",
    warning: "bg-amber-500/10 text-amber-600",
    destructive: "bg-red-500/10 text-red-600",
    muted: "bg-secondary text-muted-foreground",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${colors[variant]}`}
    >
      {children}
    </span>
  );
}

function EmptyState({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="text-4xl text-muted-foreground/40 mb-4">{icon}</div>
      <h3 className="font-display font-bold text-lg">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
    </div>
  );
}

function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  message,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background rounded-2xl p-6 max-w-sm w-full shadow-xl animate-scale-in">
        <h3 className="font-display font-bold text-lg">{title}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-6 flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-sm font-semibold border border-border hover:bg-secondary transition-all"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-xl text-sm font-semibold bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  Image Uploader (File Picker)                                        */
/* ────────────────────────────────────────────────────────────────────── */
function ImageUploader({
  value,
  onChange,
  label = "Upload Image",
}: {
  value: string;
  onChange: (dataUrl: string) => void;
  label?: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    },
    [onChange],
  );

  return (
    <div>
      <span className="admin-label">{label}</span>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <div
        className={`image-upload-zone ${value ? "has-image" : ""}`}
        onClick={() => fileRef.current?.click()}
      >
        {value ? (
          <img src={value} alt="Preview" />
        ) : (
          <>
            <div className="upload-icon">
              <HiOutlineCloudUpload />
            </div>
            <div className="upload-text">Click to upload image</div>
            <div className="upload-hint">PNG, JPG, WEBP up to 5MB</div>
          </>
        )}
      </div>
      {value && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onChange("");
          }}
          className="mt-2 text-xs text-red-500 hover:text-red-600 font-medium flex items-center gap-1"
        >
          <HiOutlineTrash className="h-3.5 w-3.5" /> Remove image
        </button>
      )}
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  1. Dashboard                                                        */
/* ────────────────────────────────────────────────────────────────────── */
function DashboardSection() {
  const { leads, testimonials, blogs, services, hero, gallery, visitors } =
    useApp();

  const stats = [
    {
      label: "Total Leads",
      value: leads.length,
      gradient: "linear-gradient(135deg, #f97316 0%, #f59e0b 100%)",
      icon: <HiOutlineInbox />,
    },
    {
      label: "Pending Reviews",
      value: testimonials.filter((t) => t.status === "pending").length,
      gradient: "linear-gradient(135deg, #eab308 0%, #f97316 100%)",
      icon: <HiOutlineChatAlt2 />,
    },
    {
      label: "Approved Reviews",
      value: testimonials.filter((t) => t.status === "approved").length,
      gradient: "linear-gradient(135deg, #22c55e 0%, #10b981 100%)",
      icon: <HiOutlineCheck />,
    },
    {
      label: "Blog Posts",
      value: blogs.length,
      gradient: "linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)",
      icon: <HiOutlineDocumentText />,
    },
    {
      label: "Services",
      value: services.length,
      gradient: "linear-gradient(135deg, #a855f7 0%, #ec4899 100%)",
      icon: <HiOutlineBriefcase />,
    },
    {
      label: "Hero Slides",
      value: hero.length,
      gradient: "linear-gradient(135deg, #f43f5e 0%, #ef4444 100%)",
      icon: <HiOutlineViewBoards />,
    },
    {
      label: "Gallery Items",
      value: gallery.length,
      gradient: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)",
      icon: <HiOutlinePhotograph />,
    },
    {
      label: "Visitors",
      value: visitors.toLocaleString(),
      gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
      icon: <HiOutlineEye />,
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div
            key={s.label}
            className="admin-stat-card admin-animate-in"
            style={{ background: s.gradient }}
          >
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Leads summary */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title"><span className="title-dot" />Recent Leads</div>
        </div>
        {leads.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No leads yet. Contact form submissions will appear here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {["Name", "Service", "Status", "Date"].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-bold"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {leads.slice(0, 5).map((l) => (
                  <tr
                    key={l.id}
                    className="border-b border-border/50 hover:bg-secondary/50 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">
                      {l.firstName} {l.lastName}
                    </td>
                    <td className="px-4 py-3">
                      <Badge>{l.service}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          l.status === "new" ? "warning" : "success"
                        }
                      >
                        {l.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground text-xs">
                      {new Date(l.date).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent Testimonials */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title"><span className="title-dot" />Recent Testimonials</div>
        </div>
        {testimonials.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">
            No testimonials yet.
          </p>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {testimonials.slice(0, 4).map((t) => (
              <div
                key={t.id}
                className="flex items-start gap-3 p-4 rounded-xl bg-secondary/50"
              >
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{t.name}</span>
                    <Badge
                      variant={
                        t.status === "approved"
                          ? "success"
                          : t.status === "pending"
                          ? "warning"
                          : "destructive"
                      }
                    >
                      {t.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {t.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  2. Leads Section                                                    */
/* ────────────────────────────────────────────────────────────────────── */
function LeadsSection() {
  const { leads, updateLead, deleteLead } = useApp();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [expandedLead, setExpandedLead] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {leads.length} total lead{leads.length !== 1 ? "s" : ""}
        </p>
      </div>

      {leads.length === 0 ? (
        <Card>
          <EmptyState
            icon={<HiOutlineInbox />}
            title="No leads yet"
            description="When visitors submit the contact form, their submissions will appear here."
          />
        </Card>
      ) : (
        <Card className="!p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-secondary">
                  {["Name", "Email", "Phone", "Service", "Stage", "Status", "Date", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="px-4 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground font-bold whitespace-nowrap"
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {leads.map((l) => (
                  <>
                    <tr
                      key={l.id}
                      className="border-t border-border/50 hover:bg-secondary/30 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium whitespace-nowrap">
                        {l.firstName} {l.lastName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {l.email}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {l.phone}
                      </td>
                      <td className="px-4 py-3">
                        <Badge>{l.service}</Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {l.stage}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={l.status === "new" ? "warning" : "success"}
                        >
                          {l.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs whitespace-nowrap">
                        {new Date(l.date).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            title="View message"
                            onClick={() =>
                              setExpandedLead(
                                expandedLead === l.id ? null : l.id
                              )
                            }
                            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                          >
                            <HiOutlineEye className="h-4 w-4" />
                          </button>
                          {l.status === "new" && (
                            <button
                              title="Mark contacted"
                              onClick={() =>
                                updateLead(l.id, { status: "contacted" })
                              }
                              className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-600 transition-all"
                            >
                              <HiOutlineCheck className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            title="Delete"
                            onClick={() => setConfirmDelete(l.id)}
                            className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-all"
                          >
                            <HiOutlineTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedLead === l.id && (
                      <tr key={`${l.id}-msg`}>
                        <td
                          colSpan={8}
                          className="px-6 py-4 bg-accent/30 text-sm"
                        >
                          <strong>Message:</strong>{" "}
                          {l.message || "No message provided."}
                        </td>
                      </tr>
                    )}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteLead(confirmDelete)}
        title="Delete Lead"
        message="Are you sure you want to delete this lead? This action cannot be undone."
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  3. Testimonials Section                                             */
/* ────────────────────────────────────────────────────────────────────── */
function TestimonialsSection() {
  const { testimonials, setTestimonialStatus, deleteTestimonial } = useApp();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  const filtered =
    filter === "all"
      ? testimonials
      : testimonials.filter((t) => t.status === filter);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 flex-wrap">
        {(["all", "pending", "approved", "rejected"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
              filter === f
                ? "gradient-primary text-primary-foreground shadow-lg"
                : "border border-border hover:border-primary hover:text-primary"
            }`}
          >
            {f}{" "}
            {f === "all"
              ? `(${testimonials.length})`
              : `(${testimonials.filter((t) => t.status === f).length})`}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={<HiOutlineChatAlt2 />}
            title={`No ${filter === "all" ? "" : filter} testimonials`}
            description="Testimonials submitted by visitors will appear here for your review."
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((t) => (
            <Card key={t.id} className="flex flex-col">
              <div className="flex items-start gap-3 mb-3">
                <img
                  src={t.image}
                  alt={t.name}
                  className="h-12 w-12 rounded-full object-cover ring-2 ring-border"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-display font-bold text-sm">
                    {t.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t.company}
                  </div>
                  <div className="flex items-center gap-0.5 mt-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <HiOutlineStar
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < t.rating
                            ? "text-amber-500 fill-amber-500"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <Badge
                  variant={
                    t.status === "approved"
                      ? "success"
                      : t.status === "pending"
                      ? "warning"
                      : "destructive"
                  }
                >
                  {t.status}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground flex-1 line-clamp-4">
                "{t.comment}"
              </p>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <span className="text-xs text-muted-foreground flex-1">
                  {new Date(t.date).toLocaleDateString()}
                </span>
                {t.status !== "approved" && (
                  <button
                    title="Approve"
                    onClick={() => setTestimonialStatus(t.id, "approved")}
                    className="p-1.5 rounded-lg hover:bg-emerald-500/10 text-emerald-600 transition-all"
                  >
                    <HiOutlineCheck className="h-4 w-4" />
                  </button>
                )}
                {t.status !== "rejected" && (
                  <button
                    title="Reject"
                    onClick={() => setTestimonialStatus(t.id, "rejected")}
                    className="p-1.5 rounded-lg hover:bg-amber-500/10 text-amber-600 transition-all"
                  >
                    <HiOutlineX className="h-4 w-4" />
                  </button>
                )}
                <button
                  title="Delete"
                  onClick={() => setConfirmDelete(t.id)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-all"
                >
                  <HiOutlineTrash className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteTestimonial(confirmDelete)}
        title="Delete Testimonial"
        message="Are you sure you want to permanently delete this testimonial?"
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  4. Blogs Section                                                    */
/* ────────────────────────────────────────────────────────────────────── */
function BlogsSection() {
  const { blogs, upsertBlog, deleteBlog } = useApp();
  const [editing, setEditing] = useState<Blog | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const empty: Blog = {
    id: "",
    slug: "",
    title: "",
    excerpt: "",
    content: "",
    category: "",
    author: "Almawa Editorial",
    date: new Date().toISOString().split("T")[0],
    image: "",
  };

  const handleSave = () => {
    if (!editing) return;
    const blog = {
      ...editing,
      id: editing.id || crypto.randomUUID(),
      slug:
        editing.slug ||
        editing.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, ""),
    };
    upsertBlog(blog);
    setEditing(null);
  };

  if (editing) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditing(null)}
            className="p-2 rounded-lg hover:bg-secondary"
          >
            <HiOutlineChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="font-display font-bold text-xl">
            {editing.id ? "Edit Blog" : "New Blog Post"}
          </h2>
        </div>
        <div className="admin-card">
          <div className="grid gap-5">
            <div>
              <label className="admin-label">Title</label>
              <input
                className="admin-input"
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
                placeholder="Blog post title"
              />
            </div>
            <div className="grid sm:grid-cols-3 gap-4">
              <div>
                <label className="admin-label">Category</label>
                <input
                  className="admin-input"
                  value={editing.category}
                  onChange={(e) =>
                    setEditing({ ...editing, category: e.target.value })
                  }
                  placeholder="e.g. Incorporation"
                />
              </div>
              <div>
                <label className="admin-label">Author</label>
                <input
                  className="admin-input"
                  value={editing.author}
                  onChange={(e) =>
                    setEditing({ ...editing, author: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="admin-label">Date</label>
                <input
                  type="date"
                  className="admin-input"
                  value={editing.date}
                  onChange={(e) =>
                    setEditing({ ...editing, date: e.target.value })
                  }
                />
              </div>
            </div>
            <ImageUploader
              label="Cover Image"
              value={editing.image}
              onChange={(url) => setEditing({ ...editing, image: url })}
            />
            <div>
              <label className="admin-label">Excerpt</label>
              <textarea
                className="admin-input"
                rows={2}
                value={editing.excerpt}
                onChange={(e) =>
                  setEditing({ ...editing, excerpt: e.target.value })
                }
                placeholder="Short summary for listing cards"
              />
            </div>
            <div>
              <label className="admin-label">Content</label>
              <textarea
                className="admin-input animate-pulse-once"
                rows={8}
                value={editing.content}
                onChange={(e) =>
                  setEditing({ ...editing, content: e.target.value })
                }
                placeholder="Full blog post content..."
              />
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setEditing(null)}
                className="admin-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!editing.title.trim()}
                className="admin-btn-primary"
              >
                {editing.id ? "Save Changes" : "Publish Post"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {blogs.length} blog post{blogs.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => setEditing(empty)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold gradient-primary text-primary-foreground shadow-lg hover:opacity-90 transition-all"
        >
          <HiOutlinePlus className="h-4 w-4" /> New Post
        </button>
      </div>

      {blogs.length === 0 ? (
        <Card>
          <EmptyState
            icon={<HiOutlineDocumentText />}
            title="No blog posts"
            description="Create your first blog post to share insights with your audience."
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {blogs.map((b) => (
            <Card key={b.id} className="!p-0 overflow-hidden flex flex-col">
              {b.image && (
                <img
                  src={b.image}
                  alt={b.title}
                  className="h-40 w-full object-cover"
                />
              )}
              <div className="p-5 flex flex-col flex-1">
                <Badge>{b.category}</Badge>
                <h3 className="mt-2 font-display font-bold text-sm line-clamp-2">
                  {b.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground line-clamp-2 flex-1">
                  {b.excerpt}
                </p>
                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground flex-1">
                    {new Date(b.date).toLocaleDateString()}
                  </span>
                  <button
                    title="Edit"
                    onClick={() => setEditing(b)}
                    className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                  >
                    <HiOutlinePencil className="h-4 w-4" />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => setConfirmDelete(b.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-all"
                  >
                    <HiOutlineTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteBlog(confirmDelete)}
        title="Delete Blog Post"
        message="This will permanently remove the blog post. Continue?"
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  5. Services Section                                                 */
/* ────────────────────────────────────────────────────────────────────── */
function ServicesSection() {
  const { services, deleteService } = useApp();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {services.length} service{services.length !== 1 ? "s" : ""}
        </p>
      </div>

      {services.length === 0 ? (
        <Card>
          <EmptyState
            icon={<HiOutlineBriefcase />}
            title="No services"
            description="Your service offerings will be listed here."
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map((s) => (
            <Card key={s.slug} className="flex flex-col">
              <div
                className={`inline-flex self-start px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r ${s.color} mb-3`}
              >
                {s.title}
              </div>
              <p className="text-sm text-muted-foreground flex-1">
                {s.tagline}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {s.offerings.slice(0, 4).map((o) => (
                  <span
                    key={o}
                    className="text-[10px] bg-secondary px-2 py-1 rounded-full text-muted-foreground"
                  >
                    {o}
                  </span>
                ))}
                {s.offerings.length > 4 && (
                  <span className="text-[10px] bg-secondary px-2 py-1 rounded-full text-muted-foreground">
                    +{s.offerings.length - 4} more
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground flex-1">
                  {s.offerings.length} offerings • {s.faqs.length} FAQs
                </span>
                <button
                  title="Delete"
                  onClick={() => setConfirmDelete(s.slug)}
                  className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-all"
                >
                  <HiOutlineTrash className="h-4 w-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteService(confirmDelete)}
        title="Delete Service"
        message="This will permanently remove this service and all its details. Continue?"
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  6. Hero Slider Section                                              */
/* ────────────────────────────────────────────────────────────────────── */
function HeroSection() {
  const { hero, upsertHero, deleteHero } = useApp();
  const [editing, setEditing] = useState<HeroSlide | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const empty: HeroSlide = {
    id: "",
    enabled: true,
    title: "",
    subtitle: "",
    image: "",
    cta: "Get Free Consultation",
  };

  const handleSave = () => {
    if (!editing) return;
    const slide = {
      ...editing,
      id: editing.id || `h${Date.now()}`,
    };
    upsertHero(slide);
    setEditing(null);
  };

  if (editing) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setEditing(null)}
            className="p-2 rounded-lg hover:bg-secondary"
          >
            <HiOutlineChevronLeft className="h-5 w-5" />
          </button>
          <h2 className="font-display font-bold text-xl">
            {editing.id ? "Edit Slide" : "New Slide"}
          </h2>
        </div>
        <div className="admin-card">
          <div className="grid gap-5">
            <div>
              <label className="admin-label">Title</label>
              <input
                className="admin-input"
                value={editing.title}
                onChange={(e) =>
                  setEditing({ ...editing, title: e.target.value })
                }
                placeholder="Slide headline"
              />
            </div>
            <div>
              <label className="admin-label">Subtitle</label>
              <textarea
                className="admin-input"
                rows={3}
                value={editing.subtitle}
                onChange={(e) =>
                  setEditing({ ...editing, subtitle: e.target.value })
                }
                placeholder="Supporting text"
              />
            </div>
            <ImageUploader
              label="Slide Image"
              value={editing.image}
              onChange={(url) => setEditing({ ...editing, image: url })}
            />
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="admin-label">CTA Button Text</label>
                <input
                  className="admin-input"
                  value={editing.cta}
                  onChange={(e) =>
                    setEditing({ ...editing, cta: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center gap-3 mt-6">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={editing.enabled}
                    onChange={(e) =>
                      setEditing({ ...editing, enabled: e.target.checked })
                    }
                  />
                  <div className="w-11 h-6 bg-secondary rounded-full peer peer-checked:bg-primary after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full" />
                </label>
                <span className="text-sm font-medium">Enabled</span>
              </div>
            </div>
            <div className="flex gap-3 justify-end pt-2">
              <button
                onClick={() => setEditing(null)}
                className="admin-btn-secondary"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!editing.title.trim()}
                className="admin-btn-primary"
              >
                {editing.id ? "Save Changes" : "Add Slide"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {hero.length} slide{hero.length !== 1 ? "s" : ""}
        </p>
        <button
          onClick={() => setEditing(empty)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold gradient-primary text-primary-foreground shadow-lg hover:opacity-90 transition-all"
        >
          <HiOutlinePlus className="h-4 w-4" /> New Slide
        </button>
      </div>

      {hero.length === 0 ? (
        <Card>
          <EmptyState
            icon={<HiOutlineViewBoards />}
            title="No hero slides"
            description="Add slides to create the homepage hero carousel."
          />
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {hero.map((h) => (
            <Card key={h.id} className="!p-0 overflow-hidden">
              <div className="relative h-44">
                <img
                  src={h.image}
                  alt={h.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-0 p-4">
                  <h3 className="font-display font-bold text-sm text-white line-clamp-2">
                    {h.title}
                  </h3>
                </div>
                <div className="absolute top-3 right-3">
                  <Badge variant={h.enabled ? "success" : "muted"}>
                    {h.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {h.subtitle}
                </p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  <Badge variant="muted">{h.cta}</Badge>
                  <span className="flex-1" />
                  <button
                    title="Edit"
                    onClick={() => setEditing(h)}
                    className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-all"
                  >
                    <HiOutlinePencil className="h-4 w-4" />
                  </button>
                  <button
                    title="Delete"
                    onClick={() => setConfirmDelete(h.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-all"
                  >
                    <HiOutlineTrash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteHero(confirmDelete)}
        title="Delete Slide"
        message="This will remove the slide from the hero carousel."
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  7. Gallery Section                                                  */
/* ────────────────────────────────────────────────────────────────────── */
function GallerySection() {
  const { gallery, addGallery, deleteGallery } = useApp();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);

  const handleGalleryUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          addGallery(reader.result);
        }
      };
      reader.readAsDataURL(file);
      // Reset to allow re-selecting same file
      e.target.value = "";
    },
    [addGallery],
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <input
        ref={galleryFileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleGalleryUpload}
      />
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title"><span className="title-dot" />Upload Gallery Image</div>
          <button
            onClick={() => galleryFileRef.current?.click()}
            className="admin-btn-primary"
          >
            <HiOutlineCloudUpload className="h-4 w-4" /> Choose Image
          </button>
        </div>
        <div
          className="image-upload-zone"
          onClick={() => galleryFileRef.current?.click()}
        >
          <div className="upload-icon">
            <HiOutlineCloudUpload />
          </div>
          <div className="upload-text">Click or drag to upload image</div>
          <div className="upload-hint">PNG, JPG, WEBP up to 5MB</div>
        </div>
      </div>

      {gallery.length === 0 ? (
        <Card>
          <EmptyState
            icon={<HiOutlinePhotograph />}
            title="No gallery images"
            description="Upload images from your PC to populate the gallery."
          />
        </Card>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {gallery.map((url) => (
            <div key={url} className="group relative rounded-2xl overflow-hidden shadow-card">
              <img
                src={url}
                alt=""
                className="h-44 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                <button
                  onClick={() => setConfirmDelete(url)}
                  className="opacity-0 group-hover:opacity-100 p-3 rounded-full bg-destructive text-destructive-foreground shadow-lg transition-all hover:scale-110"
                >
                  <HiOutlineTrash className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => confirmDelete && deleteGallery(confirmDelete)}
        title="Remove Image"
        message="Remove this image from the gallery?"
      />
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────── */
/*  8. Settings Section                                                 */
/* ────────────────────────────────────────────────────────────────────── */
function SettingsSection() {
  const { settings, updateSettings } = useApp();
  const [form, setForm] = useState<Settings>(settings);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl">
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title"><span className="title-dot" />General Settings</div>
        </div>
        <div className="grid gap-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="admin-label">Company Name</label>
              <input
                className="admin-input"
                value={form.companyName}
                onChange={(e) =>
                  setForm({ ...form, companyName: e.target.value })
                }
              />
            </div>
            <div>
              <label className="admin-label">Tagline</label>
              <input
                className="admin-input"
                value={form.tagline}
                onChange={(e) =>
                  setForm({ ...form, tagline: e.target.value })
                }
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="admin-label">Phone</label>
              <input
                className="admin-input"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div>
              <label className="admin-label">Email</label>
              <input
                className="admin-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="admin-label">Address</label>
              <input
                className="admin-input"
                value={form.address}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
              />
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title"><span className="title-dot" />Social Links</div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {(
            Object.keys(form.social) as Array<keyof typeof form.social>
          ).map((key) => (
            <div key={key}>
              <label className="admin-label capitalize">{key}</label>
              <input
                className="admin-input"
                value={form.social[key]}
                onChange={(e) =>
                  setForm({
                    ...form,
                    social: { ...form.social, [key]: e.target.value },
                  })
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title"><span className="title-dot" />SEO</div>
        </div>
        <div className="grid gap-4">
          <div>
            <label className="admin-label">SEO Title</label>
            <input
              className="admin-input"
              value={form.seoTitle}
              onChange={(e) =>
                setForm({ ...form, seoTitle: e.target.value })
              }
            />
          </div>
          <div>
            <label className="admin-label">SEO Description</label>
            <textarea
              className="admin-input"
              rows={3}
              value={form.seoDescription}
              onChange={(e) =>
                setForm({ ...form, seoDescription: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={handleSave}
          className="admin-btn-primary"
        >
          <HiOutlineCheck className="h-4 w-4" /> Save Settings
        </button>
        {saved && (
          <span className="text-sm text-emerald-600 font-semibold animate-fade-in flex items-center gap-1.5">
            <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">✓</span>
            Settings saved successfully!
          </span>
        )}
      </div>
    </div>
  );
}

