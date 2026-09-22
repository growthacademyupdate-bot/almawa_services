"use client";

import {
  Plus,
  Search,
  Filter,
  Download,
  X,
  Save,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  ConsultationTable,
} from "@/components/admin/ConsultationTable";
import { useApp } from "@/context/AppContext";

type Consultation = {
  id: string | number;
  client: string;
  company: string;
  service: string;
  date: string;
  status: string;
  email?: string;
  phone?: string;
  message?: string;
};

type ConsultationForm = {
  client: string;
  company: string;
  service: string;
  date: string;
  status: string;
  email: string;
  phone: string;
  message: string;
};

const EMPTY_FORM: ConsultationForm = {
  client: "",
  company: "",
  service: "",
  date: "",
  status: "pending",
  email: "",
  phone: "",
  message: "",
};

export default function ConsultationsManagementPage() {
  const { addConsultation } = useApp();

  const [consultations, setConsultations] =
    useState<Consultation[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("");
  const [dateFilter, setDateFilter] =
    useState("");

  const [showSchedule, setShowSchedule] =
    useState(false);

  const [editingConsultation, setEditingConsultation] =
    useState<Consultation | null>(null);

  const [deleteTarget, setDeleteTarget] =
    useState<Consultation | null>(null);

  const [form, setForm] =
    useState<ConsultationForm>(EMPTY_FORM);

  const [formError, setFormError] =
    useState("");

  useEffect(() => {
    let cancelled = false;

    const loadConsultations = async () => {
      try {
        const response = await fetch("/api/consultations", {
          cache: "no-store",
        });
        const data = await response.json();

        if (!cancelled && response.ok && Array.isArray(data)) {
          setConsultations(data);
        }
      } catch (error) {
        console.error("Failed to load consultations:", error);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadConsultations();

    return () => {
      cancelled = true;
    };
  }, []);

  /* -------------------------------------------------------
     SEARCH + FILTER
  ------------------------------------------------------- */

  const filteredConsultations = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    const now = new Date();

    const startOfToday = new Date(now);
    startOfToday.setHours(
      0,
      0,
      0,
      0,
    );

    const endOfToday = new Date(now);
    endOfToday.setHours(
      23,
      59,
      59,
      999,
    );

    const startOfWeek = new Date(
      startOfToday,
    );

    const day =
      startOfWeek.getDay();

    const mondayOffset =
      day === 0 ? -6 : 1 - day;

    startOfWeek.setDate(
      startOfWeek.getDate() +
        mondayOffset,
    );

    const endOfWeek = new Date(
      startOfWeek,
    );

    endOfWeek.setDate(
      endOfWeek.getDate() + 6,
    );

    endOfWeek.setHours(
      23,
      59,
      59,
      999,
    );

    const startOfNextWeek =
      new Date(endOfWeek);

    startOfNextWeek.setDate(
      startOfNextWeek.getDate() + 1,
    );

    startOfNextWeek.setHours(
      0,
      0,
      0,
      0,
    );

    const endOfNextWeek =
      new Date(startOfNextWeek);

    endOfNextWeek.setDate(
      endOfNextWeek.getDate() + 6,
    );

    endOfNextWeek.setHours(
      23,
      59,
      59,
      999,
    );

    return consultations.filter(
      (consultation) => {
        const matchesSearch =
          !query ||
          consultation.client
            .toLowerCase()
            .includes(query) ||
          consultation.company
            .toLowerCase()
            .includes(query) ||
          consultation.service
            .toLowerCase()
            .includes(query) ||
          (consultation.email ?? "")
            .toLowerCase()
            .includes(query);

        const matchesStatus =
          !statusFilter ||
          consultation.status
            .toLowerCase() ===
            statusFilter.toLowerCase();

        const consultationDate =
          new Date(
            consultation.date,
          );

        let matchesDate = true;

        if (
          dateFilter &&
          !Number.isNaN(
            consultationDate.getTime(),
          )
        ) {
          if (
            dateFilter === "today"
          ) {
            matchesDate =
              consultationDate >=
                startOfToday &&
              consultationDate <=
                endOfToday;
          }

          if (
            dateFilter ===
            "this-week"
          ) {
            matchesDate =
              consultationDate >=
                startOfWeek &&
              consultationDate <=
                endOfWeek;
          }

          if (
            dateFilter ===
            "next-week"
          ) {
            matchesDate =
              consultationDate >=
                startOfNextWeek &&
              consultationDate <=
                endOfNextWeek;
          }

          if (
            dateFilter === "past"
          ) {
            matchesDate =
              consultationDate <
              startOfToday;
          }
        }

        if (
          dateFilter &&
          Number.isNaN(
            consultationDate.getTime(),
          )
        ) {
          matchesDate = false;
        }

        return (
          matchesSearch &&
          matchesStatus &&
          matchesDate
        );
      },
    );
  }, [
    consultations,
    search,
    statusFilter,
    dateFilter,
  ]);

  /* -------------------------------------------------------
     FORM
  ------------------------------------------------------- */

  const updateForm = (
    field: keyof ConsultationForm,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setFormError("");
  };

  const resetForm = () => {
    setForm({
      ...EMPTY_FORM,
    });

    setFormError("");
  };

  /* -------------------------------------------------------
     ADD / SCHEDULE
  ------------------------------------------------------- */

  const openSchedule = () => {
    resetForm();
    setEditingConsultation(null);
    setShowSchedule(true);
  };

  const saveNewConsultation = () => {
    if (
      !form.client.trim() ||
      !form.company.trim() ||
      !form.service.trim() ||
      !form.date
    ) {
      setFormError(
        "Please fill in Client, Company, Service, and Date.",
      );
      return;
    }

    const newConsultation: Consultation = {
      id: crypto.randomUUID(),
      client: form.client.trim(),
      company: form.company.trim(),
      service: form.service.trim(),
      date: form.date,
      status: form.status,
      email: form.email.trim(),
      phone: form.phone.trim(),
      message: form.message.trim(),
    };

    addConsultation({
      client: newConsultation.client,
      company: newConsultation.company,
      service: newConsultation.service,
      date: newConsultation.date,
      status: newConsultation.status as
        | "pending"
        | "confirmed"
        | "completed"
        | "cancelled",
      email: newConsultation.email,
      phone: newConsultation.phone,
      message: newConsultation.message,
    });

    setConsultations((current) => [
      newConsultation,
      ...current,
    ]);

    setShowSchedule(false);
    resetForm();
  };

  /* -------------------------------------------------------
     EDIT
  ------------------------------------------------------- */

  const openEdit = (
    consultation: Consultation,
  ) => {
    setEditingConsultation(
      consultation,
    );

    setForm({
      client: consultation.client,
      company: consultation.company,
      service: consultation.service,
      date: consultation.date
        ? consultation.date.slice(
            0,
            10,
          )
        : "",
      status: consultation.status,
      email:
        consultation.email ?? "",
      phone:
        consultation.phone ?? "",
      message:
        consultation.message ?? "",
    });

    setFormError("");
  };

  const saveEdit = () => {
    if (
      !editingConsultation
    ) {
      return;
    }

    if (
      !form.client.trim() ||
      !form.company.trim() ||
      !form.service.trim() ||
      !form.date
    ) {
      setFormError(
        "Please fill in Client, Company, Service, and Date.",
      );
      return;
    }

    setConsultations(
      (current) =>
        current.map(
          (consultation) =>
            String(
              consultation.id,
            ) ===
            String(
              editingConsultation.id,
            )
              ? {
                  ...consultation,
                  client:
                    form.client.trim(),
                  company:
                    form.company.trim(),
                  service:
                    form.service.trim(),
                  date: form.date,
                  status:
                    form.status,
                  email:
                    form.email.trim(),
                  phone:
                    form.phone.trim(),
                  message:
                    form.message.trim(),
                }
              : consultation,
        ),
    );

    setEditingConsultation(null);
    resetForm();
  };

  /* -------------------------------------------------------
     DELETE
  ------------------------------------------------------- */

  const confirmDelete = () => {
    if (!deleteTarget) {
      return;
    }

    setConsultations(
      (current) =>
        current.filter(
          (consultation) =>
            String(
              consultation.id,
            ) !==
            String(
              deleteTarget.id,
            ),
        ),
    );

    setDeleteTarget(null);
  };

  /* -------------------------------------------------------
     EXPORT CSV
  ------------------------------------------------------- */

  const exportCSV = () => {
    const headers = [
      "Client",
      "Company",
      "Service",
      "Preferred Date",
      "Status",
      "Email",
      "Phone",
      "Message",
    ];

    const rows =
      filteredConsultations.map(
        (consultation) => [
          consultation.client,
          consultation.company,
          consultation.service,
          consultation.date,
          consultation.status,
          consultation.email ?? "",
          consultation.phone ?? "",
          consultation.message ?? "",
        ],
      );

    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(
                value,
              ).replaceAll(
                '"',
                '""',
              )}"`,
          )
          .join(","),
      )
      .join("\n");

    const blob = new Blob(
      [csv],
      {
        type: "text/csv;charset=utf-8;",
      },
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement(
        "a",
      );

    link.href = url;
    link.download =
      "almawa-consultations.csv";

    document.body.appendChild(
      link,
    );

    link.click();

    document.body.removeChild(
      link,
    );

    URL.revokeObjectURL(url);
  };

  /* -------------------------------------------------------
     CLOSE MODALS
  ------------------------------------------------------- */

  const closeSchedule = () => {
    setShowSchedule(false);
    resetForm();
  };

  const closeEdit = () => {
    setEditingConsultation(null);
    resetForm();
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">
            Consultation Requests
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            Review and manage upcoming client meetings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Export */}
          <button
            type="button"
            onClick={exportCSV}
            className="admin-btn-secondary h-10 px-4 whitespace-nowrap"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>

          {/* Schedule */}
          <button
            type="button"
            onClick={openSchedule}
            className="admin-btn-primary h-10 px-4 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-1" />
            Schedule
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="admin-card flex flex-col sm:flex-row gap-4 justify-between items-center p-4">

        {/* Search */}
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value,
              )
            }
            placeholder="Search by client name or company..."
            className="w-full bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-10 pr-10 py-2 text-sm outline-none transition-all"
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 w-full sm:w-auto">

          {/* Status */}
          <div className="relative w-full sm:w-40">
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value,
                )
              }
              className="w-full appearance-none bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-3 pr-8 py-2 text-sm outline-none transition-all cursor-pointer text-foreground"
            >
              <option value="">
                All Statuses
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="confirmed">
                Confirmed
              </option>

              <option value="completed">
                Completed
              </option>

              <option value="cancelled">
                Cancelled
              </option>
            </select>

            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>

          {/* Dates */}
          <div className="relative w-full sm:w-48">
            <select
              value={dateFilter}
              onChange={(e) =>
                setDateFilter(
                  e.target.value,
                )
              }
              className="w-full appearance-none bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-3 pr-8 py-2 text-sm outline-none transition-all cursor-pointer text-foreground"
            >
              <option value="">
                All Dates
              </option>

              <option value="today">
                Today
              </option>

              <option value="this-week">
                This Week
              </option>

              <option value="next-week">
                Next Week
              </option>

              <option value="past">
                Past Consultations
              </option>
            </select>

            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Result Count */}
      <div className="text-sm text-muted-foreground">
        {loading ? "Loading consultations..." : "Showing "}
        {!loading && (
          <>
        <span className="font-semibold text-foreground">
          {filteredConsultations.length}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-foreground">
          {consultations.length}
        </span>{" "}
        consultations
          </>
        )}
      </div>

      {/* Consultations Table */}
      <div
        className="admin-animate-in"
        style={{
          animationDelay: "100ms",
        }}
      >
        <ConsultationTable
          consultations={
            filteredConsultations
          }
          hideViewAll={true}
          onEdit={openEdit}
          onDelete={setDeleteTarget}
        />
      </div>

      {/* --------------------------------------------------
          SCHEDULE MODAL
      -------------------------------------------------- */}
      {showSchedule && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
        >
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-background shadow-2xl border border-border">

            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="text-lg font-bold font-display">
                  Schedule Consultation
                </h3>

                <p className="text-xs text-muted-foreground mt-1">
                  Enter the client meeting details below.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeSchedule
                }
                className="p-2 rounded-lg hover:bg-secondary transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">

              {/* Client */}
              <div>
                <label className="admin-label">
                  Client Name
                </label>

                <input
                  value={form.client}
                  onChange={(e) =>
                    updateForm(
                      "client",
                      e.target.value,
                    )
                  }
                  className="admin-input mt-1.5"
                  placeholder="Client name"
                />
              </div>

              {/* Company */}
              <div>
                <label className="admin-label">
                  Company
                </label>

                <input
                  value={
                    form.company
                  }
                  onChange={(e) =>
                    updateForm(
                      "company",
                      e.target.value,
                    )
                  }
                  className="admin-input mt-1.5"
                  placeholder="Company name"
                />
              </div>

              {/* Service */}
              <div>
                <label className="admin-label">
                  Service
                </label>

                <input
                  value={
                    form.service
                  }
                  onChange={(e) =>
                    updateForm(
                      "service",
                      e.target.value,
                    )
                  }
                  className="admin-input mt-1.5"
                  placeholder="Service"
                />
              </div>

              {/* Date */}
              <div>
                <label className="admin-label">
                  Preferred Date
                </label>

                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    updateForm(
                      "date",
                      e.target.value,
                    )
                  }
                  className="admin-input mt-1.5"
                />
              </div>

              {/* Status */}
              <div>
                <label className="admin-label">
                  Status
                </label>

                <select
                  value={
                    form.status
                  }
                  onChange={(e) =>
                    updateForm(
                      "status",
                      e.target.value,
                    )
                  }
                  className="admin-input mt-1.5"
                >
                  <option value="pending">
                    Pending
                  </option>

                  <option value="confirmed">
                    Confirmed
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

              {/* Email */}
              <div>
                <label className="admin-label">
                  Email
                </label>

                <input
                  type="email"
                  value={
                    form.email
                  }
                  onChange={(e) =>
                    updateForm(
                      "email",
                      e.target.value,
                    )
                  }
                  className="admin-input mt-1.5"
                  placeholder="Email"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="admin-label">
                  Phone
                </label>

                <input
                  value={
                    form.phone
                  }
                  onChange={(e) =>
                    updateForm(
                      "phone",
                      e.target.value,
                    )
                  }
                  className="admin-input mt-1.5"
                  placeholder="Phone"
                />
              </div>

              {/* Message */}
              <div>
                <label className="admin-label">
                  Message
                </label>

                <textarea
                  value={
                    form.message
                  }
                  onChange={(e) =>
                    updateForm(
                      "message",
                      e.target.value,
                    )
                  }
                  className="admin-input mt-1.5 min-h-24 resize-none"
                  placeholder="Message"
                />
              </div>

              {formError && (
                <p className="text-sm text-red-500">
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={
                    closeSchedule
                  }
                  className="admin-btn-secondary"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    saveNewConsultation
                  }
                  className="admin-btn-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Schedule
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------
          EDIT MODAL
      -------------------------------------------------- */}
      {editingConsultation && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
        >
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-background shadow-2xl border border-border">

            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="text-lg font-bold font-display">
                  Edit Consultation
                </h3>

                <p className="text-xs text-muted-foreground mt-1">
                  Update consultation details.
                </p>
              </div>

              <button
                type="button"
                onClick={closeEdit}
                className="p-2 rounded-lg hover:bg-secondary transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">

              <div>
                <label className="admin-label">
                  Client Name
                </label>

                <input
                  value={form.client}
                  onChange={(e) =>
                    updateForm(
                      "client",
                      e.target.value,
                    )
                  }
                  className="admin-input mt-1.5"
                />
              </div>

              <div>
                <label className="admin-label">
                  Company
                </label>

                <input
                  value={
                    form.company
                  }
                  onChange={(e) =>
                    updateForm(
                      "company",
                      e.target.value,
                    )
                  }
                  className="admin-input mt-1.5"
                />
              </div>

              <div>
                <label className="admin-label">
                  Service
                </label>

                <input
                  value={
                    form.service
                  }
                  onChange={(e) =>
                    updateForm(
                      "service",
                      e.target.value,
                    )
                  }
                  className="admin-input mt-1.5"
                />
              </div>

              <div>
                <label className="admin-label">
                  Preferred Date
                </label>

                <input
                  type="date"
                  value={form.date}
                  onChange={(e) =>
                    updateForm(
                      "date",
                      e.target.value,
                    )
                  }
                  className="admin-input mt-1.5"
                />
              </div>

              <div>
                <label className="admin-label">
                  Status
                </label>

                <select
                  value={
                    form.status
                  }
                  onChange={(e) =>
                    updateForm(
                      "status",
                      e.target.value,
                    )
                  }
                  className="admin-input mt-1.5"
                >
                  <option value="pending">
                    Pending
                  </option>

                  <option value="confirmed">
                    Confirmed
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>
                </select>
              </div>

              <div>
                <label className="admin-label">
                  Email
                </label>

                <input
                  type="email"
                  value={
                    form.email
                  }
                  onChange={(e) =>
                    updateForm(
                      "email",
                      e.target.value,
                    )
                  }
                  className="admin-input mt-1.5"
                />
              </div>

              <div>
                <label className="admin-label">
                  Phone
                </label>

                <input
                  value={
                    form.phone
                  }
                  onChange={(e) =>
                    updateForm(
                      "phone",
                      e.target.value,
                    )
                  }
                  className="admin-input mt-1.5"
                />
              </div>

              <div>
                <label className="admin-label">
                  Message
                </label>

                <textarea
                  value={
                    form.message
                  }
                  onChange={(e) =>
                    updateForm(
                      "message",
                      e.target.value,
                    )
                  }
                  className="admin-input mt-1.5 min-h-24 resize-none"
                />
              </div>

              {formError && (
                <p className="text-sm text-red-500">
                  {formError}
                </p>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="admin-btn-secondary"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={saveEdit}
                  className="admin-btn-primary"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --------------------------------------------------
          DELETE CONFIRMATION
      -------------------------------------------------- */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4"
        >
          <div className="w-full max-w-md rounded-2xl bg-background shadow-2xl border border-border">

            <div className="px-6 py-5 border-b border-border">
              <h3 className="text-lg font-bold font-display">
                Delete Consultation?
              </h3>

              <p className="text-sm text-muted-foreground mt-1">
                This action cannot be undone.
              </p>
            </div>

            <div className="p-6">
              <div className="rounded-xl border border-border bg-secondary/40 p-4">
                <p className="font-semibold">
                  {
                    deleteTarget.client
                  }
                </p>

                <p className="text-sm text-muted-foreground mt-1">
                  {
                    deleteTarget.company
                  }
                </p>

                <p className="text-sm text-muted-foreground mt-1">
                  {
                    deleteTarget.service
                  }
                </p>
              </div>

              <div className="flex justify-end gap-3 mt-5">
                <button
                  type="button"
                  onClick={() =>
                    setDeleteTarget(
                      null,
                    )
                  }
                  className="admin-btn-secondary"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    confirmDelete
                  }
                  className="rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-semibold hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}