import { Calendar, MessageSquare, Mail, User, Shield } from "lucide-react";

interface RecentActivityTimelineProps {
  activities: any[];
}

export function RecentActivityTimeline({ activities }: RecentActivityTimelineProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "consultation": return <Calendar className="w-4 h-4 text-blue-500" />;
      case "message": return <Mail className="w-4 h-4 text-emerald-500" />;
      case "testimonial": return <MessageSquare className="w-4 h-4 text-purple-500" />;
      case "lead": return <User className="w-4 h-4 text-amber-500" />;
      case "system": return <Shield className="w-4 h-4 text-slate-500" />;
      default: return <User className="w-4 h-4 text-primary" />;
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "consultation": return "bg-blue-500/10 border-blue-500/20";
      case "message": return "bg-emerald-500/10 border-emerald-500/20";
      case "testimonial": return "bg-purple-500/10 border-purple-500/20";
      case "lead": return "bg-amber-500/10 border-amber-500/20";
      case "system": return "bg-slate-500/10 border-slate-500/20";
      default: return "bg-primary/10 border-primary/20";
    }
  };

  return (
    <div className="admin-card h-full">
      <div className="admin-card-header mb-6">
        <div className="admin-card-title">
          <span className="title-dot" /> Recent Activity
        </div>
      </div>
      
      <div className="relative pl-6 border-l-2 border-border space-y-6">
        {activities.map((activity) => (
          <div key={activity.id} className="relative">
            <span className={`absolute -left-[35px] top-0.5 flex h-8 w-8 items-center justify-center rounded-full border ${getBgColor(activity.type)} bg-background`}>
              {getIcon(activity.type)}
            </span>
            <p className="text-sm font-medium text-foreground">{activity.title}</p>
            <span className="mt-1 block text-xs text-muted-foreground">{activity.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
