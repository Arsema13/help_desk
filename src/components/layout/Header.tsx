import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { HeaderClock } from "./HeaderClock";
import { Search, Bell, Plus, ShieldCheck } from "lucide-react";

export async function Header() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/60 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        {/* Search Input Bar */}
        <div className="flex items-center flex-1 max-w-[140px] sm:max-w-xs lg:max-w-md">
          <form action="/tickets" method="GET" className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 sm:left-3.5 sm:h-4 sm:w-4" />
            <input
              type="text"
              name="search"
              placeholder="Search tickets..."
              className="w-full rounded-xl border border-slate-800/80 bg-slate-900/80 pl-8 pr-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/50 transition-all sm:pl-10 sm:pr-4"
            />
          </form>
        </div>

        {/* Right Section: System status, Clock, Actions */}
        <div className="flex items-center gap-3">
          {/* Status Indicator */}
          <div className="hidden lg:flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1.5 text-xs text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            </span>
            <span className="font-medium">System Optimal</span>
          </div>

          {/* Clock Widget */}
          <HeaderClock />

          {/* Notifications Button */}
          <button
            type="button"
            className="relative rounded-xl border border-slate-800/80 bg-slate-900/60 p-2 text-slate-400 hover:border-slate-700 hover:text-slate-200 transition-all"
            title="Notifications"
          >
            <Bell className="h-4 w-4" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-sky-400 ring-2 ring-slate-950" />
          </button>

          {/* Quick Create Button */}
          <Link
            href="/tickets/create"
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-3.5 py-2 text-xs font-semibold text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-cyan-400 transition-all active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Ticket</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
