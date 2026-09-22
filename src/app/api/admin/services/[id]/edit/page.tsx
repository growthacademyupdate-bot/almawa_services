"use client";

import {
  ArrowLeft,
  Loader2,
  Save,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { toast } from "sonner";

export default function EditServicePage() {
  const router =
    useRouter();

  const params =
    useParams<{
      id: string;
    }>();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const response =
          await fetch(
            `/api/admin/services/${params.id}`,
            {
              cache: "no-store",
            },
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ??
              "Service not found.",
          );
        }

        setForm(data);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "Failed to load service.",
        );

        router.push(
          "/admin/services",
        );
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      void load();
    }
  }, [
    params.id,
    router,
  ]);

  const save = async () => {
    if (saving || !form) {
      return;
    }

    setSaving(true);

    try {
      const response =
        await fetch(
          `/api/admin/services/${params.id}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              form,
            ),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ??
            "Failed to update service.",
        );
      }

      toast.success(
        "Service updated successfully.",
      );

      router.push(
        "/admin/services",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update service.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-7 w-7 animate-spin text-[#ff5a1f]" />
      </div>
    );
  }

  if (!form) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button
        type="button"
        onClick={() =>
          router.push(
            "/admin/services",
          )
        }
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Services
      </button>

      <div className="admin-card">
        <h1 className="font-display text-2xl font-bold">
          Edit Service
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Update service information.
        </p>

        <div className="mt-6 space-y-5">
          <Field
            label="Service Name"
            value={form.name}
            onChange={(value) =>
              setForm({
                ...form,
                name: value,
              })
            }
          />

          <Field
            label="Slug"
            value={form.slug}
            onChange={(value) =>
              setForm({
                ...form,
                slug: value
                  .toLowerCase()
                  .replace(
                    /[^a-z0-9]+/g,
                    "-",
                  )
                  .replace(
                    /^-+|-+$/g,
                    ""),
              })
            }
          />

          <div>
            <label className="admin-label">
              Short Description
            </label>

            <textarea
              value={
                form.shortDescription
              }
              maxLength={250}
              rows={4}
              onChange={(event) =>
                setForm({
                  ...form,
                  shortDescription:
                    event.target
                      .value,
                })
              }
              className="admin-input resize-y"
            />

            <p className="mt-1 text-right text-xs text-muted-foreground">
              {
                form
                  .shortDescription
                  .length
              }
              /250
            </p>
          </div>

          <div>
            <label className="admin-label">
              Service Content
            </label>

            <textarea
              value={
                form.content
              }
              rows={15}
              onChange={(event) =>
                setForm({
                  ...form,
                  content:
                    event.target
                      .value,
                })
              }
              className="admin-input resize-y font-mono text-sm"
            />
          </div>

          <Field
            label="Image URL / Image"
            value={
              form.image ?? ""
            }
            onChange={(value) =>
              setForm({
                ...form,
                image: value,
              })
            }
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="admin-label">
                Category
              </label>

              <select
                value={
                  form.category
                }
                onChange={(event) =>
                  setForm({
                    ...form,
                    category:
                      event.target
                        .value,
                  })
                }
                className="admin-input"
              >
                <option value="">
                  Select category
                </option>

                <option>
                  Business Consulting
                </option>

                <option>
                  Strategy
                </option>

                <option>
                  Digital Transformation
                </option>

                <option>
                  Technology
                </option>

                <option>
                  Operations
                </option>

                <option>
                  Business Growth
                </option>

                <option>
                  Process Optimization
                </option>
              </select>
            </div>

            <div>
              <label className="admin-label">
                Status
              </label>

              <select
                value={
                  form.status
                }
                onChange={(event) =>
                  setForm({
                    ...form,
                    status:
                      event.target
                        .value,
                  })
                }
                className="admin-input"
              >
                <option value="active">
                  Active
                </option>

                <option value="inactive">
                  Inactive
                </option>
              </select>
            </div>

            <Field
              label="Display Order"
              type="number"
              value={String(
                form.displayOrder ??
                  1,
              )}
              onChange={(value) =>
                setForm({
                  ...form,
                  displayOrder:
                    Number(
                      value,
                    ),
                })
              }
            />

            <Field
              label="Service Icon"
              value={
                form.icon ??
                "Briefcase"
              }
              onChange={(value) =>
                setForm({
                  ...form,
                  icon: value,
                })
              }
            />
          </div>

          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/services",
                )
              }
              className="admin-btn-secondary"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={() =>
                void save()
              }
              className="admin-btn-primary"
            >
              {saving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (
    value: string,
  ) => void;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="admin-label">
        {label}
      </span>

      <input
        type={type}
        value={value}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="admin-input"
      />
    </label>
  );
}