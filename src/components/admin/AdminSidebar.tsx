"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  MessageSquare,
  FileText,
  HelpCircle,
  Mail,
  Settings,
  Calendar,
  Building,
  Bell,
} from "lucide-react";

const NAV_ITEMS = [
  {
    href: "/admin",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/admin/leads",
    label: "Leads",
    icon: Users,
  },
  {
    href: "/admin/consultations",
    label: "Consultations",
    icon: Calendar,
  },
  {
    href: "/admin/services",
    label: "Services",
    icon: Briefcase,
  },
  {
    href: "/admin/industries",
    label: "Industries",
    icon: Building,
  },
  {
    href: "/admin/testimonials",
    label: "Testimonials",
    icon: MessageSquare,
  },
  {
    href: "/admin/blog",
    label: "Blog",
    icon: FileText,
  },
  {
    href: "/admin/faq",
    label: "FAQ",
    icon: HelpCircle,
  },
  {
    href: "/admin/messages",
    label: "Contact Messages",
    icon: Mail,
  },
  {
    href: "/admin/notifications",
    label: "Notifications",
    icon: Bell,
  },
  {
    href: "/admin/users",
    label: "Users",
    icon: Users,
  },
  {
    href: "/admin/settings",
    label: "Settings",
    icon: Settings,
  },
];

export function AdminSidebar({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 overflow-hidden bg-[#0A0F1C] text-slate-300 transform transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0 lg:w-64 border-r border-white/5 flex flex-col ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-5 shrink-0 border-b border-white/5">
          <Link
            href="/admin"
            className="flex items-center"
          >
            <img
              src="/almawa-logo.svg"
              alt="Almawa Services"
              className="h-12 w-auto max-w-[180px] object-contain"
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="min-h-0 flex-1 overflow-y-auto py-6 px-4 space-y-1 custom-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname === item.href ||
                  pathname.startsWith(
                    `${item.href}/`,
                  );

            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-[#ff5a1f] text-white shadow-[0_4px_12px_rgba(255,90,31,0.25)]"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
                onClick={() =>
                  setIsOpen(false)
                }
              >
                <Icon
                  className={`w-5 h-5 ${
                    isActive
                      ? "text-white"
                      : "text-slate-500"
                  }`}
                />

                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-white/5 bg-[#0A0F1C]/50">
          <div className="bg-white/5 rounded-xl p-4">
            <p className="text-xs text-slate-400 text-center">
              Logged in as Admin
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}