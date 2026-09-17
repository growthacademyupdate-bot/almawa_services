"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Quote, Star } from "lucide-react";

import { useApp } from "@/context/AppContext";
import TestimonialForm from "@/components/site/TestimonialForm";

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

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export default function TestimonialsPage() {
  const {
    openConsultation,
    testimonials,
  } = useApp();

  /* Only APPROVED testimonials are public */
  const approvedTestimonials =
    testimonials.filter(
      (testimonial) =>
        testimonial.status === "approved",
    );

  return (
    <main className="flex min-h-screen flex-col bg-background pt-24">
      {/* =====================================================
          HERO
      ====================================================== */}
      <section className="relative overflow-hidden bg-secondary/30 py-20 lg:py-28">
        <div className="absolute -right-64 -top-64 h-96 w-96 rounded-full bg-primary/10 blur-[100px]" />

        <div className="absolute -left-32 top-32 h-72 w-72 rounded-full bg-primary/5 blur-[80px]" />

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <motion.span
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
              }}
              className="mb-4 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold uppercase tracking-wider text-primary"
            >
              CLIENT TESTIMONIALS
            </motion.span>

            <motion.h1
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.1,
              }}
              className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              What Our Clients Say
            </motion.h1>

            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.2,
              }}
              className="mt-4 text-xl font-semibold text-primary"
            >
              Trusted by businesses that are ready to grow,
              improve, and transform.
            </motion.p>

            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.3,
              }}
              className="mt-6 text-lg leading-relaxed text-muted-foreground"
            >
              At Almawa Services, we believe our clients'
              success is the best measure of our work. Here's
              what businesses have to say about working with our
              consulting team.
            </motion.p>

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.5,
                delay: 0.4,
              }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <button
                type="button"
                onClick={() => openConsultation()}
                className="rounded-full gradient-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-elegant transition-transform hover:scale-105"
              >
                Get Free Consultation
              </button>

              <a
                href="#share-experience"
                className="rounded-full border border-border bg-background px-8 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Share Your Experience
              </a>

              <Link
                href="/services"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-8 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                View Our Services
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* =====================================================
          APPROVED TESTIMONIALS
      ====================================================== */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Client Experiences
            </h2>

            <p className="mt-3 text-muted-foreground">
              Testimonials approved by the Almawa Services team.
            </p>
          </div>

          {approvedTestimonials.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
              <Quote className="mx-auto h-10 w-10 text-primary/30" />

              <h3 className="mt-4 text-lg font-bold text-foreground">
                No approved testimonials yet
              </h3>

              <p className="mt-2 text-sm text-muted-foreground">
                Be the first to share your experience with Almawa
                Services.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {approvedTestimonials.map(
                (testimonial, index) => {
                  const initials = getInitials(
                    testimonial.name,
                  );

                  return (
                    <motion.div
                      key={testimonial.id}
                      initial={{
                        opacity: 0,
                        y: 20,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.5,
                        delay: index * 0.08,
                      }}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-elegant"
                    >
                      <Quote className="absolute right-6 top-6 h-12 w-12 text-primary/10 transition-colors group-hover:text-primary/20" />

                      {/* Stars */}
                      <div className="flex items-center gap-1">
                        {Array.from({
                          length: 5,
                        }).map(
                          (_, starIndex) => (
                            <Star
                              key={starIndex}
                              className={`h-5 w-5 ${
                                starIndex <
                                testimonial.rating
                                  ? "fill-primary text-primary"
                                  : "text-muted-foreground/20"
                              }`}
                            />
                          ),
                        )}
                      </div>

                      {/* Comment */}
                      <p className="relative z-10 mb-8 mt-6 flex-grow leading-relaxed text-muted-foreground">
                        "{testimonial.comment}"
                      </p>

                      {/* Client */}
                      <div className="flex items-center gap-4 border-t border-border pt-6">
                        {testimonial.image ? (
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-primary font-bold text-primary-foreground">
                            {initials || "A"}
                          </div>
                        )}

                        <div>
                          <h4 className="font-bold text-foreground">
                            {testimonial.name}
                          </h4>

                          <p className="text-sm text-muted-foreground">
                            {testimonial.company}
                          </p>
                        </div>
                      </div>

                      <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                    </motion.div>
                  );
                },
              )}
            </div>
          )}
        </div>
      </section>

      {/* =====================================================
          SUBMIT TESTIMONIAL
      ====================================================== */}
      <section
        id="share-experience"
        className="border-y border-border bg-secondary/40 py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <TestimonialForm />
        </div>
      </section>

      {/* =====================================================
          STATS
      ====================================================== */}
      <section className="border-y border-border bg-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Building Success Through Partnership
            </h2>

            <p className="mx-auto mt-4 max-w-3xl text-lg leading-relaxed text-muted-foreground">
              Every business has a different story. Our role is
              to understand that story, identify opportunities,
              and help turn business goals into measurable
              outcomes.
            </p>
          </div>

          <div className="grid grid-cols-1 divide-y divide-border md:grid-cols-3 md:divide-x md:divide-y-0">
            {stats.map((stat) => (
              <div
                key={stat.label}
                className="px-4 py-6 text-center md:py-0"
              >
                <div className="mb-3 text-5xl font-black text-primary">
                  {stat.value}
                </div>

                <div className="text-lg font-semibold uppercase tracking-wider text-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          WHY ALMAWA
      ====================================================== */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Why Businesses Choose Almawa Services
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {reasons.map((reason) => (
              <div
                key={reason.num}
                className="rounded-2xl border border-border bg-card p-8 shadow-sm transition-colors hover:border-primary/50"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-xl font-bold text-primary">
                  {reason.num}
                </div>

                <h3 className="mb-3 text-xl font-bold text-foreground">
                  {reason.title}
                </h3>

                <p className="leading-relaxed text-muted-foreground">
                  {reason.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          CTA
      ====================================================== */}
      <section className="border-t border-border bg-background py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl gradient-primary p-12 shadow-elegant">
            <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-white/10 blur-[50px]" />

            <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-black/10 blur-[50px]" />

            <h2 className="relative z-10 mb-6 text-3xl font-bold text-primary-foreground sm:text-4xl">
              Ready to Create Your Success Story?
            </h2>

            <p className="relative z-10 mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/90">
              Join businesses that are working with Almawa
              Services to improve performance, solve challenges,
              and build sustainable growth.
            </p>

            <button
              type="button"
              onClick={() => openConsultation()}
              className="relative z-10 rounded-full bg-white px-8 py-4 text-base font-bold text-primary shadow-lg transition-transform hover:scale-105"
            >
              Get Your Free Consultation
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}