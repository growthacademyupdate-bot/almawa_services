import { createFileRoute, Link } from "@tanstack/react-router";
import { HiSearch } from "react-icons/hi";
import { useMemo, useState } from "react";
import { Section, Reveal } from "@/components/site/primitives";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Almawa Journal — Insights for Indian Founders" },
      {
        name: "description",
        content:
          "Insights on incorporation, fund raising, certifications and digital marketing for Indian startups and MSMEs.",
      },
      { property: "og:title", content: "Almawa Journal" },
      { property: "og:description", content: "Practical, no-fluff insights for Indian founders." },
    ],
  }),
  component: BlogList,
});

function BlogList() {
  const { blogs } = useApp();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("All");
  const cats = useMemo(() => ["All", ...Array.from(new Set(blogs.map((b) => b.category)))], [blogs]);
  const filtered = useMemo(() => {
    return blogs.filter(
      (b) =>
        (cat === "All" || b.category === cat) &&
        (b.title.toLowerCase().includes(q.toLowerCase()) ||
          b.excerpt.toLowerCase().includes(q.toLowerCase())),
    );
  }, [blogs, q, cat]);

  return (
    <>
      <section className="pt-36 pb-14 gradient-navy text-navy-foreground">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest mb-4">
            Journal
          </div>
          <h1 className="text-4xl sm:text-6xl font-display font-black leading-tight">
            Insights for <span className="text-gradient">Indian founders.</span>
          </h1>
          <p className="mt-4 text-lg text-navy-foreground/80">
            Practical playbooks on incorporation, funding, certifications and growth.
          </p>
        </div>
      </section>

      <Section>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-10">
          <div className="relative w-full sm:max-w-sm">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search articles…"
              className="input pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  cat === c
                    ? "gradient-primary text-primary-foreground shadow-elegant"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b, i) => (
            <Reveal key={b.id} delay={i * 0.04}>
              <Link
                to="/blog/$slug"
                params={{ slug: b.slug }}
                className="group h-full flex flex-col rounded-3xl overflow-hidden border border-border bg-background hover-lift"
              >
                <div className="aspect-[16/10] overflow-hidden">
                  <img
                    src={b.image}
                    alt=""
                    className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-primary">
                    {b.category}
                  </div>
                  <h3 className="mt-2 text-lg font-bold group-hover:text-primary leading-snug">
                    {b.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{b.excerpt}</p>
                  <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground flex items-center justify-between">
                    <span>{b.author}</span>
                    <span>{new Date(b.date).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center text-muted-foreground py-20">No articles match your search.</div>
        )}
      </Section>
    </>
  );
}
