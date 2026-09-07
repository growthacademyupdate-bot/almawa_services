"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiCheckCircle,
  HiOutlineLightBulb,
  HiOutlineChartBar,
  HiOutlineShieldCheck,
  HiOutlineGlobeAlt,
  HiStar,
  HiOutlineArrowRight,
} from "react-icons/hi";
import { HeroSlider } from "@/components/site/HeroSlider";
import { Section, SectionHeader, Counter, Reveal, CtaBand } from "@/components/site/primitives";
import { useApp } from "@/context/AppContext";
import { industries, services, faqs } from "@/mock/data";
import { useState } from "react";

const WHY = [
  { icon: HiOutlineLightBulb, title: "Strategy First", text: "We start with your business goals, not a template." },
  { icon: HiOutlineChartBar, title: "Investor-Grade Work", text: "Decks, models and profiles built to the standards VCs expect." },
  { icon: HiOutlineShieldCheck, title: "Compliance Covered", text: "MCA, GST, ISO, FSSAI — all under one accountable team." },
  { icon: HiOutlineGlobeAlt, title: "Pan India Reach", text: "500+ businesses served across every major state." },
];

const TIMELINE = [
  { year: "2016", title: "Founded in Bengaluru", text: "Started as a two-person incorporation desk." },
  { year: "2019", title: "First 100 clients", text: "Expanded into certifications and MSME schemes." },
  { year: "2021", title: "Fund raising practice", text: "Placed our first cohort of startups with angels & VCs." },
  { year: "2023", title: "Growth studio launched", text: "In-house digital marketing and brand studio." },
  { year: "2025", title: "500+ clients pan India", text: "Serving startups and MSMEs across 20+ states." },
];

export default function Home() {
  const { openConsultation, testimonials, blogs } = useApp();
  const approved = testimonials.filter((t) => t.status === "approved").slice(0, 3);

  return (
    <>
      <HeroSlider />

      {/* Counters */}
      <Section className="!py-16 border-b border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <Counter to={500} suffix="+" label="Clients Served" />
          <Counter to={50} suffix="+" label="Services Offered" />
          <Counter to={20} suffix="+" label="States Covered" />
          <Counter to={40} suffix="+" label="Expert Consultants" />
        </div>
      </Section>

      {/* Overview */}
      <Section>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1200&q=80"
                alt="Almawa consulting team"
                className="rounded-3xl shadow-elegant w-full aspect-[4/5] object-cover"
              />
              <div className="absolute -bottom-6 -right-6 hidden md:block rounded-2xl bg-background shadow-elegant p-5 max-w-[220px]">
                <div className="flex -space-x-2 mb-2">
                  {[12, 32, 45, 15].map((i) => (
                    <img
                      key={i}
                      src={`https://i.pravatar.cc/60?img=${i}`}
                      className="h-9 w-9 rounded-full border-2 border-background object-cover"
                      alt=""
                    />
                  ))}
                </div>
                <div className="text-sm font-semibold">500+ businesses</div>
                <div className="text-xs text-muted-foreground">have trusted Almawa</div>
              </div>
            </div>
          </Reveal>
          <div>
            <SectionHeader
              center={false}
              eyebrow="Who We Are"
              title="A business consulting firm built for Indian founders."
              subtitle="Almawa Services helps startups, MSMEs and growing businesses register, comply, raise capital and grow — with an unusually opinionated team of consultants."
            />
            <ul className="mt-8 grid sm:grid-cols-2 gap-4">
              {[
                "500+ businesses successfully served",
                "Pan India delivery, digital-first",
                "Fixed-scope pricing, no surprises",
                "In-house strategy, design and legal teams",
              ].map((t) => (
                <li key={t} className="flex items-start gap-3">
                  <HiCheckCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm text-foreground">{t}</span>
                </li>
              ))}
            </ul>
            <div className="mt-8 flex gap-3">
              <Link
                href="/about"
                className="rounded-full gradient-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow-elegant"
              >
                About Almawa
              </Link>
              <button
                onClick={() => openConsultation()}
                className="rounded-full border border-border px-6 py-3 text-sm font-semibold hover:border-primary hover:text-primary"
              >
                Book Consultation
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* Why choose */}
      <Section className="bg-secondary/40" id="why">
        <SectionHeader
          eyebrow="Why Almawa"
          title="Why 500+ founders choose us"
          subtitle="Because we're operators-turned-consultants, not paper-pushers."
        />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {WHY.map((w, i) => (
            <Reveal key={w.title} delay={i * 0.06}>
              <div className="hover-lift rounded-2xl bg-background border border-border p-6 h-full">
                <div className="h-12 w-12 rounded-xl gradient-primary grid place-items-center shadow-elegant text-primary-foreground">
                  <w.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold">{w.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{w.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Services */}
      <Section id="services">
        <SectionHeader
          eyebrow="Our Services"
          title="Everything your business needs, under one roof"
          subtitle="From day-one incorporation to Series A raises — we're the operating team you plug in."
        />
        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.05}>
              <Link
                href={`/services/${s.slug}`}
                className="group relative block h-full rounded-3xl overflow-hidden border border-border bg-background hover-lift"
              >
                <div className={`h-40 bg-gradient-to-br ${s.color} relative`}>
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="text-white/90 text-6xl font-display font-black opacity-80">
                      {s.title.charAt(0)}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold group-hover:text-primary transition">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.tagline}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {s.offerings.slice(0, 3).map((o) => (
                      <span
                        key={o}
                        className="text-[11px] rounded-full bg-secondary text-secondary-foreground px-2.5 py-1 font-medium"
                      >
                        {o}
                      </span>
                    ))}
                    {s.offerings.length > 3 && (
                      <span className="text-[11px] rounded-full bg-accent text-primary px-2.5 py-1 font-semibold">
                        +{s.offerings.length - 3} more
                      </span>
                    )}
                  </div>
                  <div className="mt-5 flex items-center gap-1.5 text-primary font-semibold text-sm">
                    Explore <HiOutlineArrowRight className="group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Journey timeline */}
      <Section className="bg-navy text-navy-foreground">
        <SectionHeader
          eyebrow="Our Journey"
          title="From two founders to a pan-India firm"
          subtitle="A decade of helping Indian businesses build, comply and grow."
        />
        <div className="mt-16 relative">
          <div className="absolute left-4 sm:left-1/2 top-0 bottom-0 w-px bg-white/15" />
          <div className="space-y-10">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} delay={i * 0.05}>
                <div
                  className={`relative sm:grid sm:grid-cols-2 gap-8 pl-14 sm:pl-0 ${
                    i % 2 ? "sm:pl-8" : "sm:pr-8 sm:text-right"
                  }`}
                >
                  <div className={i % 2 ? "sm:col-start-2" : ""}>
                    <div className="text-primary-glow font-bold text-sm">{t.year}</div>
                    <h4 className="mt-1 text-xl font-display font-bold">{t.title}</h4>
                    <p className="mt-2 text-navy-foreground/70 text-sm">{t.text}</p>
                  </div>
                  <div
                    className="absolute left-4 sm:left-1/2 top-1 -translate-x-1/2 h-4 w-4 rounded-full gradient-primary ring-4 ring-navy"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Industries */}
      <Section id="industries">
        <SectionHeader
          eyebrow="Industries"
          title="Industries we serve"
          subtitle="Deep sector expertise across ten industries — with playbooks tailored to each."
        />
        <div className="mt-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {industries.map((ind, i) => (
            <Reveal key={ind.name} delay={i * 0.04}>
              <div className="group hover-lift rounded-2xl border border-border bg-background p-5 text-center">
                <div className="mx-auto h-12 w-12 rounded-xl gradient-primary grid place-items-center text-primary-foreground text-xl font-black shadow-elegant group-hover:scale-110 transition">
                  {ind.name.charAt(0)}
                </div>
                <div className="mt-3 font-semibold text-sm">{ind.name}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="bg-secondary/40">
        <SectionHeader
          eyebrow="Testimonials"
          title="What founders say about us"
        />
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {approved.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.05}>
              <div className="h-full rounded-3xl bg-background border border-border p-7 shadow-card hover-lift">
                <div className="flex text-primary gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <HiStar key={i} className="h-5 w-5 fill-primary" />
                  ))}
                </div>
                <p className="mt-4 text-foreground/90 leading-relaxed">"{t.comment}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <img src={t.image} alt={t.name} className="h-11 w-11 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.company}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/testimonials"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            Read all testimonials <HiOutlineArrowRight />
          </Link>
        </div>
      </Section>

      {/* Blogs */}
      <Section>
        <SectionHeader eyebrow="Insights" title="Latest from the Almawa journal" />
        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {blogs.slice(0, 3).map((b, i) => (
            <Reveal key={b.id} delay={i * 0.05}>
              <Link
                href={`/blog/${b.slug}`}
                className="group block rounded-3xl overflow-hidden border border-border bg-background hover-lift"
              >
                <div className="overflow-hidden aspect-[16/10]">
                  <img
                    src={b.image}
                    alt=""
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-6">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-primary">
                    {b.category}
                  </div>
                  <h4 className="mt-2 text-lg font-bold leading-snug group-hover:text-primary">
                    {b.title}
                  </h4>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-2">{b.excerpt}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* FAQ */}
      <Section className="bg-secondary/40">
        <SectionHeader eyebrow="FAQ" title="Frequently asked questions" />
        <div className="mt-12 max-w-3xl mx-auto space-y-3">
          {faqs.slice(0, 5).map((f, i) => (
            <FaqItem key={i} q={f.q} a={f.a} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/faq"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
          >
            View all FAQs <HiOutlineArrowRight />
          </Link>
        </div>
      </Section>

      <CtaBand onCta={() => openConsultation()} />
    </>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-border bg-background overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 p-5 text-left"
      >
        <span className="font-semibold text-foreground">{q}</span>
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
