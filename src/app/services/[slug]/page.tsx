import Link from "next/link";
import { notFound } from "next/navigation";
import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";
import * as LucideIcons from "lucide-react";
import { ChevronRight, Home } from "lucide-react";
import { CtaBand } from "@/components/site/primitives";
import ClientServiceDetailWrapper from "./ClientWrapper";
import { ServiceFAQ } from "@/components/site/ServiceFAQ";
import { RelatedServices } from "@/components/site/RelatedServices";

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
  
  // Fetch related services for the bottom section
  const allServices = await Service.find({ status: "Active" })
    .select("_id name slug shortDescription icon")
    .limit(4)
    .lean();
  
  // Convert _id to string for the props
  const relatedServices = allServices.map((s: any) => ({
    ...s,
    _id: s._id.toString()
  }));

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
      {/* BREADCRUMB SECTION */}
      <div className="bg-background border-b border-border pt-24 pb-4">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
            <Link href="/" className="hover:text-foreground flex items-center transition-colors">
              <Home className="h-4 w-4 mr-1" />
              Home
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/services" className="hover:text-foreground transition-colors">
              Services
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{service.name}</span>
          </nav>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="pt-20 pb-20 relative overflow-hidden gradient-navy text-navy-foreground">
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
      <section className="py-20 bg-secondary/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-background border border-border rounded-3xl p-8 sm:p-12 shadow-elegant">
            <div 
              className="prose prose-lg dark:prose-invert prose-headings:font-display prose-headings:font-bold prose-a:text-[#ff5a1f] max-w-none"
              dangerouslySetInnerHTML={{ __html: service.content }}
            />
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      {service.faqs && service.faqs.length > 0 && (
        <ServiceFAQ faqs={service.faqs.map((faq: any) => ({ q: faq.q, a: faq.a }))} />
      )}

      {/* RELATED SERVICES */}
      <RelatedServices currentServiceId={service._id.toString()} relatedServices={relatedServices} />

      {/* CTA BAND */}
      <section className="py-20 gradient-navy text-navy-foreground text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-display font-black mb-6">Let's Discuss Your Business Requirements</h2>
          <p className="text-lg text-navy-foreground/80 mb-8">
            Tell us about your business goals and challenges. Our team can help you identify the right solution for your requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <ClientServiceDetailWrapper serviceName={service.name} />
            <Link href="/contact" className="inline-flex items-center justify-center rounded-full bg-white/10 text-white px-8 py-4 font-bold shadow-soft hover:bg-white/20 transition-all hover:scale-105">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}