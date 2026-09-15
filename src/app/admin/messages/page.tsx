"use client";

import { useEffect, useMemo, useState } from "react";
import { Mail, RefreshCw, Search, Trash2 } from "lucide-react";

type ContactMessage = {
  _id: string;
  firstname: string;
  lastname: string;
  email: string;
  mobile: string;
  phone: string;
  country: string;
  subjects: string;
  msg: string;
  status?: string;
  createdAt?: string;
};

export default function MessagesManagementPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadMessages = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/contact", { cache: "no-store" });
      const payload = (await response.json()) as ContactMessage[] | { error?: string };
      if (!response.ok || !Array.isArray(payload)) {
        const errorMessage = !Array.isArray(payload) ? payload.error : undefined;
        throw new Error(errorMessage ?? "Unable to load messages.");
      }
      setMessages(payload);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Unable to load messages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadMessages();
  }, []);

  const filteredMessages = useMemo(() => {
    const query = search.trim().toLowerCase();
    return messages.filter((message) => {
      const matchesSearch = !query || [
        message.firstname,
        message.lastname,
        message.email,
        message.subjects,
        message.country,
        message.msg,
      ].some((value) => value.toLowerCase().includes(query));
      return matchesSearch && (!statusFilter || (message.status ?? "new") === statusFilter);
    });
  }, [messages, search, statusFilter]);

  const deleteMessage = async (id: string) => {
    if (!window.confirm("Delete this contact message?")) return;
    const response = await fetch(`/api/contact?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (response.ok) setMessages((current) => current.filter((message) => message._id !== id));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Contact Messages</h2>
          <p className="mt-1 text-sm text-muted-foreground">Review enquiries submitted from your contact form.</p>
        </div>
        <button type="button" onClick={() => void loadMessages()} className="admin-btn-secondary h-10 px-4" disabled={loading}>
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      <div className="admin-card flex flex-col gap-3 p-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search messages..." className="input pl-10" />
        </div>
        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="input sm:w-44">
          <option value="">All statuses</option>
          <option value="new">New</option>
        </select>
      </div>

      {error && <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}
      {!loading && !error && filteredMessages.length === 0 && (
        <div className="admin-card flex flex-col items-center gap-3 p-12 text-center text-muted-foreground">
          <Mail className="h-8 w-8" />
          <p>No contact messages found.</p>
        </div>
      )}
      <div className="grid gap-4">
        {filteredMessages.map((message) => (
          <article key={message._id} className="admin-card p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div>
                <h3 className="font-display text-lg font-bold">{message.firstname} {message.lastname}</h3>
                <p className="text-sm text-muted-foreground">{message.email} · {message.mobile}</p>
              </div>
              <div className="flex items-start gap-3 text-right">
                <div>
                  <span className="rounded-full border border-blue-200 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600">{message.status ?? "new"}</span>
                  <p className="mt-2 text-xs text-muted-foreground">{message.createdAt ? new Date(message.createdAt).toLocaleString() : ""}</p>
                </div>
                <button type="button" aria-label={`Delete message from ${message.firstname}`} onClick={() => void deleteMessage(message._id)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-4 grid gap-1 text-sm"><p className="font-semibold">{message.subjects}</p><p className="whitespace-pre-wrap text-muted-foreground">{message.msg}</p><p className="mt-2 text-xs text-muted-foreground">{message.country} · {message.phone}</p></div>
          </article>
        ))}
      </div>
    </div>
  );
}