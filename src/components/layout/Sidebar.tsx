"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Ticket,
  PlusCircle,
  Menu,
  X,
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
  const [isOpen, setIsOpen] = useState(false);

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
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed left-3 top-3 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800/80 bg-slate-950/90 text-slate-400 hover:text-white backdrop-blur-xl md:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-64 flex-col justify-between border-r border-slate-800/80 bg-slate-950/95 p-4 backdrop-blur-xl transition-transform duration-300 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800/80 text-slate-400 hover:text-white md:hidden"
          aria-label="Close menu"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex w-full flex-col items-start">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-2 py-3 text-sky-400 hover:text-sky-300 transition-colors"
            onClick={() => setIsOpen(false)}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-400 shadow-lg ring-1 ring-white/20">
              <LayoutDashboard className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-wider text-white">
                HELPDESK
              </span>
              <span className="text-[10px] uppercase font-semibold text-slate-400 tracking-widest">
                Manager Portal
              </span>
            </div>
          </Link>

          <div className="my-4 h-px w-full bg-slate-800/80" />

          <nav className="flex w-full flex-col gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={`group relative flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-sky-500/15 text-sky-400 shadow-inner ring-1 ring-sky-500/30"
                      : "text-slate-400 hover:bg-slate-900/80 hover:text-slate-200"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 ${
                      isActive ? "text-sky-400" : "text-slate-400"
                    }`}
                  />
                  <span>{item.name}</span>
                  {isActive && (
                    <span className="absolute right-0 top-1/2 hidden h-6 w-1 -translate-y-1/2 rounded-l-full bg-sky-400 md:block" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex w-full flex-col gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-800/60 bg-slate-900/60 p-3 backdrop-blur-md">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 font-bold text-white shadow-md ring-2 ring-indigo-400/30">
              {getInitials(user.name)}
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-xs font-semibold text-slate-100">
                {user.name}
              </span>
              <span className="truncate text-[10px] font-medium text-sky-400">
                {formatRole(user.role)}
              </span>
            </div>
          </div>

          <div className="w-full">
            <LogoutButton />
          </div>
        </div>
      </aside>
    </>
  );
}
