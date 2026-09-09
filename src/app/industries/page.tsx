"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Landmark,
  HeartPulse,
  Factory,
  ShoppingCart,
  MonitorSmartphone,
  Building2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { useApp } from "@/context/AppContext";

const industries = [
  {
    title: "Banking & Financial Services",
    description:
      "Helping financial organizations improve operational efficiency, customer experience, compliance, and digital transformation.",
    icon: Landmark,
    focus: [
      "Process Optimization",
      "Digital Transformation",
      "Customer Experience",
      "Business Strategy",
    ],
  },
  {
    title: "Healthcare",
    description:
      "Supporting healthcare organizations with better processes, technology adoption, operational improvement, and patient-focused strategies.",
    icon: HeartPulse,
    focus: [
      "Operational Efficiency",
      "Digital Solutions",
      "Process Improvement",
      "Strategic Planning",
    ],
  },
  {
    title: "Manufacturing",
    description:
      "Helping manufacturers optimize operations, reduce inefficiencies, improve productivity, and build scalable business processes.",
    icon: Factory,
    focus: [
      "Process Optimization",
      "Supply Chain Improvement",
      "Cost Reduction",
      "Productivity Enhancement",
    ],
  },
  {
    title: "Retail & E-Commerce",
    description:
      "Helping retail and e-commerce businesses improve customer experience, streamline operations, and build strategies for sustainable growth.",
    icon: ShoppingCart,
    focus: [
      "Customer Experience",
      "E-Commerce Strategy",
      "Sales Optimization",
      "Digital Transformation",
    ],
  },
  {
    title: "Technology & IT",
    description:
      "Supporting technology companies with business strategy, process improvement, digital transformation, and scalable growth solutions.",
    icon: MonitorSmartphone,
    focus: [
      "Technology Strategy",
      "Business Growth",
      "Process Automation",
      "Digital Transformation",
    ],
  },
  {
    title: "Real Estate & Construction",
    description:
      "Helping real estate and construction businesses improve project management, operational processes, customer relationships, and business performance.",
    icon: Building2,
    focus: [
      "Project Management",
      "Business Strategy",
      "Process Improvement",
      "Operational Efficiency",
    ],
  },
];

const processSteps = [
  { num: "01", title: "Understand", text: "Understand the industry, business model, challenges, and objectives." },
  { num: "02", title: "Analyze", text: "Analyze existing processes and identify opportunities for improvement." },
  { num: "03", title: "Strategize", text: "Develop a customized strategy aligned with business goals." },
  { num: "04", title: "Implement", text: "Transform recommendations into practical actions." },
  { num: "05", title: "Grow", text: "Identify opportunities for optimization and sustainable growth." },
];

export default function IndustriesPage() {
  const { openConsultation } = useApp();

  return (
    <main className="flex min-h-screen flex-col pt-24 bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary/30 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl text-center mx-auto">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Industries We Serve
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-4 text-xl font-semibold text-primary"
            >
              Industry-Focused Solutions. Business-Driven Results.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-muted-foreground leading-relaxed"
            >
              At Almawa Services, we understand that every industry has unique challenges, opportunities, and business requirements. Our consulting solutions are designed to address industry-specific needs and help organizations improve performance, efficiency, and sustainable growth.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <button
                onClick={() => openConsultation()}
                className="rounded-full gradient-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-elegant hover:scale-105 transition-transform"
              >
                Get Free Consultation
              </button>
              <Link
                href="/services"
                className="rounded-full bg-background border border-border px-8 py-3.5 text-base font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                Explore Our Services
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Industries Grid */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {industries.map((ind, i) => (
              <motion.div
                key={ind.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:shadow-elegant hover:border-primary/50 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[100px] -z-10 transition-transform group-hover:scale-110"></div>
                <div>
                  <div className="h-14 w-14 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground mb-6 shadow-md">
                    <ind.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-3">{ind.title}</h3>
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {ind.description}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold uppercase tracking-wider text-foreground mb-3">
                    Key Focus Areas
                  </h4>
                  <ul className="space-y-2">
                    {ind.focus.map((item) => (
                      <li key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Industry Expertise Matters */}
      <section className="py-24 bg-secondary/30 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-sm font-bold tracking-widest uppercase text-primary mb-3">
                Why Industry Expertise Matters
              </h2>
              <h3 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
                Every Industry Is Different. So Are Our Solutions.
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                A one-size-fits-all approach doesn't work when businesses operate in different environments. At Almawa Services, we take time to understand your industry's challenges, market conditions, customer expectations, and operational requirements before developing a strategy.
              </p>
              
              <div className="space-y-6">
                {processSteps.map((step, i) => (
                  <div key={step.num} className="flex items-start gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                        {step.num}
                      </div>
                      {i !== processSteps.length - 1 && (
                        <div className="w-px h-10 bg-border mt-2"></div>
                      )}
                    </div>
                    <div className="pt-2">
                      <h4 className="text-lg font-bold text-foreground">{step.title}</h4>
                      <p className="text-muted-foreground mt-1">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="relative hidden lg:block"
            >
              <div className="aspect-[4/5] rounded-3xl bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent border border-border p-8 flex flex-col justify-center items-center shadow-elegant">
                 <div className="w-full max-w-sm space-y-4">
                    {["Industry Understanding", "Business Analysis", "Customized Strategy", "Implementation", "Measurable Results"].map((text, i) => (
                       <div key={text} className="flex flex-col items-center w-full">
                         <div className="w-full bg-card border border-border rounded-xl p-4 text-center font-semibold text-foreground shadow-sm hover:border-primary/50 transition-colors">
                           {text}
                         </div>
                         {i < 4 && <ArrowRight className="h-6 w-6 text-primary mt-4 rotate-90" />}
                       </div>
                    ))}
                 </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl gradient-primary p-12 shadow-elegant"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
              Let's Build a Better Future for Your Business
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-10 max-w-2xl mx-auto">
              Whatever industry you operate in, Almawa Services can help you identify opportunities, solve challenges, and create a roadmap for sustainable growth.
            </p>
            <button
              onClick={() => openConsultation()}
              className="rounded-full bg-white px-8 py-4 text-base font-bold text-primary shadow-lg hover:scale-105 transition-transform"
            >
              Get Your Free Consultation
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
