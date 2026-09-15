"use client";

import { FileText, Pencil, Plus, Trash2 } from "lucide-react";
import { useState } from "react";

import { useApp, type Blog } from "@/context/AppContext";

const EMPTY_BLOG: Blog = {
  id: "",
  slug: "",
  title: "",
  excerpt: "",
  content: "",
  category: "",
  author: "Almawa Editorial",
  date: new Date().toISOString().slice(0, 10),
  image: "",
};

function formatDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : `${String(date.getUTCDate()).padStart(2, "0")}/${String(
        date.getUTCMonth() + 1,
      ).padStart(2, "0")}/${date.getUTCFullYear()}`;
}

export default function AdminBlogPage() {
  const { blogs, upsertBlog, deleteBlog } = useApp();
  const [editing, setEditing] = useState<Blog | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const saveBlog = () => {
    if (!editing?.title.trim()) {
      return;
    }

    const title = editing.title.trim();
    const slug =
      editing.slug.trim() ||
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

    upsertBlog({
      ...editing,
      id: editing.id || crypto.randomUUID(),
      title,
      slug,
      date: editing.date || new Date().toISOString().slice(0, 10),
    });
    setEditing(null);
  };

  if (editing) {
    return (
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-display">
              {editing.id ? "Edit Blog Post" : "New Blog Post"}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Create and manage your published content.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEditing(null)}
            className="admin-btn-secondary"
          >
            Cancel
          </button>
        </div>

        <div className="admin-card space-y-5">
          <div>
            <label className="admin-label" htmlFor="blog-title">Title</label>
            <input
              id="blog-title"
              className="admin-input mt-1.5"
              value={editing.title}
              onChange={(event) => setEditing({ ...editing, title: event.target.value })}
              placeholder="Blog post title"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="admin-label" htmlFor="blog-category">Category</label>
              <input
                id="blog-category"
                className="admin-input mt-1.5"
                value={editing.category}
                onChange={(event) => setEditing({ ...editing, category: event.target.value })}
                placeholder="Category"
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="blog-author">Author</label>
              <input
                id="blog-author"
                className="admin-input mt-1.5"
                value={editing.author}
                onChange={(event) => setEditing({ ...editing, author: event.target.value })}
              />
            </div>
            <div>
              <label className="admin-label" htmlFor="blog-date">Date</label>
              <input
                id="blog-date"
                type="date"
                className="admin-input mt-1.5"
                value={editing.date}
                onChange={(event) => setEditing({ ...editing, date: event.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="admin-label" htmlFor="blog-excerpt">Excerpt</label>
            <textarea
              id="blog-excerpt"
              rows={3}
              className="admin-input mt-1.5 resize-none"
              value={editing.excerpt}
              onChange={(event) => setEditing({ ...editing, excerpt: event.target.value })}
              placeholder="Short summary"
            />
          </div>

          <div>
            <label className="admin-label" htmlFor="blog-content">Content</label>
            <textarea
              id="blog-content"
              rows={10}
              className="admin-input mt-1.5 resize-y"
              value={editing.content}
              onChange={(event) => setEditing({ ...editing, content: event.target.value })}
              placeholder="Full blog post content"
            />
          </div>

          <div className="flex justify-end border-t border-border pt-4">
            <button
              type="button"
              onClick={saveBlog}
              disabled={!editing.title.trim()}
              className="admin-btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              {editing.id ? "Save Changes" : "Publish Post"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display">Blog Management</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, edit, and publish articles for your website.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing({ ...EMPTY_BLOG })}
          className="admin-btn-primary"
        >
          <Plus className="mr-1 h-4 w-4" />
          New Post
        </button>
      </div>

      {blogs.length === 0 ? (
        <div className="admin-card py-16 text-center">
          <FileText className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
          <p className="font-semibold">No blog posts yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Create your first article to share it with visitors.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article key={blog.id} className="admin-card flex flex-col">
              <div className="flex items-start justify-between gap-3">
                <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                  {blog.category || "General"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatDate(blog.date)}
                </span>
              </div>
              <h3 className="mt-4 line-clamp-2 font-bold font-display">
                {blog.title}
              </h3>
              <p className="mt-2 line-clamp-3 flex-1 text-sm text-muted-foreground">
                {blog.excerpt || blog.content || "No excerpt provided."}
              </p>
              <div className="mt-5 flex justify-end gap-2 border-t border-border pt-4">
                <button
                  type="button"
                  onClick={() => setEditing({ ...blog })}
                  className="rounded-md p-2 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                  title="Edit post"
                  aria-label={`Edit ${blog.title}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(blog.id)}
                  className="rounded-md p-2 text-red-600 transition hover:bg-red-500/10"
                  title="Delete post"
                  aria-label={`Delete ${blog.title}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {confirmDelete && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-2xl">
            <h3 className="font-bold font-display">Delete blog post?</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmDelete(null)}
                className="admin-btn-secondary"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  deleteBlog(confirmDelete);
                  setConfirmDelete(null);
                }}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
