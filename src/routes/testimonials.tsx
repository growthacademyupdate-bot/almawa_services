import { createFileRoute } from "@tanstack/react-router";
import { HiStar, HiOutlineChatAlt } from "react-icons/hi";
import { useState } from "react";
import { Section, SectionHeader, Reveal, CtaBand } from "@/components/site/primitives";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/testimonials")({
  head: () => ({
    meta: [
      { title: "Client Testimonials — Almawa Services" },
      {
        name: "description",
        content: "Read what 500+ Indian founders and MSMEs say about working with Almawa Services.",
      },
      { property: "og:title", content: "Client Testimonials — Almawa Services" },
      { property: "og:description", content: "Real reviews from real founders." },
    ],
  }),
  component: Testimonials,
});

function Testimonials() {
  const { testimonials, addTestimonial, openConsultation } = useApp();
  const approved = testimonials.filter((t) => t.status === "approved");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", company: "", rating: 5, comment: "", image: "" });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    addTestimonial({
      name: form.name,
      company: form.company,
      rating: form.rating,
      comment: form.comment,
      image: form.image || `https://i.pravatar.cc/150?u=${encodeURIComponent(form.name)}`,
    });
    setSent(true);
    setForm({ name: "", company: "", rating: 5, comment: "", image: "" });
  };

  return (
    <>
      <section className="pt-36 pb-16 gradient-navy text-navy-foreground">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest mb-4">
            Testimonials
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black leading-tight">
            Real founders. <span className="text-gradient">Real outcomes.</span>
          </h1>
          <p className="mt-5 text-lg text-navy-foreground/80 max-w-3xl mx-auto">
            {approved.length}+ testimonials from businesses we've helped register, comply, raise
            capital and grow.
          </p>
        </div>
      </section>

      <Section>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
          <SectionHeader eyebrow="Reviews" title="What our clients say" center={false} />
          <button
            onClick={() => setOpen((v) => !v)}
            className="rounded-full gradient-primary text-primary-foreground px-6 py-3 text-sm font-semibold shadow-elegant"
          >
            <HiOutlineChatAlt className="inline mr-2 -mt-0.5" />
            {open ? "Hide form" : "Submit your testimonial"}
          </button>
        </div>

        {open && (
          <form
            onSubmit={submit}
            className="mb-12 rounded-3xl bg-background border border-border p-6 sm:p-8 shadow-card grid gap-4 sm:grid-cols-2"
          >
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider">Your Name *</span>
              <input
                required
                className="input mt-1.5"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-wider">Company *</span>
              <input
                required
                className="input mt-1.5"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Photo URL (optional)</span>
              <input
                className="input mt-1.5"
                placeholder="https://…"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Rating</span>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3, 4, 5].map((r) => (
                  <button
                    type="button"
                    key={r}
                    onClick={() => setForm({ ...form, rating: r })}
                    className="p-1"
                  >
                    <HiStar
                      className={`h-7 w-7 ${
                        r <= form.rating ? "text-primary fill-primary" : "text-muted-foreground/40"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </label>
            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Your Review *</span>
              <textarea
                required
                minLength={20}
                maxLength={500}
                rows={4}
                className="input mt-1.5 resize-none"
                value={form.comment}
                onChange={(e) => setForm({ ...form, comment: e.target.value })}
              />
            </label>
            <div className="sm:col-span-2 flex items-center justify-between gap-4 flex-wrap">
              <p className="text-xs text-muted-foreground">
                Your review will be published after admin approval.
              </p>
              <button className="rounded-full gradient-primary text-primary-foreground px-6 py-3 text-sm font-bold shadow-elegant">
                Submit Review
              </button>
            </div>
            {sent && (
              <p className="sm:col-span-2 text-sm text-primary font-semibold">
                Thank you — your testimonial is pending admin approval.
              </p>
            )}
          </form>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {approved.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.04}>
              <div className="h-full rounded-3xl bg-background border border-border p-7 hover-lift">
                <div className="flex text-primary gap-0.5">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <HiStar key={i} className="h-5 w-5 fill-primary" />
                  ))}
                </div>
                <p className="mt-4 text-foreground/90 leading-relaxed">"{t.comment}"</p>
                <div className="mt-6 flex items-center gap-3">
                  <img src={t.image} alt="" className="h-11 w-11 rounded-full object-cover" />
                  <div>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.company}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaBand onCta={() => openConsultation()} />
    </>
  );
}
