import { notFound } from "next/navigation";
import { blogsSeed } from "@/mock/data";

import BlogDetailClient from "./BlogDetailClient";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function BlogDetailPage({
  params,
}: PageProps) {
  const { slug } = await params;

  const blog = blogsSeed.find(
    (item) => item.slug === slug,
  );

  if (!blog) {
    notFound();
  }

  return (
    <BlogDetailClient blog={blog} />
  );
}