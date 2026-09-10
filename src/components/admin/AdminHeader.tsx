"use client";

import { Bell, Menu, Search, User } from "lucide-react";
import { notifications } from "@/lib/admin-data";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AdminHeader({
  setSidebarOpen,
}: {
  setSidebarOpen: (open: boolean) => void;
}) {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/80 px-6 backdrop-blur-md">
      <button
        onClick={() => setSidebarOpen(true)}
        className="lg:hidden p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <h1 className="text-lg font-display font-bold lg:block hidden">
        Dashboard
      </h1>

      <div className="flex-1 flex justify-end items-center gap-4">
        <div className="relative hidden sm:block max-w-md w-full ml-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search leads, services..."
            className="w-full bg-secondary/50 border border-transparent focus:border-border focus:bg-background rounded-full pl-10 pr-4 py-2 text-sm outline-none transition-all"
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 rounded-full hover:bg-secondary text-muted-foreground transition-colors outline-none">
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ff5a1f]" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.slice(0, 4).map((n) => (
              <DropdownMenuItem key={n.id} className="flex flex-col items-start p-3 gap-1 cursor-pointer">
                <div className="flex items-center gap-2 w-full">
                  <span className={`w-2 h-2 rounded-full ${n.isRead ? 'bg-transparent' : 'bg-[#ff5a1f]'}`} />
                  <p className="text-sm font-medium leading-none">{n.title}</p>
                </div>
                <p className="text-xs text-muted-foreground ml-4">{n.time}</p>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-[#ff5a1f] font-medium cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 outline-none hover:opacity-80 transition-opacity">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold leading-none">Good Morning, Admin</p>
                <p className="text-xs text-muted-foreground mt-1">Superadmin</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden">
                <User className="w-5 h-5 text-muted-foreground" />
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
