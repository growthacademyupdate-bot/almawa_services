"use client";

import { Plus, Search, Filter, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { ServicesSummary } from "@/components/admin/ServicesSummary";
import { servicesPerformance } from "@/lib/admin-data";
import { useApp } from "@/context/AppContext";
import type { ServiceItem as ContextServiceItem } from "@/mock/data";

interface ServiceItem {
  id?: string;
  name: string;
  title: string;
  slug: string;
  category: string;
  clients: number;
  leads: number;
  projects: number;
  offerings: number;
  conversions: number;
  revenue: number;
}

export default function ServicesManagementPage() {
  const { services: contextServices, upsertService } = useApp();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const initialSearch = new URLSearchParams(
      window.location.search,
    ).get("search");

    if (initialSearch) {
      setSearch(initialSearch);
    }
  }, []);

  const [services, setServices] = useState<ServiceItem[]>(
    servicesPerformance.map((service: any) => ({
      id: service.id,
      name: String(service.name ?? service.title ?? "Service"),
      title: String(service.title ?? service.name ?? "Service"),
      slug: String(
        service.slug ??
          service.name ??
          service.title ??
          "",
      ),
      category: String(service.category ?? "consulting"),
      clients: Number(service.clients ?? service.clientCount ?? 0),
      leads: Number(service.leads ?? 0),
      projects: Number(service.projects ?? service.projectCount ?? 0),
      offerings: Number(
        service.offerings ?? service.offeringCount ?? 0,
      ),
      conversions: Number(service.conversions ?? 0),
      revenue: Number(service.revenue ?? 0),
    })),
  );

  useEffect(() => {
    const sharedServices: ServiceItem[] = contextServices.map((service) => ({
      id: service.slug,
      name: service.title,
      title: service.title,
      slug: service.slug,
      category: "consulting",
      clients: service.clients ?? 0,
      leads: 0,
      projects: service.projects ?? 0,
      offerings: service.offerings?.length ?? 0,
      conversions: 0,
      revenue: 0,
    }));

    setServices((current) => {
      const existingNames = new Set(
        current.map((service) => service.name.toLowerCase()),
      );
      const additions = sharedServices.filter(
        (service) => !existingNames.has(service.name.toLowerCase()),
      );

      return additions.length > 0
        ? [...additions, ...current]
        : current;
    });
  }, [contextServices]);

  const [showAddService, setShowAddService] = useState(false);
  const [serviceName, setServiceName] = useState("");
  const [serviceCategory, setServiceCategory] = useState("consulting");
  const [serviceClients, setServiceClients] = useState("0");
  const [serviceProjects, setServiceProjects] = useState("0");
  const [serviceOfferings, setServiceOfferings] = useState("0");

  const filteredServices = useMemo(() => {
    const query = search.trim().toLowerCase();

    return services.filter((service) => {
      const name = service.name.toLowerCase();
      const title = service.title.toLowerCase();
      const category = service.category.toLowerCase();

      const matchesSearch =
        !query ||
        name.includes(query) ||
        title.includes(query);

      const matchesCategory =
        !categoryFilter ||
        category === categoryFilter.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [services, search, categoryFilter]);

  const addService = () => {
    const name = serviceName.trim();

    if (!name) {
      return;
    }

    const duplicate = services.some(
      (service) =>
        service.name.toLowerCase() === name.toLowerCase() ||
        service.title.toLowerCase() === name.toLowerCase(),
    );

    if (duplicate) {
      return;
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newService: ServiceItem = {
      id: crypto.randomUUID(),
      name,
      title: name,
      slug,
      category: serviceCategory,
      clients: Number(serviceClients) || 0,
      leads: 0,
      projects: Number(serviceProjects) || 0,
      offerings: Number(serviceOfferings) || 0,
      conversions: 0,
      revenue: 0,
    };

    setServices((current) => [newService, ...current]);

    upsertService({
      slug: slug as ContextServiceItem["slug"],
      title: name,
      createdAt: new Date().toISOString(),
      clients: Number(serviceClients) || 0,
      projects: Number(serviceProjects) || 0,
      tagline: "",
      description: "",
      icon: "building",
      color: "from-orange-500 to-amber-500",
      overview: "",
      benefits: [],
      process: [],
      documents: [],
      whoCanApply: [],
      faqs: [],
      offerings: Array.from(
        { length: Number(serviceOfferings) || 0 },
        (_, index) => `Offering ${index + 1}`,
      ),
    });

    setServiceName("");
    setServiceCategory("consulting");
    setServiceClients("0");
    setServiceProjects("0");
    setServiceOfferings("0");
    setShowAddService(false);
  };

  const closeAddService = () => {
    setServiceName("");
    setServiceCategory("consulting");
    setServiceClients("0");
    setServiceProjects("0");
    setServiceOfferings("0");
    setShowAddService(false);
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">
            Services Management
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            Manage your offerings and monitor performance.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAddService(true)}
            className="admin-btn-primary h-10 px-4 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add New Service
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
            placeholder="Search services by name..."
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

        {/* Category Filter */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full appearance-none bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-3 pr-8 py-2 text-sm outline-none transition-all cursor-pointer text-foreground"
            >
              <option value="">All Categories</option>
              <option value="consulting">Consulting</option>
              <option value="technology">Technology</option>
              <option value="strategy">Strategy</option>
            </select>

            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Result Count */}
      <div className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-foreground">
          {filteredServices.length}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-foreground">
          {services.length}
        </span>{" "}
        services
      </div>

      {/* Services Grid */}
      <div
        className="admin-animate-in"
        style={{ animationDelay: "100ms" }}
      >
        <ServicesSummary
          services={filteredServices}
          hideHeader={true}
        />
      </div>

      {/* No Results */}
      {filteredServices.length === 0 && (
        <div className="admin-card py-12 text-center">
          <Search className="w-10 h-10 mx-auto text-muted-foreground mb-3" />

          <h3 className="font-semibold text-lg">
            No services found
          </h3>

          <p className="text-sm text-muted-foreground mt-1">
            Try changing your search or category filter.
          </p>
        </div>
      )}

      {/* Add New Service Modal */}
      {showAddService && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeAddService();
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-background shadow-2xl border border-border">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="text-lg font-bold font-display">
                  Add New Service
                </h3>

                <p className="text-xs text-muted-foreground mt-1">
                  Enter the service details below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeAddService}
                className="p-2 rounded-lg hover:bg-secondary transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              {/* Service Name */}
              <div>
                <label
                  htmlFor="service-name"
                  className="admin-label"
                >
                  Service Name
                </label>

                <input
                  id="service-name"
                  type="text"
                  autoFocus
                  value={serviceName}
                  onChange={(e) => setServiceName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      addService();
                    }

                    if (e.key === "Escape") {
                      closeAddService();
                    }
                  }}
                  placeholder="Enter service name"
                  className="admin-input mt-1.5"
                />
              </div>

              {/* Category */}
              <div>
                <label
                  htmlFor="service-category"
                  className="admin-label"
                >
                  Category
                </label>

                <select
                  id="service-category"
                  value={serviceCategory}
                  onChange={(e) =>
                    setServiceCategory(e.target.value)
                  }
                  className="admin-input mt-1.5"
                >
                  <option value="consulting">
                    Consulting
                  </option>

                  <option value="technology">
                    Technology
                  </option>

                  <option value="strategy">
                    Strategy
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <label className="admin-label" htmlFor="service-clients">
                  Clients
                  <input
                    id="service-clients"
                    type="number"
                    min="0"
                    value={serviceClients}
                    onChange={(event) => setServiceClients(event.target.value)}
                    className="admin-input mt-1.5"
                  />
                </label>

                <label className="admin-label" htmlFor="service-projects">
                  Projects
                  <input
                    id="service-projects"
                    type="number"
                    min="0"
                    value={serviceProjects}
                    onChange={(event) => setServiceProjects(event.target.value)}
                    className="admin-input mt-1.5"
                  />
                </label>

                <label className="admin-label" htmlFor="service-offerings">
                  Offerings
                  <input
                    id="service-offerings"
                    type="number"
                    min="0"
                    value={serviceOfferings}
                    onChange={(event) => setServiceOfferings(event.target.value)}
                    className="admin-input mt-1.5"
                  />
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-5 border-t border-border">
                <button
                  type="button"
                  onClick={closeAddService}
                  className="admin-btn-secondary"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={addService}
                  disabled={!serviceName.trim()}
                  className="admin-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Service
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}