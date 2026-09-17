"use client";

import {
  CheckCircle,
  Filter,
  Search,
  Star,
  Trash2,
  XCircle,
} from "lucide-react";
import { useMemo, useState } from "react";

import {
  useApp,
  type Testimonial,
} from "@/context/AppContext";

function formatTestimonialDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `${String(date.getUTCDate()).padStart(2, "0")}/${String(
    date.getUTCMonth() + 1,
  ).padStart(2, "0")}/${date.getUTCFullYear()}`;
}

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) =>
      part.charAt(0).toUpperCase(),
    )
    .join("");
}

function getStatusStyle(
  status: Testimonial["status"],
) {
  if (status === "approved") {
    return "bg-emerald-500/10 text-emerald-700 border-emerald-200";
  }

  if (status === "rejected") {
    return "bg-red-500/10 text-red-700 border-red-200";
  }

  return "bg-amber-500/10 text-amber-700 border-amber-200";
}

export default function TestimonialsManagementPage() {
  const {
    testimonials,
    setTestimonialStatus,
    deleteTestimonial,
  } = useApp();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState<
    "all" | "pending" | "approved" | "rejected"
  >("all");

  const [ratingFilter, setRatingFilter] =
    useState("");

  const filteredTestimonials = useMemo(() => {
    const query = search.trim().toLowerCase();

    return testimonials.filter((testimonial) => {
      const matchesSearch =
        !query ||
        testimonial.name
          .toLowerCase()
          .includes(query) ||
        testimonial.company
          .toLowerCase()
          .includes(query) ||
        testimonial.comment
          .toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        testimonial.status === statusFilter;

      const minimumRating =
        ratingFilter === "5"
          ? 5
          : ratingFilter === "4"
            ? 4
            : ratingFilter === "3"
              ? 3
              : 0;

      const matchesRating =
        testimonial.rating >= minimumRating;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRating
      );
    });
  }, [
    testimonials,
    search,
    statusFilter,
    ratingFilter,
  ]);

  const handleApprove = (id: string) => {
    setTestimonialStatus(id, "approved");
  };

  const handleReject = (id: string) => {
    setTestimonialStatus(id, "rejected");
  };

  const handleDelete = (
    testimonial: Testimonial,
  ) => {
    const confirmed = window.confirm(
      `Delete ${testimonial.name}'s testimonial?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    deleteTestimonial(testimonial.id);
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* =====================================================
          HEADER
      ====================================================== */}
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">
          Testimonials Management
        </h2>

        <p className="mt-1 text-sm text-muted-foreground">
          Review testimonials submitted through the website.
        </p>
      </div>

      {/* =====================================================
          SUMMARY CARDS
      ====================================================== */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {/* Total */}
        <div className="admin-card">
          <p className="text-sm text-muted-foreground">
            Total
          </p>

          <p className="mt-1 text-2xl font-bold text-foreground">
            {testimonials.length}
          </p>
        </div>

        {/* Pending */}
        <div className="admin-card">
          <p className="text-sm text-muted-foreground">
            Pending
          </p>

          <p className="mt-1 text-2xl font-bold text-amber-600">
            {
              testimonials.filter(
                (testimonial) =>
                  testimonial.status === "pending",
              ).length
            }
          </p>
        </div>

        {/* Approved */}
        <div className="admin-card">
          <p className="text-sm text-muted-foreground">
            Approved
          </p>

          <p className="mt-1 text-2xl font-bold text-emerald-600">
            {
              testimonials.filter(
                (testimonial) =>
                  testimonial.status === "approved",
              ).length
            }
          </p>
        </div>

        {/* Rejected */}
        <div className="admin-card">
          <p className="text-sm text-muted-foreground">
            Rejected
          </p>

          <p className="mt-1 text-2xl font-bold text-red-600">
            {
              testimonials.filter(
                (testimonial) =>
                  testimonial.status === "rejected",
              ).length
            }
          </p>
        </div>
      </div>

      {/* =====================================================
          SEARCH + FILTERS
      ====================================================== */}
      <div className="admin-card p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Search */}
          <div className="relative w-full lg:max-w-lg">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Search by client, company or feedback..."
              className="w-full rounded-lg border border-border bg-secondary/50 py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition-all focus:border-primary"
            />
          </div>

          {/* Filters */}
          <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
            {/* Status */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value as
                      | "all"
                      | "pending"
                      | "approved"
                      | "rejected",
                  )
                }
                className="w-full appearance-none rounded-lg border border-border bg-secondary/50 py-2.5 pl-3 pr-10 text-sm text-foreground outline-none transition-all focus:border-primary sm:w-44"
              >
                <option value="all">
                  All Statuses
                </option>

                <option value="pending">
                  Pending
                </option>

                <option value="approved">
                  Approved
                </option>

                <option value="rejected">
                  Rejected
                </option>
              </select>

              <Filter className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>

            {/* Rating */}
            <div className="relative">
              <select
                value={ratingFilter}
                onChange={(event) =>
                  setRatingFilter(
                    event.target.value,
                  )
                }
                className="w-full appearance-none rounded-lg border border-border bg-secondary/50 py-2.5 pl-3 pr-10 text-sm text-foreground outline-none transition-all focus:border-primary sm:w-40"
              >
                <option value="">
                  Any Rating
                </option>

                <option value="5">
                  5 Stars
                </option>

                <option value="4">
                  4+ Stars
                </option>

                <option value="3">
                  3+ Stars
                </option>
              </select>

              <Filter className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          TESTIMONIAL CARDS
      ====================================================== */}
      {filteredTestimonials.length === 0 ? (
        <div className="admin-card p-12 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-secondary">
            <Star className="h-7 w-7 text-muted-foreground" />
          </div>

          <h3 className="mt-4 text-lg font-bold text-foreground">
            No testimonials found
          </h3>

          <p className="mt-2 text-sm text-muted-foreground">
            Testimonials submitted by website visitors will
            appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredTestimonials.map(
            (testimonial) => {
              const initials = getInitials(
                testimonial.name,
              );

              return (
                <div
                  key={testimonial.id}
                  className="admin-card flex flex-col"
                >
                  {/* Client Details */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      {testimonial.image ? (
                        <img
                          src={testimonial.image}
                          alt={testimonial.name}
                          className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-border"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                          {initials || "A"}
                        </div>
                      )}

                      <div className="min-w-0">
                        <h3 className="truncate font-bold text-foreground">
                          {testimonial.name}
                        </h3>

                        <p className="truncate text-sm text-muted-foreground">
                          {testimonial.company}
                        </p>
                      </div>
                    </div>

                    {/* Status */}
                    <span
                      className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize ${getStatusStyle(
                        testimonial.status,
                      )}`}
                    >
                      {testimonial.status}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="mt-4 flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map(
                      (starNumber) => (
                        <Star
                          key={starNumber}
                          className={`h-4 w-4 ${
                            starNumber <=
                            testimonial.rating
                              ? "fill-primary text-primary"
                              : "text-muted-foreground/20"
                          }`}
                        />
                      ),
                    )}
                  </div>

                  {/* Comment */}
                  <div className="mt-4 flex-grow">
                    <p className="border-l-2 border-primary/30 pl-3 text-sm italic leading-relaxed text-muted-foreground">
                      "{testimonial.comment}"
                    </p>
                  </div>

                  {/* Date */}
                  <div className="mt-5 border-t border-border pt-4">
                    <p className="text-xs font-medium text-muted-foreground">
                      Submitted on{" "}
                      {formatTestimonialDate(
                        testimonial.date,
                      )}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {/* APPROVE */}
                    {testimonial.status !==
                      "approved" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleApprove(
                            testimonial.id,
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-500/20"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Approve
                      </button>
                    )}

                    {/* REJECT */}
                    {testimonial.status !==
                      "rejected" && (
                      <button
                        type="button"
                        onClick={() =>
                          handleReject(
                            testimonial.id,
                          )
                        }
                        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-500/20"
                      >
                        <XCircle className="h-4 w-4" />
                        Reject
                      </button>
                    )}

                    {/* DELETE */}
                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(
                          testimonial,
                        )
                      }
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-500/10 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              );
            },
          )}
        </div>
      )}
    </div>
  );
}