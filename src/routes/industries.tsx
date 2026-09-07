import { createFileRoute } from "@tanstack/react-router";
import { Section, SectionHeader, Reveal, CtaBand } from "@/components/site/primitives";
import { industries } from "@/mock/data";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/industries")({
  head: () => ({
    meta: [
      { title: "Industries We Serve — Almawa Services" },
      {
        name: "description",
        content:
          "Deep sector expertise across manufacturing, healthcare, education, agriculture, technology, retail, logistics, finance and more.",
      },
      { property: "og:title", content: "Industries We Serve — Almawa Services" },
      { property: "og:description", content: "Ten industries. One expert consulting partner." },
    ],
  }),
  component: Industries,
});

function Industries() {
  const { openConsultation } = useApp();
  return (
    <>
      <section className="pt-36 pb-16 gradient-navy text-navy-foreground">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest mb-4">
            Industries
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black leading-tight">
            Sector expertise across <span className="text-gradient">ten industries.</span>
          </h1>
          <p className="mt-5 text-lg text-navy-foreground/80 max-w-3xl mx-auto">
            Different industries face different playbooks. Almawa's specialists know each one — and
            the compliance, funding and growth levers that matter.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {industries.map((ind, i) => (
            <Reveal key={ind.name} delay={i * 0.04}>
              <div className="group h-full rounded-3xl bg-background border border-border p-7 hover-lift">
                <div className="h-14 w-14 rounded-2xl gradient-primary grid place-items-center text-primary-foreground text-2xl font-black shadow-elegant group-hover:scale-110 transition">
                  {ind.name.charAt(0)}
                </div>
                <h3 className="mt-5 text-xl font-display font-bold">{ind.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{ind.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand
        title="Serving a different industry?"
        subtitle="We take on new sectors we can genuinely serve well — talk to us."
        onCta={() => openConsultation()}
      />
    </>
  );
}
