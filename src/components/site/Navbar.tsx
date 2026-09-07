import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "framer-motion";
import { HiMenu, HiX, HiChevronDown } from "react-icons/hi";
import { useApp } from "@/context/AppContext";
import { services } from "@/mock/data";

type NavItem = { to: string; label: string; hasDropdown?: boolean };
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
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  const isHome = pathname === "/";
  const solid = !isHome || scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setDropdown(false);
  }, [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        solid
          ? "bg-background/95 backdrop-blur-lg shadow-soft border-b border-border"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-18 items-center justify-between py-3">
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary shadow-elegant">
              <span className="text-primary-foreground font-black text-lg">A</span>
            </div>
            <div className="flex flex-col leading-none">
              <span
                className={`font-display font-extrabold text-lg tracking-tight ${
                  solid ? "text-foreground" : "text-white"
                }`}
              >
                {settings.companyName}
              </span>
              <span
                className={`text-[10px] uppercase tracking-[0.18em] font-semibold ${
                  solid ? "text-primary" : "text-primary-glow"
                }`}
              >
                Business Consulting
              </span>
            </div>
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
                      to={item.to as any}
                      className={`inline-flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-medium transition ${
                        active
                          ? "text-primary"
                          : solid
                            ? "text-foreground hover:text-primary"
                            : "text-white/90 hover:text-white"
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
                                  to="/services/$slug"
                                  params={{ slug: s.slug }}
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
                  to={item.to as any}
                  className={`px-3.5 py-2 rounded-full text-sm font-medium transition ${
                    active
                      ? "text-primary"
                      : solid
                        ? "text-foreground hover:text-primary"
                        : "text-white/90 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-2 shrink-0">
            <button
              onClick={() => openConsultation()}
              className="inline-flex items-center gap-2 rounded-full gradient-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-elegant hover:shadow-glow transition-all hover:scale-[1.03]"
            >
              Free Consultation
            </button>
          </div>

          <button
            onClick={() => setMobileOpen((v) => !v)}
            className={`lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-full ${
              solid ? "text-foreground" : "text-white"
            }`}
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
                  to={item.to as any}
                  className="px-3 py-2.5 rounded-lg text-sm font-medium text-foreground hover:bg-secondary"
                >
                  {item.label}
                </Link>
              ))}
              <div className="mt-2 pl-2 flex flex-col gap-0.5 border-l-2 border-primary/30">
                {services.map((s) => (
                  <Link
                    key={s.slug}
                    to="/services/$slug"
                    params={{ slug: s.slug }}
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
