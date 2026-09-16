import dbConnect from "@/lib/mongodb";
import Service from "@/models/Service";
import Link from "next/link";
import * as LucideIcons from "lucide-react";

export const metadata = {
  title: "Our Services | Almawa Services",
  description: "Explore our professional consulting, strategy, and technology services.",
};

async function getServices() {
  await dbConnect();
  // Fetch active services, sorted by displayOrder
  const services = await Service.find({ status: "Active" }).sort({ displayOrder: 1 }).lean();
  
  return services.map(s => ({
    ...s,
    _id: s._id.toString(),
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <div className="min-h-screen py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold font-display text-foreground mb-4">
          Our Services
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We offer a comprehensive suite of professional services designed to help your business grow, innovate, and succeed.
        </p>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-border">
          <p className="text-muted-foreground">Check back soon for our updated service offerings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service: any) => {
            const Icon = (LucideIcons as any)[service.icon || "Briefcase"] || LucideIcons.Briefcase;

            return (
              <Link 
                href={`/services/${service.slug}`} 
                key={service._id}
                className="group flex flex-col bg-background border border-border rounded-2xl overflow-hidden hover:border-[#ff5a1f] hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                {service.image ? (
                  <div className="aspect-video w-full overflow-hidden relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={service.image} 
                      alt={service.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                ) : (
                  <div className="h-48 w-full bg-secondary/50 flex items-center justify-center">
                    <Icon className="w-16 h-16 text-muted-foreground opacity-50" />
                  </div>
                )}
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-[#ff5a1f]/10 rounded-lg">
                      <Icon className="w-5 h-5 text-[#ff5a1f]" />
                    </div>
                    <span className="text-sm font-medium text-[#ff5a1f] uppercase tracking-wider">
                      {service.category}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold font-display mb-3 text-foreground group-hover:text-[#ff5a1f] transition-colors">
                    {service.name}
                  </h3>
                  
                  <p className="text-muted-foreground line-clamp-3 mb-6 flex-1">
                    {service.shortDescription}
                  </p>
                  
                  <div className="inline-flex items-center font-medium text-[#ff5a1f] group-hover:translate-x-2 transition-transform duration-300">
                    Learn more <LucideIcons.ArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}