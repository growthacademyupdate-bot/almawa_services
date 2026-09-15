"use client";

import { useState } from "react";
import {
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Save,
} from "lucide-react";

import { useApp } from "@/context/AppContext";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RecentLeadsTableProps {
  leads: AdminLead[];
  hideViewAll?: boolean;
}

interface AdminLead {
  id: string | number;
  firstName?: string;
  lastName?: string;
  name?: string;
  company?: string;
  email?: string;
  phone?: string;
  service?: string;
  stage?: string;
  status?: string;
  date: string;
  message?: string;
}

interface EditForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  stage: string;
  status: string;
  message: string;
}

export function RecentLeadsTable({
  leads,
  hideViewAll = false,
}: RecentLeadsTableProps) {
  const { updateLead, deleteLead } = useApp();

  const [selectedLead, setSelectedLead] =
    useState<AdminLead | null>(null);

  const [editingLead, setEditingLead] =
    useState<AdminLead | null>(null);

  const [deleteConfirm, setDeleteConfirm] =
    useState<AdminLead | null>(null);

  const [editForm, setEditForm] =
    useState<EditForm | null>(null);

  const [saving, setSaving] = useState(false);

  const getLeadName = (lead: AdminLead) => {
    if (lead.name?.trim()) {
      return lead.name.trim();
    }

    const name =
      `${lead.firstName ?? ""} ${lead.lastName ?? ""}`.trim();

    return name || "Unnamed Lead";
  };

  const getStatusColor = (status: string = "") => {
    switch (status.toLowerCase()) {
      case "new":
        return "bg-blue-500/10 text-blue-600 border-blue-200";

      case "contacted":
        return "bg-amber-500/10 text-amber-600 border-amber-200";

      case "qualified":
        return "bg-purple-500/10 text-purple-600 border-purple-200";

      case "converted":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-200";

      case "closed":
        return "bg-slate-500/10 text-slate-600 border-slate-200";

      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const openEdit = (lead: AdminLead) => {
    setSelectedLead(null);
    setEditingLead(lead);

    setEditForm({
      firstName: lead.firstName ?? "",
      lastName: lead.lastName ?? "",
      email: lead.email ?? "",
      phone: lead.phone ?? "",
      company: lead.company ?? "",
      service: lead.service ?? "",
      stage: lead.stage ?? "",
      status: lead.status ?? "new",
      message: lead.message ?? "",
    });
  };

  const closeEdit = () => {
    setEditingLead(null);
    setEditForm(null);
    setSaving(false);
  };

  const updateField = (
    field: keyof EditForm,
    value: string,
  ) => {
    setEditForm((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [field]: value,
      };
    });
  };

  const saveEdit = () => {
    if (!editingLead || !editForm || saving) {
      return;
    }

    setSaving(true);

    const updateData = {
      firstName: editForm.firstName.trim(),
      lastName: editForm.lastName.trim(),
      email: editForm.email.trim(),
      phone: editForm.phone.trim(),
      company: editForm.company.trim(),
      service: editForm.service.trim(),
      stage: editForm.stage.trim(),
      status: editForm.status,
      message: editForm.message.trim(),
    } as Parameters<typeof updateLead>[1];

    updateLead(
      String(editingLead.id),
      updateData,
    );

    setTimeout(() => {
      closeEdit();
    }, 300);
  };

  const handleDelete = () => {
    if (!deleteConfirm) {
      return;
    }

    deleteLead(String(deleteConfirm.id));

    setDeleteConfirm(null);
    setSelectedLead(null);
  };

  return (
    <>
      {/* =========================
          RECENT LEADS TABLE
      ========================== */}

      <div className="admin-card overflow-hidden !p-0">
        <div className="admin-card-header p-6 border-b border-border mb-0">
          <div className="admin-card-title">
            <span className="title-dot" />
            Recent Leads
          </div>

          {!hideViewAll && (
            <button
              type="button"
              onClick={() => {
                window.location.href =
                  "/admin/leads";
              }}
              className="text-sm text-[#ff5a1f] font-semibold hover:underline"
            >
              View All Leads
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">
                  Name
                </th>

                <th className="px-6 py-4 font-bold">
                  Company
                </th>

                <th className="px-6 py-4 font-bold">
                  Service
                </th>

                <th className="px-6 py-4 font-bold">
                  Status
                </th>

                <th className="px-6 py-4 font-bold">
                  Date
                </th>

                <th className="px-6 py-4 font-bold text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {leads.length > 0 ? (
                leads.map((lead) => (
                  <tr
                    key={String(lead.id)}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    {/* NAME */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-foreground">
                        {getLeadName(lead)}
                      </div>

                      <div className="text-xs text-muted-foreground">
                        {lead.email || "—"}
                      </div>
                    </td>

                    {/* COMPANY */}
                    <td className="px-6 py-4 text-muted-foreground">
                      {lead.company || "—"}
                    </td>

                    {/* SERVICE */}
                    <td className="px-6 py-4 font-medium">
                      {lead.service || "—"}
                    </td>

                    {/* STATUS */}
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                          lead.status,
                        )}`}
                      >
                        {lead.status || "new"}
                      </span>
                    </td>

                    {/* DATE */}
                    <td className="px-6 py-4 text-muted-foreground">
                      {formatAdminDate(lead.date)}
                    </td>

                    {/* ACTION */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        {/* VIEW */}
                        <button
                          type="button"
                          title="View details"
                          aria-label="View details"
                          onClick={() =>
                            setSelectedLead(lead)
                          }
                          className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* MORE */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              type="button"
                              title="Actions"
                              aria-label="Actions"
                              className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors outline-none"
                            >
                              <MoreHorizontal className="w-4 h-4" />
                            </button>
                          </DropdownMenuTrigger>

                          <DropdownMenuContent
                            align="end"
                            className="w-40"
                          >
                            <DropdownMenuItem
                              onClick={() =>
                                openEdit(lead)
                              }
                              className="cursor-pointer"
                            >
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem
                              onClick={() =>
                                setDeleteConfirm(
                                  lead,
                                )
                              }
                              className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-10 text-center text-sm text-muted-foreground"
                  >
                    No leads found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================
          VIEW DIALOG
      ========================== */}

      <Dialog
        open={Boolean(selectedLead)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedLead(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-sm p-4">
          <DialogHeader>
            <DialogTitle className="text-base">
              {selectedLead
                ? getLeadName(selectedLead)
                : "Lead Details"}
            </DialogTitle>

            <DialogDescription className="text-xs">
              Lead information
            </DialogDescription>
          </DialogHeader>

          {selectedLead && (
            <div className="space-y-2">
              <CompactDetail
                label="Email"
                value={
                  selectedLead.email || "—"
                }
              />

              <CompactDetail
                label="Phone"
                value={
                  selectedLead.phone || "—"
                }
              />

              <CompactDetail
                label="Company"
                value={
                  selectedLead.company || "—"
                }
              />

              <CompactDetail
                label="Service"
                value={
                  selectedLead.service || "—"
                }
              />

              <div className="grid grid-cols-2 gap-2">
                <CompactDetail
                  label="Stage"
                  value={
                    selectedLead.stage || "—"
                  }
                />

                <CompactDetail
                  label="Status"
                  value={
                    selectedLead.status || "new"
                  }
                />
              </div>

              <CompactDetail
                label="Date"
                value={formatAdminDate(
                  selectedLead.date,
                )}
              />

              <CompactDetail
                label="Message"
                value={
                  selectedLead.message ||
                  "No message provided."
                }
              />

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedLead(null)
                  }
                  className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary transition"
                >
                  <X className="w-3.5 h-3.5" />
                  Close
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* =========================
          EDIT DIALOG
      ========================== */}

      <Dialog
        open={Boolean(editingLead)}
        onOpenChange={(open) => {
          if (!open) {
            closeEdit();
          }
        }}
      >
        <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Lead
            </DialogTitle>

            <DialogDescription>
              Update lead information.
            </DialogDescription>
          </DialogHeader>

          {editForm && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <EditField
                  label="First Name"
                  value={editForm.firstName}
                  onChange={(value) =>
                    updateField(
                      "firstName",
                      value,
                    )
                  }
                />

                <EditField
                  label="Last Name"
                  value={editForm.lastName}
                  onChange={(value) =>
                    updateField(
                      "lastName",
                      value,
                    )
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <EditField
                  label="Email"
                  type="email"
                  value={editForm.email}
                  onChange={(value) =>
                    updateField(
                      "email",
                      value,
                    )
                  }
                />

                <EditField
                  label="Phone"
                  value={editForm.phone}
                  onChange={(value) =>
                    updateField(
                      "phone",
                      value,
                    )
                  }
                />
              </div>

              <EditField
                label="Company"
                value={editForm.company}
                onChange={(value) =>
                  updateField(
                    "company",
                    value,
                  )
                }
              />

              <EditField
                label="Service"
                value={editForm.service}
                onChange={(value) =>
                  updateField(
                    "service",
                    value,
                  )
                }
              />

              <div className="grid grid-cols-2 gap-3">
                <EditSelect
                  label="Stage"
                  value={editForm.stage}
                  options={[
                    "Idea Stage",
                    "Early Startup",
                    "Existing Business",
                    "MSME / SME",
                  ]}
                  onChange={(value) =>
                    updateField(
                      "stage",
                      value,
                    )
                  }
                />

                <EditSelect
                  label="Status"
                  value={editForm.status}
                  options={[
                    "new",
                    "contacted",
                    "qualified",
                    "converted",
                    "closed",
                  ]}
                  onChange={(value) =>
                    updateField(
                      "status",
                      value,
                    )
                  }
                />
              </div>

              <div>
                <label className="admin-label">
                  Message
                </label>

                <textarea
                  rows={4}
                  value={editForm.message}
                  onChange={(event) =>
                    updateField(
                      "message",
                      event.target.value,
                    )
                  }
                  className="admin-input mt-1.5 resize-none"
                  placeholder="Lead message"
                />
              </div>

              <div className="pt-3 border-t border-border flex justify-end gap-2">
                <button
                  type="button"
                  onClick={closeEdit}
                  className="inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary transition"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>

                <button
                  type="button"
                  disabled={saving}
                  onClick={saveEdit}
                  className="inline-flex items-center gap-2 rounded-lg bg-[#ff5a1f] text-white px-4 py-2 text-sm font-semibold hover:opacity-90 disabled:opacity-60 transition"
                >
                  <Save className="w-4 h-4" />

                  {saving
                    ? "Saving..."
                    : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* =========================
          DELETE DIALOG
      ========================== */}

      <Dialog
        open={Boolean(deleteConfirm)}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteConfirm(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>
              Delete Lead?
            </DialogTitle>

            <DialogDescription>
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          {deleteConfirm && (
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-secondary/40 p-3">
                <p className="font-semibold">
                  {getLeadName(
                    deleteConfirm,
                  )}
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  {deleteConfirm.email ||
                    "No email"}
                </p>

                <p className="text-xs text-muted-foreground mt-1">
                  {deleteConfirm.service ||
                    "No service"}
                </p>
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setDeleteConfirm(null)
                  }
                  className="rounded-lg border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-semibold hover:bg-red-700 transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

/* =========================
   COMPACT VIEW DETAIL
========================= */

function CompactDetail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md border border-border px-2.5 py-1.5">
      <div className="text-[9px] font-bold uppercase tracking-wide text-muted-foreground">
        {label}
      </div>

      <div className="mt-0.5 text-xs font-medium break-words">
        {value}
      </div>
    </div>
  );
}

/* =========================
   EDIT INPUT
========================= */

function EditField({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <div>
      <label className="admin-label">
        {label}
      </label>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="admin-input mt-1.5"
      />
    </div>
  );
}

/* =========================
   EDIT SELECT
========================= */

function EditSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="admin-label">
        {label}
      </label>

      <select
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
        className="admin-input mt-1.5"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* =========================
   DATE FORMAT
========================= */

function formatAdminDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value || "—";
  }

  return `${String(date.getUTCDate()).padStart(
    2,
    "0",
  )}/${String(date.getUTCMonth() + 1).padStart(
    2,
    "0",
  )}/${date.getUTCFullYear()}`;
}