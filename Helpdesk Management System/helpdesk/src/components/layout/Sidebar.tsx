"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Sparkles,
} from "lucide-react";
import { formatRole } from "@/lib/utils";
import { LogoutButton } from "./LogoutButton";

interface SidebarProps {
  user: {
    name: string;
    email: string;
    role: string;
  };
}

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      name: "Tickets",
      href: "/tickets",
      icon: Ticket,
    },
    {
      name: "New Ticket",
      href: "/tickets/create",
      icon: PlusCircle,
    },
  ];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-20 flex-col items-center justify-between border-r border-slate-800/80 bg-slate-950/80 p-4 backdrop-blur-xl transition-all duration-300 md:w-64">
      {/* Top Branding Section */}
      <div className="flex w-full flex-col items-center md:items-start">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-2 py-3 text-sky-400 hover:text-sky-300 transition-colors"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-400 shadow-lg shadow-sky-500/30 ring-1 ring-white/20">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <div className="hidden flex-col md:flex">
            <span className="text-lg font-bold tracking-wider text-white">
              HELPDESK<span className="text-sky-400">.AI</span>
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-widest">
              Manager Portal
            </span>
          </div>
        </Link>

        {/* Divider */}
        <div className="my-4 h-px w-full bg-slate-800/80" />

        {/* Navigation items */}
        <nav className="flex w-full flex-col gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-sky-500/15 text-sky-400 shadow-inner ring-1 ring-sky-500/30"
                    : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-200"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? "text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.6)]" : "text-slate-400"
                  }`}
                />
                <span className="hidden md:inline">{item.name}</span>
                {isActive && (
                  <span className="absolute right-0 top-1/2 hidden h-6 w-1 -translate-y-1/2 rounded-l-full bg-sky-400 shadow-[0_0_10px_#38bdf8] md:block" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom User Info Card & Logout */}
      <div className="flex w-full flex-col gap-3">
        {/* User Card */}
        <div className="flex items-center gap-3 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-2 md:p-3 backdrop-blur-md">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white shadow-md ring-2 ring-indigo-400/30">
            {getInitials(user.name)}
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
          </div>
          <div className="hidden min-w-0 flex-1 flex-col md:flex">
            <span className="truncate text-xs font-semibold text-slate-100">
              {user.name}
            </span>
            <span className="truncate text-[10px] font-medium text-sky-400">
              {formatRole(user.role)}
            </span>
          </div>
        </div>

        {/* Logout */}
        <div className="w-full">
          <LogoutButton />
        </div>
      </div>
    </aside>
  );
}
