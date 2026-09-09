"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Star, Quote, ArrowRight, CheckCircle2 } from "lucide-react";
import { useApp } from "@/context/AppContext";

const testimonials = [
  {
    name: "Rahul Sharma",
    position: "Managing Director",
    company: "RS Business Solutions",
    rating: 5,
    testimonial:
      "Almawa Services helped us identify several operational challenges that were affecting our growth. Their practical recommendations and hands-on approach made a significant difference to our business.",
    initials: "RS",
  },
  {
    name: "Priya Mehta",
    position: "Founder & CEO",
    company: "PM Technologies",
    rating: 5,
    testimonial:
      "The team understood our business requirements quickly and provided a clear strategy for moving forward. Their consulting approach was professional, practical, and focused on real results.",
    initials: "PM",
  },
  {
    name: "Amit Verma",
    position: "Operations Head",
    company: "AV Enterprises",
    rating: 5,
    testimonial:
      "Working with Almawa Services gave our team a much clearer direction. They helped us improve our internal processes and identify opportunities that we had previously overlooked.",
    initials: "AV",
  },
  {
    name: "Neha Kapoor",
    position: "Business Director",
    company: "NK Retail",
    rating: 5,
    testimonial:
      "We appreciated the personalized approach from the Almawa Services team. Instead of providing generic advice, they took the time to understand our challenges and create solutions specifically for our business.",
    initials: "NK",
  },
  {
    name: "Vikram Singh",
    position: "CEO",
    company: "VS Industries",
    rating: 5,
    testimonial:
      "Their strategic guidance helped us make better business decisions. The team was responsive, knowledgeable, and committed throughout the engagement.",
    initials: "VS",
  },
  {
    name: "Ananya Rao",
    position: "Founder",
    company: "AR Consulting",
    rating: 5,
    testimonial:
      "Almawa Services became more than just a consultant for us. They worked closely with our team and helped us build a stronger foundation for sustainable growth.",
    initials: "AR",
  },
];

const reasons = [
  {
    num: "01",
    title: "Strategic Thinking",
    text: "Clear strategies designed around your business goals.",
  },
  {
    num: "02",
    title: "Practical Solutions",
    text: "Recommendations that can actually be implemented.",
  },
  {
    num: "03",
    title: "Industry Understanding",
    text: "Solutions adapted to your industry's unique challenges.",
  },
  {
    num: "04",
    title: "Long-Term Partnership",
    text: "We focus on building relationships and supporting continued growth.",
  },
];

const stats = [
  { value: "100+", label: "Clients Supported" },
  { value: "95%", label: "Client Satisfaction" },
  { value: "Multiple", label: "Industries Served" },
];

export default function TestimonialsPage() {
  const { openConsultation } = useApp();

  return (
    <main className="flex min-h-screen flex-col pt-24 bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-secondary/30 py-20 lg:py-28">
        <div className="absolute -right-64 -top-64 w-96 h-96 bg-primary/10 rounded-full blur-[100px]"></div>
        <div className="absolute -left-32 top-32 w-72 h-72 bg-primary/5 rounded-full blur-[80px]"></div>
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl text-center mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wider uppercase mb-4"
            >
              CLIENT TESTIMONIALS
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              What Our Clients Say
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-4 text-xl font-semibold text-primary"
            >
              Trusted by businesses that are ready to grow, improve, and transform.
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-6 text-lg text-muted-foreground leading-relaxed"
            >
              At Almawa Services, we believe our clients' success is the best measure of our work. Here's what businesses have to say about working with our consulting team.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
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
                View Our Services
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group flex flex-col rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-elegant hover:border-primary/50 relative overflow-hidden"
              >
                <Quote className="absolute top-6 right-6 h-12 w-12 text-primary/10 group-hover:text-primary/20 transition-colors" />
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-muted-foreground leading-relaxed flex-grow mb-8 relative z-10">
                  "{t.testimonial}"
                </p>
                <div className="flex items-center gap-4 pt-6 border-t border-border">
                  <div className="h-12 w-12 rounded-full gradient-primary flex items-center justify-center text-primary-foreground font-bold shadow-md">
                    {t.initials}
                  </div>
                  <div>
                    <h4 className="text-foreground font-bold">{t.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {t.position}, {t.company}
                    </p>
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full"></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Client Success Section */}
      <section className="py-20 bg-secondary/50 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-foreground mb-6"
            >
              Building Success Through Partnership
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground leading-relaxed"
            >
              Every business has a different story. Our role is to understand that story, identify opportunities, and help turn business goals into measurable outcomes.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
            {stats.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="py-6 md:py-0 px-4"
              >
                <div className="text-5xl font-black text-primary mb-3">{s.value}</div>
                <div className="text-lg font-semibold text-foreground uppercase tracking-wider">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Clients Choose Us */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-bold text-foreground"
            >
              Why Businesses Choose Almawa Services
            </motion.h2>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {reasons.map((r, i) => (
              <motion.div
                key={r.num}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-2xl bg-card border border-border p-8 hover:border-primary/50 transition-colors shadow-sm"
              >
                <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xl mb-6">
                  {r.num}
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{r.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{r.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background border-t border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl gradient-primary p-12 shadow-elegant overflow-hidden relative"
          >
            <div className="absolute -right-24 -top-24 w-64 h-64 bg-white/10 rounded-full blur-[50px]"></div>
            <div className="absolute -left-24 -bottom-24 w-64 h-64 bg-black/10 rounded-full blur-[50px]"></div>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-6 relative z-10">
              Ready to Create Your Success Story?
            </h2>
            <p className="text-lg text-primary-foreground/90 mb-10 max-w-2xl mx-auto relative z-10">
              Join businesses that are working with Almawa Services to improve performance, solve challenges, and build sustainable growth.
            </p>
            <button
              onClick={() => openConsultation()}
              className="relative z-10 rounded-full bg-white px-8 py-4 text-base font-bold text-primary shadow-lg hover:scale-105 transition-transform"
            >
              Get Your Free Consultation
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
