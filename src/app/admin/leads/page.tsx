import { Plus, Search, Filter, Download } from "lucide-react";
import { RecentLeadsTable } from "@/components/admin/RecentLeadsTable";
import { recentLeads } from "@/lib/admin-data";

export default function LeadsManagementPage() {
  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">Lead Management</h2>
          <p className="text-sm text-muted-foreground mt-1">View, track, and manage all your consulting leads.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="admin-btn-secondary h-10 px-4 whitespace-nowrap">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button className="admin-btn-primary h-10 px-4 whitespace-nowrap">
            <Plus className="w-4 h-4 mr-1" />
            Add New Lead
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="admin-card flex flex-col sm:flex-row gap-4 justify-between items-center p-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search leads by name, email, or company..."
            className="w-full bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-10 pr-4 py-2 text-sm outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-40">
            <select className="w-full appearance-none bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-3 pr-8 py-2 text-sm outline-none transition-all cursor-pointer text-foreground">
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative w-full sm:w-48">
            <select className="w-full appearance-none bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-3 pr-8 py-2 text-sm outline-none transition-all cursor-pointer text-foreground">
              <option value="">All Services</option>
              <option value="business-consulting">Business Consulting</option>
              <option value="digital-transformation">Digital Transformation</option>
              <option value="business-strategy">Business Strategy</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <div className="admin-animate-in" style={{ animationDelay: "100ms" }}>
        <RecentLeadsTable leads={recentLeads} hideViewAll={true} />
      </div>
      
    </div>
  );
}
