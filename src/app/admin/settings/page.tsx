"use client";

import { useState } from "react";
import { Check, Save } from "lucide-react";
import {
  useApp,
  type Settings,
} from "@/context/AppContext";

export default function SettingsManagementPage() {
  const { settings, updateSettings } = useApp();

  const [form, setForm] = useState<Settings>(() => ({
    ...settings,
    social: {
      ...settings.social,
    },
  }));

  const [saved, setSaved] = useState(false);

  const updateField = (
    field: keyof Settings,
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  };

  const updateSocial = (
    field: keyof Settings["social"],
    value: string,
  ) => {
    setForm((current) => ({
      ...current,
      social: {
        ...current.social,
        [field]: value,
      },
    }));

    setSaved(false);
  };

  const saveSettings = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    try {
      /*
       * Save maintenance mode to the backend/database.
       */
      const response = await fetch("/api/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          maintenanceMode: form.maintenanceMode,
        }),
      });

      if (!response.ok) {
        throw new Error(
          "Failed to save maintenance mode",
        );
      }

      /*
       * Keep the rest of the settings in AppContext.
       */
      updateSettings(form);

      setSaved(true);
    } catch (error) {
      console.error(
        "Failed to save settings:",
        error,
      );

      setSaved(false);
    }
  };

  return (
    <form
      onSubmit={saveSettings}
      className="max-w-4xl space-y-6 animate-in fade-in duration-500"
    >
      {/* PAGE HEADER */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Settings
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Manage the business details shown across the website.
          </p>
        </div>

        <button
          type="submit"
          className="admin-btn-primary h-10 px-4"
        >
          {saved ? (
            <Check className="mr-2 h-4 w-4" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}

          {saved ? "Saved" : "Save changes"}
        </button>
      </div>

      {/* BUSINESS DETAILS */}
      <section className="admin-card space-y-5 p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold">
          Business details
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field
            label="Company name"
            value={form.companyName}
            onChange={(value) =>
              updateField(
                "companyName",
                value,
              )
            }
          />

          <Field
            label="Tagline"
            value={form.tagline}
            onChange={(value) =>
              updateField(
                "tagline",
                value,
              )
            }
          />

          <Field
            label="Phone"
            value={form.phone}
            onChange={(value) =>
              updateField(
                "phone",
                value,
              )
            }
          />

          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) =>
              updateField(
                "email",
                value,
              )
            }
          />
        </div>

        <Field
          label="Address"
          value={form.address}
          onChange={(value) =>
            updateField(
              "address",
              value,
            )
          }
        />
      </section>

      {/* MAINTENANCE MODE */}
      <section className="admin-card space-y-5 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h3 className="font-display text-lg font-bold">
              Maintenance Mode
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Temporarily disable the public website while performing maintenance.
            </p>

            <p
              className={`mt-2 text-xs font-semibold ${
                form.maintenanceMode
                  ? "text-red-500"
                  : "text-emerald-600"
              }`}
            >
              {form.maintenanceMode
                ? "Website is currently under maintenance"
                : "Website is live"}
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={form.maintenanceMode}
            aria-label="Toggle maintenance mode"
            onClick={() => {
              setForm((current) => ({
                ...current,
                maintenanceMode:
                  !current.maintenanceMode,
              }));

              setSaved(false);
            }}
            className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors ${
              form.maintenanceMode
                ? "bg-red-500"
                : "bg-muted"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                form.maintenanceMode
                  ? "translate-x-6"
                  : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </section>

      {/* SOCIAL LINKS */}
      <section className="admin-card space-y-5 p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold">
          Social links
        </h3>

        <div className="grid gap-4 sm:grid-cols-2">
          {(
            Object.keys(
              form.social,
            ) as Array<
              keyof Settings["social"]
            >
          ).map((network) => (
            <Field
              key={network}
              label={network}
              type="url"
              value={form.social[network]}
              onChange={(value) =>
                updateSocial(
                  network,
                  value,
                )
              }
            />
          ))}
        </div>
      </section>

      {/* SEARCH ENGINE SETTINGS */}
      <section className="admin-card space-y-5 p-5 sm:p-6">
        <h3 className="font-display text-lg font-bold">
          Search engine settings
        </h3>

        <Field
          label="SEO title"
          value={form.seoTitle}
          onChange={(value) =>
            updateField(
              "seoTitle",
              value,
            )
          }
        />

        <label className="block">
          <span className="text-xs font-semibold uppercase tracking-wider">
            SEO description
          </span>

          <textarea
            className="input mt-1.5 min-h-28 resize-y"
            value={form.seoDescription}
            onChange={(event) =>
              updateField(
                "seoDescription",
                event.target.value,
              )
            }
          />
        </label>
      </section>
    </form>
  );
}

/* =====================================================
   REUSABLE FIELD
===================================================== */

function Field({
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
    <label className="block">
      <span className="text-xs font-semibold uppercase tracking-wider">
        {label}
      </span>

      <input
        type={type}
        className="input mt-1.5"
        value={value}
        onChange={(event) =>
          onChange(event.target.value)
        }
      />
    </label>
  );
}