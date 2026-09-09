"use client";

import Link from "next/link";
import { HiOutlineArrowRight } from "react-icons/hi";
import {
  Section,
  SectionHeader,
  Reveal,
  CtaBand,
} from "@/components/site/primitives";
import { services } from "@/mock/data";
import { useApp } from "@/context/AppContext";

export default function ServicesPage() {
  const { openConsultation } = useApp();

  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-20 relative overflow-hidden gradient-navy text-navy-foreground">
        <div className="absolute -right-40 -top-40 w-[500px] h-[500px] rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-40 bottom-0 w-[400px] h-[400px] rounded-full bg-accent/10 blur-3xl" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl">
            <div className="inline-flex rounded-full bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]">
              Our Services
            </div>

            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-display font-black leading-tight">
              Everything your business needs,
              <span className="text-primary-glow"> under one roof.</span>
            </h1>

            <p className="mt-6 text-lg text-navy-foreground/75 leading-relaxed max-w-2xl">
              From incorporation and compliance to fundraising, branding and
              digital growth, Almawa Services helps Indian businesses build,
              manage and scale with confidence.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={() => openConsultation()}
                className="rounded-full gradient-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow-elegant"
              >
                Book a Consultation
              </button>

              <a
                href="#services"
                className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold hover:bg-white/10 transition"
              >
                Explore Services
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <Section id="services">
        <SectionHeader
          eyebrow="What We Do"
          title="Everything your business needs, under one roof"
          subtitle="From day-one incorporation to growth-stage fundraising, we're the operating team you can plug in."
        />

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={index * 0.05}>
              <Link
                href={`/services/${service.slug}`}
                className="group relative block h-full rounded-3xl overflow-hidden border border-border bg-background hover-lift"
              >
                {/* Card image / gradient */}
                <div
                  className={`h-40 bg-gradient-to-br ${service.color} relative`}
                >
                  <div className="absolute inset-0 bg-black/5" />

                  <div className="absolute inset-0 grid place-items-center">
                    <span className="text-white/90 text-6xl font-display font-black opacity-80">
                      {service.title.charAt(0)}
                    </span>
                  </div>
                </div>

                {/* Card content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold group-hover:text-primary transition">
                    {service.title}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {service.tagline}
                  </p>

                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {service.offerings.slice(0, 3).map((offering) => (
                      <span
                        key={offering}
                        className="text-[11px] rounded-full bg-secondary text-secondary-foreground px-2.5 py-1 font-medium"
                      >
                        {offering}
                      </span>
                    ))}

                    {service.offerings.length > 3 && (
                      <span className="text-[11px] rounded-full bg-accent text-primary px-2.5 py-1 font-semibold">
                        +{service.offerings.length - 3} more
                      </span>
                    )}
                  </div>

                  <div className="mt-5 flex items-center gap-1.5 text-primary font-semibold text-sm">
                    Explore
                    <HiOutlineArrowRight className="group-hover:translate-x-1 transition" />
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* CTA */}
      <CtaBand onCta={() => openConsultation()} />
    </>
  );
}