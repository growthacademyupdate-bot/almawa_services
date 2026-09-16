import Link from "next/link";
import { FaLinkedin, FaTwitter, FaFacebook, FaInstagram } from "react-icons/fa";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { services } from "@/mock/data";

export function Footer() {
  const { settings, openAdminLogin } = useApp();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  return (
    <footer className="gradient-navy text-navy-foreground mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-10 lg:grid-cols-4 md:grid-cols-2">
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl gradient-primary shadow-elegant">
                <span className="text-primary-foreground font-black text-lg">A</span>
              </div>
              <div>
                <div className="font-display font-extrabold text-lg">{settings.companyName}</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-primary-glow font-semibold">
                  Business Consulting
                </div>
              </div>
            </div>
            <p className="text-sm text-navy-foreground/70 leading-relaxed">
              Pan-India business consulting for startups, MSMEs and growing companies. Registration,
              certifications, fund raising and growth — under one roof.
            </p>
            <div className="mt-5 flex gap-2">
              {[
                { i: FaLinkedin, h: settings.social.linkedin },
                { i: FaTwitter, h: settings.social.twitter },
                { i: FaFacebook, h: settings.social.facebook },
                { i: FaInstagram, h: settings.social.instagram },
              ].map((s, i) => (
                <a
                  key={i}
                  href={s.h}
                  target="_blank"
                  rel="noreferrer"
                  className="h-9 w-9 grid place-items-center rounded-full bg-white/10 hover:bg-primary transition"
                >
                  <s.i className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <div className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-glow">
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
                  <Link href={to} className="hover:text-primary transition story-link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-glow">
              Services
            </div>
            <ul className="space-y-2.5 text-sm text-navy-foreground/80">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="hover:text-primary transition story-link"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="font-semibold mb-4 text-sm uppercase tracking-wider text-primary-glow">
              Get In Touch
            </div>
            <ul className="space-y-3 text-sm text-navy-foreground/80">
              <li className="flex items-start gap-2">
                <HiLocationMarker className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <HiPhone className="h-4 w-4 text-primary shrink-0" />
                <a href={`tel:${settings.phone}`} className="hover:text-primary">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <HiMail className="h-4 w-4 text-primary shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-primary">
                  {settings.email}
                </a>
              </li>
            </ul>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubscribed(true);
                setEmail("");
              }}
              className="mt-5"
            >
              <label className="text-xs uppercase tracking-wider text-navy-foreground/60 font-semibold">
                Newsletter
              </label>
              <div className="mt-2 flex rounded-full bg-white/10 border border-white/15 overflow-hidden">
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  className="flex-1 min-w-0 bg-transparent px-4 py-2.5 text-sm placeholder:text-navy-foreground/40 focus:outline-none"
                />
                <button className="gradient-primary px-4 text-xs font-semibold text-primary-foreground">
                  Join
                </button>
              </div>
              {subscribed && (
                <p className="mt-2 text-xs text-primary-glow">Subscribed — thank you.</p>
              )}
            </form>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-white/10 flex flex-col md:flex-row gap-4 items-center justify-between text-xs text-navy-foreground/60">
          <div>© {new Date().getFullYear()} {settings.companyName}. All rights reserved.</div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link href="/" className="hover:text-primary">Privacy</Link>
            <Link href="/" className="hover:text-primary">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
