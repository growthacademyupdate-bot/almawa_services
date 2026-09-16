"use client";

import { Plus, Search, Filter, X, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Service {
  _id: string;
  name: string;
  slug: string;
  category: string;
  status: "Active" | "Inactive";
  displayOrder: number;
  createdAt: string;
}

export default function ServicesManagementPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const fetchServices = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (search) query.append("search", search);
      if (categoryFilter) query.append("category", categoryFilter);
      if (statusFilter !== "All") query.append("status", statusFilter);

      const res = await fetch(`/api/services?${query.toString()}`);
      const data = await res.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchServices();
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [search, categoryFilter, statusFilter]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        setServices(services.filter((s) => s._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete service:", error);
    }
  };

  const toggleStatus = async (service: Service) => {
    const newStatus = service.status === "Active" ? "Inactive" : "Active";
    try {
      const res = await fetch(`/api/services/${service._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setServices(services.map((s) => (s._id === service._id ? { ...s, status: newStatus } : s)));
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
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
          <Link
            href="/admin/services/new"
            className="admin-btn-primary h-10 px-4 whitespace-nowrap flex items-center"
          >
            <Plus className="w-4 h-4 mr-1" />
            + Add Service
          </Link>
        </div>
      </div>

      {/* Action Bar */}
      <div className="admin-card flex flex-col lg:flex-row gap-4 justify-between items-center p-4">
        {/* Search */}
        <div className="relative w-full lg:max-w-md">
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
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto">
          <div className="relative w-full sm:w-48">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full appearance-none bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-3 pr-8 py-2 text-sm outline-none transition-all cursor-pointer text-foreground"
            >
              <option value="">All Categories</option>
              <option value="Business Consulting">Business Consulting</option>
              <option value="Strategy">Strategy</option>
              <option value="Digital Transformation">Digital Transformation</option>
              <option value="Technology">Technology</option>
              <option value="Operations">Operations</option>
              <option value="Business Growth">Business Growth</option>
              <option value="Process Optimization">Process Optimization</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>

          <div className="relative w-full sm:w-48">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full appearance-none bg-secondary/50 border border-border focus:border-[#ff5a1f] rounded-lg pl-3 pr-8 py-2 text-sm outline-none transition-all cursor-pointer text-foreground"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <Filter className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="admin-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-secondary/50 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium text-muted-foreground">Service</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Category</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Status</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Order</th>
                <th className="px-6 py-4 font-medium text-muted-foreground">Created Date</th>
                <th className="px-6 py-4 font-medium text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    Loading services...
                  </td>
                </tr>
              ) : services.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                    <Search className="w-10 h-10 mx-auto text-muted-foreground mb-3 opacity-20" />
                    <p>No services found.</p>
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr key={service._id} className="hover:bg-secondary/20 transition-colors">
                    <td className="px-6 py-4 font-medium text-foreground">
                      {service.name}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {service.category}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          service.status === "Active"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400"
                        }`}
                      >
                        {service.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {service.displayOrder}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(service.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => toggleStatus(service)}
                        className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-secondary transition-colors"
                        title={service.status === "Active" ? "Deactivate" : "Activate"}
                      >
                        {service.status === "Active" ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                      </button>
                      <Link
                        href={`/admin/services/${service._id}/edit`}
                        className="inline-flex p-2 text-muted-foreground hover:text-blue-500 rounded-lg hover:bg-blue-500/10 transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(service._id)}
                        className="p-2 text-muted-foreground hover:text-red-500 rounded-lg hover:bg-red-500/10 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}