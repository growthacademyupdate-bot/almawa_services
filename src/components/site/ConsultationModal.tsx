import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HiX, HiCheckCircle } from "react-icons/hi";
import { useApp } from "@/context/AppContext";
import { createConsultation } from "@/server/consultation";

export function WelcomePopup() {
  const { welcomePopupOpen, closeWelcomePopup, preselectedService, addLead } = useApp();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    service: preselectedService ?? "",
    stage: "Website enquiry",
    message: "",
    consent: false,
  });
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (welcomePopupOpen) {
      setForm((f) => ({ ...f, service: preselectedService ?? f.service ?? "" }));
      setSuccess(false);
      setErrors({});
    }
  }, [welcomePopupOpen, preselectedService]);

  useEffect(() => {
    if (!welcomePopupOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [welcomePopupOpen]);

  const update = (k: keyof typeof form) => (v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = "Required";
    if (!/^\+?[\d\s-]{7,15}$/.test(form.phone)) errs.phone = "Invalid phone";
    if (!form.company.trim()) errs.company = "Required";
    if (form.message.trim().length < 10) errs.message = "Tell us a bit more";
    if (!form.consent) errs.consent = "Please accept the consent";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    try {
      await createConsultation({
        data: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          mobile: form.phone,
          phone: form.phone,
          country: "India",
          subject: "Free consultation",
          service: form.service || "General enquiry",
          stage: form.stage,
          message: form.message,
          company: form.company,
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
      {welcomePopupOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-navy/70 backdrop-blur-sm overflow-y-auto"
          onClick={closeWelcomePopup}
        >
          <div className="min-h-full flex items-center justify-center p-4 py-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: "spring", damping: 24 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-5xl bg-background rounded-2xl shadow-elegant overflow-hidden relative"
            >
              <button
                onClick={closeWelcomePopup}
                className="absolute right-4 top-4 z-10 h-10 w-10 grid place-items-center rounded-full bg-background/80 hover:bg-secondary text-foreground"
                aria-label="Close"
              >
                <HiX className="h-5 w-5" />
              </button>

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
                    onClick={closeWelcomePopup}
                    className="mt-6 rounded-full gradient-primary text-primary-foreground px-6 py-3 text-sm font-semibold"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <div className="grid md:grid-cols-[42%_58%]">
                  <div className="relative min-h-72 overflow-hidden bg-[#0d4b85] text-white">
                    <img
                      src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=900&q=85"
                      alt="Business team collaborating"
                      className="absolute inset-0 h-full w-full object-cover opacity-35"
                    />
                    <div className="absolute inset-0 bg-[#06477f]/80" />
                    <div className="relative flex h-full flex-col justify-end p-7 sm:p-10">
                      <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#ffc400]">
                        Almawa Services
                      </p>
                      <h2 className="mt-3 max-w-sm text-3xl font-display font-black leading-tight sm:text-4xl">
                        Build your business with the right solution.
                      </h2>
                      <p className="mt-4 max-w-sm text-sm leading-6 text-white/80">
                        Get practical guidance from our team for your next business move.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={submit} className="grid gap-4 p-6 sm:p-10">
                    <h2 className="pr-8 text-3xl font-display font-black leading-tight text-[#1260d8] sm:text-4xl">
                      Let Us Help You With the Right Solution
                    </h2>
                    <Field label="Your Name" error={errors.firstName} hideLabel>
                      <input
                        value={form.firstName}
                        onChange={(e) => update("firstName")(e.target.value)}
                        className="input"
                        placeholder="Your Name"
                        maxLength={80}
                      />
                    </Field>
                    <Field label="Your Phone Number" error={errors.phone} hideLabel>
                      <input
                        value={form.phone}
                        onChange={(e) => update("phone")(e.target.value)}
                        className="input"
                        placeholder="Your Phone Number"
                        maxLength={20}
                      />
                    </Field>
                    <Field label="Company Name" error={errors.company} hideLabel>
                      <input
                        value={form.company}
                        onChange={(e) => update("company")(e.target.value)}
                        className="input"
                        placeholder="Company Name"
                        maxLength={100}
                      />
                    </Field>
                    <Field label="Message" error={errors.message} hideLabel>
                    <textarea
                      value={form.message}
                      onChange={(e) => update("message")(e.target.value)}
                      rows={3}
                      maxLength={1000}
                      className="input resize-none"
                      placeholder="Message..."
                    />
                    </Field>
                    <p className="text-xs leading-5 text-[#1260d8]">
                      By clicking Sign Up, you confirm that you have read and agree to our Terms &amp;
                      Conditions and Privacy Policy.
                    </p>
                    <label className="flex items-start gap-2 text-xs leading-5 text-muted-foreground">
                      <input
                        type="checkbox"
                        checked={form.consent}
                        onChange={(e) => setForm((f) => ({ ...f, consent: e.target.checked }))}
                        className="mt-1 h-4 w-4 accent-[#1260d8]"
                      />
                      <span>By submitting this form, you agree to be contacted by us on WhatsApp / SMS / Email regarding your enquiry.</span>
                    </label>
                    {errors.consent && <span className="text-xs text-destructive">{errors.consent}</span>}
                    <div className="grid grid-cols-2 gap-3 pt-1">
                      <button
                        type="button"
                        onClick={closeWelcomePopup}
                        className="rounded-lg bg-[#c4dcfb] px-4 py-3 text-sm font-bold text-[#1260d8] transition hover:bg-[#b4d2f7]"
                      >
                        Skip
                      </button>
                      <button
                        type="submit"
                        className="rounded-lg bg-[#6f99ed] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#5685e5]"
                      >
                        Sign Up
                      </button>
                    </div>
                  </form>
                </div>
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
  hideLabel,
  children,
}: {
  label: string;
  error?: string;
  hideLabel?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      {!hideLabel && <span className="text-xs font-semibold text-foreground uppercase tracking-wider">
        {label} <span className="text-primary">*</span>
      </span>}
      <div className="mt-1.5">{children}</div>
      {error && <span className="text-xs text-destructive mt-1 block">{error}</span>}
    </label>
  );
}