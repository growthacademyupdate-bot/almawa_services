"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Plus, Minus, Search, MessageCircleQuestion } from "lucide-react";
import { useApp } from "@/context/AppContext";

const faqData = [
  {
    category: "General",
    questions: [
      {
        q: "What is Almawa Services?",
        a: "Almawa Services is a business consulting company that helps organizations improve their strategies, operations, processes, and overall business performance. We work closely with businesses to identify challenges and develop practical solutions for sustainable growth.",
      },
      {
        q: "Who can work with Almawa Services?",
        a: "We work with startups, small and medium-sized businesses, and established organizations across different industries. Our consulting approach is customized according to each client's business requirements.",
      },
      {
        q: "What makes Almawa Services different?",
        a: "Our approach focuses on understanding the client's actual business challenges before recommending solutions. We combine strategic thinking, practical implementation, industry understanding, and technology to create meaningful business outcomes.",
      },
    ],
  },
  {
    category: "Our Services",
    questions: [
      {
        q: "What consulting services do you provide?",
        a: "Our services can include business strategy, process optimization, digital transformation, operational improvement, technology consulting, business growth strategy, and other customized consulting solutions.",
      },
      {
        q: "Can you create a customized consulting solution?",
        a: "Yes. Every business has different requirements, so we customize our consulting approach based on your objectives, challenges, industry, existing processes, and growth plans.",
      },
      {
        q: "Do you provide technology and digital transformation consulting?",
        a: "Yes. We help businesses identify opportunities to use technology, automation, and digital solutions to improve efficiency, customer experience, and business performance.",
      },
    ],
  },
  {
    category: "Consulting Process",
    questions: [
      {
        q: "How does the consulting process work?",
        a: "Our consulting process generally follows five stages: understanding your business, analyzing challenges, developing a strategy, supporting implementation, and continuously identifying opportunities for improvement.",
      },
      {
        q: "How do we get started?",
        a: "You can start by contacting our team through the consultation form or Contact page. We will understand your requirements and discuss the next steps with you.",
      },
      {
        q: "How long does a consulting project take?",
        a: "The duration depends on the scope, complexity, and objectives of the project. After understanding your requirements, we can provide a more appropriate timeline.",
      },
    ],
  },
  {
    category: "Pricing & Consultation",
    questions: [
      {
        q: "Do you offer a free consultation?",
        a: "Yes. You can request a free initial consultation to discuss your business requirements, challenges, and potential opportunities.",
      },
      {
        q: "How much do your consulting services cost?",
        a: "Consulting fees depend on the type of service, project scope, duration, and business requirements. Contact us to discuss your needs and receive a customized proposal.",
      },
      {
        q: "Can I discuss my requirements before making a decision?",
        a: "Absolutely. We encourage potential clients to discuss their business challenges and objectives with our team before deciding on a consulting engagement.",
      },
    ],
  },
  {
    category: "Industries",
    questions: [
      {
        q: "Which industries do you serve?",
        a: "We work with businesses across multiple industries, including financial services, healthcare, manufacturing, retail and e-commerce, technology and IT, real estate, construction, and other business sectors.",
      },
      {
        q: "Do you work with businesses outside these industries?",
        a: "Yes. Our consulting approach is flexible and can be adapted to businesses with different operating models and industry requirements.",
      },
    ],
  },
  {
    category: "Support",
    questions: [
      {
        q: "Can Almawa Services support implementation?",
        a: "Yes. Depending on the project, we can support implementation and help your team turn strategic recommendations into practical actions.",
      },
      {
        q: "Can we continue working with you after the project?",
        a: "Yes. We can provide ongoing consulting and strategic support depending on your business requirements.",
      },
      {
        q: "How can I contact Almawa Services?",
        a: "You can contact us through the Contact page or request a free consultation. Our team will get in touch to understand your requirements.",
      },
    ],
  },
];

const popularQuestions = [
  "What consulting services do you provide?",
  "How do we get started?",
  "Do you offer a free consultation?",
  "How much do your consulting services cost?",
];

export default function FAQPage() {
  const { openConsultation } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);

  const toggleQuestion = (q: string) => {
    setOpenQuestion(openQuestion === q ? null : q);
  };

  const handlePopularClick = (q: string) => {
    setSearchQuery("");
    setOpenQuestion(q);
    const element = document.getElementById(`faq-${q.replace(/\s+/g, "-")}`);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  // Filter FAQ data based on search
  const filteredData = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (item) =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <main className="flex min-h-screen flex-col pt-24 bg-background">
      {/* Hero Section */}
      <section className="relative bg-secondary/30 py-20 lg:py-24 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-sm font-semibold tracking-wider uppercase mb-4"
            >
              FREQUENTLY ASKED QUESTIONS
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl mb-6"
            >
              Frequently Asked Questions
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl font-semibold text-primary mb-6"
            >
              Everything You Need to Know About Our Consulting Services
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-lg text-muted-foreground leading-relaxed mb-10"
            >
              Have questions about Almawa Services, our consulting approach, or how we can help your business grow? Find answers to some of the most common questions below.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap justify-center gap-4"
            >
              <button
                onClick={() => openConsultation()}
                className="rounded-full gradient-primary px-8 py-3.5 text-base font-semibold text-primary-foreground shadow-elegant hover:scale-105 transition-transform"
              >
                Get Free Consultation
              </button>
              <Link
                href="/contact"
                className="rounded-full bg-background border border-border px-8 py-3.5 text-base font-semibold text-foreground hover:bg-secondary transition-colors"
              >
                Contact Us
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="py-24 bg-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          
          {/* Search Box */}
          <div className="relative mb-16 max-w-2xl mx-auto">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-12 py-4 bg-card border border-border rounded-full text-foreground placeholder-muted-foreground focus:ring-2 focus:ring-primary/50 focus:border-primary transition-shadow text-lg shadow-sm"
              placeholder="Search your question..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
            )}
          </div>

          {/* Popular Questions */}
          {!searchQuery && (
            <div className="mb-20">
              <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
                Popular Questions
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {popularQuestions.map((q, i) => (
                  <motion.button
                    key={q}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.1 }}
                    onClick={() => handlePopularClick(q)}
                    className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card text-left hover:border-primary/50 hover:shadow-sm transition-all group"
                  >
                    <MessageCircleQuestion className="h-5 w-5 text-primary shrink-0" />
                    <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {q}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* FAQ Accordions */}
          <div className="space-y-12">
            {filteredData.length > 0 ? (
              filteredData.map((category, idx) => (
                <div key={category.category}>
                  <h3 className="text-2xl font-bold text-foreground mb-6 pb-2 border-b border-border">
                    {category.category}
                  </h3>
                  <div className="space-y-4">
                    {category.questions.map((item) => {
                      const isOpen = openQuestion === item.q;
                      return (
                        <div
                          key={item.q}
                          id={`faq-${item.q.replace(/\s+/g, "-")}`}
                          className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                            isOpen
                              ? "border-primary/50 shadow-md bg-card"
                              : "border-border bg-card hover:border-primary/30"
                          }`}
                        >
                          <button
                            onClick={() => toggleQuestion(item.q)}
                            className="w-full flex items-center justify-between p-6 text-left"
                          >
                            <span
                              className={`text-lg font-bold pr-8 ${
                                isOpen ? "text-primary" : "text-foreground"
                              }`}
                            >
                              {item.q}
                            </span>
                            <span
                              className={`shrink-0 flex items-center justify-center h-8 w-8 rounded-full transition-colors ${
                                isOpen ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                              }`}
                            >
                              {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                            </span>
                          </button>
                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeInOut" }}
                              >
                                <div className="px-6 pb-6 pt-0 text-muted-foreground leading-relaxed">
                                  {item.a}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 rounded-2xl border border-dashed border-border bg-secondary/30">
                <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-bold text-foreground mb-2">No questions found</h3>
                <p className="text-muted-foreground">
                  Try a different search or contact our team for assistance.
                </p>
                <button
                  onClick={() => setSearchQuery("")}
                  className="mt-6 text-primary font-semibold hover:underline"
                >
                  Reset Search
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-secondary/30 border-t border-border">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-3xl bg-card border border-border p-12 shadow-elegant"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
              Still Have Questions?
            </h2>
            <p className="text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
              Our team is here to help. Tell us about your business challenge and let's discuss how Almawa Services can help.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                onClick={() => openConsultation()}
                className="rounded-full gradient-primary px-8 py-4 text-base font-bold text-primary-foreground shadow-lg hover:scale-105 transition-transform"
              >
                Get Your Free Consultation
              </button>
              <Link
                href="/contact"
                className="rounded-full bg-secondary border border-border px-8 py-4 text-base font-bold text-foreground hover:bg-border transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
