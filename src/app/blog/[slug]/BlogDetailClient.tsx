"use client";

import Link from "next/link";

import {
  Section,
  CtaBand,
} from "@/components/site/primitives";

import { blogsSeed } from "@/mock/data";
import { useApp } from "@/context/AppContext";

type BlogItem = (typeof blogsSeed)[number];

export default function BlogDetailClient({
  blog,
}: {
  blog: BlogItem;
}) {
  const {
    blogs,
    openConsultation,
  } = useApp();

  const recent = blogs
    .filter(
      (item) => item.slug !== blog.slug,
    )
    .slice(0, 3);

  return (
    <>
      {/* Article */}
      <article className="pt-32 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="text-sm text-primary font-semibold"
          >
            ← Back to journal
          </Link>

          <div className="mt-6 text-[11px] font-bold uppercase tracking-widest text-primary">
            {blog.category}
          </div>

          <h1 className="mt-3 text-3xl sm:text-5xl font-display font-black leading-tight">
            {blog.title}
          </h1>

          <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
            <span>
              {blog.author}
            </span>

            <span>·</span>

            <span>
              {new Date(
                blog.date,
              ).toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                },
              )}
            </span>
          </div>

          <img
            src={blog.image}
            alt={blog.title}
            className="mt-8 w-full rounded-3xl aspect-[16/9] object-cover shadow-elegant"
          />

          <div className="mt-10 prose prose-lg max-w-none">
            {blog.content
              .split("\n\n")
              .map(
                (
                  paragraph,
                  index,
                ) => (
                  <p
                    key={index}
                    className="text-foreground/85 leading-relaxed mb-5"
                  >
                    {paragraph}
                  </p>
                ),
              )}
          </div>
        </div>
      </article>

      {/* Recent Posts */}
      <Section className="bg-secondary/40">
        <h3 className="text-2xl font-display font-bold mb-8">
          Recent posts
        </h3>

        {recent.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-6">
            {recent.map((item) => (
              <Link
                key={item.id}
                href={`/blog/${item.slug}`}
                className="group rounded-2xl overflow-hidden bg-background border border-border hover-lift block"
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="aspect-[16/10] w-full object-cover"
                />

                <div className="p-5">
                  <div className="text-[11px] font-bold uppercase tracking-widest text-primary">
                    {item.category}
                  </div>

                  <div className="mt-2 font-bold group-hover:text-primary line-clamp-2">
                    {item.title}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No recent posts available.
          </p>
        )}
      </Section>

      {/* CTA */}
      <CtaBand
        onCta={() =>
          openConsultation()
        }
      />
    </>
  );
}