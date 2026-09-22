"use client";

import { useState } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="relative flex min-h-screen bg-secondary/30">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Area */}
      <div className="relative z-0 flex min-w-0 flex-1 flex-col">

        {/* Top Header */}
        <div className="relative z-[100]">
          <AdminHeader
            setSidebarOpen={setSidebarOpen}
          />
        </div>

        {/* Page Content */}
        <main className="relative z-0 flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}