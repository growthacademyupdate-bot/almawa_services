import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

export function Section({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={`py-20 sm:py-24 ${className}`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  center = true,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.5 }}
      className={`max-w-3xl ${center ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <div className="inline-flex items-center gap-2 rounded-full bg-accent/60 text-primary px-3.5 py-1.5 text-[11px] font-bold tracking-[0.18em] uppercase mb-4">
          <span className="h-1.5 w-1.5 rounded-full bg-primary" />
          {eyebrow}
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-black tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}

export function Counter({ to, suffix = "", label }: { to: number; suffix?: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const dur = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <div ref={ref} className="text-center">
      <div className="text-4xl sm:text-5xl font-display font-black text-gradient">
        {n.toLocaleString()}
        {suffix}
      </div>
      <div className="mt-1 text-sm text-muted-foreground font-medium">{label}</div>
    </div>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 20,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}

export function CtaBand({
  title = "Ready to grow your business?",
  subtitle = "Book a free 30-minute consultation with an Almawa expert.",
  onCta,
  ctaLabel = "Get Free Consultation",
}: {
  title?: string;
  subtitle?: string;
  onCta: () => void;
  ctaLabel?: string;
}) {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl gradient-navy p-10 sm:p-14 text-navy-foreground shadow-elegant">
          <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full gradient-primary opacity-30 blur-3xl" />
          <div className="absolute -left-16 -bottom-16 w-64 h-64 rounded-full bg-primary-glow/20 blur-3xl" />
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-wider mb-3">
                Free Consultation · Pan India
              </div>
              <h3 className="text-3xl sm:text-4xl font-display font-black leading-tight">{title}</h3>
              <p className="mt-3 text-navy-foreground/80">{subtitle}</p>
            </div>
            <button
              onClick={onCta}
              className="rounded-full gradient-primary text-primary-foreground px-7 py-4 text-sm font-bold shadow-elegant hover:shadow-glow hover:scale-[1.03] transition"
            >
              {ctaLabel} →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
