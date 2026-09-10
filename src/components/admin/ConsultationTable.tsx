import { Calendar, MoreHorizontal } from "lucide-react";

interface ConsultationTableProps {
  consultations: any[];
  hideViewAll?: boolean;
}

export function ConsultationTable({ consultations, hideViewAll = false }: ConsultationTableProps) {
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-amber-500/10 text-amber-600 border-amber-200";
      case "confirmed": return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "completed": return "bg-emerald-500/10 text-emerald-600 border-emerald-200";
      case "cancelled": return "bg-red-500/10 text-red-600 border-red-200";
      default: return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  return (
    <div className="admin-card overflow-hidden !p-0 h-full">
      <div className="admin-card-header p-6 border-b border-border mb-0">
        <div className="admin-card-title">
          <span className="title-dot" /> Recent Consultations
        </div>
        {!hideViewAll && (
          <button className="text-sm text-[#ff5a1f] font-semibold hover:underline">
            View All
          </button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold">Client</th>
              <th className="px-6 py-4 font-bold">Service</th>
              <th className="px-6 py-4 font-bold">Preferred Date</th>
              <th className="px-6 py-4 font-bold">Status</th>
              <th className="px-6 py-4 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {consultations.map((consultation) => (
              <tr key={consultation.id} className="hover:bg-secondary/20 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-foreground">{consultation.client}</div>
                  <div className="text-xs text-muted-foreground">{consultation.company}</div>
                </td>
                <td className="px-6 py-4 font-medium text-muted-foreground">{consultation.service}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {new Date(consultation.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(consultation.status)}`}>
                    {consultation.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
