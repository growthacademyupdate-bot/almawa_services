"use client";

import {
  Bell,
  CalendarDays,
  CheckCheck,
  ChevronRight,
  Link as LinkIcon,
  Pencil,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useApp } from "@/context/AppContext";

type NotificationItem = {
  id: string;
  title: string;
  message: string;
  date: string;
  route: string;
  type: "lead" | "consultation";
};

type SiteNotification = {
  id: string;
  title: string;
  message: string;
  link?: string;
  createdAt: string;
};

const READ_NOTIFICATIONS_KEY = "almawa-admin-read-notifications";

function formatDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationsPage() {
  const {
    leads,
    consultations,
    deleteLead,
    deleteConsultation,
  } = useApp();

  const router = useRouter();

  const [readIds, setReadIds] = useState<string[]>([]);
  const [siteNotifications, setSiteNotifications] = useState<SiteNotification[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingNotificationId, setEditingNotificationId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", message: "", link: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const storedReadIds = window.localStorage.getItem(READ_NOTIFICATIONS_KEY);

      if (storedReadIds) {
        const parsedReadIds = JSON.parse(storedReadIds);

        if (Array.isArray(parsedReadIds)) {
          setReadIds(parsedReadIds.filter((id): id is string => typeof id === "string"));
        }
      }
    } catch (error) {
      console.error("Failed to load notification read state:", error);
    }

    void fetch("/api/notifications", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : []))
      .then((data: SiteNotification[]) => setSiteNotifications(Array.isArray(data) ? data : []))
      .catch(() => setSiteNotifications([]));
  }, []);

  const notifications = useMemo<NotificationItem[]>(() => {
    const items: NotificationItem[] = [
      ...leads.map((lead) => ({
        id: `lead-${lead.id}`,
        title: "New lead received",
        message:
          `${lead.firstName ?? ""} ${lead.lastName ?? ""}`.trim() ||
          lead.email ||
          "New lead received",
        date: lead.date,
        route: "/admin/leads",
        type: "lead" as const,
      })),

      ...consultations.map((consultation) => ({
        id: `consultation-${consultation.id}`,
        title: "New consultation request",
        message:
          consultation.client ||
          "New consultation request",
        date: consultation.date,
        route: "/admin/consultations",
        type: "consultation" as const,
      })),
    ];

    return items.sort((a, b) => {
      const aTime = new Date(a.date).getTime();
      const bTime = new Date(b.date).getTime();

      const safeA = Number.isNaN(aTime)
        ? 0
        : aTime;

      const safeB = Number.isNaN(bTime)
        ? 0
        : bTime;

      return safeB - safeA;
    });
  }, [leads, consultations]);

  const unreadCount = notifications.filter(
    (notification) =>
      !readIds.includes(notification.id),
  ).length;

  const markAllRead = () => {
    const allReadIds = notifications.map((notification) => notification.id);
    setReadIds(allReadIds);
    window.localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(allReadIds));
  };

  const handleNotificationClick = (
    notification: NotificationItem,
  ) => {
    setReadIds((current) => {
      if (current.includes(notification.id)) {
        return current;
      }

      const nextReadIds = [...current, notification.id];
      window.localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(nextReadIds));
      return nextReadIds;
    });

    router.push(
      notification.route,
    );
  };

  const handleNotificationDelete = (notification: NotificationItem) => {
    if (!window.confirm(`Delete this ${notification.type} notification?`)) {
      return;
    }

    const recordId = notification.id.replace(`${notification.type}-`, "");

    if (notification.type === "lead") {
      deleteLead(recordId);
    } else {
      deleteConsultation(recordId);
    }

    setReadIds((current) => {
      const nextReadIds = current.filter((id) => id !== notification.id);
      window.localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(nextReadIds));
      return nextReadIds;
    });
  };

  const createNotification = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/notifications", {
        method: editingNotificationId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          editingNotificationId
            ? { id: editingNotificationId, ...form }
            : form,
        ),
      });
      const created = (await response.json()) as SiteNotification & { error?: string };
      if (!response.ok) throw new Error(created.error || "Unable to save notification");
      setSiteNotifications((current) =>
        editingNotificationId
          ? current.map((notification) =>
              notification.id === editingNotificationId ? created : notification,
            )
          : [created, ...current],
      );
      setForm({ title: "", message: "", link: "" });
      setShowCreateForm(false);
      setEditingNotificationId(null);
    } catch (error) {
      window.alert(error instanceof Error ? error.message : "Unable to create notification");
    } finally {
      setSaving(false);
    }
  };

  const editSiteNotification = (notification: SiteNotification) => {
    setForm({
      title: notification.title,
      message: notification.message,
      link: notification.link ?? "",
    });
    setEditingNotificationId(notification.id);
    setShowCreateForm(true);
  };

  const deleteSiteNotification = async (id: string) => {
    if (!window.confirm("Delete this website notification?")) return;
    const response = await fetch(`/api/notifications?id=${encodeURIComponent(id)}`, { method: "DELETE" });
    if (response.ok) setSiteNotifications((current) => current.filter((notification) => notification.id !== id));
  };

  return (
    <div className="space-y-6 lg:space-y-8 animate-in fade-in duration-300">

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff5a1f]/10">
              <Bell className="h-5 w-5 text-[#ff5a1f]" />
            </div>

            <div>
              <h2 className="text-2xl font-bold font-display">
                Notifications
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                View and manage your latest admin notifications.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {unreadCount > 0 && (
            <button type="button" onClick={markAllRead} className="admin-btn-secondary"><CheckCheck className="mr-2 h-4 w-4" />Mark all as read</button>
          )}
          <button type="button" onClick={() => setShowCreateForm((current) => !current)} className="admin-btn-primary"><Plus className="mr-2 h-4 w-4" />Create notification</button>
        </div>
      </div>

      {showCreateForm && (
        <form onSubmit={createNotification} className="admin-card space-y-4">
          <div><h3 className="font-bold font-display">{editingNotificationId ? "Edit website notification" : "New website notification"}</h3><p className="mt-1 text-sm text-muted-foreground">This will appear in the notification bell on the public website.</p></div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="text-sm font-medium">Title<input required value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="New service available" className="admin-input mt-1" /></label>
            <label className="text-sm font-medium">Link (optional)<div className="relative mt-1"><LinkIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><input value={form.link} onChange={(event) => setForm({ ...form, link: event.target.value })} placeholder="/services" className="admin-input pl-9" /></div></label>
          </div>
          <label className="block text-sm font-medium">Message<textarea required value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} placeholder="Tell visitors what is new..." rows={3} className="admin-input mt-1 resize-y" /></label>
          <div className="flex justify-end gap-2"><button type="button" onClick={() => { setShowCreateForm(false); setEditingNotificationId(null); setForm({ title: "", message: "", link: "" }); }} className="admin-btn-secondary"><X className="mr-2 h-4 w-4" />Cancel</button><button type="submit" disabled={saving} className="admin-btn-primary">{saving ? "Saving..." : editingNotificationId ? "Save changes" : "Publish notification"}</button></div>
        </form>
      )}

      {siteNotifications.length > 0 && (
        <div className="admin-card overflow-hidden p-0">
          <div className="border-b border-border px-5 py-4"><h3 className="font-bold font-display">Website notifications</h3><p className="mt-1 text-xs text-muted-foreground">Published notices shown to website visitors.</p></div>
          {siteNotifications.map((notification) => (
            <div key={notification.id} className="flex items-start gap-4 border-b border-border px-5 py-4 last:border-b-0"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10"><Bell className="h-5 w-5 text-primary" /></div><div className="min-w-0 flex-1"><h4 className="font-semibold">{notification.title}</h4><p className="mt-1 text-sm text-muted-foreground">{notification.message}</p><p className="mt-1 text-xs text-muted-foreground">{formatDate(notification.createdAt)}</p></div><div className="flex shrink-0 items-center gap-1"><button type="button" aria-label={`Edit ${notification.title}`} onClick={() => editSiteNotification(notification)} className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-primary"><Pencil className="h-4 w-4" /></button><button type="button" aria-label={`Delete ${notification.title}`} onClick={() => void deleteSiteNotification(notification.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"><Trash2 className="h-4 w-4" /></button></div></div>
          ))}
        </div>
      )}

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Total Notifications
              </p>

              <p className="mt-1 text-3xl font-bold">
                {notifications.length}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Unread
              </p>

              <p className="mt-1 text-3xl font-bold">
                {unreadCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#ff5a1f]/10">
              <Bell className="h-5 w-5 text-[#ff5a1f]" />
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Read
              </p>

              <p className="mt-1 text-3xl font-bold">
                {notifications.length -
                  unreadCount}
              </p>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-500/10">
              <CheckCheck className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Notification List */}
      <div className="admin-card overflow-hidden p-0">

        {/* List Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="font-bold font-display">
              All Notifications
            </h3>

            <p className="mt-1 text-xs text-muted-foreground">
              Click a notification to open the related section.
            </p>
          </div>

          <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
            {notifications.length}
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="py-20 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
              <Bell className="h-6 w-6 text-muted-foreground" />
            </div>

            <h3 className="font-semibold">
              No notifications yet
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              New leads and consultation requests will appear here.
            </p>
          </div>
        ) : (
          <div>
            {notifications.map(
              (notification) => {
                const isRead =
                  readIds.includes(
                    notification.id,
                  );

                const isLead =
                  notification.type ===
                  "lead";

                return (
                  <div
                    key={notification.id}
                    className={`flex w-full items-center gap-4 border-b border-border px-5 py-5 text-left transition last:border-b-0 hover:bg-secondary/60 ${
                      !isRead
                        ? "bg-primary/[0.03]"
                        : ""
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        isLead
                          ? "bg-orange-500/10 text-orange-600"
                          : "bg-blue-500/10 text-blue-600"
                      }`}
                    >
                      {isLead ? (
                        <Users className="h-5 w-5" />
                      ) : (
                        <CalendarDays className="h-5 w-5" />
                      )}
                    </div>

                    {/* Content */}
                    <button
                      type="button"
                      onClick={() => handleNotificationClick(notification)}
                      className="flex min-w-0 flex-1 items-center gap-4 text-left"
                    >
                      <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4
                          className={`text-sm ${
                            !isRead
                              ? "font-bold"
                              : "font-semibold"
                          }`}
                        >
                          {notification.title}
                        </h4>

                        {!isRead && (
                          <span className="h-2 w-2 rounded-full bg-[#ff5a1f]" />
                        )}
                      </div>

                      <p className="mt-1 text-sm text-muted-foreground">
                        {notification.message}
                      </p>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDate(
                          notification.date,
                        )}
                      </p>
                      </div>

                      <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                    </button>

                    <button
                      type="button"
                      aria-label={`Delete ${notification.title}`}
                      onClick={() => handleNotificationDelete(notification)}
                      className="shrink-0 rounded-lg p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                );
              },
            )}
          </div>
        )}
      </div>
    </div>
  );
}