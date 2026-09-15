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

  return (
    <BlogDetailClient slug={slug} />
  );
}