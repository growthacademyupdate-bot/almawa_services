import Link from "next/link";
import * as LucideIcons from "lucide-react";

interface RelatedService {
  _id: string;
  name: string;
  slug: string;
  shortDescription: string;
  icon: string;
}

interface RelatedServicesProps {
  currentServiceId: string;
  relatedServices: RelatedService[];
}

export function RelatedServices({ currentServiceId, relatedServices }: RelatedServicesProps) {
  // Filter out the current service and take up to 3
  const filtered = relatedServices
    .filter((s) => s._id.toString() !== currentServiceId)
    .slice(0, 3);

  if (filtered.length === 0) return null;

  return (
    <section className="py-20 bg-secondary/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-display font-bold text-foreground">Explore Our Other Services</h2>
          <p className="mt-4 text-muted-foreground">Discover more ways we can help your business grow.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {filtered.map((service) => {
            const Icon = (LucideIcons as any)[service.icon || "Briefcase"] || LucideIcons.Briefcase;

            return (
              <div
                key={service._id}
                className="group bg-background border border-border rounded-2xl p-6 shadow-soft hover:shadow-elegant transition-all duration-300 flex flex-col"
              >
                <div className="h-12 w-12 rounded-xl gradient-primary flex items-center justify-center text-primary-foreground mb-6 shrink-0 group-hover:scale-110 transition-transform">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold font-display text-foreground mb-3">
                  {service.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-6 line-clamp-3 flex-grow">
                  {service.shortDescription}
                </p>
                <Link
                  href={`/services/${service.slug}`}
                  className="inline-flex items-center text-sm font-semibold text-primary hover:text-primary-glow transition-colors mt-auto"
                >
                  View Service
                  <LucideIcons.ArrowRight className="ml-1.5 h-4 w-4" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
