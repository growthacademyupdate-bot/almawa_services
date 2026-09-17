"use client";

import Link from "next/link";
import {
  FaLinkedin,
  FaFacebook,
  FaInstagram,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import {
  HiMail,
  HiPhone,
  HiLocationMarker,
} from "react-icons/hi";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { services } from "@/mock/data";

const CONTACT_EMAIL = "business@al-mawa.international";
const PHONE_ONE = "+91 9561179693";
const PHONE_TWO = "+91 9561106693";

const PUNE_LOCATION =
  "AL-MAWA INTERNATIONAL PUNE Location";

const GOOGLE_MAPS_URL =
  "https://www.google.com/maps/place/Al-Mawa+International+(OPC)+PVT.+LTD./@18.5434425,73.9359362,17z/data=!3m1!4b1!4m6!3m5!1s0x6094c0903e247dfd:0xb0a873dfffda5192!8m2!3d18.5434425!4d73.9359362!16s%2Fg%2F11xngk5zft?entry=ttu&g_ep=EgoyMDI2MDkxNC4wIKXMDSoASAFQAw%3D%3D";

export function Footer() {
  const { settings, openAdminLogin } = useApp();

  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const socialLinks = [
    {
      icon: FaXTwitter,
      href: "https://x.com/al_mawa__",
      label: "X",
    },
    {
      icon: FaLinkedin,
      href: "https://www.linkedin.com/company/al-mawa-international-opc-private-limited/posts/?feedView=all",
      label: "LinkedIn",
    },
    {
      icon: FaFacebook,
      href: "https://www.facebook.com/almawainternational",
      label: "Facebook",
    },
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/al_mawainternational",
      label: "Instagram",
    },
  ];

  return (
    <footer className="gradient-navy text-navy-foreground mt-20">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Company */}
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <div className="grid h-11 w-11 place-items-center rounded-xl gradient-primary shadow-elegant">
                <span className="text-lg font-black text-primary-foreground">
                  A
                </span>
              </div>

              <div>
                <div className="font-display text-lg font-extrabold">
                  {settings.companyName}
                </div>

                <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-glow">
                  Business Consulting
                </div>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-navy-foreground/70">
              Pan-India business consulting for startups, MSMEs and
              growing companies. Registration, certifications, fund
              raising and growth — under one roof.
            </p>

            {/* Social Links */}
            <div className="mt-5 flex gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;

                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="grid h-9 w-9 place-items-center rounded-full bg-white/10 transition hover:bg-primary"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-glow">
              Quick Links
            </div>

            <ul className="space-y-2.5 text-sm text-navy-foreground/80">
              {[
                ["/about", "About Us"],
                ["/services", "Services"],
                ["/industries", "Industries"],
                ["/testimonials", "Testimonials"],
                ["/blog", "Blog"],
                ["/faq", "FAQ"],
                ["/contact", "Contact"],
              ].map(([to, label]) => (
                <li key={to}>
                  <Link
                    href={to}
                    className="story-link transition hover:text-primary"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-glow">
              Services
            </div>

            <ul className="space-y-2.5 text-sm text-navy-foreground/80">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="story-link transition hover:text-primary"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get In Touch */}
          <div>
            <div className="mb-4 text-sm font-semibold uppercase tracking-wider text-primary-glow">
              Get In Touch
            </div>

            <ul className="space-y-3 text-sm text-navy-foreground/80">

              {/* Email */}
              <li className="flex items-start gap-2">
                <HiMail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="transition hover:text-primary"
                >
                  {CONTACT_EMAIL}
                </a>
              </li>

              {/* Phone Numbers */}
              <li className="flex items-start gap-2">
                <HiPhone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <a
                    href="tel:+919561179693"
                    className="transition hover:text-primary"
                  >
                    {PHONE_ONE}
                  </a>

                  <span className="text-navy-foreground/50">
                    |
                  </span>

                  <a
                    href="tel:+919561106693"
                    className="transition hover:text-primary"
                  >
                    {PHONE_TWO}
                  </a>
                </div>
              </li>

              {/* Pune Location */}
              <li className="flex items-start gap-2">
                <HiLocationMarker className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                <a
                  href={GOOGLE_MAPS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-primary"
                >
                  {PUNE_LOCATION}
                </a>
              </li>
            </ul>

            {/* Newsletter */}
            <form
              onSubmit={(event) => {
                event.preventDefault();
                setSubscribed(true);
                setEmail("");
              }}
              className="mt-5"
            >
              <label className="text-xs font-semibold uppercase tracking-wider text-navy-foreground/60">
                Newsletter
              </label>

              <div className="mt-2 flex overflow-hidden rounded-full border border-white/15 bg-white/10">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@company.com"
                  className="min-w-0 flex-1 bg-transparent px-4 py-2.5 text-sm placeholder:text-navy-foreground/40 focus:outline-none"
                />

                <button
                  type="submit"
                  className="gradient-primary px-4 text-xs font-semibold text-primary-foreground"
                >
                  Join
                </button>
              </div>

              {subscribed && (
                <p className="mt-2 text-xs text-primary-glow">
                  Subscribed — thank you.
                </p>
              )}
            </form>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-navy-foreground/60 md:flex-row">
          <div>
            © {new Date().getFullYear()}{" "}
            {settings.companyName}. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link
              href="/"
              className="hover:text-primary"
            >
              Privacy
            </Link>

            <Link
              href="/"
              className="hover:text-primary"
            >
              Terms
            </Link>

            <button
              type="button"
              onClick={openAdminLogin}
              className="hover:text-primary"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}