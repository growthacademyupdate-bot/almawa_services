import Link from "next/link";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";
import * as LucideIcons from "lucide-react";
import { CtaBand } from "@/components/site/primitives";
import ClientServiceDetailWrapper from "./ClientWrapper";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await dbConnect();
  const service = await Service.findOne({ slug }).lean();
  
  if (!service) return { title: "Service Not Found" };
  
  return {
    title: service.seoTitle || `${service.name} | Almawa Services`,
    description: service.seoDescription || service.shortDescription,
    keywords: service.seoKeywords || service.category,
  };
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await dbConnect();
  
  const service = await Service.findOne({ slug }).lean();

  if (!service) {
    notFound();
  }

  const serializedService = {
    ...service,
    _id: service._id.toString(),
    createdAt: service.createdAt.toISOString(),
    updatedAt: service.updatedAt.toISOString(),
  };

  const Icon = (LucideIcons as any)[service.icon || "Briefcase"] || LucideIcons.Briefcase;

  return (
    <>
      {/* HERO SECTION */}
      <section className="pt-36 pb-20 relative overflow-hidden gradient-navy text-navy-foreground">
        <div className={`absolute -right-40 -top-40 w-[500px] h-[500px] rounded-full opacity-30 blur-3xl bg-[#ff5a1f]`} />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest mb-4">
                {service.category}
              </div>

              <h1 className="text-4xl sm:text-6xl font-display font-black leading-tight">
                {service.name}
              </h1>

              <p className="mt-6 text-lg text-navy-foreground/80 max-w-2xl">
                {service.shortDescription}
              </p>

              <ClientServiceDetailWrapper serviceName={service.name} />
            </div>

            {service.image ? (
              <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={service.image} alt={service.name} className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="relative rounded-2xl overflow-hidden aspect-video border border-white/10 shadow-2xl bg-white/5 flex items-center justify-center">
                <Icon className="w-32 h-32 text-white/20" />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RICH CONTENT SECTION */}
      <section className="py-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div 
            className="prose prose-lg dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-a:text-[#ff5a1f] max-w-none"
            dangerouslySetInnerHTML={{ __html: service.content }}
          />
        </div>
      </section>

      {/* CTA BAND */}
      <ClientServiceDetailWrapper serviceName={service.name} isCtaBand={true} />
    </>
  );
}