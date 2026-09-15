"use client";

import { Plus, Search, Filter, Building, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { industriesData } from "@/lib/admin-data";

type Industry = {
  id: string | number;
  name: string;
  clients: number;
  activeProjects: number;
};

export default function IndustriesManagementPage() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("");

  const [industries, setIndustries] = useState<Industry[]>(
    industriesData as Industry[],
  );

  const [showAddIndustry, setShowAddIndustry] = useState(false);
  const [industryName, setIndustryName] = useState("");

  useEffect(() => {
    const loadIndustries = async () => {
      try {
        const response = await fetch("/api/admin/content/industries");
        if (!response.ok) return;

        const backendIndustries = await response.json();
        if (Array.isArray(backendIndustries) && backendIndustries.length > 0) {
          setIndustries(backendIndustries as Industry[]);
        }
      } catch (error) {
        console.error("Failed to load industries from backend:", error);
      }
    };

    void loadIndustries();
  }, []);

  const filteredIndustries = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = industries.filter((industry) =>
      industry.name.toLowerCase().includes(query),
    );

    if (sortBy === "name") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sortBy === "clients") {
      result.sort((a, b) => b.clients - a.clients);
    }

    if (sortBy === "projects") {
      result.sort((a, b) => b.activeProjects - a.activeProjects);
    }

    return result;
  }, [industries, search, sortBy]);

  const addIndustry = () => {
    const name = industryName.trim();

    if (!name) {
      return;
    }

    const alreadyExists = industries.some(
      (industry) =>
        industry.name.toLowerCase() === name.toLowerCase(),
    );

    if (alreadyExists) {
      return;
    }

    const newIndustry: Industry = {
      id: crypto.randomUUID(),
      name,
      clients: 0,
      activeProjects: 0,
    };

    setIndustries((current) => [...current, newIndustry]);
    void fetch("/api/admin/content/industries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newIndustry),
    }).catch((error) => {
      console.error("Failed to save industry to backend:", error);
    });
    setIndustryName("");
    setShowAddIndustry(false);
  };

  const closeAddIndustry = () => {
    setIndustryName("");
    setShowAddIndustry(false);
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold font-display text-foreground">
            Industries Management
          </h2>

          <p className="text-sm text-muted-foreground mt-1">
            Manage industry sectors and monitor client distribution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setShowAddIndustry(true)}
            className="admin-btn-primary h-10 px-4 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add New Industry
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
            placeholder="Search industries..."
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

        {/* Sort */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-48">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-3 pr-8 py-2 text-sm outline-none transition-all cursor-pointer text-foreground"
            >
              <option value="">Sort By</option>
              <option value="name">Name (A-Z)</option>
              <option value="clients">Most Clients</option>
              <option value="projects">Most Projects</option>
            </select>

            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Result Count */}
      <div className="text-sm text-muted-foreground">
        Showing{" "}
        <span className="font-semibold text-foreground">
          {filteredIndustries.length}
        </span>{" "}
        of{" "}
        <span className="font-semibold text-foreground">
          {industries.length}
        </span>{" "}
        industries
      </div>

      {/* Industries Grid */}
      <div
        className="admin-animate-in"
        style={{ animationDelay: "100ms" }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredIndustries.map((industry) => (
            <div
              key={industry.id}
              className="admin-card flex flex-col hover:border-[#ff5a1f]/50 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center group-hover:bg-[#ff5a1f]/10 transition-colors">
                  <Building className="w-5 h-5 text-muted-foreground group-hover:text-[#ff5a1f] transition-colors" />
                </div>

                <h3 className="font-semibold text-lg">
                  {industry.name}
                </h3>
              </div>

              <div className="flex justify-between items-center mt-auto pt-4 border-t border-border/50">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Clients
                  </p>

                  <p className="font-bold text-lg">
                    {industry.clients}
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">
                    Active Projects
                  </p>

                  <p className="font-bold text-lg">
                    {industry.activeProjects}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredIndustries.length === 0 && (
          <div className="admin-card mt-4 py-12 text-center">
            <Building className="w-10 h-10 mx-auto text-muted-foreground mb-3" />

            <h3 className="font-semibold text-lg">
              No industries found
            </h3>

            <p className="text-sm text-muted-foreground mt-1">
              Try changing your search.
            </p>
          </div>
        )}
      </div>

      {/* Add New Industry Modal */}
      {showAddIndustry && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeAddIndustry();
            }
          }}
        >
          <div className="w-full max-w-md rounded-2xl bg-background shadow-2xl border border-border">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border">
              <div>
                <h3 className="text-lg font-bold font-display">
                  Add New Industry
                </h3>

                <p className="text-xs text-muted-foreground mt-1">
                  Enter the industry name below.
                </p>
              </div>

              <button
                type="button"
                onClick={closeAddIndustry}
                className="p-2 rounded-lg hover:bg-secondary transition"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <div className="p-6">
              <label
                htmlFor="industry-name"
                className="admin-label"
              >
                Industry Name
              </label>

              <input
                id="industry-name"
                type="text"
                autoFocus
                value={industryName}
                onChange={(e) => setIndustryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addIndustry();
                  }

                  if (e.key === "Escape") {
                    closeAddIndustry();
                  }
                }}
                placeholder="Enter industry name"
                className="admin-input mt-1.5"
              />

              {/* Buttons */}
              <div className="flex justify-end gap-3 pt-5">
                <button
                  type="button"
                  onClick={closeAddIndustry}
                  className="admin-btn-secondary"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={addIndustry}
                  disabled={!industryName.trim()}
                  className="admin-btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Add Industry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}