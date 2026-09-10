import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  change: string;
  trend: "up" | "down";
  icon: LucideIcon;
}

export function StatCard({ title, value, change, trend, icon: Icon }: StatCardProps) {
  return (
    <div className="admin-stat-card bg-[#0A0F1C] group">
      <div className="flex justify-between items-start mb-4">
        <div className="stat-icon group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-6 h-6 text-[#ff5a1f]" />
        </div>
        <div className={`px-2.5 py-1 rounded-full text-xs font-bold ${
          trend === 'up' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
        }`}>
          {change}
        </div>
      </div>
      <div>
        <h3 className="stat-value">{value}</h3>
        <p className="stat-label mt-1">{title}</p>
      </div>
    </div>
  );
}
