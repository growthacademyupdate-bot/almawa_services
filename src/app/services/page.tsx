"use client";

import { useMemo, useState } from "react";
import { Plus, Search, Filter, X } from "lucide-react";
import { ServicesSummary } from "@/components/admin/ServicesSummary";
import { servicesPerformance } from "@/lib/admin-data";

type Service = {
  name: string;
  title: string;
  slug: string;
  clients: number;
  projects: number;
  offerings: number;
};

const categories = [
  "All Categories",
  "Consulting",
  "Technology",
  "Strategy",
];

function normalizeService(item: unknown): Service {
  const s = item as Record<string, unknown>;

  return {
    name: String(s.name ?? s.title ?? "Service"),
    title: String(s.title ?? s.name ?? "Service"),
    slug: String(s.slug ?? s.name ?? s.title ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-"),
    clients: Number(
      s.clients ?? s.clientCount ?? s.totalClients ?? 0,
    ),
    projects: Number(
      s.projects ?? s.projectCount ?? s.activeProjects ?? 0,
    ),
    offerings: Number(
      s.offerings ?? s.offeringCount ?? s.totalOfferings ?? 0,
    ),
  };
}

function getCategory(service: Service) {
  const text =
    `${service.name} ${service.title}`.toLowerCase();

  if (
    text.includes("technology") ||
    text.includes("digital") ||
    text.includes("tech")
  ) {
    return "Technology";
  }

  if (
    text.includes("strategy") ||
    text.includes("growth") ||
    text.includes("optimization")
  ) {
    return "Strategy";
  }

  return "Consulting";
}

export default function ServicesManagementPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] =
    useState("All Categories");
  const [showAdd, setShowAdd] = useState(false);

  const [customServices, setCustomServices] =
    useState<Service[]>([]);

  const [form, setForm] = useState({
    name: "",
    title: "",
    slug: "",
    clients: "0",
    projects: "0",
    offerings: "0",
  });

  const services = useMemo(
    () => servicesPerformance.map(normalizeService),
    [],
  );

  const allServices = [
    ...services,
    ...customServices,
  ];

  const filteredServices = useMemo(() => {
    const q = search.trim().toLowerCase();

    return allServices.filter((service) => {
      const matchesSearch =
        !q ||
        service.name.toLowerCase().includes(q) ||
        service.title.toLowerCase().includes(q) ||
        service.slug.toLowerCase().includes(q);

      const matchesCategory =
        category === "All Categories" ||
        getCategory(service) === category;

      return matchesSearch && matchesCategory;
    });
  }, [allServices, search, category]);

  function addService(
    e: React.FormEvent<HTMLFormElement>,
  ) {
    e.preventDefault();

    if (!form.name.trim() || !form.title.trim()) {
      return;
    }

    const service: Service = {
      name: form.name.trim(),
      title: form.title.trim(),
      slug:
        form.slug.trim() ||
        form.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-"),
      clients: Number(form.clients) || 0,
      projects: Number(form.projects) || 0,
      offerings: Number(form.offerings) || 0,
    };

    setCustomServices((prev) => [
      service,
      ...prev,
    ]);

    setForm({
      name: "",
      title: "",
      slug: "",
      clients: "0",
      projects: "0",
      offerings: "0",
    });

    setShowAdd(false);
  }

  return (
    <div className="space-y-6 lg:space-y-8">

      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Services Management
          </h1>

          <p className="text-sm text-muted-foreground mt-1">
            Manage your offerings and monitor performance.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="admin-btn-primary"
        >
          <Plus className="w-4 h-4" />
          Add New Service
        </button>
      </div>

      {/* SEARCH */}
      <div className="admin-card">
        <div className="flex gap-4">

          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />

            <input
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search services..."
              className="admin-input pl-11"
            />
          </div>

          <div className="relative w-56">
            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="admin-input appearance-none pr-10"
            >
              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
          </div>
        </div>

        {(search ||
          category !== "All Categories") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("All Categories");
            }}
            className="mt-3 text-sm text-[#ff5a1f] font-semibold"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* SERVICES */}
      {filteredServices.length > 0 ? (
        <ServicesSummary
          services={filteredServices}
          hideHeader
        />
      ) : (
        <div className="admin-card py-10 text-center">
          No services found.
        </div>
      )}

      {/* ADD MODAL */}
      {showAdd && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <form
            onSubmit={addService}
            className="bg-background border border-border rounded-2xl p-6 w-full max-w-lg space-y-4"
          >
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">
                Add New Service
              </h2>

              <button
                type="button"
                onClick={() => setShowAdd(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <input
              required
              placeholder="Service Name"
              className="admin-input"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
            />

            <input
              required
              placeholder="Display Title"
              className="admin-input"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />

            <input
              placeholder="Slug"
              className="admin-input"
              value={form.slug}
              onChange={(e) =>
                setForm({
                  ...form,
                  slug: e.target.value,
                })
              }
            />

            <div className="grid grid-cols-3 gap-3">
              <input
                type="number"
                min="0"
                placeholder="Clients"
                className="admin-input"
                value={form.clients}
                onChange={(e) =>
                  setForm({
                    ...form,
                    clients: e.target.value,
                  })
                }
              />

              <input
                type="number"
                min="0"
                placeholder="Projects"
                className="admin-input"
                value={form.projects}
                onChange={(e) =>
                  setForm({
                    ...form,
                    projects: e.target.value,
                  })
                }
              />

              <input
                type="number"
                min="0"
                placeholder="Offerings"
                className="admin-input"
                value={form.offerings}
                onChange={(e) =>
                  setForm({
                    ...form,
                    offerings: e.target.value,
                  })
                }
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowAdd(false)}
                className="admin-btn-secondary"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="admin-btn-primary"
              >
                Add Service
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}