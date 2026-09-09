"use client";

import Link from "next/link";
import { HiSearch } from "react-icons/hi";
import { useMemo, useState } from "react";

import {
  Section,
  Reveal,
} from "@/components/site/primitives";

import { useApp } from "@/context/AppContext";

export default function BlogPage() {
  const { blogs } = useApp();

  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");

  const cats = useMemo(
    () => [
      "All",
      ...Array.from(
        new Set(
          blogs.map(
            (blog) => blog.category,
          ),
        ),
      ),
    ],
    [blogs],
  );

  const filtered = useMemo(() => {
    const search = q.toLowerCase();

    return blogs.filter(
      (blog) =>
        (cat === "All" ||
          blog.category === cat) &&
        (blog.title
          .toLowerCase()
          .includes(search) ||
          blog.excerpt
            .toLowerCase()
            .includes(search)),
    );
  }, [blogs, q, cat]);

  return (
    <>
      {/* Hero */}
      <section className="pt-36 pb-14 gradient-navy text-navy-foreground">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest mb-4">
            Journal
          </div>

          <h1 className="text-4xl sm:text-6xl font-display font-black leading-tight">
            Insights for{" "}
            <span className="text-gradient">
              Indian founders.
            </span>
          </h1>

          <p className="mt-4 text-lg text-navy-foreground/80">
            Practical playbooks on incorporation,
            funding, certifications and growth.
          </p>
        </div>
      </section>

      {/* Blog listing */}
      <Section>
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mb-10">
          {/* Search */}
          <div className="relative w-full sm:max-w-sm">
            <HiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />

            <input
              value={q}
              onChange={(e) =>
                setQ(e.target.value)
              }
              placeholder="Search articles…"
              className="input pl-10"
            />
          </div>

          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {cats.map((category) => (
              <button
                type="button"
                key={category}
                onClick={() =>
                  setCat(category)
                }
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  cat === category
                    ? "gradient-primary text-primary-foreground shadow-elegant"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(
            (blog, index) => (
              <Reveal
                key={blog.id}
                delay={index * 0.04}
              >
                <Link
                  href={`/blog/${blog.slug}`}
                  className="group h-full flex flex-col rounded-3xl overflow-hidden border border-border bg-background hover-lift"
                >
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-[11px] font-bold uppercase tracking-widest text-primary">
                      {blog.category}
                    </div>

                    <h3 className="mt-2 text-lg font-bold group-hover:text-primary leading-snug">
                      {blog.title}
                    </h3>

                    <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                      {blog.excerpt}
                    </p>

                    <div className="mt-4 pt-4 border-t border-border text-xs text-muted-foreground flex items-center justify-between gap-3">
                      <span>
                        {blog.author}
                      </span>

                      <span>
                        {new Date(
                          blog.date,
                        ).toLocaleDateString(
                          "en-IN",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </span>
                    </div>
                  </div>
                </Link>
              </Reveal>
            ),
          )}
        </div>

        {filtered.length === 0 && (
          <div className="text-center text-muted-foreground py-20">
            No articles match your search.
          </div>
        )}
      </Section>
    </>
  );
}