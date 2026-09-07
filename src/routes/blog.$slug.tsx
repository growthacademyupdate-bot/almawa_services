import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Section, CtaBand } from "@/components/site/primitives";
import { blogsSeed } from "@/mock/data";
import { useApp } from "@/context/AppContext";

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const blog = blogsSeed.find((b) => b.slug === params.slug);
    if (!blog) throw notFound();
    return { blog };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Article not found" }, { name: "robots", content: "noindex" }] };
    const b = loaderData.blog;
    return {
      meta: [
        { title: `${b.title} — Almawa Journal` },
        { name: "description", content: b.excerpt },
        { property: "og:title", content: b.title },
        { property: "og:description", content: b.excerpt },
        { property: "og:image", content: b.image },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: BlogDetail,
  notFoundComponent: NotFoundBlog,
  errorComponent: ErrBlog,
});

function NotFoundBlog() {
  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Article not found</h1>
        <Link to="/blog" className="mt-4 inline-block text-primary underline">Back to blog</Link>
      </div>
    </div>
  );
}
function ErrBlog() {
  return <div className="min-h-[70vh] grid place-items-center">Something went wrong</div>;
}

function BlogDetail() {
  const { blog } = Route.useLoaderData();
  const { blogs, openConsultation } = useApp();
  const recent = blogs.filter((b) => b.slug !== blog.slug).slice(0, 3);

  return (
    <>
      <article className="pt-32 pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="text-sm text-primary font-semibold">← Back to journal</Link>
          <div className="mt-6 text-[11px] font-bold uppercase tracking-widest text-primary">
            {blog.category}
          </div>
          <h1 className="mt-3 text-3xl sm:text-5xl font-display font-black leading-tight">
            {blog.title}
          </h1>
          <div className="mt-4 flex items-center gap-3 text-sm text-muted-foreground">
            <span>{blog.author}</span>·
            <span>{new Date(blog.date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
          <img
            src={blog.image}
            alt=""
            className="mt-8 w-full rounded-3xl aspect-[16/9] object-cover shadow-elegant"
          />
          <div className="mt-10 prose prose-lg max-w-none">
            {blog.content.split("\n\n").map((p: string, i: number) => (
              <p key={i} className="text-foreground/85 leading-relaxed mb-5">
                {p}
              </p>
            ))}
          </div>
        </div>
      </article>

      <Section className="bg-secondary/40">
        <h3 className="text-2xl font-display font-bold mb-8">Recent posts</h3>
        <div className="grid md:grid-cols-3 gap-6">
          {recent.map((b) => (
            <Link
              key={b.id}
              to="/blog/$slug"
              params={{ slug: b.slug }}
              className="group rounded-2xl overflow-hidden bg-background border border-border hover-lift block"
            >
              <img src={b.image} alt="" className="aspect-[16/10] w-full object-cover" />
              <div className="p-5">
                <div className="text-[11px] font-bold uppercase tracking-widest text-primary">
                  {b.category}
                </div>
                <div className="mt-2 font-bold group-hover:text-primary line-clamp-2">
                  {b.title}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      <CtaBand onCta={() => openConsultation()} />
    </>
  );
}
