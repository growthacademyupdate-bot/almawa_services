"use client";

import { useEffect, useState, type FormEvent } from "react";
import { HiCheckCircle, HiLocationMarker, HiMail, HiPhone } from "react-icons/hi";
import { Section } from "@/components/site/primitives";
import { serviceOptions } from "@/mock/data";

type ContactForm = {
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  phone: string;
  country: string;
  subjects: string;
  msg: string;
};

type GeoNamesPlace = {
  geonameId: number;
  name: string;
  countryName: string;
  adminName1?: string;
};

const initialForm: ContactForm = {
  firstname: "",
  lastname: "",
  email: "",
  mobile: "",
  phone: "",
  country: "",
  subjects: "",
  msg: "",
};

const CONTACT_EMAIL = "business@al-mawa.international";
const PHONE_ONE = "+91 9561179693";
const PHONE_TWO = "+91 9561106693";

export default function ContactPage() {
  const [form, setForm] = useState<ContactForm>(initialForm);
  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactForm, string>>
  >({});
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [places, setPlaces] = useState<GeoNamesPlace[]>([]);
  const [placesLoading, setPlacesLoading] = useState(false);
  const [placesError, setPlacesError] = useState("");
  const [locationSelected, setLocationSelected] = useState(false);

  const update = (field: keyof ContactForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const updateLocation = (value: string) => {
    setLocationSelected(false);
    update("country", value);
  };

  useEffect(() => {
    const query = (form.country ?? "").trim();

    if (locationSelected || query.length < 2) {
      setPlaces([]);
      setPlacesError("");
      return;
    }

    const controller = new AbortController();

    const timeout = window.setTimeout(async () => {
      setPlacesLoading(true);
      setPlacesError("");

      try {
        const response = await fetch(
          `/api/geonames?q=${encodeURIComponent(query)}`,
          {
            signal: controller.signal,
          },
        );

        const payload = (await response.json()) as {
          places?: GeoNamesPlace[];
          error?: string;
        };

        if (!response.ok) {
          setPlaces([]);
          setPlacesError(payload.error ?? "Unable to search locations.");
          return;
        }

        setPlaces(payload.places ?? []);
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }

        setPlaces([]);
        setPlacesError("Unable to search locations.");
      } finally {
        if (!controller.signal.aborted) {
          setPlacesLoading(false);
        }
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [form.country, locationSelected]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextErrors: Partial<Record<keyof ContactForm, string>> = {};

    const required: Array<keyof ContactForm> = [
      "firstname",
      "lastname",
      "email",
      "mobile",
      "phone",
      "country",
      "subjects",
      "msg",
    ];

    required.forEach((field) => {
      if (!(form[field] ?? "").trim()) {
        nextErrors[field] = "This field is required.";
      }
    });

    if (
      form.email &&
      !/^\S+@\S+\.\S+$/.test(form.email)
    ) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (
      form.mobile &&
      !/^\+?[\d\s()-]{7,20}$/.test(form.mobile)
    ) {
      nextErrors.mobile = "Enter a valid mobile number.";
    }

    if (
      form.phone &&
      !/^\+?[\d\s()-]{7,20}$/.test(form.phone)
    ) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    if (
      form.msg &&
      form.msg.trim().length < 10
    ) {
      nextErrors.msg = "Please enter at least 10 characters.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length) {
      return;
    }

    setStatus("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        throw new Error(
          payload?.error ?? "Unable to send your enquiry.",
        );
      }

      setForm(initialForm);
      setStatus("success");
    } catch (error) {
      setStatus("error");

      setErrors({
        msg:
          error instanceof Error
            ? error.message
            : "Unable to send your enquiry.",
      });
    }
  };

  return (
    <>
      <section className="pt-36 pb-12 gradient-navy text-navy-foreground">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/25 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em]">
            <HiLocationMarker className="h-3.5 w-3.5 text-primary-glow" />
            Contact Almawa Services
          </div>

          <h1 className="mt-4 text-4xl font-display font-black sm:text-6xl">
            Let&apos;s Talk About Your Business
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-navy-foreground/80">
            Send your details and our team will respond within 24 hours.
          </p>
        </div>
      </section>

      <Section className="!pt-14">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div className="rounded-3xl border border-border bg-background p-6 shadow-elegant sm:p-10">
            {status === "success" ? (
              <div className="py-12 text-center">
                <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full gradient-primary shadow-glow">
                  <HiCheckCircle className="h-9 w-9 text-primary-foreground" />
                </div>

                <h2 className="text-2xl font-display font-bold">
                  Thank you for contacting us!
                </h2>

                <p className="mx-auto mt-2 max-w-md text-muted-foreground">
                  Your information was saved successfully. We&apos;ll be in
                  touch soon.
                </p>

                <button
                  type="button"
                  onClick={() => setStatus("idle")}
                  className="mt-6 rounded-full gradient-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
                >
                  Send another enquiry
                </button>
              </div>
            ) : (
              <form onSubmit={submit} noValidate className="grid gap-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="First name"
                    error={errors.firstname}
                  >
                    <input
                      className="input"
                      value={form.firstname}
                      onChange={(e) =>
                        update("firstname", e.target.value)
                      }
                      maxLength={50}
                    />
                  </Field>

                  <Field
                    label="Last name"
                    error={errors.lastname}
                  >
                    <input
                      className="input"
                      value={form.lastname}
                      onChange={(e) =>
                        update("lastname", e.target.value)
                      }
                      maxLength={50}
                    />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Email"
                    error={errors.email}
                  >
                    <input
                      type="email"
                      className="input"
                      value={form.email}
                      onChange={(e) =>
                        update("email", e.target.value)
                      }
                      maxLength={100}
                    />
                  </Field>

                  <Field
                    label="Mobile"
                    error={errors.mobile}
                  >
                    <input
                      type="tel"
                      className="input"
                      value={form.mobile}
                      onChange={(e) =>
                        update("mobile", e.target.value)
                      }
                      maxLength={20}
                    />
                  </Field>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field
                    label="Phone"
                    error={errors.phone}
                  >
                    <input
                      type="tel"
                      className="input"
                      value={form.phone}
                      onChange={(e) =>
                        update("phone", e.target.value)
                      }
                      maxLength={20}
                    />
                  </Field>

                  <Field
                    label="Select location"
                    error={errors.country}
                  >
                    <div className="relative">
                      <input
                        className="input"
                        value={form.country ?? ""}
                        onChange={(e) =>
                          updateLocation(e.target.value)
                        }
                        maxLength={100}
                        placeholder="Start typing a city"
                        autoComplete="off"
                        role="combobox"
                        aria-expanded={
                          placesLoading ||
                          places.length > 0 ||
                          Boolean(placesError)
                        }
                        aria-controls="location-suggestions"
                      />

                      {(placesLoading ||
                        places.length > 0 ||
                        placesError) && (
                        <div
                          id="location-suggestions"
                          role="listbox"
                          className="absolute z-10 mt-1 max-h-56 w-full overflow-auto rounded-xl border border-border bg-background p-1 shadow-elegant"
                        >
                          {placesLoading ? (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                              Searching locations...
                            </div>
                          ) : placesError ? (
                            <div className="px-3 py-2 text-sm text-destructive">
                              {placesError}
                            </div>
                          ) : places.length > 0 ? (
                            places.map((place) => (
                              <button
                                type="button"
                                role="option"
                                key={place.geonameId}
                                onClick={() => {
                                  update(
                                    "country",
                                    [
                                      place.name,
                                      place.adminName1,
                                      place.countryName,
                                    ]
                                      .filter(Boolean)
                                      .join(", "),
                                  );

                                  setLocationSelected(true);
                                  setPlaces([]);
                                }}
                                className="block w-full rounded-lg px-3 py-2 text-left text-sm hover:bg-accent"
                              >
                                <span className="font-semibold">
                                  {place.name}
                                </span>

                                {place.adminName1 && (
                                  <span className="text-muted-foreground">
                                    {`, ${place.adminName1}`}
                                  </span>
                                )}

                                <span className="block text-xs text-muted-foreground">
                                  {place.countryName}
                                </span>
                              </button>
                            ))
                          ) : (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                              No matching locations found.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Field>
                </div>

                <Field
                  label="Subjects"
                  error={errors.subjects}
                >
                  <select
                    className="input"
                    value={form.subjects}
                    onChange={(e) =>
                      update("subjects", e.target.value)
                    }
                  >
                    <option value="">
                      Select a subject
                    </option>

                    {serviceOptions.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field
                  label="Message"
                  error={errors.msg}
                >
                  <textarea
                    className="input resize-none"
                    rows={5}
                    value={form.msg}
                    onChange={(e) =>
                      update("msg", e.target.value)
                    }
                    maxLength={2000}
                    placeholder="How can we help you?"
                  />
                </Field>

                <button
                  disabled={status === "sending"}
                  type="submit"
                  className="mt-2 rounded-full gradient-primary px-6 py-3.5 text-sm font-bold text-primary-foreground shadow-elegant disabled:cursor-wait disabled:opacity-70"
                >
                  {status === "sending"
                    ? "Sending..."
                    : "Send Enquiry"}
                </button>
              </form>
            )}
          </div>

          <aside className="grid content-start gap-4">
            <div className="rounded-3xl gradient-navy p-7 text-navy-foreground shadow-elegant">
              <h2 className="text-xl font-display font-bold">
                Reach us directly
              </h2>

              <div className="mt-5 space-y-4 text-sm">
                {/* Email */}
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-start gap-3 transition hover:text-primary-glow"
                >
                  <HiMail className="mt-0.5 h-5 w-5 shrink-0 text-primary-glow" />

                  <span>
                    {CONTACT_EMAIL}
                  </span>
                </a>

                {/* Phone Numbers */}
                <div className="flex items-start gap-3">
                  <HiPhone className="mt-0.5 h-5 w-5 shrink-0 text-primary-glow" />

                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <a
                      href="tel:+919561179693"
                      className="transition hover:text-primary-glow"
                    >
                      {PHONE_ONE}
                    </a>

                    <span className="text-navy-foreground/50">
                      |
                    </span>

                    <a
                      href="tel:+919561106693"
                      className="transition hover:text-primary-glow"
                    >
                      {PHONE_TWO}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-accent bg-accent/40 p-7">
              <div className="text-sm font-bold uppercase tracking-widest text-primary">
                Response promise
              </div>

              <p className="mt-2 text-xl font-display font-bold">
                Every enquiry gets a human reply within 24 hours.
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
        {label}{" "}
        <span className="text-primary">*</span>
      </span>

      <div className="mt-1.5">
        {children}
      </div>

      {error && (
        <span className="mt-1 block text-xs text-destructive">
          {error}
        </span>
      )}
    </label>
  );
}