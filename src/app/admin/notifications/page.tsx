"use client";

import {
  Bell,
  CalendarDays,
  CheckCheck,
  ChevronRight,
  Users,
} from "lucide-react";
import { useMemo, useState } from "react";
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
  } = useApp();

  const router = useRouter();

  const [readIds, setReadIds] = useState<string[]>([]);

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
    setReadIds(
      notifications.map(
        (notification) =>
          notification.id,
      ),
    );
  };

  const handleNotificationClick = (
    notification: NotificationItem,
  ) => {
    setReadIds((current) =>
      current.includes(notification.id)
        ? current
        : [
            ...current,
            notification.id,
          ],
    );

    router.push(
      notification.route,
    );
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

        {unreadCount > 0 && (
          <button
            type="button"
            onClick={markAllRead}
            className="admin-btn-secondary"
          >
            <CheckCheck className="mr-2 h-4 w-4" />
            Mark all as read
          </button>
        )}
      </div>

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
                  <button
                    key={notification.id}
                    type="button"
                    onClick={() =>
                      handleNotificationClick(
                        notification,
                      )
                    }
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

                    {/* Arrow */}
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
                  </button>
                );
              },
            )}
          </div>
        )}
      </div>
    </div>
  );
}