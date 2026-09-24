"use client";

import {
  Building2,
  CheckCircle2,
  Filter,
  ImagePlus,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

type Industry = {
  id: string;
  name: string;
  description: string;
  focus: string[];
  icon?: string;
  imageUrl?: string;
};

const emptyForm = {
  name: "",
  description: "",
  focus: [""],
  imageUrl: "",
};

function notifyIndustryUpdate() {
  /*
   * Current tab
   */
  window.dispatchEvent(
    new Event(
      "almawa:industries-updated",
    ),
  );

  /*
   * Other browser tabs
   */
  localStorage.setItem(
    "almawa_industries_updated",
    Date.now().toString(),
  );
}

export default function IndustriesManagementPage() {
  const [
    industries,
    setIndustries,
  ] = useState<Industry[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    sortBy,
    setSortBy,
  ] = useState("");

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    editingId,
    setEditingId,
  ] = useState<
    string | null
  >(null);

  const [
    form,
    setForm,
  ] = useState(
    emptyForm,
  );

  const [
    error,
    setError,
  ] = useState("");

  const loadIndustries =
    useCallback(
      async () => {
        try {
          setLoading(true);
          setError("");

          const response =
            await fetch(
              "/api/admin/content/industries",
              {
                cache:
                  "no-store",
              },
            );

          const data =
            await response.json();

          if (!response.ok) {
            throw new Error(
              data?.error ??
                "Unable to load industries",
            );
          }

          if (
            !Array.isArray(data)
          ) {
            throw new Error(
              "Invalid industries response",
            );
          }

          const normalized =
            data
              .map(
                (item) => ({
                  id: String(
                    item.id ??
                      item._id ??
                      crypto.randomUUID(),
                  ),
                  name: String(
                    item.name ??
                      item.title ??
                      "",
                  ),
                  description: String(
                    item.description ??
                      item.desc ??
                      "",
                  ),
                  focus: Array.isArray(
                    item.focus,
                  )
                    ? item.focus
                        .map(
                          (
                            value: unknown,
                          ) =>
                            String(
                              value,
                            ),
                        )
                        .filter(
                          Boolean,
                        )
                    : Array.isArray(
                        item.keyFocusAreas,
                      )
                      ? item.keyFocusAreas
                          .map(
                            (
                              value: unknown,
                            ) =>
                              String(
                                value,
                              ),
                          )
                          .filter(
                            Boolean,
                          )
                      : [],
                  icon:
                    typeof item.icon ===
                    "string"
                      ? item.icon
                      : undefined,
                  imageUrl:
                    typeof item.imageUrl ===
                    "string"
                      ? item.imageUrl
                      : undefined,
                })
              )
              .filter(
                (
                  item,
                ) =>
                  item.name.trim() !==
                  "",
              );

          setIndustries(
            normalized,
          );
        } catch (loadError) {
          console.error(
            "Failed to load industries:",
            loadError,
          );

          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load industries",
          );
        } finally {
          setLoading(false);
        }
      },
      [],
    );

  useEffect(() => {
    void loadIndustries();

    const handleIndustryUpdate =
      () => {
        void loadIndustries();
      };

    const handleStorage =
      (
        event: StorageEvent,
      ) => {
        if (
          event.key ===
          "almawa_industries_updated"
        ) {
          void loadIndustries();
        }
      };

    window.addEventListener(
      "almawa:industries-updated",
      handleIndustryUpdate,
    );

    window.addEventListener(
      "storage",
      handleStorage,
    );

    return () => {
      window.removeEventListener(
        "almawa:industries-updated",
        handleIndustryUpdate,
      );

      window.removeEventListener(
        "storage",
        handleStorage,
      );
    };
  }, [
    loadIndustries,
  ]);

  const filteredIndustries =
    useMemo(() => {
      const query =
        search
          .trim()
          .toLowerCase();

      const result =
        industries.filter(
          (industry) => {
            if (!query) {
              return true;
            }

            return (
              industry.name
                .toLowerCase()
                .includes(query) ||
              industry.description
                .toLowerCase()
                .includes(query) ||
              industry.focus.some(
                (item) =>
                  item
                    .toLowerCase()
                    .includes(
                      query,
                    ),
              )
            );
          },
        );

      if (
        sortBy === "name"
      ) {
        result.sort(
          (a, b) =>
            a.name.localeCompare(
              b.name,
            ),
        );
      }

      return result;
    }, [
      industries,
      search,
      sortBy,
    ]);

  const openAddForm =
    () => {
      setEditingId(null);
      setForm({
        name: "",
        description: "",
        focus: [""],
        imageUrl: "",
      });
      setError("");
      setShowForm(true);
    };

  const openEditForm =
    (industry: Industry) => {
      setEditingId(
        industry.id,
      );

      setForm({
        name: industry.name,
        description:
          industry.description,
        focus:
          industry.focus.length >
          0
            ? [
                ...industry.focus,
              ]
            : [""],
        imageUrl:
          industry.imageUrl ?? "",
      });

      setError("");
      setShowForm(true);
    };

  const closeForm =
    () => {
      if (saving) {
        return;
      }

      setShowForm(false);
      setEditingId(null);
      setForm({
        name: "",
        description: "",
        focus: [""],
        imageUrl: "",
      });
      setError("");
    };

  const updateFocus =
    (
      index: number,
      value: string,
    ) => {
      setForm(
        (current) => {
          const focus = [
            ...current.focus,
          ];

          focus[index] =
            value;

          return {
            ...current,
            focus,
          };
        },
      );
    };

  const addFocus =
    () => {
      setForm(
        (current) => ({
          ...current,
          focus: [
            ...current.focus,
            "",
          ],
        }),
      );
    };

  const removeFocus =
    (index: number) => {
      setForm(
        (current) => {
          const focus =
            current.focus.filter(
              (
                _,
                itemIndex,
              ) =>
                itemIndex !==
                index,
            );

          return {
            ...current,
            focus:
              focus.length > 0
                ? focus
                : [""],
          };
        },
      );
    };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError("Please choose an image smaller than 3 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setForm((current) => ({
        ...current,
        imageUrl:
          typeof reader.result === "string"
            ? reader.result
            : current.imageUrl,
      }));
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const saveIndustry =
    async () => {
      const name =
        form.name.trim();

      const description =
        form.description.trim();

      const focus =
        form.focus
          .map(
            (item) =>
              item.trim(),
          )
          .filter(Boolean);

      if (!name) {
        setError(
          "Please enter the industry name.",
        );
        return;
      }

      if (!description) {
        setError(
          "Please enter the description.",
        );
        return;
      }

      if (focus.length === 0) {
        setError(
          "Please add at least one Key Focus Area.",
        );
        return;
      }

      setSaving(true);
      setError("");

      try {
        const payload = {
          name,
          description,
          focus,
          imageUrl: form.imageUrl || null,
        };

        const response =
          await fetch(
            "/api/admin/content/industries",
            {
              method:
                editingId
                  ? "PATCH"
                  : "POST",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify(
                editingId
                  ? {
                      id: editingId,
                      ...payload,
                    }
                  : {
                      id: crypto.randomUUID(),
                      ...payload,
                    },
              ),
            },
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ??
              "Unable to save industry",
          );
        }

        /*
         * Reload Admin from MongoDB.
         */
        await loadIndustries();

        /*
         * Tell Website to reload too.
         */
        notifyIndustryUpdate();

        closeForm();
      } catch (saveError) {
        console.error(
          "Failed to save industry:",
          saveError,
        );

        setError(
          saveError instanceof Error
            ? saveError.message
            : "Unable to save industry",
        );
      } finally {
        setSaving(false);
      }
    };

  const deleteIndustry =
    async (
      industry: Industry,
    ) => {
      const confirmed =
        window.confirm(
          `Delete "${industry.name}"?\n\nThis action cannot be undone.`,
        );

      if (!confirmed) {
        return;
      }

      try {
        const response =
          await fetch(
            "/api/admin/content/industries",
            {
              method: "DELETE",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body: JSON.stringify({
                id: industry.id,
              }),
            },
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.error ??
              "Unable to delete industry",
          );
        }

        setIndustries(
          (current) =>
            current.filter(
              (item) =>
                item.id !==
                industry.id,
            ),
        );

        /*
         * Tell Website to reload.
         */
        notifyIndustryUpdate();
      } catch (deleteError) {
        console.error(
          "Failed to delete industry:",
          deleteError,
        );

        window.alert(
          deleteError instanceof Error
            ? deleteError.message
            : "Unable to delete industry",
        );
      }
    };

  return (
    <div className="space-y-6 lg:space-y-8">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">
            Industries Management
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Add, edit, and delete industries displayed on the website.
          </p>
        </div>

        <button
          type="button"
          onClick={
            openAddForm
          }
          className="admin-btn-primary h-10 px-4"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add New Industry
        </button>
      </div>

      {/* SEARCH */}
      <div className="admin-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="text"
            value={search}
            onChange={(
              event,
            ) =>
              setSearch(
                event.target
                  .value,
              )
            }
            placeholder="Search industries..."
            className="w-full rounded-lg border border-border bg-secondary/50 py-2.5 pl-10 pr-10 text-sm outline-none transition focus:border-primary"
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
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <div className="relative w-full sm:w-48">
          <select
            value={sortBy}
            onChange={(
              event,
            ) =>
              setSortBy(
                event.target
                  .value,
              )
            }
            className="w-full appearance-none rounded-lg border border-border bg-secondary/50 py-2.5 pl-3 pr-9 text-sm outline-none focus:border-primary"
          >
            <option value="">
              Sort By
            </option>

            <option value="name">
              Name (A-Z)
            </option>
          </select>

          <Filter className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        </div>
      </div>

      {/* RESULT COUNT */}
      {!loading && (
        <div className="text-sm text-muted-foreground">
          Showing{" "}
          <span className="font-semibold text-foreground">
            {
              filteredIndustries.length
            }
          </span>{" "}
          of{" "}
          <span className="font-semibold text-foreground">
            {
              industries.length
            }
          </span>{" "}
          industries
        </div>
      )}

      {/* LOADING */}
      {loading && (
        <div className="admin-card p-12 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />

          <p className="mt-4 text-sm text-muted-foreground">
            Loading industries...
          </p>
        </div>
      )}

      {/* ERROR */}
      {!loading &&
        error &&
        !showForm && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

      {/* GRID */}
      {!loading &&
        filteredIndustries.length >
          0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredIndustries.map(
              (industry) => (
                <div
                  key={
                    industry.id
                  }
                  className="group flex h-full flex-col rounded-3xl border border-border bg-background p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-primary/50 hover:shadow-elegant"
                >
                  {/* ICON + NAME */}
                  <div className="flex items-start gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl gradient-primary text-primary-foreground shadow-elegant transition-transform group-hover:scale-105">
                      <Building2 className="h-7 w-7" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="text-xl font-bold text-foreground">
                        {
                          industry.name
                        }
                      </h3>
                    </div>
                  </div>

                  {industry.imageUrl && (
                    <img
                      src={industry.imageUrl}
                      alt=""
                      className="mt-5 h-36 w-full rounded-2xl object-cover"
                    />
                  )}

                  {/* DESCRIPTION */}
                  <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                    {
                      industry.description
                    }
                  </p>

                  {/* FOCUS */}
                  <div className="mt-6 flex-grow">
                    <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
                      Key Focus Areas
                    </h4>

                    <ul className="space-y-2">
                      {industry.focus.map(
                        (
                          item,
                          index,
                        ) => (
                          <li
                            key={`${industry.id}-${index}-${item}`}
                            className="flex items-start gap-2"
                          >
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />

                            <span className="text-sm text-muted-foreground">
                              {item}
                            </span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>

                  {/* ADMIN-ONLY ACTIONS */}
                  <div className="mt-6 flex gap-2 border-t border-border/50 pt-5">
                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(
                          industry,
                        )
                      }
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm font-semibold text-foreground transition hover:bg-secondary"
                    >
                      <Pencil className="h-4 w-4" />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        deleteIndustry(
                          industry,
                        )
                      }
                      className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-red-500/10 px-3 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              ),
            )}
          </div>
        )}

      {/* EMPTY */}
      {!loading &&
        filteredIndustries.length ===
          0 && (
          <div className="admin-card p-12 text-center">
            <Building2 className="mx-auto h-10 w-10 text-muted-foreground" />

            <h3 className="mt-4 text-lg font-semibold text-foreground">
              No industries found
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Try a different search or add
              a new industry.
            </p>
          </div>
        )}

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-border bg-background shadow-2xl">
            {/* HEADER */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-background px-6 py-5">
              <div>
                <h3 className="font-display text-xl font-bold text-foreground">
                  {editingId
                    ? "Edit Industry"
                    : "Add New Industry"}
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Add the industry information displayed on the website.
                </p>
              </div>

              <button
                type="button"
                onClick={
                  closeForm
                }
                className="rounded-lg p-2 transition hover:bg-secondary"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* FORM */}
            <div className="space-y-6 p-6">
              {/* INDUSTRY NAME */}
              <div>
                <label
                  htmlFor="industry-name"
                  className="admin-label"
                >
                  Industry Name
                </label>

                <input
                  id="industry-name"
                  type="text"
                  value={
                    form.name
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,
                        name: event.target
                          .value,
                      }),
                    )
                  }
                  placeholder="e.g. Manufacturing"
                  maxLength={120}
                  className="admin-input mt-1.5"
                />
              </div>

              {/* DESCRIPTION */}
              <div>
                <label
                  htmlFor="industry-description"
                  className="admin-label"
                >
                  Description
                </label>

                <textarea
                  id="industry-description"
                  value={
                    form.description
                  }
                  onChange={(
                    event,
                  ) =>
                    setForm(
                      (
                        current,
                      ) => ({
                        ...current,
                        description:
                          event
                            .target
                            .value,
                      }),
                    )
                  }
                  placeholder="Describe how Almawa Services supports this industry..."
                  rows={5}
                  maxLength={500}
                  className="admin-input mt-1.5 resize-none"
                />

                <p className="mt-1 text-right text-xs text-muted-foreground">
                  {
                    form
                      .description
                      .length
                  }
                  /500
                </p>
              </div>

              {/* INDUSTRY IMAGE */}
              <div>
                <label
                  htmlFor="industry-image"
                  className="admin-label"
                >
                  Industry Image
                </label>

                <div className="mt-1.5 flex flex-col gap-3 sm:flex-row sm:items-start">
                  <label
                    htmlFor="industry-image"
                    className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-border bg-secondary/50 px-4 py-3 text-sm font-semibold text-foreground transition hover:border-primary hover:bg-primary/5"
                  >
                    <ImagePlus className="h-4 w-4" />
                    Choose Image
                  </label>

                  <input
                    id="industry-image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="sr-only"
                  />

                  {form.imageUrl && (
                    <div className="relative h-24 w-36 overflow-hidden rounded-xl border border-border">
                      <img
                        src={form.imageUrl}
                        alt="Industry preview"
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setForm((current) => ({
                            ...current,
                            imageUrl: "",
                          }))
                        }
                        className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white transition hover:bg-black"
                        aria-label="Remove industry image"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  JPG, PNG, or WebP. Maximum file size: 3 MB.
                </p>
              </div>

              {/* KEY FOCUS AREAS */}
              <div>
                <div className="flex items-center justify-between">
                  <label className="admin-label">
                    Key Focus Areas
                  </label>

                  <button
                    type="button"
                    onClick={
                      addFocus
                    }
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-xs font-semibold text-primary transition hover:bg-primary/20"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Focus Area
                  </button>
                </div>

                <div className="mt-3 space-y-3">
                  {form.focus.map(
                    (
                      focus,
                      index,
                    ) => (
                      <div
                        key={
                          index
                        }
                        className="flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={
                            focus
                          }
                          onChange={(
                            event,
                          ) =>
                            updateFocus(
                              index,
                              event
                                .target
                                .value,
                            )
                          }
                          placeholder={`Focus area ${index + 1}`}
                          className="admin-input flex-1"
                        />

                        <button
                          type="button"
                          onClick={() =>
                            removeFocus(
                              index,
                            )
                          }
                          className="rounded-lg p-2.5 text-muted-foreground transition hover:bg-red-500/10 hover:text-red-600"
                          aria-label="Remove focus area"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* ERROR */}
              {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {
                    error
                  }
                </div>
              )}

              {/* BUTTONS */}
              <div className="flex justify-end gap-3 border-t border-border pt-5">
                <button
                  type="button"
                  onClick={
                    closeForm
                  }
                  disabled={
                    saving
                  }
                  className="admin-btn-secondary"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={
                    saveIndustry
                  }
                  disabled={
                    saving
                  }
                  className="admin-btn-primary min-w-32"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Save Changes"
                      : "Add Industry"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}