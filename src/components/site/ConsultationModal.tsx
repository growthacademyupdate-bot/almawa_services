import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HiX, HiCheckCircle, HiShieldCheck, HiClock, HiUsers, HiLocationMarker } from "react-icons/hi";
import { useApp } from "@/context/AppContext";
import { serviceOptions } from "@/mock/data";
import { createConsultation } from "@/server/consultation";

const STAGES = ["Idea Stage", "Early Startup", "Existing Business", "MSME / SME"];

export function ConsultationModal() {
  const { consultationOpen, closeConsultation, preselectedService, addLead } = useApp();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    service: preselectedService ?? "",
    stage: "Idea Stage",
    message: "",
  });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (consultationOpen) {
      setForm((f) => ({ ...f, service: preselectedService ?? f.service ?? "" }));
      setSuccess(false);
      setErrors({});
    }
  }, [consultationOpen, preselectedService]);

  useEffect(() => {
    if (!consultationOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [consultationOpen]);

  const update = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

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

    try {
      await createConsultation({
        data: {
          ...form,
          mobile: form.phone,
          country: "India",
          subject: "Free consultation",
        },
      });
      addLead(form);
      setSuccess(true);
    } catch (error) {
      console.error("Failed to submit consultation", error);
      setErrors({ message: "Unable to submit right now. Please try again." });
    }
  };

  return (
    <AnimatePresence>
      {consultationOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-navy/70 backdrop-blur-sm overflow-y-auto"
          onClick={closeConsultation}
        >
          <div className="min-h-full flex items-center justify-center p-4 py-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: "spring", damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl bg-background rounded-3xl shadow-elegant overflow-hidden relative"
            >
              <button
                onClick={closeConsultation}
                className="absolute right-4 top-4 z-10 h-10 w-10 grid place-items-center rounded-full bg-background/80 hover:bg-secondary text-foreground"
                aria-label="Close"
              >
                <HiX className="h-5 w-5" />
              </button>

              <div className="gradient-primary text-primary-foreground px-6 sm:px-10 pt-8 pb-6 relative overflow-hidden">
                <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-white/10 blur-3xl" />
                <div className="relative">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold tracking-wider uppercase mb-3">
                    <HiLocationMarker className="h-3.5 w-3.5" /> Free Consultation · Pan India
                  </div>
                  <h2 className="text-3xl sm:text-4xl font-display font-black leading-tight">
                    Start Your Business Journey
                  </h2>
                  <p className="mt-2 text-sm sm:text-base text-primary-foreground/90 max-w-2xl">
                    Tell us about your startup or business idea. Our expert consultants will get
                    back to you within 24 hours.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-medium">
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
                          className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5"
                        >
                          <Icon className="h-3.5 w-3.5" />
                          {t as string}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {success ? (
                <div className="p-10 text-center">
                  <div className="mx-auto h-16 w-16 rounded-full gradient-primary grid place-items-center shadow-glow mb-4">
                    <HiCheckCircle className="h-9 w-9 text-primary-foreground" />
                  </div>
                  <h3 className="text-2xl font-display font-bold">You're all set!</h3>
                  <p className="mt-2 text-muted-foreground">
                    Thank you, {form.firstName}. One of our consultants will call you on {form.phone}{" "}
                    within 24 hours.
                  </p>
                  <button
                    onClick={closeConsultation}
                    className="mt-6 rounded-full gradient-primary text-primary-foreground px-6 py-3 text-sm font-semibold"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={submit} className="p-6 sm:p-10 grid gap-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="First Name" error={errors.firstName}>
                      <input
                        value={form.firstName}
                        onChange={(e) => update("firstName")(e.target.value)}
                        className="input"
                        placeholder="Priya"
                        maxLength={50}
                      />
                    </Field>
                    <Field label="Last Name" error={errors.lastName}>
                      <input
                        value={form.lastName}
                        onChange={(e) => update("lastName")(e.target.value)}
                        className="input"
                        placeholder="Sharma"
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
                        placeholder="priya@company.com"
                        maxLength={100}
                      />
                    </Field>
                    <Field label="WhatsApp / Mobile" error={errors.phone}>
                      <input
                        value={form.phone}
                        onChange={(e) => update("phone")(e.target.value)}
                        className="input"
                        placeholder="+91 98765 43210"
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
                        <option key={s} value={s}>
                          {s}
                        </option>
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
                              : "border-border bg-background hover:border-primary/40"
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
                      rows={4}
                      maxLength={1000}
                      className="input resize-none"
                      placeholder="What are you building? Where are you today? What do you need help with?"
                    />
                  </Field>
                  <button
                    type="submit"
                    className="mt-2 rounded-full gradient-primary text-primary-foreground px-6 py-3.5 text-sm font-bold shadow-elegant hover:shadow-glow transition"
                  >
                    Submit — Get My Free Consultation
                  </button>
                  <p className="text-center text-xs text-muted-foreground">
                    By submitting, you agree to be contacted about your enquiry. Your details are
                    kept confidential.
                  </p>
                </form>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
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
      <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
        {label} <span className="text-primary">*</span>
      </span>
      <div className="mt-1.5">{children}</div>
      {error && <span className="text-xs text-destructive mt-1 block">{error}</span>}
    </label>
  );
}
