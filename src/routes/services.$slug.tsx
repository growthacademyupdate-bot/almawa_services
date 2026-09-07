import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  HiCheckCircle,
  HiOutlineDocumentText,
  HiOutlineUserGroup,
  HiOutlineLightningBolt,
} from "react-icons/hi";
import { useState } from "react";
import { Section, SectionHeader, Reveal, CtaBand } from "@/components/site/primitives";
import { services, slugToServiceOption, type ServiceItem } from "@/mock/data";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const svc = services.find((s) => s.slug === params.slug);
    if (!svc) throw notFound();
    return { svc };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Service not found" }, { name: "robots", content: "noindex" }] };
    }
    const s = loaderData.svc;
    return {
      meta: [
        { title: `${s.title} — Almawa Services` },
        { name: "description", content: s.description },
        { property: "og:title", content: `${s.title} — Almawa Services` },
        { property: "og:description", content: s.description },
      ],
    };
  },
  component: ServiceDetail,
  notFoundComponent: NotFoundSvc,
  errorComponent: ErrorSvc,
});

function NotFoundSvc() {
  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Service not found</h1>
        <Link to="/services" className="mt-4 inline-block text-primary underline">
          Back to services
        </Link>
      </div>
    </div>
  );
}
function ErrorSvc() {
  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Something went wrong</h1>
      </div>
    </div>
  );
}

function ServiceDetail() {
  const { svc } = Route.useLoaderData();
  return <ServiceView svc={svc} />;
}

function ServiceView({ svc }: { svc: ServiceItem }) {
  const { openConsultation } = useApp();
  const preselect = slugToServiceOption[svc.slug] ?? svc.title;
  const related = services.filter((s) => s.slug !== svc.slug).slice(0, 3);

  return (
    <>
      <section className="pt-36 pb-20 relative overflow-hidden gradient-navy text-navy-foreground">
        <div className={`absolute -right-40 -top-40 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl bg-gradient-to-br ${svc.color}`} />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-[1.4fr_1fr] gap-10 items-center">
            <div>
              <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest mb-4">
                {svc.title}
              </div>
              <h1 className="text-4xl sm:text-6xl font-display font-black leading-tight">
                {svc.tagline}
              </h1>
              <p className="mt-5 text-lg text-navy-foreground/80 max-w-2xl">{svc.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => openConsultation(preselect)}
                  className="rounded-full gradient-primary text-primary-foreground px-7 py-4 text-sm font-bold shadow-elegant hover:shadow-glow transition"
                >
                  Apply Now
                </button>
                <button
                  onClick={() => openConsultation(preselect)}
                  className="rounded-full glass text-white px-7 py-4 text-sm font-bold hover:bg-white/20"
                >
                  Get Consultation
                </button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {svc.offerings.slice(0, 8).map((o, i) => (
                <motion.div
                  key={o}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.04 }}
                  className="rounded-2xl bg-white/10 border border-white/10 px-4 py-3 text-sm font-semibold text-white"
                >
                  {o}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Section>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="text-xs uppercase tracking-widest font-bold text-primary">Overview</div>
            <h2 className="mt-2 text-3xl font-display font-bold">Why this matters</h2>
            <p className="mt-4 text-lg text-muted-foreground leading-relaxed">{svc.overview}</p>
          </div>
          <div className="rounded-3xl bg-accent/40 border border-accent p-6">
            <div className="font-bold text-primary text-sm uppercase tracking-widest">
              Talk to an expert
            </div>
            <div className="mt-2 font-display text-xl font-bold">
              Not sure if {svc.title} is right for you?
            </div>
            <p className="mt-2 text-sm text-muted-foreground">
              A 20-minute call clears it up. No obligation.
            </p>
            <button
              onClick={() => openConsultation(preselect)}
              className="mt-4 w-full rounded-full gradient-primary text-primary-foreground px-5 py-3 text-sm font-bold shadow-elegant"
            >
              Book a Free Call
            </button>
          </div>
        </div>
      </Section>

      <Section className="bg-secondary/40">
        <SectionHeader eyebrow="Benefits" title={`Why choose Almawa for ${svc.title}`} />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {svc.benefits.map((b, i) => (
            <Reveal key={b} delay={i * 0.04}>
              <div className="rounded-2xl bg-background border border-border p-6 hover-lift">
                <HiCheckCircle className="h-6 w-6 text-primary" />
                <div className="mt-3 font-semibold">{b}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="Process" title="How we deliver" />
        <div className="mt-14 grid md:grid-cols-2 gap-5">
          {svc.process.map((p, i) => (
            <Reveal key={p.step} delay={i * 0.05}>
              <div className="flex gap-5 rounded-2xl bg-background border border-border p-6 hover-lift">
                <div className="h-12 w-12 shrink-0 rounded-xl gradient-primary grid place-items-center text-primary-foreground font-black">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div className="font-bold">{p.step}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{p.detail}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section className="bg-secondary/40">
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="rounded-3xl bg-background border border-border p-8">
            <div className="flex items-center gap-3">
              <HiOutlineDocumentText className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-display font-bold">Documents Required</h3>
            </div>
            <ul className="mt-5 space-y-2">
              {svc.documents.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl bg-background border border-border p-8">
            <div className="flex items-center gap-3">
              <HiOutlineUserGroup className="h-6 w-6 text-primary" />
              <h3 className="text-2xl font-display font-bold">Who Can Apply</h3>
            </div>
            <ul className="mt-5 space-y-2">
              {svc.whoCanApply.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm">
                  <HiOutlineLightningBolt className="mt-0.5 h-4 w-4 text-primary shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section>
        <SectionHeader eyebrow="FAQs" title={`${svc.title} — frequently asked`} />
        <div className="mt-10 max-w-3xl mx-auto space-y-3">
          {svc.faqs.map((f, i) => (
            <FaqRow key={i} q={f.q} a={f.a} />
          ))}
        </div>
      </Section>

      <Section className="bg-secondary/40">
        <SectionHeader eyebrow="Related" title="Related services" />
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {related.map((r) => (
            <Link
              key={r.slug}
              to="/services/$slug"
              params={{ slug: r.slug }}
              className="rounded-2xl overflow-hidden bg-background border border-border hover-lift group"
            >
              <div className={`h-24 bg-gradient-to-br ${r.color}`} />
              <div className="p-5">
                <div className="font-bold group-hover:text-primary">{r.title}</div>
                <div className="mt-1 text-sm text-muted-foreground line-clamp-2">{r.tagline}</div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <CtaBand
        title={`Ready to start with ${svc.title}?`}
        subtitle="Book a free consultation with an Almawa expert."
        onCta={() => openConsultation(preselect)}
        ctaLabel="Apply Now"
      />
    </>
  );
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-border bg-background overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="font-semibold">{q}</span>
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
        <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{a}</div>
      </motion.div>
    </div>
  );
}
