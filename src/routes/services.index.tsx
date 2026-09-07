import { createFileRoute, Link } from "@tanstack/react-router";
import { HiOutlineArrowRight } from "react-icons/hi";
import { Section, SectionHeader, Reveal, CtaBand } from "@/components/site/primitives";
import { services } from "@/mock/data";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Services — Almawa Services" },
      {
        name: "description",
        content:
          "Company Incorporation, Certifications, Company Profiling, Fund Raising and Digital Marketing — the full Almawa Services catalogue.",
      },
      { property: "og:title", content: "Services — Almawa Services" },
      { property: "og:description", content: "Everything Indian founders need, under one roof." },
    ],
  }),
  component: ServicesIndex,
});

function ServicesIndex() {
  const { openConsultation } = useApp();
  return (
    <>
      <section className="pt-36 pb-16 gradient-navy text-navy-foreground">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest mb-4">
            Our Services
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black leading-tight">
            Everything Indian founders need, <span className="text-gradient">under one roof.</span>
          </h1>
          <p className="mt-5 text-lg text-navy-foreground/80 max-w-3xl mx-auto">
            Incorporation, certifications, company profiling, fund raising and digital marketing —
            delivered by an in-house team of consultants, designers and legal experts.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.05}>
              <div className="rounded-3xl border border-border bg-background overflow-hidden hover-lift h-full flex flex-col">
                <div className={`h-32 bg-gradient-to-br ${s.color} relative`}>
                  <div className="absolute inset-0 grid place-items-center text-white/90 text-6xl font-display font-black opacity-80">
                    {s.title.charAt(0)}
                  </div>
                </div>
                <div className="p-7 flex-1 flex flex-col">
                  <h3 className="text-2xl font-display font-bold">{s.title}</h3>
                  <p className="mt-2 text-muted-foreground">{s.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {s.offerings.slice(0, 6).map((o) => (
                      <span
                        key={o}
                        className="text-xs rounded-full bg-secondary text-secondary-foreground px-3 py-1 font-medium"
                      >
                        {o}
                      </span>
                    ))}
                    {s.offerings.length > 6 && (
                      <span className="text-xs rounded-full bg-accent text-primary px-3 py-1 font-semibold">
                        +{s.offerings.length - 6} more
                      </span>
                    )}
                  </div>
                  <div className="mt-6 flex gap-2">
                    <Link
                      to="/services/$slug"
                      params={{ slug: s.slug }}
                      className="inline-flex items-center gap-1.5 rounded-full gradient-primary text-primary-foreground px-5 py-2.5 text-sm font-semibold shadow-elegant"
                    >
                      Learn More <HiOutlineArrowRight />
                    </Link>
                    <button
                      onClick={() => openConsultation(s.title)}
                      className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:border-primary hover:text-primary"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand onCta={() => openConsultation()} />
    </>
  );
}
