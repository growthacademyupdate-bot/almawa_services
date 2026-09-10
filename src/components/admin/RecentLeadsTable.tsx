import { Eye, MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RecentLeadsTableProps {
  leads: any[];
}

export function RecentLeadsTable({ leads }: RecentLeadsTableProps) {
  const getStatusVariant = (status: string) => {
    switch (status.toLowerCase()) {
      case "new": return "default";
      case "contacted": return "secondary";
      case "qualified": return "outline";
      case "converted": return "default"; // green would be better
      case "closed": return "destructive";
      default: return "secondary";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "new": return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "contacted": return "bg-amber-500/10 text-amber-600 border-amber-200";
      case "qualified": return "bg-purple-500/10 text-purple-600 border-purple-200";
      case "converted": return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
      case "closed": return "bg-slate-500/10 text-slate-600 border-slate-200";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="admin-card overflow-hidden !p-0">
      <div className="admin-card-header p-6 border-b border-border mb-0">
        <div className="admin-card-title">
          <span className="title-dot" /> Recent Leads
        </div>
        <button className="text-sm text-[#ff5a1f] font-semibold hover:underline">
          View All Leads
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold">Name</th>
              <th className="px-6 py-4 font-bold">Company</th>
              <th className="px-6 py-4 font-bold">Service</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold">Date</th>
              <th className="px-6 py-4 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((lead) => (
              <tr key={lead.id} className="hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-foreground">{lead.name}</div>
                  <div className="text-xs text-muted-foreground">{lead.email}</div>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{lead.company}</td>
                <td className="px-6 py-4 font-medium">{lead.service}</td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(lead.status)}`}>
                    {lead.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{new Date(lead.date).toLocaleDateString()}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
