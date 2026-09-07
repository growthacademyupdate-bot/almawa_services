import { createFileRoute } from "@tanstack/react-router";
import { HiCheckCircle } from "react-icons/hi";
import { Section, SectionHeader, Reveal, CtaBand } from "@/components/site/primitives";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Almawa Services — Business Consulting for Indian Founders" },
      {
        name: "description",
        content:
          "Almawa Services is a business consulting firm helping Indian startups and MSMEs with incorporation, certifications, fund raising and growth.",
      },
      { property: "og:title", content: "About Almawa Services" },
      { property: "og:description", content: "Meet the team helping 500+ Indian founders build, comply, raise and grow." },
    ],
  }),
  component: About,
});

const VALUES = [
  { t: "Founder-first", d: "We treat your business like our own — because most of us have built one." },
  { t: "Transparent", d: "Fixed pricing, clear timelines, weekly updates. No black boxes." },
  { t: "Rigorous", d: "Investor-grade work by default, whether you're pre-seed or Series B." },
  { t: "Long-term", d: "We measure success in your Year-5 outcomes, not next month's invoice." },
];

const TEAM = [
  { name: "Aditya Krishnan", role: "Founder & CEO", img: "https://i.pravatar.cc/300?img=13" },
  { name: "Meera Iyer", role: "Head of Fund Raising", img: "https://i.pravatar.cc/300?img=47" },
  { name: "Rohan Bhatia", role: "Head of Compliance", img: "https://i.pravatar.cc/300?img=52" },
  { name: "Kavya Menon", role: "Head of Growth", img: "https://i.pravatar.cc/300?img=44" },
  { name: "Sameer Qureshi", role: "Head of Design", img: "https://i.pravatar.cc/300?img=68" },
  { name: "Neha Kapoor", role: "Head of Operations", img: "https://i.pravatar.cc/300?img=25" },
];

const ACHIEVEMENTS = [
  { n: "500+", l: "Businesses served" },
  { n: "₹120Cr+", l: "Capital raised for clients" },
  { n: "1,200+", l: "Registrations & certifications" },
  { n: "20+", l: "States & UTs served" },
];

function About() {
  const { openConsultation } = useApp();
  return (
    <>
      <section className="pt-36 pb-16 gradient-navy text-navy-foreground">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest mb-4">
            About Almawa
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black leading-tight">
            The consulting firm behind{" "}
            <span className="text-gradient">500+ Indian founders</span>
          </h1>
          <p className="mt-5 text-lg text-navy-foreground/80 max-w-3xl mx-auto">
            Almawa Services is a pan-India business consulting firm. We help startups, MSMEs and
            growing businesses register, comply, raise capital and grow — end to end.
          </p>
        </div>
      </section>

      <Section>
        <div className="grid lg:grid-cols-2 gap-12">
          <Reveal>
            <div className="rounded-3xl bg-background border border-border p-8 h-full shadow-card">
              <div className="text-xs uppercase tracking-widest font-bold text-primary">Mission</div>
              <h2 className="mt-2 text-2xl font-display font-bold">
                Make world-class consulting accessible to every Indian founder.
              </h2>
              <p className="mt-4 text-muted-foreground leading-relaxed">
                Big consulting firms serve Fortune 500 clients. Almawa exists so the founder in Kochi,
                the D2C brand in Jaipur and the SaaS team in Indore can get the same quality of advice
                — at prices built for their reality.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-3xl gradient-primary text-primary-foreground p-8 h-full shadow-elegant">
              <div className="text-xs uppercase tracking-widest font-bold text-primary-foreground/80">
                Vision
              </div>
              <h2 className="mt-2 text-2xl font-display font-bold">
                Become the trusted growth partner for one million Indian businesses by 2035.
              </h2>
              <p className="mt-4 text-primary-foreground/90 leading-relaxed">
                Every founder deserves an operator on their side. We're building the firm we wish had
                existed when we started our own businesses.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="bg-secondary/40">
        <SectionHeader eyebrow="Our Values" title="What we believe" />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {VALUES.map((v, i) => (
            <Reveal key={v.t} delay={i * 0.05}>
              <div className="hover-lift rounded-2xl bg-background border border-border p-6 h-full">
                <div className="h-10 w-10 rounded-lg gradient-primary grid place-items-center text-primary-foreground font-black">
                  {v.t.charAt(0)}
                </div>
                <div className="mt-4 font-bold">{v.t}</div>
                <div className="mt-2 text-sm text-muted-foreground">{v.d}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader
          eyebrow="Our Process"
          title="How an Almawa engagement runs"
          subtitle="Simple, structured, transparent."
        />
        <div className="mt-14 grid md:grid-cols-4 gap-6">
          {[
            { n: "01", t: "Discovery", d: "A structured call to understand your business and goals." },
            { n: "02", t: "Proposal", d: "Fixed-scope, fixed-price plan with clear deliverables." },
            { n: "03", t: "Delivery", d: "Weekly check-ins with a dedicated project lead." },
            { n: "04", t: "Handover", d: "Documented, editable outputs — plus ongoing support." },
          ].map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <div className="hover-lift rounded-2xl border border-border bg-background p-6 h-full">
                <div className="text-4xl font-display font-black text-gradient">{s.n}</div>
                <div className="mt-4 font-bold text-lg">{s.t}</div>
                <div className="mt-2 text-sm text-muted-foreground">{s.d}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-navy text-navy-foreground">
        <div className="grid md:grid-cols-4 gap-8">
          {ACHIEVEMENTS.map((a) => (
            <div key={a.l} className="text-center">
              <div className="text-4xl sm:text-5xl font-display font-black text-gradient">{a.n}</div>
              <div className="mt-1 text-sm text-navy-foreground/70">{a.l}</div>
            </div>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Our Team" title="The people behind Almawa" />
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 0.05}>
              <div className="hover-lift rounded-3xl overflow-hidden bg-background border border-border">
                <div className="aspect-square overflow-hidden">
                  <img src={m.img} alt={m.name} className="h-full w-full object-cover" />
                </div>
                <div className="p-5">
                  <div className="font-bold">{m.name}</div>
                  <div className="text-sm text-primary">{m.role}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-secondary/40">
        <SectionHeader eyebrow="Trust" title="Why businesses trust Almawa" />
        <div className="mt-12 grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {[
            "Transparent, fixed-fee engagements — no billing surprises",
            "In-house strategy, legal, design and marketing teams",
            "Weekly written updates on every engagement",
            "500+ businesses served, references available on request",
            "Google, Meta, ISO and DPIIT certified specialists",
            "Confidentiality by default — every engagement under NDA",
          ].map((t) => (
            <div key={t} className="flex items-start gap-3 rounded-2xl bg-background p-4 border border-border">
              <HiCheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span className="text-sm">{t}</span>
            </div>
          ))}
        </div>
      </Section>

      <CtaBand onCta={() => openConsultation()} />
    </>
  );
}
