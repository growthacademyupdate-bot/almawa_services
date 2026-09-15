"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  Eye,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";

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

interface ConsultationTableProps {
  consultations: Consultation[];
  hideViewAll?: boolean;
  onEdit?: (consultation: Consultation) => void;
  onDelete?: (consultation: Consultation) => void;
}

interface Consultation {
  id: string | number;
  client: string;
  company: string;
  service: string;
  date: string;
  status: string;
  email?: string;
  phone?: string;
  message?: string;
}

export function ConsultationTable({
  consultations,
  hideViewAll = false,
  onEdit,
  onDelete,
}: ConsultationTableProps) {
  const router = useRouter();

  const [
    selectedConsultation,
    setSelectedConsultation,
  ] = useState<Consultation | null>(null);

  const [
    deleteConsultation,
    setDeleteConsultation,
  ] = useState<Consultation | null>(null);

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-amber-500/10 text-amber-600 border-amber-200";

      case "confirmed":
        return "bg-blue-500/10 text-blue-600 border-blue-200";

      case "completed":
        return "bg-emerald-500/10 text-emerald-600 border-emerald-200";

      case "cancelled":
        return "bg-red-500/10 text-red-600 border-red-200";

      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  };

  const handleEdit = (
    consultation: Consultation,
  ) => {
    if (onEdit) {
      onEdit(consultation);
      return;
    }

    router.push(
      `/admin/consultations?edit=${encodeURIComponent(
        String(consultation.id),
      )}`,
    );
  };

  const handleDelete = () => {
    if (!deleteConsultation) return;

    if (onDelete) {
      onDelete(deleteConsultation);
    }

    setDeleteConsultation(null);
  };

  return (
    <>
      <div className="admin-card overflow-hidden !p-0 h-full">
        {/* HEADER */}
        <div className="admin-card-header p-6 border-b border-border mb-0">
          <div className="admin-card-title">
            <span className="title-dot" />
            Recent Consultations
          </div>

          {!hideViewAll && (
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/consultations",
                )
              }
              className="text-sm text-[#ff5a1f] font-semibold hover:underline"
            >
              View All
            </button>
          )}
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-secondary/50 text-muted-foreground text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">
                  Client
                </th>

                <th className="px-6 py-4 font-bold">
                  Service
                </th>

                <th className="px-6 py-4 font-bold">
                  Preferred Date
                </th>

                <th className="px-6 py-4 font-bold">
                  Status
                </th>

                <th className="px-6 py-4 font-bold text-right">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border">
              {consultations.length > 0 ? (
                consultations.map(
                  (consultation) => (
                    <tr
                      key={consultation.id}
                      className="hover:bg-secondary/20 transition-colors"
                    >
                      {/* CLIENT */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-foreground">
                          {consultation.client}
                        </div>

                        <div className="text-xs text-muted-foreground">
                          {consultation.company}
                        </div>
                      </td>

                      {/* SERVICE */}
                      <td className="px-6 py-4 font-medium text-muted-foreground">
                        {consultation.service}
                      </td>

                      {/* DATE */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />

                          {formatAdminDate(
                            consultation.date,
                          )}
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(
                            consultation.status,
                          )}`}
                        >
                          {consultation.status}
                        </span>
                      </td>

                      {/* ACTIONS */}
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1">
                          {/* VIEW */}
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedConsultation(
                                consultation,
                              )
                            }
                            aria-label={`View ${consultation.client} consultation details`}
                            title="View details"
                            className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* MORE */}
                          <DropdownMenu>
                            <DropdownMenuTrigger
                              asChild
                            >
                              <button
                                type="button"
                                aria-label={`Actions for ${consultation.client}`}
                                title="Actions"
                                className="p-2 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors outline-none"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                              align="end"
                              className="w-40"
                            >
                              {/* EDIT */}
                              <DropdownMenuItem
                                onClick={() =>
                                  handleEdit(
                                    consultation,
                                  )
                                }
                                className="cursor-pointer"
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>

                              <DropdownMenuSeparator />

                              {/* DELETE */}
                              <DropdownMenuItem
                                onClick={() =>
                                  setDeleteConsultation(
                                    consultation,
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
                  ),
                )
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-10 text-center text-sm text-muted-foreground"
                  >
                    No consultations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* VIEW DIALOG */}
      <Dialog
        open={Boolean(
          selectedConsultation,
        )}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedConsultation(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedConsultation?.client}
            </DialogTitle>

            <DialogDescription>
              Complete consultation request
              details.
            </DialogDescription>
          </DialogHeader>

          {selectedConsultation && (
            <div className="space-y-4 mt-2">
              <Detail
                label="Client"
                value={
                  selectedConsultation.client
                }
              />

              <Detail
                label="Company"
                value={
                  selectedConsultation.company
                }
              />

              <Detail
                label="Service"
                value={
                  selectedConsultation.service
                }
              />

              <Detail
                label="Preferred Date"
                value={formatAdminDate(
                  selectedConsultation.date,
                )}
              />

              <Detail
                label="Status"
                value={
                  selectedConsultation.status
                }
              />

              {selectedConsultation.email && (
                <Detail
                  label="Email"
                  value={
                    selectedConsultation.email
                  }
                />
              )}

              {selectedConsultation.phone && (
                <Detail
                  label="Phone"
                  value={
                    selectedConsultation.phone
                  }
                />
              )}

              {selectedConsultation.message && (
                <Detail
                  label="Message"
                  value={
                    selectedConsultation.message
                  }
                />
              )}

              {/* IMPORTANT:
                  NO EDIT BUTTON HERE */}
              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() =>
                    setSelectedConsultation(
                      null,
                    )
                  }
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-secondary transition"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog
        open={Boolean(
          deleteConsultation,
        )}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteConsultation(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Delete Consultation?
            </DialogTitle>

            <DialogDescription>
              Are you sure you want to delete this
              consultation? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>

          {deleteConsultation && (
            <div className="mt-4">
              <div className="rounded-lg border border-border bg-secondary/40 p-4">
                <p className="font-semibold">
                  {
                    deleteConsultation.client
                  }
                </p>

                <p className="text-sm text-muted-foreground mt-1">
                  {
                    deleteConsultation.company
                  }
                </p>

                <p className="text-sm text-muted-foreground mt-1">
                  {
                    deleteConsultation.service
                  }
                </p>

                <p className="text-sm text-muted-foreground mt-1">
                  {formatAdminDate(
                    deleteConsultation.date,
                  )}
                </p>
              </div>

              <div className="flex justify-end gap-2 mt-5">
                <button
                  type="button"
                  onClick={() =>
                    setDeleteConsultation(null)
                  }
                  className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-secondary transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDelete}
                  className="rounded-lg bg-red-600 text-white px-4 py-2 text-sm font-semibold hover:bg-red-700 transition"
                >
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

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border p-3">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>

      <span className="text-sm font-medium text-foreground break-words">
        {value}
      </span>
    </div>
  );
}

function formatAdminDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return `${String(date.getUTCDate()).padStart(
    2,
    "0",
  )}/${String(date.getUTCMonth() + 1).padStart(
    2,
    "0",
  )}/${date.getUTCFullYear()}`;
}