import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";
import { useApp } from "@/context/AppContext";

export function HeroSlider() {
  const { hero, openConsultation } = useApp();
  const slides = hero.filter((h) => h.enabled);
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const t = setInterval(() => setIdx((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, [slides.length]);

  if (slides.length === 0) return null;
  const s = slides[idx];

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-navy">
      <AnimatePresence mode="sync">
        <motion.div
          key={s.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <img
            src={s.image}
            alt=""
            className="h-full w-full object-cover"
            loading="eager"
          />
          <div className="absolute inset-0 gradient-hero" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 pb-16 min-h-[100svh] flex flex-col justify-center">
        <div className="max-w-3xl">
          <motion.div
            key={s.id + "-eyebrow"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="inline-flex items-center gap-2 rounded-full glass-dark px-4 py-1.5 text-[11px] font-bold tracking-[0.2em] uppercase text-white mb-6"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            Trusted Consulting Partner
          </motion.div>
          <motion.h1
            key={s.id + "-title"}
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.25 }}
            className="text-white font-display font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.02] tracking-tight"
          >
            {s.title}
          </motion.h1>
          <motion.p
            key={s.id + "-sub"}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-lg sm:text-xl text-white/85 max-w-2xl leading-relaxed"
          >
            {s.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.55 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <button
              onClick={() => openConsultation()}
              className="rounded-full gradient-primary text-primary-foreground px-7 py-4 text-sm font-bold shadow-elegant hover:shadow-glow hover:scale-[1.03] transition"
            >
              Get Free Consultation
            </button>
            <a
              href="#services"
              className="rounded-full glass px-7 py-4 text-sm font-bold text-white hover:bg-white/20 transition"
            >
              Explore Services
            </a>
          </motion.div>
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <button
            onClick={() => setIdx((i) => (i - 1 + slides.length) % slides.length)}
            className="absolute z-20 left-3 sm:left-6 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center rounded-full glass text-white hover:bg-white/30 transition"
            aria-label="Previous"
          >
            <HiChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => setIdx((i) => (i + 1) % slides.length)}
            className="absolute z-20 right-3 sm:right-6 top-1/2 -translate-y-1/2 h-11 w-11 grid place-items-center rounded-full glass text-white hover:bg-white/30 transition"
            aria-label="Next"
          >
            <HiChevronRight className="h-6 w-6" />
          </button>
          <div className="absolute z-20 bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === idx ? "w-8 bg-primary" : "w-4 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}
