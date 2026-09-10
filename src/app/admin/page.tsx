import { Users, Calendar, Mail, Briefcase, Plus } from "lucide-react";
import { StatCard } from "@/components/admin/StatCard";
import { LeadsChart } from "@/components/admin/LeadsChart";
import { RecentLeadsTable } from "@/components/admin/RecentLeadsTable";
import { ConsultationTable } from "@/components/admin/ConsultationTable";
import { ServicesSummary } from "@/components/admin/ServicesSummary";
import { RecentActivityTimeline } from "@/components/admin/RecentActivityTimeline";

import { 
  dashboardStats, 
  leadsChartData, 
  recentLeads, 
  consultationRequests,
  servicesPerformance,
  recentActivities
} from "@/lib/admin-data";

export default function AdminDashboardPage() {
  const getIcon = (title: string) => {
    switch (title) {
      case "Total Leads": return Users;
      case "Consultations": return Calendar;
      case "Contact Messages": return Mail;
      case "Active Services": return Briefcase;
      default: return Users;
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">Dashboard Overview</h2>
          <p className="text-sm text-muted-foreground mt-1">Monitor your business website and client activity.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="admin-btn-secondary h-10 px-4 whitespace-nowrap">
            Generate Report
          </button>
          <button className="admin-btn-primary h-10 px-4 whitespace-nowrap">
            <Plus className="w-4 h-4 mr-1" />
            Add Lead
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {dashboardStats.map((stat, i) => (
          <div key={stat.title} className="admin-animate-in" style={{ animationDelay: `${i * 50}ms` }}>
            <StatCard
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend as "up" | "down"}
              icon={getIcon(stat.title)}
            />
          </div>
        ))}
      </div>

      {/* Leads Chart & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 admin-animate-in" style={{ animationDelay: "200ms" }}>
        <div className="lg:col-span-2">
          <LeadsChart data={leadsChartData} />
        </div>
        <div className="lg:col-span-1">
          <RecentActivityTimeline activities={recentActivities} />
        </div>
      </div>

      {/* Recent Leads */}
      <div className="admin-animate-in" style={{ animationDelay: "300ms" }}>
        <RecentLeadsTable leads={recentLeads} />
      </div>

      {/* Consultations & Services */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 admin-animate-in" style={{ animationDelay: "400ms" }}>
        <ConsultationTable consultations={consultationRequests} />
        <ServicesSummary services={servicesPerformance} />
      </div>
      
    </div>
  );
}
