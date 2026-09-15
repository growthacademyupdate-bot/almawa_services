"use client";

import { Plus, Search, Filter, Download, X, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { RecentLeadsTable } from "@/components/admin/RecentLeadsTable";
import { useApp } from "@/context/AppContext";

type Lead = {
  id: string | number;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  company?: string;
  service?: string;
  status?: string;
  stage?: string;
  date?: string;
  createdAt?: string;
  message?: string;
};

type NewLeadForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  status: string;
};

export default function LeadsManagementPage() {
  const { leads: contextLeads, addLead: addContextLead } = useApp();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [serviceFilter, setServiceFilter] = useState("");

  const leads = contextLeads as Lead[];

  const [showAddLead, setShowAddLead] = useState(false);

  useEffect(() => {
    const initialSearch = new URLSearchParams(
      window.location.search,
    ).get("search");

    if (initialSearch) {
      setSearch(initialSearch);
    }
  }, []);

  const [form, setForm] = useState<NewLeadForm>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    status: "new",
  });

  const filteredLeads = useMemo(() => {
    const query = search.trim().toLowerCase();

    return leads.filter((lead) => {
      const fullName =
        lead.name ||
        `${lead.firstName ?? ""} ${lead.lastName ?? ""}`.trim();

      const matchesSearch =
        !query ||
        fullName.toLowerCase().includes(query) ||
        (lead.email ?? "").toLowerCase().includes(query) ||
        (lead.company ?? "").toLowerCase().includes(query) ||
        (lead.service ?? "").toLowerCase().includes(query) ||
        (lead.status ?? "").toLowerCase().includes(query);

      const matchesStatus =
        !statusFilter || lead.status === statusFilter;

      const matchesService =
        !serviceFilter || lead.service === serviceFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesService
      );
    });
  }, [leads, search, statusFilter, serviceFilter]);

  const updateForm = (
    field: keyof NewLeadForm,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const addLead = () => {
    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();

    if (!firstName || !lastName || !email || !form.service) {
      return;
    }

    addContextLead({
      firstName,
      lastName,
      email,
      phone: form.phone.trim(),
      service: form.service,
      stage: "New",
      message: "",
    });

    setForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      service: "",
      status: "new",
    });

    setShowAddLead(false);
  };

  const exportCSV = () => {
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Company",
      "Service",
      "Status",
      "Date",
    ];

    const rows = filteredLeads.map((lead) => {
      const name =
        lead.name ||
        `${lead.firstName ?? ""} ${lead.lastName ?? ""}`.trim();

      return [
        name,
        lead.email ?? "",
        lead.phone ?? "",
        lead.company ?? "",
        lead.service ?? "",
        lead.status ?? "",
        lead.date ?? lead.createdAt ?? "",
      ];
    });

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map(
            (value) =>
              `"${String(value).replaceAll('"', '""')}"`,
          )
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "almawa-leads.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  const serviceOptions = Array.from(
    new Set(
      leads
        .map((lead) => lead.service)
        .filter(
          (service): service is string => Boolean(service),
        ),
    ),
  );

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">
            Lead Management
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            View, track, and manage all your consulting leads.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={exportCSV}
            className="admin-btn-secondary h-10 px-4 whitespace-nowrap"
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </button>

          <button
            type="button"
            onClick={() => setShowAddLead(true)}
            className="admin-btn-primary h-10 px-4 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add New Lead
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
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, email, or company..."
            className="w-full bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-10 pr-10 py-2 text-sm outline-none transition-all"
          />

          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
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
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-3 pr-8 py-2 text-sm outline-none transition-all cursor-pointer text-foreground"
            >
              <option value="">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="converted">Converted</option>
              <option value="closed">Closed</option>
            </select>

            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>

          {/* Services */}
          <div className="relative w-full sm:w-48">
            <select
              value={serviceFilter}
              onChange={(e) => setServiceFilter(e.target.value)}
              className="w-full appearance-none bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-3 pr-8 py-2 text-sm outline-none transition-all cursor-pointer text-foreground"
            >
              <option value="">All Services</option>

              {serviceOptions.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}

              {!serviceOptions.includes("Business Consulting") && (
                <option value="Business Consulting">
                  Business Consulting
                </option>
              )}

              {!serviceOptions.includes("Digital Transformation") && (
                <option value="Digital Transformation">
                  Digital Transformation
                </option>
              )}

              {!serviceOptions.includes("Business Strategy") && (
                <option value="Business Strategy">
                  Business Strategy
                </option>
              )}
            </select>

            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Result Count */}
      <div className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-foreground">
          {filteredLeads.length}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-foreground">
          {leads.length}
        </span>{" "}
        leads
      </div>

      {/* Leads Table */}
      <div
        className="admin-animate-in"
        style={{ animationDelay: "100ms" }}
      >
        <RecentLeadsTable
          leads={filteredLeads as any}
          hideViewAll={true}
        />
      </div>

      {/* Add New Lead Modal */}
      {showAddLead && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setShowAddLead(false);
            }
          }}
        >
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-background shadow-2xl border border-border">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="text-lg font-bold font-display">
                  Add New Lead
                </h3>

                <p className="text-xs text-muted-foreground mt-1">
                  Enter the lead details below.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAddLead(false)}
                className="p-2 rounded-lg hover:bg-secondary transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">
                    First Name
                  </label>

                  <input
                    value={form.firstName}
                    onChange={(e) =>
                      updateForm("firstName", e.target.value)
                    }
                    className="admin-input mt-1.5"
                    placeholder="First name"
                  />
                </div>

                <div>
                  <label className="admin-label">
                    Last Name
                  </label>

                  <input
                    value={form.lastName}
                    onChange={(e) =>
                      updateForm("lastName", e.target.value)
                    }
                    className="admin-input mt-1.5"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">
                    Email
                  </label>

                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      updateForm("email", e.target.value)
                    }
                    className="admin-input mt-1.5"
                    placeholder="Email"
                  />
                </div>

                <div>
                  <label className="admin-label">
                    Phone
                  </label>

                  <input
                    value={form.phone}
                    onChange={(e) =>
                      updateForm("phone", e.target.value)
                    }
                    className="admin-input mt-1.5"
                    placeholder="Phone"
                  />
                </div>
              </div>

              <div>
                <label className="admin-label">
                  Company
                </label>

                <input
                  value={form.company}
                  onChange={(e) =>
                    updateForm("company", e.target.value)
                  }
                  className="admin-input mt-1.5"
                  placeholder="Company"
                />
              </div>

              <div>
                <label className="admin-label">
                  Service
                </label>

                <select
                  value={form.service}
                  onChange={(e) =>
                    updateForm("service", e.target.value)
                  }
                  className="admin-input mt-1.5"
                >
                  <option value="">
                    Select Service
                  </option>

                  <option value="Business Consulting">
                    Business Consulting
                  </option>

                  <option value="Digital Transformation">
                    Digital Transformation
                  </option>

                  <option value="Business Strategy">
                    Business Strategy
                  </option>

                  <option value="Process Optimization">
                    Process Optimization
                  </option>

                  <option value="Technology Consulting">
                    Technology Consulting
                  </option>
                </select>
              </div>

              <div>
                <label className="admin-label">
                  Status
                </label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    updateForm("status", e.target.value)
                  }
                  className="admin-input mt-1.5"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="converted">Converted</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddLead(false)}
                  className="admin-btn-secondary"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={addLead}
                  disabled={
                    !form.firstName.trim() ||
                    !form.lastName.trim() ||
                    !form.email.trim() ||
                    !form.service
                  }
                  className="admin-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Add Lead
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}