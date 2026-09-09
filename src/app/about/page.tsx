"use client";

import Link from "next/link";
import { HiOutlineBriefcase, HiOutlineCheckCircle, HiOutlineLightBulb, HiOutlineChip, HiOutlineUserGroup, HiOutlineTrendingUp, HiOutlineArrowRight } from "react-icons/hi";
import { Section, SectionHeader, Reveal, CtaBand } from "@/components/site/primitives";
import { useApp } from "@/context/AppContext";

const WHY_CHOOSE_US = [
  { icon: HiOutlineBriefcase, title: "Business-Focused Approach", text: "We prioritize your core business objectives over generic templates." },
  { icon: HiOutlineCheckCircle, title: "Practical Solutions", text: "Actionable strategies designed for real-world execution." },
  { icon: HiOutlineUserGroup, title: "Industry Expertise", text: "Deep knowledge across multiple sectors and markets." },
  { icon: HiOutlineChip, title: "Technology & Innovation", text: "Leveraging the latest tech to drive operational efficiency." },
  { icon: HiOutlineLightBulb, title: "Long-Term Partnership", text: "We grow with you, supporting you through every business stage." },
  { icon: HiOutlineTrendingUp, title: "Result Oriented", text: "A strict focus on measurable outcomes and sustainable growth." },
];

const APPROACH = [
  { step: "01", title: "Understand", text: "We analyze your business, challenges, and goals." },
  { step: "02", title: "Strategize", text: "We develop a tailored roadmap for your success." },
  { step: "03", title: "Implement", text: "We execute the strategy with precision and care." },
  { step: "04", title: "Grow", text: "We monitor progress and optimize for sustainable growth." },
];

export default function AboutPage() {
  const { openConsultation } = useApp();

  return (
    <>
      {/* Hero Section */}
      <section className="pt-36 pb-20 gradient-navy text-navy-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-navy to-transparent"></div>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <Reveal>
            <h1 className="text-4xl sm:text-6xl font-display font-black leading-tight">
              About <span className="text-gradient">Almawa Services</span>
            </h1>
            <p className="mt-4 text-xl font-medium text-primary-glow">
              Your Trusted Partner for Business Growth & Transformation
            </p>
            <p className="mt-6 text-lg text-navy-foreground/80 max-w-3xl mx-auto leading-relaxed">
              We help businesses solve complex challenges, improve operations, develop winning strategies, and achieve sustainable growth. Whether you are starting out or scaling up, our expert team is here to guide you.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <button
                onClick={() => openConsultation()}
                className="rounded-full gradient-primary text-primary-foreground px-8 py-4 text-sm font-semibold shadow-elegant hover:shadow-glow transition-all hover:-translate-y-0.5"
              >
                Get Free Consultation
              </button>
              <Link
                href="/services"
                className="rounded-full border-2 border-white/20 px-8 py-4 text-sm font-semibold hover:border-primary-glow hover:text-primary-glow transition-all hover:-translate-y-0.5 bg-white/5 backdrop-blur-sm"
              >
                Explore Our Services
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Who We Are */}
      <Section className="!py-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80"
                alt="Business Consulting Team"
                className="rounded-3xl shadow-elegant w-full aspect-[4/3] object-cover"
              />
              <div className="absolute -bottom-8 -right-8 hidden md:block rounded-3xl gradient-primary text-primary-foreground p-8 max-w-[240px] shadow-glow">
                <div className="text-4xl font-display font-black mb-2">10+</div>
                <div className="text-sm font-medium opacity-90">Years of helping businesses achieve excellence</div>
              </div>
            </div>
          </Reveal>
          <div>
            <SectionHeader
              center={false}
              eyebrow="Who We Are"
              title="A Business Consulting Company Built for Modern Challenges"
            />
            <div className="mt-8 space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Almawa Services is a premier business consulting firm dedicated to helping startups, small businesses, and established organizations navigate their most critical challenges and significantly improve overall performance.
              </p>
              <p>
                We believe that every business has untapped potential. Our team of seasoned operators and strategic thinkers works closely with founders and leadership teams to uncover that potential, build robust operational frameworks, and drive meaningful, sustainable growth.
              </p>
              <p>
                From foundational incorporation to complex market expansion and digital transformation, we are the operating partner that ambitious companies trust to get things done right.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section className="bg-secondary/40 border-y border-border">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Reveal delay={0.1}>
            <div className="bg-background rounded-3xl p-10 shadow-sm border border-border h-full hover-lift">
              <div className="h-14 w-14 rounded-2xl gradient-primary grid place-items-center mb-6 shadow-elegant">
                <HiOutlineTrendingUp className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">Our Mission</h3>
              <p className="text-xl font-medium text-foreground/90 italic">
                "Empowering Businesses to Achieve More"
              </p>
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                We strive to provide accessible, high-quality consulting services that enable businesses of all sizes to overcome obstacles, streamline operations, and realize their full market potential.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="bg-background rounded-3xl p-10 shadow-sm border border-border h-full hover-lift">
              <div className="h-14 w-14 rounded-2xl gradient-primary grid place-items-center mb-6 shadow-elegant">
                <HiOutlineLightBulb className="h-7 w-7 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-4">Our Vision</h3>
              <p className="text-xl font-medium text-foreground/90 italic">
                "Building Better Businesses for a Better Future"
              </p>
              <p className="mt-4 text-muted-foreground text-sm leading-relaxed">
                To be the most trusted consulting partner in India, recognized for our unwavering commitment to client success, innovative solutions, and measurable impact on the broader business ecosystem.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section>
        <SectionHeader
          eyebrow="The Almawa Advantage"
          title="Why Choose Almawa Services"
          subtitle="We bring a unique blend of strategic thinking, practical execution, and industry expertise to every engagement."
        />
        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {WHY_CHOOSE_US.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <div className="hover-lift rounded-3xl bg-background border border-border p-8 h-full transition-all duration-300 hover:border-primary/50 hover:shadow-card">
                <div className="h-12 w-12 rounded-xl bg-primary/10 grid place-items-center mb-6">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-bold mb-3">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Our Approach */}
      <Section className="bg-navy text-navy-foreground">
        <SectionHeader
          eyebrow="Our Process"
          title="How We Deliver Results"
          subtitle="A systematic, proven methodology that ensures clarity, execution, and success."
        />
        <div className="mt-20 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-8 left-10 right-10 h-0.5 bg-white/10 z-0"></div>
          {APPROACH.map((step, i) => (
            <Reveal key={step.step} delay={i * 0.1}>
              <div className="relative z-10 flex flex-col items-center text-center group">
                <div className="h-16 w-16 rounded-full gradient-primary grid place-items-center shadow-glow mb-6 text-xl font-black text-primary-foreground group-hover:scale-110 transition-transform duration-300">
                  {step.step}
                </div>
                <h3 className="text-xl font-display font-bold mb-3">{step.title}</h3>
                <p className="text-sm text-navy-foreground/70">{step.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Final CTA */}
      <Section className="bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center rounded-3xl bg-background border border-border p-12 shadow-elegant">
          <Reveal>
            <h2 className="text-3xl md:text-4xl font-display font-black mb-4">Ready to Take Your Business to the Next Level?</h2>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
              Whether you need strategic guidance, operational improvements, or digital transformation, our team is ready to help you succeed.
            </p>
            <button
              onClick={() => openConsultation()}
              className="inline-flex items-center gap-2 rounded-full gradient-primary text-primary-foreground px-8 py-4 text-base font-bold shadow-elegant hover:shadow-glow transition-all hover:scale-105"
            >
              Get Your Free Consultation <HiOutlineArrowRight className="h-5 w-5" />
            </button>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
