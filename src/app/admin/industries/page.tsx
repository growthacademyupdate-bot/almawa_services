import { Plus, Search, Filter, Building } from "lucide-react";
import { industriesData } from "@/lib/admin-data";

export default function IndustriesManagementPage() {
  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">Industries Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Manage industry sectors and monitor client distribution.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="admin-btn-primary h-10 px-4 whitespace-nowrap">
            <Plus className="w-4 h-4 mr-1" />
            Add New Industry
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="admin-card flex flex-col sm:flex-row gap-4 justify-between items-center p-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search industries..."
            className="w-full bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-10 pr-4 py-2 text-sm outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-48">
            <select className="w-full appearance-none bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-3 pr-8 py-2 text-sm outline-none transition-all cursor-pointer text-foreground">
              <option value="">Sort By</option>
              <option value="name">Name (A-Z)</option>
              <option value="clients">Most Clients</option>
              <option value="projects">Most Projects</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Industries Grid */}
      <div className="admin-animate-in" style={{ animationDelay: "100ms" }}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {industriesData.map((industry) => (
            <div key={industry.id} className="admin-card flex flex-col hover:border-[#ff5a1f]/50 transition-colors cursor-pointer group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-[#ff5a1f]/10 transition-colors">
                  <Building className="w-5 h-5 text-muted-foreground group-hover:text-[#ff5a1f] transition-colors" />
                </div>
                <h3 className="font-semibold text-lg">{industry.name}</h3>
              </div>
              <div className="flex justify-between items-center mt-auto pt-4 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Clients</p>
                  <p className="font-bold text-lg">{industry.clients}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Active Projects</p>
                  <p className="font-bold text-lg">{industry.activeProjects}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
