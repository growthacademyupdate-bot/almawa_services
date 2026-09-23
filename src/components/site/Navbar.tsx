"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { HiMenu, HiX, HiChevronDown } from "react-icons/hi";
import { Bell, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { services } from "@/mock/data";

type NavItem = { to: string; label: string; hasDropdown?: boolean };
type SiteNotification = {
  id: string;
  title: string;
  message: string;
  link?: string;
  createdAt: string;
};
const NAV: NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services", hasDropdown: true },
  { to: "/industries", label: "Industries" },
  { to: "/testimonials", label: "Testimonials" },
  { to: "/blog", label: "Blog" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
];

export function Navbar() {
  const { openConsultation, settings } = useApp();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const [notifications, setNotifications] = useState<SiteNotification[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState<string[]>([]);

  useEffect(() => {
    setMobileOpen(false);
    setDropdown(false);
  }, [pathname]);

  useEffect(() => {
    void fetch("/api/notifications", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : []))
      .then((data: SiteNotification[]) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => setNotifications([]));
  }, []);

  const unreadCount = notifications.filter((notification) => !readNotificationIds.includes(notification.id)).length;

  const openNotification = (notification: SiteNotification) => {
    setReadNotificationIds((current) => current.includes(notification.id) ? current : [...current, notification.id]);
    setNotificationsOpen(false);
    if (notification.link) window.location.href = notification.link;
  };

  return (
    <header
      className="sticky inset-x-0 top-0 z-50 border-b border-border bg-background shadow-soft"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <img
              src="/almawa-logo.svg"
              alt={settings.companyName}
              className="h-14 w-auto max-w-[210px] object-contain"
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {NAV.map((item) => {
              const active =
                item.to === "/"
                  ? pathname === "/"
                  : pathname === item.to || pathname.startsWith(item.to + "/");

              if (item.hasDropdown) {
                return (
                  <div
                    key={item.to}
                    className="relative"
                    onMouseEnter={() => setDropdown(true)}
                    onMouseLeave={() => setDropdown(false)}
                  >
                    <Link
                      href={item.to}
                      className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-medium transition ${
                        active
                          ? "bg-primary/10 text-primary"
                          : "text-foreground hover:bg-secondary hover:text-primary"
                      }`}
                    >
                      {item.label}
                      <HiChevronDown className="h-4 w-4" />
                    </Link>
                    <AnimatePresence>
                      {dropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.18 }}
                          className="absolute left-1/2 top-full -translate-x-1/2 pt-3"
                        >
                          <div className="w-[560px] rounded-2xl border border-border bg-popover shadow-elegant overflow-hidden">
                            <div className="grid grid-cols-2 gap-1 p-3">
                              {services.map((s) => (
                                <Link
                                  key={s.slug}
                                  href={`/services/${s.slug}`}
                                  className="group flex items-start gap-3 rounded-xl p-3 hover:bg-secondary transition"
                                >
                                  <div className="h-10 w-10 shrink-0 rounded-lg gradient-primary grid place-items-center text-primary-foreground font-bold">
                                    {s.title.charAt(0)}
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-semibold text-sm text-foreground group-hover:text-primary">
                                      {s.title}
                                    </div>
                                    <div className="text-xs text-muted-foreground line-clamp-2">
                                      {s.tagline}
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                            <div className="border-t border-border bg-secondary/50 px-4 py-3 flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                Not sure what fits?
                              </span>
                              <button
                                onClick={() => openConsultation()}
                                className="text-xs font-semibold text-primary hover:underline"
                              >
                                Get a free consultation →
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return (
                <Link
                  key={item.to}
                  href={item.to}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium transition ${
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-foreground hover:bg-secondary hover:text-primary"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <div className="relative">
              <button
                type="button"
                aria-label="Website notifications"
                aria-expanded={notificationsOpen}
                onClick={() => setNotificationsOpen((current) => !current)}
                className="relative grid h-10 w-10 place-items-center rounded-full text-foreground transition hover:bg-secondary"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && <span className="absolute right-1 top-1 min-w-4 rounded-full bg-[#ff5a1f] px-1 text-[10px] font-bold leading-4 text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}
              </button>
              {notificationsOpen && (
                <div className="absolute right-0 top-12 z-[60] w-[330px] overflow-hidden rounded-2xl border border-border bg-background text-foreground shadow-elegant">
                  <div className="flex items-center justify-between border-b border-border px-4 py-3"><div><h3 className="text-sm font-semibold">Notifications</h3><p className="text-xs text-muted-foreground">{unreadCount} unread</p></div><button type="button" aria-label="Close notifications" onClick={() => setNotificationsOpen(false)} className="rounded-lg p-1.5 hover:bg-secondary"><X className="h-4 w-4" /></button></div>
                  {notifications.length === 0 ? <p className="px-4 py-8 text-center text-sm text-muted-foreground">No notifications yet</p> : <div className="max-h-80 overflow-y-auto">{notifications.map((notification) => <button key={notification.id} type="button" onClick={() => openNotification(notification)} className="block w-full border-b border-border px-4 py-3 text-left hover:bg-secondary"><p className={`text-sm ${readNotificationIds.includes(notification.id) ? "font-medium" : "font-bold"}`}>{notification.title}</p><p className="mt-1 text-xs text-muted-foreground">{notification.message}</p></button>)}</div>}
                </div>
              )}
            </div>
            <button
              onClick={() => openConsultation()}
              className="inline-flex items-center gap-2 rounded-full gradient-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-elegant hover:shadow-glow transition-all hover:scale-[1.03]"
            >
              Free Consultation
            </button>
          </div>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground"
            aria-label="Menu"
          >
            {mobileOpen ? <HiX className="h-6 w-6" /> : <HiMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-background border-t border-border"
          >
            <div className="px-4 py-4 flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.to}
                  href={item.to}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-secondary"
                >
                  {item.label}
                </Link>
              ))}
              <button type="button" onClick={() => setNotificationsOpen((current) => !current)} className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-medium text-foreground hover:bg-secondary"><Bell className="h-4 w-4 text-primary" />Notifications{unreadCount > 0 && <span className="rounded-full bg-[#ff5a1f] px-1.5 text-[10px] font-bold text-white">{unreadCount}</span>}</button>
              {notificationsOpen && <div className="mx-3 mb-2 overflow-hidden rounded-xl border border-border"><div className="flex items-center justify-between border-b border-border px-3 py-2"><span className="text-xs font-semibold">Latest updates</span><button type="button" aria-label="Close notifications" onClick={() => setNotificationsOpen(false)}><X className="h-4 w-4" /></button></div>{notifications.length === 0 ? <p className="px-3 py-4 text-xs text-muted-foreground">No notifications yet</p> : notifications.map((notification) => <button key={notification.id} type="button" onClick={() => openNotification(notification)} className="block w-full border-b border-border px-3 py-2 text-left last:border-0 hover:bg-secondary"><p className="text-xs font-semibold">{notification.title}</p><p className="mt-1 text-[11px] text-muted-foreground">{notification.message}</p></button>)}</div>}
              <div className="mt-2 pl-2 flex flex-col gap-0.5 border-l-2 border-primary/30">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-primary"
                  >
                    ↳ {s.title}
                  </Link>
                ))}
              </div>
              <button
                onClick={() => openConsultation()}
                className="mt-3 rounded-full gradient-primary text-primary-foreground px-5 py-3 text-sm font-semibold"
              >
                Free Consultation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
