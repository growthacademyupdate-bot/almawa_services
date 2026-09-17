"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Factory,
  HeartPulse,
  Landmark,
  MonitorSmartphone,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useApp } from "@/context/AppContext";

type Industry = {
  id: string;
  name: string;
  description: string;
  focus: string[];
  icon?: string;
};

const fallbackIndustries: Industry[] = [
  {
    id: "fallback-banking",
    name: "Banking & Financial Services",
    description:
      "Helping financial organizations improve operational efficiency, customer experience, compliance, and digital transformation.",
    focus: [
      "Process Optimization",
      "Digital Transformation",
      "Customer Experience",
      "Business Strategy",
    ],
    icon: "bank",
  },
  {
    id: "fallback-healthcare",
    name: "Healthcare",
    description:
      "Supporting healthcare organizations with better processes, technology adoption, operational improvement, and patient-focused strategies.",
    focus: [
      "Operational Efficiency",
      "Digital Solutions",
      "Process Improvement",
      "Strategic Planning",
    ],
    icon: "healthcare",
  },
  {
    id: "fallback-manufacturing",
    name: "Manufacturing",
    description:
      "Helping manufacturers optimize operations, reduce inefficiencies, improve productivity, and build scalable business processes.",
    focus: [
      "Process Optimization",
      "Supply Chain Improvement",
      "Cost Reduction",
      "Productivity Enhancement",
    ],
    icon: "factory",
  },
  {
    id: "fallback-retail",
    name: "Retail & E-Commerce",
    description:
      "Helping retail and e-commerce businesses improve customer experience, streamline operations, and build strategies for sustainable growth.",
    focus: [
      "Customer Experience",
      "E-Commerce Strategy",
      "Sales Optimization",
      "Digital Transformation",
    ],
    icon: "retail",
  },
  {
    id: "fallback-technology",
    name: "Technology & IT",
    description:
      "Supporting technology companies with business strategy, process improvement, digital transformation, and scalable growth solutions.",
    focus: [
      "Technology Strategy",
      "Business Growth",
      "Process Automation",
      "Digital Transformation",
    ],
    icon: "technology",
  },
  {
    id: "fallback-construction",
    name: "Real Estate & Construction",
    description:
      "Helping real estate and construction businesses improve project management, operational processes, customer relationships, and business performance.",
    focus: [
      "Project Management",
      "Business Strategy",
      "Process Improvement",
      "Operational Efficiency",
    ],
    icon: "construction",
  },
];

const processSteps = [
  {
    num: "01",
    title: "Understand",
    text: "Understand the industry, business model, challenges, and objectives.",
  },
  {
    num: "02",
    title: "Analyze",
    text: "Analyze existing processes and identify opportunities for improvement.",
  },
  {
    num: "03",
    title: "Strategize",
    text: "Develop a customized strategy aligned with business goals.",
  },
  {
    num: "04",
    title: "Implement",
    text: "Transform recommendations into practical actions.",
  },
  {
    num: "05",
    title: "Grow",
    text: "Identify opportunities for optimization and sustainable growth.",
  },
];

const iconMap: Record<
  string,
  LucideIcon
> = {
  bank: Landmark,
  banking: Landmark,
  finance: Landmark,

  healthcare: HeartPulse,
  health: HeartPulse,

  factory: Factory,
  manufacturing: Factory,

  retail: ShoppingCart,
  ecommerce: ShoppingCart,

  technology: MonitorSmartphone,
  technologyit: MonitorSmartphone,
  it: MonitorSmartphone,

  construction: Building2,
  realestate: Building2,
};

function normalizeKey(
  value: string,
) {
  return value
    .toLowerCase()
    .replace(/&/g, "")
    .replace(/[^a-z0-9]/g, "");
}

function getIndustryIcon(
  industry: Industry,
): LucideIcon {
  const iconKey = industry.icon
    ? normalizeKey(
        industry.icon,
      )
    : "";

  const nameKey =
    normalizeKey(
      industry.name,
    );

  return (
    iconMap[iconKey] ??
    iconMap[nameKey] ??
    Building2
  );
}

function normalizeIndustry(
  item: unknown,
  index: number,
): Industry | null {
  if (
    !item ||
    typeof item !== "object"
  ) {
    return null;
  }

  const value =
    item as Record<
      string,
      unknown
    >;

  const focusValue =
    Array.isArray(
      value.focus,
    )
      ? value.focus
      : Array.isArray(
            value.keyFocusAreas,
          )
        ? value.keyFocusAreas
        : [];

  const name = String(
    value.name ??
      value.title ??
      "",
  ).trim();

  if (!name) {
    return null;
  }

  return {
    id: String(
      value.id ??
        value._id ??
        `industry-${index}`,
    ),
    name,
    description: String(
      value.description ??
        value.desc ??
        "",
    ).trim(),
    focus: focusValue
      .map((item) =>
        String(item).trim(),
      )
      .filter(Boolean),
    icon:
      typeof value.icon ===
      "string"
        ? value.icon
        : undefined,
  };
}

export default function IndustriesPage() {
  const {
    openConsultation,
  } = useApp();

  const [
    industries,
    setIndustries,
  ] = useState<Industry[]>(
    fallbackIndustries,
  );

  const [
    loading,
    setLoading,
  ] = useState(true);

  const loadIndustries =
    useCallback(async () => {
      try {
        const response =
          await fetch(
            "/api/admin/content/industries",
            {
              cache:
                "no-store",
            },
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ??
              `Unable to load industries (${response.status})`,
          );
        }

        if (
          !Array.isArray(data)
        ) {
          throw new Error(
            "Invalid industries response",
          );
        }

        const loadedIndustries =
          data
            .map(
              (
                item,
                index,
              ) =>
                normalizeIndustry(
                  item,
                  index,
                ),
            )
            .filter(
              (
                item,
              ): item is Industry =>
                item !== null,
            );

        /*
         * Once the API has data, use the database
         * as the website source.
         */
        setIndustries(
          loadedIndustries,
        );
      } catch (error) {
        console.error(
          "Failed to load industries:",
          error,
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadIndustries();

    /*
     * Same browser tab.
     */
    const handleIndustryUpdate =
      () => {
        void loadIndustries();
      };

    /*
     * Different browser tab.
     */
    const handleStorage =
      (
        event: StorageEvent,
      ) => {
        if (
          event.key ===
          "almawa_industries_updated"
        ) {
          void loadIndustries();
        }
      };

    window.addEventListener(
      "almawa:industries-updated",
      handleIndustryUpdate,
    );

    window.addEventListener(
      "storage",
      handleStorage,
    );

    /*
     * Extra fallback so changes are picked up
     * even when the other tab does not trigger
     * a browser storage event.
     */
    const interval =
      window.setInterval(
        () => {
          void loadIndustries();
        },
        10000,
      );

    return () => {
      window.removeEventListener(
        "almawa:industries-updated",
        handleIndustryUpdate,
      );

      window.removeEventListener(
        "storage",
        handleStorage,
      );

      window.clearInterval(
        interval,
      );
    };
  }, [
    loadIndustries,
  ]);

  return (
    <main className="flex min-h-screen flex-col bg-background pt-24">
      {/* HERO */}
      <section className="relative overflow-hidden bg-secondary/30 py-20 lg:py-28">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

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
              INDUSTRIES
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
              Industries We Serve
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
                delay: 0.15,
              }}
              className="mt-4 text-xl font-semibold text-primary"
            >
              Industry-Focused Solutions.
              Business-Driven Results.
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
                delay: 0.2,
              }}
              className="mt-6 text-lg leading-relaxed text-muted-foreground"
            >
              At Almawa Services, we
              understand that every industry
              has unique challenges,
              opportunities, and business
              requirements. Our consulting
              solutions are designed to address
              industry-specific needs and help
              organizations improve
              performance, efficiency, and
              sustainable growth.
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
                delay: 0.3,
              }}
              className="mt-10 flex flex-wrap justify-center gap-4"
            >
              <button
                type="button"
                onClick={() =>
                  openConsultation()
                }
                className="rounded-full gradient-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-elegant transition-transform hover:scale-105"
              >
                Get Free Consultation
              </button>

              <Link
                href="/services"
                className="rounded-full border border-border bg-background px-8 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                Explore Our Services
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* INDUSTRIES */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {loading && (
            <div className="mb-8 text-center text-sm text-muted-foreground">
              Loading industries...
            </div>
          )}

          {industries.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center">
              <Building2 className="mx-auto h-10 w-10 text-muted-foreground/50" />

              <h3 className="mt-4 text-xl font-bold text-foreground">
                No industries available
              </h3>

              <p className="mt-2 text-muted-foreground">
                Industries added from the
                Admin Dashboard will appear
                here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {industries.map(
                (
                  industry,
                  index,
                ) => {
                  const IndustryIcon =
                    getIndustryIcon(
                      industry,
                    );

                  return (
                    <motion.div
                      key={industry.id}
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
                        delay:
                          index *
                          0.08,
                      }}
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-elegant"
                    >
                      <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-[100px] bg-primary/5 transition-transform group-hover:scale-110" />

                      <div className="relative z-10 mb-6 flex h-14 w-14 items-center justify-center rounded-xl gradient-primary text-primary-foreground shadow-md">
                        <IndustryIcon className="h-7 w-7" />
                      </div>

                      <h3 className="relative z-10 mb-3 text-2xl font-bold text-foreground">
                        {industry.name}
                      </h3>

                      <p className="relative z-10 mb-6 leading-relaxed text-muted-foreground">
                        {industry.description}
                      </p>

                      {industry.focus.length >
                        0 && (
                        <div className="relative z-10 mt-auto">
                          <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
                            Key Focus Areas
                          </h4>

                          <ul className="space-y-2">
                            {industry.focus.map(
                              (
                                item,
                                focusIndex,
                              ) => (
                                <li
                                  key={`${industry.id}-${focusIndex}-${item}`}
                                  className="flex items-start gap-2"
                                >
                                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />

                                  <span className="text-sm text-muted-foreground">
                                    {item}
                                  </span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                      <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
                    </motion.div>
                  );
                },
              )}
            </div>
          )}
        </div>
      </section>

      {/* WHY INDUSTRY EXPERTISE */}
      <section className="border-y border-border bg-secondary/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{
                opacity: 0,
                x: -20,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
              }}
            >
              <h2 className="mb-3 text-sm font-bold uppercase tracking-widest text-primary">
                Why Industry Expertise Matters
              </h2>

              <h3 className="mb-6 text-3xl font-bold text-foreground sm:text-4xl">
                Every Industry Is Different.
                So Are Our Solutions.
              </h3>

              <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
                A one-size-fits-all approach
                doesn't work when businesses
                operate in different environments.
                At Almawa Services, we take time
                to understand your industry's
                challenges, market conditions,
                customer expectations, and
                operational requirements before
                developing a strategy.
              </p>

              <div className="space-y-6">
                {processSteps.map(
                  (
                    step,
                    index,
                  ) => (
                    <div
                      key={step.num}
                      className="flex items-start gap-4"
                    >
                      <div className="flex flex-col items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                          {step.num}
                        </div>

                        {index !==
                          processSteps.length -
                            1 && (
                          <div className="mt-2 h-10 w-px bg-border" />
                        )}
                      </div>

                      <div className="pt-2">
                        <h4 className="text-lg font-bold text-foreground">
                          {step.title}
                        </h4>

                        <p className="mt-1 text-muted-foreground">
                          {step.text}
                        </p>
                      </div>
                    </div>
                  ),
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{
                opacity: 0,
                x: 20,
              }}
              whileInView={{
                opacity: 1,
                x: 0,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.5,
              }}
              className="relative hidden lg:block"
            >
              <div className="flex aspect-[4/5] flex-col items-center justify-center rounded-3xl border border-border bg-gradient-to-tr from-primary/20 via-primary/5 to-transparent p-8 shadow-elegant">
                <div className="w-full max-w-sm space-y-4">
                  {[
                    "Industry Understanding",
                    "Business Analysis",
                    "Customized Strategy",
                    "Implementation",
                    "Measurable Results",
                  ].map(
                    (
                      text,
                      index,
                    ) => (
                      <div
                        key={text}
                        className="flex w-full flex-col items-center"
                      >
                        <div className="w-full rounded-xl border border-border bg-card p-4 text-center font-semibold text-foreground shadow-sm transition-colors hover:border-primary/50">
                          {text}
                        </div>

                        {index < 4 && (
                          <ArrowRight className="mt-4 h-6 w-6 rotate-90 text-primary" />
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <motion.div
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
            }}
            className="rounded-3xl gradient-primary p-12 shadow-elegant"
          >
            <h2 className="mb-6 text-3xl font-bold text-primary-foreground sm:text-4xl">
              Let's Build a Better Future
              for Your Business
            </h2>

            <p className="mx-auto mb-10 max-w-2xl text-lg text-primary-foreground/90">
              Whatever industry you operate
              in, Almawa Services can help you
              identify opportunities, solve
              challenges, and create a roadmap
              for sustainable growth.
            </p>

            <button
              type="button"
              onClick={() =>
                openConsultation()
              }
              className="rounded-full bg-white px-8 py-4 text-base font-bold text-primary shadow-lg transition-transform hover:scale-105"
            >
              Get Your Free Consultation
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}