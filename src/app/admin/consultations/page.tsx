import { Plus, Search, Filter, Download } from "lucide-react";
import { ConsultationTable } from "@/components/admin/ConsultationTable";
import { consultationRequests } from "@/lib/admin-data";

export default function ConsultationsManagementPage() {
  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">Consultation Requests</h2>
          <p className="text-sm text-muted-foreground mt-1">Review and manage upcoming client meetings.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="admin-btn-secondary h-10 px-4 whitespace-nowrap">
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>
          <button className="admin-btn-primary h-10 px-4 whitespace-nowrap">
            <Plus className="w-4 h-4 mr-1" />
            Schedule
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="admin-card flex flex-col sm:flex-row gap-4 justify-between items-center p-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by client name or company..."
            className="w-full bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-10 pr-4 py-2 text-sm outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-40">
            <select className="w-full appearance-none bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-3 pr-8 py-2 text-sm outline-none transition-all cursor-pointer text-foreground">
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative w-full sm:w-48">
            <select className="w-full appearance-none bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-3 pr-8 py-2 text-sm outline-none transition-all cursor-pointer text-foreground">
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="this-week">This Week</option>
              <option value="next-week">Next Week</option>
              <option value="past">Past Consultations</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Consultations Table */}
      <div className="admin-animate-in" style={{ animationDelay: "100ms" }}>
        <ConsultationTable consultations={consultationRequests} hideViewAll={true} />
      </div>
      
    </div>
  );
}
