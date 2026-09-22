"use client";

import {
  ArrowLeft,
  Bold,
  Heading1,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Loader2,
  Redo2,
  Save,
  Underline,
  Undo2,
  Upload,
  X,
} from "lucide-react";

import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  useRouter,
} from "next/navigation";

import { toast } from "sonner";

import {
  SERVICE_CATEGORIES,
  type ServiceFormData,
} from "@/types/service";

const ICONS = [
  "Briefcase",
  "BarChart3",
  "Target",
  "Settings",
  "Users",
  "Lightbulb",
  "Globe",
  "TrendingUp",
];

const EMPTY_FORM: ServiceFormData = {
  name: "",
  slug: "",
  shortDescription: "",
  content: "",
  icon: "Briefcase",
  image: "",
  category: "",
  status: "active",
  displayOrder: 1,
  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function insertCommand(
  command: string,
  value?: string,
) {
  document.execCommand(
    command,
    false,
    value,
  );
}

export default function NewServicePage() {
  const router = useRouter();

  const editorRef =
    useRef<HTMLDivElement>(null);

  const [form, setForm] =
    useState<ServiceFormData>(
      EMPTY_FORM,
    );

  const [
    slugManuallyEdited,
    setSlugManuallyEdited,
  ] = useState(false);

  const [
    seoOpen,
    setSeoOpen,
  ] = useState(false);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    imageUploading,
    setImageUploading,
  ] = useState(false);

  const [
    errors,
    setErrors,
  ] = useState<
    Record<string, string>
  >({});

  useEffect(() => {
    if (
      editorRef.current &&
      editorRef.current.innerHTML !==
        form.content
    ) {
      editorRef.current.innerHTML =
        form.content;
    }
  }, [form.content]);

  const updateField = <
    K extends keyof ServiceFormData,
  >(
    field: K,
    value: ServiceFormData[K],
  ) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      const next = {
        ...current,
      };

      delete next[field];

      return next;
    });
  };

  const handleNameChange = (
    value: string,
  ) => {
    updateField(
      "name",
      value,
    );

    if (!slugManuallyEdited) {
      updateField(
        "slug",
        slugify(value),
      );
    }
  };

  const handleSlugChange = (
    value: string,
  ) => {
    setSlugManuallyEdited(true);

    updateField(
      "slug",
      slugify(value),
    );
  };

  const updateContent = () => {
    const html =
      editorRef.current?.innerHTML ??
      "";

    updateField(
      "content",
      html,
    );
  };

  const validate = () => {
    const nextErrors: Record<
      string,
      string
    > = {};

    if (!form.name.trim()) {
      nextErrors.name =
        "Service name is required.";
    }

    if (!form.slug.trim()) {
      nextErrors.slug =
        "Slug is required.";
    }

    if (
      !form.shortDescription.trim()
    ) {
      nextErrors.shortDescription =
        "Short description is required.";
    }

    if (
      form.shortDescription.length >
      250
    ) {
      nextErrors.shortDescription =
        "Maximum 250 characters allowed.";
    }

    if (
      !form.content
        .replace(
          /<[^>]*>/g,
          "",
        )
        .trim()
    ) {
      nextErrors.content =
        "Service content is required.";
    }

    if (!form.category) {
      nextErrors.category =
        "Category is required.";
    }

    if (
      !Number.isFinite(
        Number(form.displayOrder),
      )
    ) {
      nextErrors.displayOrder =
        "Display order must be a valid number.";
    }

    setErrors(
      nextErrors,
    );

    return (
      Object.keys(
        nextErrors,
      ).length === 0
    );
  };

  const uploadServiceImage = async (
    file: File,
  ) => {
    setImageUploading(true);

    try {
      /*
       * No separate image library is introduced here.
       * The selected image is stored as a data URL.
       * When your existing project has Cloudinary wiring,
       * replace this function with that existing uploader.
       */
      const reader =
        new FileReader();

      reader.onload =
        () => {
          const result =
            String(
              reader.result ??
                "",
            );

          updateField(
            "image",
            result,
          );

          setImageUploading(
            false,
          );
        };

      reader.onerror = () => {
        setImageUploading(
          false,
        );

        toast.error(
          "Failed to read image.",
        );
      };

      reader.readAsDataURL(
        file,
      );
    } catch {
      setImageUploading(false);

      toast.error(
        "Failed to upload image.",
      );
    }
  };

  const saveService = async (
    publish: boolean,
  ) => {
    if (saving) {
      return;
    }

    updateContent();

    const isValid =
      validate();

    if (!isValid) {
      toast.error(
        "Please fix the highlighted fields.",
      );
      return;
    }

    setSaving(true);

    try {
      const response =
        await fetch(
          "/api/admin/services",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              ...form,
              status: publish
                ? "active"
                : form.status,
            }),
          },
        );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error ??
            "Failed to create service.",
        );
      }

      toast.success(
        "Service created successfully.",
      );

      router.push(
        "/admin/services",
      );
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create service.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6 pb-10">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/services",
              )
            }
            className="mb-3 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </button>

          <h1 className="font-display text-2xl font-bold">
            Add Service
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Create a new service for your Almawa Services website.
          </p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.5fr)_360px]">
        {/* LEFT */}
        <div className="space-y-6">
          {/* SERVICE INFORMATION */}
          <section className="admin-card">
            <SectionTitle
              title="Service Information"
              description="Basic information about this service."
            />

            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Service Name"
                required
                value={form.name}
                placeholder="Enter service name"
                error={
                  errors.name
                }
                onChange={
                  handleNameChange
                }
              />

              <Field
                label="Slug"
                required
                value={form.slug}
                placeholder="business-strategy-consulting"
                error={
                  errors.slug
                }
                onChange={
                  handleSlugChange
                }
              />

              <div className="sm:col-span-2">
                <label className="admin-label">
                  Short Description
                  <span className="ml-1 text-[#ff5a1f]">
                    *
                  </span>
                </label>

                <textarea
                  value={
                    form.shortDescription
                  }
                  onChange={(event) =>
                    updateField(
                      "shortDescription",
                      event.target.value.slice(
                        0,
                        250,
                      ),
                    )
                  }
                  placeholder="Enter a short description of this service"
                  rows={4}
                  className="admin-input min-h-[120px] resize-y"
                />

                <div className="mt-1 flex justify-between">
                  <ErrorText
                    value={
                      errors.shortDescription
                    }
                  />

                  <span className="text-xs text-muted-foreground">
                    {
                      form
                        .shortDescription
                        .length
                    }
                    /250
                  </span>
                </div>
              </div>
            </div>
          </section>

          {/* CONTENT */}
          <section className="admin-card">
            <SectionTitle
              title="Content"
              description="Write the full service content that will appear on the public page."
            />

            <label className="admin-label">
              Service Content
              <span className="ml-1 text-[#ff5a1f]">
                *
              </span>
            </label>

            <div className="overflow-hidden rounded-xl border border-border">
              <EditorToolbar />

              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={
                  updateContent
                }
                className="min-h-[380px] bg-background p-5 text-sm leading-7 outline-none"
                data-placeholder="Write your service content..."
              />
            </div>

            <ErrorText
              value={errors.content}
            />
          </section>

          {/* SEO */}
          <section className="admin-card">
            <button
              type="button"
              onClick={() =>
                setSeoOpen(
                  (current) =>
                    !current,
                )
              }
              className="flex w-full items-center justify-between text-left"
            >
              <div>
                <h2 className="text-base font-bold">
                  SEO Settings
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Optional search engine information.
                </p>
              </div>

              <span className="text-xl text-muted-foreground">
                {seoOpen
                  ? "−"
                  : "+"}
              </span>
            </button>

            {seoOpen && (
              <div className="mt-5 grid gap-5">
                <Field
                  label="SEO Title"
                  value={
                    form.seoTitle
                  }
                  placeholder="Service SEO title"
                  onChange={(
                    value,
                  ) =>
                    updateField(
                      "seoTitle",
                      value,
                    )
                  }
                />

                <div>
                  <label className="admin-label">
                    SEO Description
                  </label>

                  <textarea
                    value={
                      form.seoDescription
                    }
                    onChange={(
                      event,
                    ) =>
                      updateField(
                        "seoDescription",
                        event.target
                          .value,
                      )
                    }
                    rows={4}
                    className="admin-input resize-y"
                    placeholder="SEO description"
                  />
                </div>

                <Field
                  label="SEO Keywords"
                  value={
                    form.seoKeywords
                  }
                  placeholder="consulting, strategy, business"
                  onChange={(
                    value,
                  ) =>
                    updateField(
                      "seoKeywords",
                      value,
                    )
                  }
                />
              </div>
            )}
          </section>
        </div>

        {/* RIGHT */}
        <div className="space-y-6">
          {/* IMAGE */}
          <section className="admin-card">
            <SectionTitle
              title="Media"
              description="Upload the image used on this service."
            />

            <div
              className={`image-upload-zone ${
                form.image
                  ? "has-image"
                  : ""
              }`}
            >
              {form.image ? (
                <div className="relative">
                  <img
                    src={form.image}
                    alt="Service preview"
                    className="max-h-[240px] w-full rounded-xl object-cover"
                  />

                  <div className="mt-3 flex gap-2">
                    <label className="admin-btn-secondary flex-1 cursor-pointer justify-center">
                      <Upload className="h-4 w-4" />
                      Replace
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(
                          event,
                        ) => {
                          const file =
                            event.target
                              .files?.[0];

                          if (
                            file
                          ) {
                            void uploadServiceImage(
                              file,
                            );
                          }
                        }}
                      />
                    </label>

                    <button
                      type="button"
                      onClick={() =>
                        updateField(
                          "image",
                          "",
                        )
                      }
                      className="admin-btn-secondary"
                    >
                      <X className="h-4 w-4" />
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <label className="block cursor-pointer">
                  <div className="upload-icon">
                    {imageUploading ? (
                      <Loader2 className="h-6 w-6 animate-spin" />
                    ) : (
                      <ImagePlus className="h-6 w-6" />
                    )}
                  </div>

                  <p className="upload-text">
                    Upload service image
                  </p>

                  <p className="upload-hint">
                    PNG, JPG, WEBP
                  </p>

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={
                      imageUploading
                    }
                    onChange={(
                      event,
                    ) => {
                      const file =
                        event.target
                          .files?.[0];

                      if (
                        file
                      ) {
                        void uploadServiceImage(
                          file,
                        );
                      }
                    }}
                  />
                </label>
              )}
            </div>
          </section>

          {/* ICON */}
          <section className="admin-card">
            <SectionTitle
              title="Service Icon"
              description="Choose an icon already available in the project."
            />

            <div className="grid grid-cols-4 gap-2">
              {ICONS.map(
                (icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() =>
                      updateField(
                        "icon",
                        icon,
                      )
                    }
                    className={`rounded-xl border p-3 text-xs font-semibold transition ${
                      form.icon ===
                      icon
                        ? "border-[#ff5a1f] bg-[#ff5a1f]/10 text-[#ff5a1f]"
                        : "border-border hover:bg-secondary"
                    }`}
                  >
                    {icon}
                  </button>
                ),
              )}
            </div>
          </section>

          {/* CATEGORY STATUS */}
          <section className="admin-card">
            <SectionTitle
              title="Category & Status"
              description="Control service classification and visibility."
            />

            <div className="space-y-5">
              <div>
                <label className="admin-label">
                  Category
                  <span className="ml-1 text-[#ff5a1f]">
                    *
                  </span>
                </label>

                <select
                  value={
                    form.category
                  }
                  onChange={(event) =>
                    updateField(
                      "category",
                      event.target
                        .value as ServiceFormData["category"],
                    )
                  }
                  className="admin-input"
                >
                  <option value="">
                    Select category
                  </option>

                  {SERVICE_CATEGORIES.map(
                    (
                      category,
                    ) => (
                      <option
                        key={
                          category
                        }
                        value={
                          category
                        }
                      >
                        {category}
                      </option>
                    ),
                  )}
                </select>

                <ErrorText
                  value={
                    errors.category
                  }
                />
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
                    updateField(
                      "status",
                      event.target
                        .value as ServiceFormData["status"],
                    )
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

              <div>
                <label className="admin-label">
                  Display Order
                </label>

                <input
                  type="number"
                  min="1"
                  value={
                    form.displayOrder
                  }
                  onChange={(
                    event,
                  ) =>
                    updateField(
                      "displayOrder",
                      Number(
                        event.target
                          .value,
                      ),
                    )
                  }
                  placeholder="1"
                  className="admin-input"
                />

                <ErrorText
                  value={
                    errors.displayOrder
                  }
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ACTIONS */}
      <div className="sticky bottom-4 z-20 flex flex-col-reverse gap-3 rounded-2xl border border-border bg-background/95 p-4 shadow-xl backdrop-blur sm:flex-row sm:justify-end">
        <button
          type="button"
          disabled={saving}
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
            void saveService(false)
          }
          className="admin-btn-secondary"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Service
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={() =>
            void saveService(true)
          }
          className="admin-btn-primary"
        >
          {saving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save & Publish
        </button>
      </div>
    </div>
  );
}

function SectionTitle({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-base font-bold">
        {title}
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function Field({
  label,
  value,
  placeholder,
  required,
  error,
  onChange,
}: {
  label: string;
  value: string;
  placeholder?: string;
  required?: boolean;
  error?: string;
  onChange: (
    value: string,
  ) => void;
}) {
  return (
    <div>
      <label className="admin-label">
        {label}
        {required && (
          <span className="ml-1 text-[#ff5a1f]">
            *
          </span>
        )}
      </label>

      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) =>
          onChange(
            event.target.value,
          )
        }
        className="admin-input"
      />

      <ErrorText
        value={error}
      />
    </div>
  );
}

function ErrorText({
  value,
}: {
  value?: string;
}) {
  if (!value) {
    return null;
  }

  return (
    <p className="mt-1 text-xs font-medium text-red-500">
      {value}
    </p>
  );
}

function EditorToolbar() {
  return (
    <div className="flex flex-wrap gap-1 border-b border-border bg-secondary/40 p-2">
      <ToolbarButton
        title="Bold"
        onClick={() =>
          insertCommand(
            "bold",
          )
        }
      >
        <Bold className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Italic"
        onClick={() =>
          insertCommand(
            "italic",
          )
        }
      >
        <Italic className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Underline"
        onClick={() =>
          insertCommand(
            "underline",
          )
        }
      >
        <Underline className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Heading 1"
        onClick={() =>
          insertCommand(
            "formatBlock",
            "H1",
          )
        }
      >
        <Heading1 className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Heading 2"
        onClick={() =>
          insertCommand(
            "formatBlock",
            "H2",
          )
        }
      >
        <Heading2 className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Heading 3"
        onClick={() =>
          insertCommand(
            "formatBlock",
            "H3",
          )
        }
      >
        <Heading3 className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Bullet list"
        onClick={() =>
          insertCommand(
            "insertUnorderedList",
          )
        }
      >
        <List className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Numbered list"
        onClick={() =>
          insertCommand(
            "insertOrderedList",
          )
        }
      >
        <ListOrdered className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Blockquote"
        onClick={() =>
          insertCommand(
            "formatBlock",
            "BLOCKQUOTE",
          )
        }
      >
        <span className="text-sm font-bold">
          “”
        </span>
      </ToolbarButton>

      <ToolbarButton
        title="Link"
        onClick={() => {
          const url =
            window.prompt(
              "Enter URL",
            );

          if (url) {
            insertCommand(
              "createLink",
              url,
            );
          }
        }}
      >
        <LinkIcon className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Undo"
        onClick={() =>
          insertCommand(
            "undo",
          )
        }
      >
        <Undo2 className="h-4 w-4" />
      </ToolbarButton>

      <ToolbarButton
        title="Redo"
        onClick={() =>
          insertCommand(
            "redo",
          )
        }
      >
        <Redo2 className="h-4 w-4" />
      </ToolbarButton>
    </div>
  );
}

function ToolbarButton({
  title,
  onClick,
  children,
}: {
  title: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={title}
      onMouseDown={(event) =>
        event.preventDefault()
      }
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-md border border-transparent text-muted-foreground hover:border-border hover:bg-background hover:text-foreground"
    >
      {children}
    </button>
  );
}