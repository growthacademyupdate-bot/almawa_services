"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import "react-quill-new/dist/quill.snow.css";

// Dynamic import for ReactQuill to prevent SSR issues
const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
  loading: () => <div className="h-40 bg-secondary/50 rounded-lg animate-pulse" />,
});

const formSchema = z.object({
  name: z.string().min(1, "Service name is required."),
  slug: z.string().min(1, "Slug is required."),
  shortDescription: z.string().min(1, "Short description is required.").max(250, "Maximum 250 characters."),
  content: z.string().min(1, "Service content is required."),
  icon: z.string().optional(),
  image: z.string().optional(),
  category: z.string().min(1, "Category is required."),
  status: z.enum(["Active", "Inactive"]),
  displayOrder: z.coerce.number().min(0, "Must be a valid number"),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ICONS = [
  "Briefcase",
  "Chart",
  "Target",
  "Settings",
  "Users",
  "Lightbulb",
  "Globe",
  "TrendingUp",
];

const CATEGORIES = [
  "Business Consulting",
  "Strategy",
  "Digital Transformation",
  "Technology",
  "Operations",
  "Business Growth",
  "Process Optimization",
];

interface ServiceFormProps {
  initialData?: FormValues & { _id?: string };
  isEdit?: boolean;
}

export function ServiceForm({ initialData, isEdit }: ServiceFormProps) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      slug: "",
      shortDescription: "",
      content: "",
      icon: "Briefcase",
      image: "",
      category: "",
      status: "Active",
      displayOrder: 1,
      seoTitle: "",
      seoDescription: "",
      seoKeywords: "",
    },
  });

  const { watch, setValue } = form;
  const name = watch("name");

  // Auto-generate slug when name changes (only in create mode and if user hasn't manually edited slug heavily)
  useEffect(() => {
    if (!isEdit && name) {
      const generatedSlug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      
      // Only update if it's currently empty or strictly matches the previous auto-generation
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [name, isEdit, setValue]);

  const onSubmit = async (data: FormValues, publish: boolean = false) => {
    setIsSaving(true);
    setErrorMsg("");

    const payload = {
      ...data,
      status: publish ? "Active" : data.status,
    };

    try {
      const url = isEdit && initialData?._id ? `/api/services/${initialData._id}` : `/api/services`;
      const method = isEdit ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to save service");
      }

      // Success
      alert("Service saved successfully!"); // Simple alert for demo, better to use toast
      router.push("/admin/services");
      router.refresh();
    } catch (error: any) {
      setErrorMsg(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["blockquote", "link", "image"],
      ["clean"],
    ],
  };

  return (
    <form className="space-y-8 pb-10" onSubmit={form.handleSubmit((d) => onSubmit(d, false))}>
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg text-sm border border-red-200">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="admin-card p-6 space-y-6">
            <h3 className="text-lg font-bold font-display border-b border-border pb-4">Service Information</h3>
            
            <div className="space-y-4">
              <div>
                <label className="admin-label">Service Name *</label>
                <input
                  type="text"
                  placeholder="Enter service name"
                  className="admin-input mt-1.5"
                  {...form.register("name")}
                />
                {form.formState.errors.name && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>

              <div>
                <label className="admin-label">Slug *</label>
                <input
                  type="text"
                  placeholder="business-strategy"
                  className="admin-input mt-1.5"
                  {...form.register("slug")}
                />
                {form.formState.errors.slug && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.slug.message}</p>
                )}
              </div>

              <div>
                <label className="admin-label">
                  Short Description * 
                  <span className="text-xs text-muted-foreground ml-2">
                    ({form.watch("shortDescription")?.length || 0}/250)
                  </span>
                </label>
                <textarea
                  placeholder="Enter a short description of this service"
                  className="admin-input mt-1.5 min-h-[80px]"
                  maxLength={250}
                  {...form.register("shortDescription")}
                />
                {form.formState.errors.shortDescription && (
                  <p className="text-red-500 text-xs mt-1">{form.formState.errors.shortDescription.message}</p>
                )}
              </div>
            </div>
          </div>

          <div className="admin-card p-6 space-y-6">
            <h3 className="text-lg font-bold font-display border-b border-border pb-4">Service Content *</h3>
            <div className="prose-container max-w-none">
              <Controller
                name="content"
                control={form.control}
                render={({ field }) => (
                  <ReactQuill
                    theme="snow"
                    value={field.value}
                    onChange={field.onChange}
                    modules={quillModules}
                    className="bg-background rounded-lg border-border"
                  />
                )}
              />
              {form.formState.errors.content && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.content.message}</p>
              )}
            </div>
          </div>
          
          <div className="admin-card p-6 space-y-4">
            <h3 className="text-lg font-bold font-display border-b border-border pb-4">SEO Settings (Optional)</h3>
            
            <div>
              <label className="admin-label">SEO Title</label>
              <input type="text" className="admin-input mt-1.5" {...form.register("seoTitle")} />
            </div>
            
            <div>
              <label className="admin-label">SEO Description</label>
              <textarea className="admin-input mt-1.5 min-h-[80px]" {...form.register("seoDescription")} />
            </div>
            
            <div>
              <label className="admin-label">SEO Keywords</label>
              <input type="text" placeholder="consulting, strategy, business" className="admin-input mt-1.5" {...form.register("seoKeywords")} />
            </div>
          </div>
        </div>

        {/* Right Column - Meta & Media */}
        <div className="space-y-6">
          <div className="admin-card p-6 space-y-6">
            <h3 className="text-lg font-bold font-display border-b border-border pb-4">Organization & Status</h3>
            
            <div>
              <label className="admin-label">Status *</label>
              <select className="admin-input mt-1.5" {...form.register("status")}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            
            <div>
              <label className="admin-label">Category *</label>
              <select className="admin-input mt-1.5" {...form.register("category")}>
                <option value="">Select a category</option>
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              {form.formState.errors.category && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="admin-label">Display Order</label>
              <input
                type="number"
                placeholder="1"
                className="admin-input mt-1.5"
                {...form.register("displayOrder")}
              />
              {form.formState.errors.displayOrder && (
                <p className="text-red-500 text-xs mt-1">{form.formState.errors.displayOrder.message}</p>
              )}
            </div>
          </div>

          <div className="admin-card p-6 space-y-6">
            <h3 className="text-lg font-bold font-display border-b border-border pb-4">Media</h3>
            
            <div>
              <label className="admin-label">Service Icon</label>
              <select className="admin-input mt-1.5" {...form.register("icon")}>
                {ICONS.map(icon => (
                  <option key={icon} value={icon}>{icon}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="admin-label">Service Image URL</label>
              <input
                type="text"
                placeholder="https://..."
                className="admin-input mt-1.5 mb-2"
                {...form.register("image")}
              />
              {form.watch("image") && (
                <div className="mt-2 relative aspect-video rounded-lg overflow-hidden border border-border bg-secondary/20">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.watch("image")} alt="Preview" className="object-cover w-full h-full" />
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                Paste an image URL (e.g., from Cloudinary).
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 fixed bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur border-t border-border z-10 lg:pl-64">
        <button
          type="button"
          onClick={() => router.push("/admin/services")}
          className="admin-btn-secondary"
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="admin-btn-secondary bg-white text-black"
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Service"}
        </button>
        <button
          type="button"
          onClick={form.handleSubmit((d) => onSubmit(d, true))}
          className="admin-btn-primary"
          disabled={isSaving}
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          Save & Publish
        </button>
      </div>
    </form>
  );
}
