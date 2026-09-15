"use client";

import { Plus, Search, Filter, Star, Edit, Trash2, CheckCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useApp } from "@/context/AppContext";

type Testimonial = {
  id: string | number;
  clientName: string;
  company: string;
  rating: number;
  status: string;
  text: string;
  date: string;
};

function formatTestimonialDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `${String(date.getUTCDate()).padStart(2, "0")}/${String(
    date.getUTCMonth() + 1,
  ).padStart(2, "0")}/${date.getUTCFullYear()}`;
}

export default function TestimonialsManagementPage() {
  const {
    testimonials: contextTestimonials,
    addTestimonial,
    setTestimonialStatus,
    updateTestimonial,
    deleteTestimonial,
  } = useApp();
  const testimonials: Testimonial[] = contextTestimonials.map(
    (testimonial) => ({
      id: testimonial.id,
      clientName: testimonial.name,
      company: testimonial.company,
      rating: testimonial.rating,
      status: testimonial.status,
      text: testimonial.comment,
      date: testimonial.date,
    }),
  );
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");
  const [showAddTestimonial, setShowAddTestimonial] =
    useState(false);
  const [editingTestimonial, setEditingTestimonial] =
    useState<Testimonial | null>(null);
  const [newTestimonial, setNewTestimonial] = useState({
    clientName: "",
    company: "",
    rating: "5",
    text: "",
  });

  const filteredTestimonials = useMemo(() => {
    const query = search.trim().toLowerCase();

    return testimonials.filter((testimonial) => {
      const matchesSearch =
        !query ||
        testimonial.clientName.toLowerCase().includes(query) ||
        testimonial.company.toLowerCase().includes(query) ||
        testimonial.text.toLowerCase().includes(query);

      const matchesStatus =
        !statusFilter || testimonial.status === statusFilter;

      const minimumRating =
        ratingFilter === "5"
          ? 5
          : ratingFilter === "4"
            ? 4
            : ratingFilter === "3"
              ? 3
              : 0;

      const matchesRating = testimonial.rating >= minimumRating;

      return matchesSearch && matchesStatus && matchesRating;
    });
  }, [ratingFilter, search, statusFilter, testimonials]);

  const handleAddTestimonial = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const clientName = newTestimonial.clientName.trim();
    const company = newTestimonial.company.trim();
    const text = newTestimonial.text.trim();

    if (!clientName || !company || !text) {
      return;
    }

    if (editingTestimonial) {
      updateTestimonial(String(editingTestimonial.id), {
        name: clientName,
        company,
        rating: Number(newTestimonial.rating),
        comment: text,
      });
    } else {
      addTestimonial({
        name: clientName,
        company,
        rating: Number(newTestimonial.rating),
        comment: text,
        image: "",
      });
    }

    setNewTestimonial({
      clientName: "",
      company: "",
      rating: "5",
      text: "",
    });
    setEditingTestimonial(null);
    setShowAddTestimonial(false);
  };

  const openAddTestimonial = () => {
    setEditingTestimonial(null);
    setNewTestimonial({
      clientName: "",
      company: "",
      rating: "5",
      text: "",
    });
    setShowAddTestimonial(true);
  };

  const openEditTestimonial = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setNewTestimonial({
      clientName: testimonial.clientName,
      company: testimonial.company,
      rating: String(testimonial.rating),
      text: testimonial.text,
    });
    setShowAddTestimonial(true);
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">Testimonials Management</h2>
          <p className="text-sm text-muted-foreground mt-1">Review, approve, and manage client feedback.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={openAddTestimonial}
            className="admin-btn-primary h-10 px-4 whitespace-nowrap"
          >
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
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by client or company..."
            className="w-full bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-10 pr-4 py-2 text-sm outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="w-full appearance-none bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-3 pr-8 py-2 text-sm outline-none transition-all cursor-pointer text-foreground"
            >
              <option value="">All Statuses</option>
              <option value="approved">Approved</option>
              <option value="pending">Pending</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
          <div className="relative w-full sm:w-40">
            <select
              value={ratingFilter}
              onChange={(event) => setRatingFilter(event.target.value)}
              className="w-full appearance-none bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-3 pr-8 py-2 text-sm outline-none transition-all cursor-pointer text-foreground"
            >
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
          {filteredTestimonials.map((testimonial) => (
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
                <span className="text-xs text-muted-foreground font-medium">{formatTestimonialDate(testimonial.date)}</span>
                
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {testimonial.status === "pending" && (
                    <button
                      type="button"
                      onClick={() =>
                        setTestimonialStatus(
                          String(testimonial.id),
                          "approved",
                        )
                      }
                      className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-md transition-colors"
                      title="Approve"
                    >
                      <CheckCircle className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openEditTestimonial(testimonial)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                    title="Edit"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (
                        window.confirm(
                          `Delete ${testimonial.clientName}'s testimonial?`,
                        )
                      ) {
                        deleteTestimonial(String(testimonial.id));
                      }
                    }}
                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTestimonials.length === 0 && (
          <p className="py-10 text-center text-sm text-muted-foreground">
            No testimonials found.
          </p>
        )}
      </div>

      {showAddTestimonial && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowAddTestimonial(false);
            }
          }}
        >
          <form
            onSubmit={handleAddTestimonial}
            className="w-full max-w-lg space-y-4 rounded-2xl border border-border bg-background p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold font-display">
                  {editingTestimonial
                    ? "Edit Testimonial"
                    : "Add Testimonial"}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {editingTestimonial
                    ? "Update the testimonial details."
                    : "New testimonials are added as pending."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingTestimonial(null);
                  setShowAddTestimonial(false);
                }}
                className="rounded-lg p-2 hover:bg-secondary"
                aria-label="Close"
              >
                x
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="admin-label">
                Client Name
                <input
                  required
                  value={newTestimonial.clientName}
                  onChange={(event) =>
                    setNewTestimonial((current) => ({
                      ...current,
                      clientName: event.target.value,
                    }))
                  }
                  className="admin-input mt-1.5"
                />
              </label>

              <label className="admin-label">
                Company
                <input
                  required
                  value={newTestimonial.company}
                  onChange={(event) =>
                    setNewTestimonial((current) => ({
                      ...current,
                      company: event.target.value,
                    }))
                  }
                  className="admin-input mt-1.5"
                />
              </label>
            </div>

            <label className="admin-label">
              Rating
              <select
                value={newTestimonial.rating}
                onChange={(event) =>
                  setNewTestimonial((current) => ({
                    ...current,
                    rating: event.target.value,
                  }))
                }
                className="admin-input mt-1.5"
              >
                {[5, 4, 3, 2, 1].map((rating) => (
                  <option key={rating} value={rating}>
                    {rating} Stars
                  </option>
                ))}
              </select>
            </label>

            <label className="admin-label">
              Feedback
              <textarea
                required
                rows={4}
                value={newTestimonial.text}
                onChange={(event) =>
                  setNewTestimonial((current) => ({
                    ...current,
                    text: event.target.value,
                  }))
                }
                className="admin-input mt-1.5 resize-none"
              />
            </label>

            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <button
                type="button"
                onClick={() => {
                  setEditingTestimonial(null);
                  setShowAddTestimonial(false);
                }}
                className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="admin-btn-primary px-4 py-2"
              >
                {editingTestimonial
                  ? "Save Changes"
                  : "Add Testimonial"}
              </button>
            </div>
          </form>
        </div>
      )}
      
    </div>
  );
}
