import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  HiCheckCircle,
  HiShieldCheck,
  HiClock,
  HiUsers,
  HiLocationMarker,
  HiMail,
  HiPhone,
} from "react-icons/hi";
import { Section } from "@/components/site/primitives";
import { useApp } from "@/context/AppContext";
import { serviceOptions } from "@/mock/data";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Almawa Services — Free Consultation, Pan India" },
      {
        name: "description",
        content:
          "Tell us about your startup or business idea. Our expert consultants will get back to you within 24 hours.",
      },
      { property: "og:title", content: "Contact Almawa Services" },
      { property: "og:description", content: "Free consultation for Indian founders. Pan India." },
    ],
  }),
  component: Contact,
});

const STAGES = ["Idea Stage", "Early Startup", "Existing Business", "MSME / SME"];

function Contact() {
  const { addLead, settings } = useApp();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: "",
    stage: "Idea Stage",
    message: "",
  });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const p = new URLSearchParams(window.location.search).get("service");
    if (p) setForm((f) => ({ ...f, service: p }));
  }, []);

  const update = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!form.lastName.trim()) errs.lastName = "Required";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = "Invalid email";
    if (!/^\+?[\d\s-]{7,15}$/.test(form.phone)) errs.phone = "Invalid phone";
    if (!form.service) errs.service = "Required";
    if (form.message.trim().length < 10) errs.message = "Tell us a bit more";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      if (response.ok) {
        addLead(form);
        setSuccess(true);
        setForm({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          service: "",
          stage: "Idea Stage",
          message: "",
        });
      } else {
        const errorData = await response.json();
        console.error("Failed to submit form:", errorData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section className="pt-36 pb-10 gradient-navy text-navy-foreground">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/25 border border-primary/40 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
            <HiLocationMarker className="h-3.5 w-3.5 text-primary-glow" />
            Free Consultation — Pan India
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black leading-tight">
            Start Your <span className="text-gradient">Business Journey</span>
          </h1>
          <p className="mt-4 text-lg text-navy-foreground/80 max-w-2xl mx-auto">
            Tell us about your startup or business idea. Our expert consultants will get back to you
            within 24 hours.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs font-medium">
            {[
              [HiShieldCheck, "100% Confidential"],
              [HiClock, "24 Hr Response"],
              [HiUsers, "500+ Businesses Served"],
              [HiLocationMarker, "Pan India"],
            ].map(([I, t], i) => {
              const Icon = I as typeof HiShieldCheck;
              return (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-3 py-1.5"
                >
                  <Icon className="h-3.5 w-3.5 text-primary-glow" />
                  {t as string}
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <Section className="!pt-14">
        <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8">
          <div className="rounded-3xl bg-background border border-border shadow-elegant p-6 sm:p-10">
            {success ? (
              <div className="py-10 text-center">
                <div className="mx-auto h-16 w-16 rounded-full gradient-primary grid place-items-center shadow-glow mb-4">
                  <HiCheckCircle className="h-9 w-9 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-display font-bold">You're all set!</h3>
                <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                  Thank you. One of our consultants will reach out within 24 hours.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-6 rounded-full gradient-primary text-primary-foreground px-6 py-3 text-sm font-semibold"
                >
                  Submit another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="First Name" error={errors.firstName}>
                    <input
                      value={form.firstName}
                      onChange={(e) => update("firstName")(e.target.value)}
                      className="input"
                      maxLength={50}
                    />
                  </Field>
                  <Field label="Last Name" error={errors.lastName}>
                    <input
                      value={form.lastName}
                      onChange={(e) => update("lastName")(e.target.value)}
                      className="input"
                      maxLength={50}
                    />
                  </Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field label="Email" error={errors.email}>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email")(e.target.value)}
                      className="input"
                      maxLength={100}
                    />
                  </Field>
                  <Field label="WhatsApp / Mobile" error={errors.phone}>
                    <input
                      value={form.phone}
                      onChange={(e) => update("phone")(e.target.value)}
                      className="input"
                      maxLength={20}
                    />
                  </Field>
                </div>
                <Field label="Service Needed" error={errors.service}>
                  <select
                    value={form.service}
                    onChange={(e) => update("service")(e.target.value)}
                    className="input"
                  >
                    <option value="">Choose a service…</option>
                    {serviceOptions.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Business Stage">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {STAGES.map((s) => (
                      <button
                        type="button"
                        key={s}
                        onClick={() => update("stage")(s)}
                        className={`rounded-xl border px-3 py-2.5 text-xs font-semibold transition ${
                          form.stage === s
                            ? "border-primary bg-accent text-primary"
                            : "border-border hover:border-primary/40"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </Field>
                <Field label="About Your Business" error={errors.message}>
                  <textarea
                    value={form.message}
                    onChange={(e) => update("message")(e.target.value)}
                    rows={5}
                    maxLength={1000}
                    className="input resize-none"
                    placeholder="What are you building? Where are you today? What do you need help with?"
                  />
                </Field>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-2 rounded-full gradient-primary text-primary-foreground px-6 py-3.5 text-sm font-bold shadow-elegant hover:shadow-glow transition disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting..." : "Submit — Get My Free Consultation"}
                </button>
              </form>
            )}
          </div>

          <aside className="grid gap-4 content-start">
            <div className="rounded-3xl gradient-navy text-navy-foreground p-7 shadow-elegant">
              <h3 className="text-xl font-display font-bold">Reach us directly</h3>
              <div className="mt-5 space-y-4 text-sm">
                <a href={`mailto:${settings.email}`} className="flex items-start gap-3">
                  <HiMail className="h-5 w-5 text-primary-glow mt-0.5" />
                  <span>{settings.email}</span>
                </a>
                <a href={`tel:${settings.phone}`} className="flex items-start gap-3">
                  <HiPhone className="h-5 w-5 text-primary-glow mt-0.5" />
                  <span>{settings.phone}</span>
                </a>
                <div className="flex items-start gap-3">
                  <HiLocationMarker className="h-5 w-5 text-primary-glow mt-0.5" />
                  <span>{settings.address}</span>
                </div>
              </div>
            </div>
            <div className="rounded-3xl bg-accent/40 border border-accent p-7">
              <div className="font-bold text-primary text-sm uppercase tracking-widest">
                Response promise
              </div>
              <div className="mt-2 font-display text-xl font-bold">
                Every enquiry gets a human reply within 24 hours.
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                We treat every founder's message like our own.
              </p>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider">
        {label} <span className="text-primary">*</span>
      </span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="text-xs text-destructive mt-1 block">{error}</span>}
    </label>
  );
}
