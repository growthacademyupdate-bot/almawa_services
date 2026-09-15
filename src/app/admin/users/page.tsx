"use client";

import { CheckCircle2, LogOut, ShieldCheck, UserRound } from "lucide-react";
import { useApp } from "@/context/AppContext";

const ADMIN_EMAIL = "admin@almawaservices.com";

export default function UsersManagementPage() {
  const { isAdmin, logout } = useApp();

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Users</h2>
        <p className="mt-1 text-sm text-muted-foreground">Review the accounts currently configured for admin access.</p>
      </div>

      <div className="admin-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h3 className="font-semibold">Admin accounts</h3>
            <p className="mt-1 text-xs text-muted-foreground">Authentication is currently configured for one administrator.</p>
          </div>
          <ShieldCheck className="h-5 w-5 text-primary" />
        </div>

        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary">
              <UserRound className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold">Administrator</p>
              <p className="text-sm text-muted-foreground">{ADMIN_EMAIL}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-500/10 px-2.5 py-1 font-semibold text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> {isAdmin ? "Active session" : "Signed out"}
            </span>
            {isAdmin && (
              <button type="button" onClick={logout} className="admin-btn-secondary h-9 px-3">
                <LogOut className="mr-2 h-4 w-4" /> Sign out
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-amber-200 bg-amber-500/10 p-4 text-sm text-amber-800">
        Additional user accounts are not configured yet. Add a user store and server-side authentication before enabling account creation here.
      </div>
    </div>
  );
}