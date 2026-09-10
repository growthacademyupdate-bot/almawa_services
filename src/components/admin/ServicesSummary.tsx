import { ArrowRight, TrendingUp } from "lucide-react";

interface ServicesSummaryProps {
  services: any[];
  hideHeader?: boolean;
}

export function ServicesSummary({ services, hideHeader = false }: ServicesSummaryProps) {
  return (
    <div className="admin-card h-full flex flex-col">
      {!hideHeader && (
        <div className="admin-card-header mb-4">
          <div className="admin-card-title">
            <span className="title-dot" /> Services Performance
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 flex-1">
        {services.map((service) => (
          <div key={service.id} className="p-4 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/60 transition-colors group">
            <h4 className="font-semibold text-sm mb-3 group-hover:text-[#ff5a1f] transition-colors line-clamp-1" title={service.name}>
              {service.name}
            </h4>
            <div className="flex justify-between items-end">
              <div>
                <p className="text-2xl font-bold font-display">{service.enquiries}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Enquiries</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-500 flex items-center justify-end gap-1">
                  <TrendingUp className="w-3.5 h-3.5" />
                  {service.conversionRate}%
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Conv. Rate</p>
              </div>
            </div>
            
            <button className="mt-4 w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg bg-background border border-border hover:border-[#ff5a1f] hover:text-[#ff5a1f] transition-colors">
              View Details
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
