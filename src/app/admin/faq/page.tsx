"use client";

import { HelpCircle, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { faqs } from "@/mock/data";

type Faq = {
  id: string;
  q: string;
  a: string;
};

export default function AdminFaqPage() {
  const [items, setItems] = useState<Faq[]>(
    faqs.map((faq, index) => ({ ...faq, id: `seed-${index}` })),
  );
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Faq | null>(null);

  useEffect(() => {
    const loadFaqs = async () => {
      try {
        const response = await fetch("/api/admin/content/faqs");
        if (!response.ok) return;

        const backendFaqs = await response.json();
        if (Array.isArray(backendFaqs) && backendFaqs.length > 0) {
          setItems((current) => {
            const backendByQuestion = new Map(
              backendFaqs.map((faq: Faq) => [faq.q, faq]),
            );
            const currentQuestions = new Set(current.map((faq) => faq.q));
            const merged = current.map(
              (faq) => backendByQuestion.get(faq.q) ?? faq,
            );
            const additions = backendFaqs.filter(
              (faq: Faq) => !currentQuestions.has(faq.q),
            );

            return [...additions, ...merged];
          });
        }
      } catch (error) {
        console.error("Failed to load FAQs from backend:", error);
      }
    };

    void loadFaqs();
  }, []);

  const filteredFaqs = useMemo(() => {
    const query = search.trim().toLowerCase();

    return items.filter((faq) => {
      const matchesSearch =
        !query ||
        faq.q.toLowerCase().includes(query) ||
        faq.a.toLowerCase().includes(query);
      return matchesSearch;
    });
  }, [items, search]);

  const saveFaq = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const currentEditing = editing;
    if (!currentEditing || !currentEditing.q.trim() || !currentEditing.a.trim()) {
      return;
    }

    const faq = {
      ...currentEditing,
      q: currentEditing.q.trim(),
      a: currentEditing.a.trim(),
    };
    const isNew = faq.id.startsWith("new-");

    try {
      const response = await fetch("/api/admin/content/faqs", {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faq),
      });

      if (!response.ok) throw new Error("FAQ save failed");
      setItems((current) =>
        isNew
          ? [faq, ...current]
          : current.map((item) => (item.id === faq.id ? faq : item)),
      );
      setEditing(null);
    } catch (error) {
      console.error("Failed to save FAQ:", error);
    }
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold font-display">
            FAQ Management
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Review the frequently asked questions shown on your website.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setEditing({ id: `new-${Date.now()}`, q: "", a: "" })}
          className="admin-btn-primary"
        >
          <Plus className="mr-1 h-4 w-4" />
          Add FAQ
        </button>
      </div>

      <div className="admin-card flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search FAQs..."
            className="admin-input pl-10"
          />
        </div>

      </div>

      {filteredFaqs.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredFaqs.map((faq) => (
            <article key={faq.id} className="admin-card">
              <div className="flex items-start gap-3">
                <HelpCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#ff5a1f]" />
                <div>
                  <h3 className="mt-2 font-semibold">{faq.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {faq.a || "Answer pending administrator review."}
                  </p>
                  <div className="mt-4 flex justify-end gap-2 border-t border-border pt-3">
                    <button
                      type="button"
                      onClick={() => setEditing({ ...faq })}
                      className="rounded-md p-2 text-muted-foreground hover:bg-secondary"
                      aria-label={`Edit ${faq.q}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await fetch("/api/admin/content/faqs", {
                          method: "DELETE",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ id: faq.id }),
                        });
                        setItems((current) =>
                          current.filter((item) => item.id !== faq.id),
                        );
                      }}
                      className="rounded-md p-2 text-red-600 hover:bg-red-500/10"
                      aria-label={`Delete ${faq.q}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="admin-card py-16 text-center text-sm text-muted-foreground">
          No FAQs found.
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4">
          <form
            onSubmit={saveFaq}
            className="w-full max-w-lg space-y-4 rounded-2xl border border-border bg-background p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-display">
                {editing.id.startsWith("new-") ? "Add FAQ" : "Edit FAQ"}
              </h3>
              <button type="button" onClick={() => setEditing(null)} aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </div>
            <label className="admin-label">
              Question
              <input
                required
                value={editing.q}
                onChange={(event) => setEditing({ ...editing, q: event.target.value })}
                className="admin-input mt-1.5"
              />
            </label>
            <label className="admin-label">
              Answer
              <textarea
                required
                rows={5}
                value={editing.a}
                onChange={(event) => setEditing({ ...editing, a: event.target.value })}
                className="admin-input mt-1.5 resize-none"
              />
            </label>
            <div className="flex justify-end gap-2 border-t border-border pt-4">
              <button type="button" onClick={() => setEditing(null)} className="admin-btn-secondary">
                Cancel
              </button>
              <button type="submit" className="admin-btn-primary">
                Save FAQ
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
