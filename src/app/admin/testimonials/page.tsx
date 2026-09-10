import { Plus, Search, Filter, Star, Edit, Trash2, CheckCircle } from "lucide-react";
import { testimonialsData } from "@/lib/admin-data";

export default function TestimonialsManagementPage() {
  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">Testimonials Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Review, approve, and manage client feedback.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="admin-btn-primary h-10 px-4 whitespace-nowrap">
            <Plus className="w-4 h-4 mr-1" />
            Add Testimonial
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="admin-card flex flex-col sm:flex-row gap-4 justify-between items-center p-4">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by client or company..."
            className="w-full bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-10 pr-4 py-2 text-sm outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-48">
            <select className="w-full appearance-none bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-3 pr-8 py-2 text-sm outline-none transition-all cursor-pointer text-foreground">
              <option value="">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative w-full sm:w-40">
            <select className="w-full appearance-none bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-3 pr-8 py-2 text-sm outline-none transition-all cursor-pointer text-foreground">
              <option value="">Any Rating</option>
              <option value="5">5 Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Testimonials Grid */}
      <div className="admin-animate-in" style={{ animationDelay: "100ms" }}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {testimonialsData.map((testimonial) => (
            <div key={testimonial.id} className="admin-card flex flex-col relative group">
              
              {/* Status Badge */}
              <div className="absolute top-4 right-4 flex gap-2">
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                  testimonial.status === "approved" 
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-200" 
                    : "bg-amber-500/10 text-amber-600 border-amber-200"
                }`}>
                  {testimonial.status.charAt(0).toUpperCase() + testimonial.status.slice(1)}
                </span>
              </div>

              <div className="mb-4 pr-24">
                <h3 className="font-semibold text-lg">{testimonial.clientName}</h3>
                <p className="text-sm text-muted-foreground">{testimonial.company}</p>
              </div>

              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < testimonial.rating ? "fill-[#ff5a1f] text-[#ff5a1f]" : "fill-muted text-muted"}`} 
                  />
                ))}
              </div>

              <p className="text-sm italic text-foreground flex-1 mb-6 border-l-2 border-[#ff5a1f]/30 pl-3 py-1">
                "{testimonial.text}"
              </p>

              <div className="flex justify-between items-center mt-auto pt-4 border-t border-border/50">
                <span className="text-xs text-muted-foreground font-medium">{new Date(testimonial.date).toLocaleDateString()}</span>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {testimonial.status === "pending" && (
                    <button className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors" title="Approve">
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" title="Edit">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors" title="Delete">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
    </div>
  );
}
