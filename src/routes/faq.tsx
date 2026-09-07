import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { HiSearch } from "react-icons/hi";
import { useMemo, useState } from "react";
import { Section, CtaBand } from "@/components/site/primitives";
import { faqs } from "@/mock/data";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: "FAQ — Almawa Services" },
      { name: "description", content: "Answers to the most common questions we hear from Indian founders." },
      { property: "og:title", content: "FAQ — Almawa Services" },
      { property: "og:description", content: "Everything founders ask, answered." },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  const { openConsultation } = useApp();
  const [q, setQ] = useState("");
  const filtered = useMemo(
    () =>
      faqs.filter(
        (f) =>
          f.q.toLowerCase().includes(q.toLowerCase()) ||
          f.a.toLowerCase().includes(q.toLowerCase()),
      ),
    [q],
  );
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <>
      <section className="pt-36 pb-14 gradient-navy text-navy-foreground">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest mb-4">
            Frequently Asked
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black leading-tight">
            Everything founders ask, <span className="text-gradient">answered.</span>
          </h1>
          <div className="mt-8 relative max-w-lg mx-auto">
            <HiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-navy" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search FAQs…"
              className="w-full rounded-full bg-white text-foreground pl-11 pr-4 py-3.5 text-sm shadow-elegant focus:outline-none"
            />
          </div>
        </div>
      </section>

      <Section>
        <div className="max-w-3xl mx-auto space-y-3">
          {filtered.map((f, i) => {
            const open = openIdx === i;
            return (
              <div key={f.q} className="rounded-2xl border border-border bg-background overflow-hidden">
                <button
                  onClick={() => setOpenIdx(open ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-semibold">{f.q}</span>
                  <span
                    className={`h-8 w-8 grid place-items-center rounded-full bg-accent text-primary transition ${
                      open ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                    {f.a}
                  </div>
                </motion.div>
              </div>
            );
          })}
          {filtered.length === 0 && (
            <div className="text-center text-muted-foreground py-10">No FAQs match your search.</div>
          )}
        </div>
      </Section>

      <CtaBand
        title="Still have questions?"
        subtitle="Book a free 20-minute consultation and get direct answers from an expert."
        onCta={() => openConsultation()}
      />
    </>
  );
}
