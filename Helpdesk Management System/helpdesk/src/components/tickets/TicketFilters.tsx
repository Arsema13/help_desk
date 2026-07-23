"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { Search, Filter, X, ArrowUpDown } from "lucide-react";

interface TicketFiltersProps {
  userRole: string;
  users: { id: string; name: string }[];
}

export function TicketFilters({ userRole, users }: TicketFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const createQueryString = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });
      return params.toString();
    },
    [searchParams]
  );

  const updateFilter = useCallback(
    (key: string, value: string) => {
      router.push(`/tickets?${createQueryString({ [key]: value || null })}`);
    },
    [router, createQueryString]
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("search", search);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-xl">
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative w-full">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            name="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by ticket title, keywords..."
            className="w-full rounded-xl border border-slate-800/80 bg-slate-950/80 pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-1.5 rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-all shrink-0"
        >
          <Filter className="h-3.5 w-3.5 text-sky-400" /> Filter
        </button>
        {(searchParams.toString() || search) && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              router.push("/tickets");
            }}
            className="flex items-center gap-1 rounded-xl bg-rose-500/10 border border-rose-500/30 px-3 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/20 transition-all shrink-0"
          >
            <X className="h-3.5 w-3.5" /> Clear
          </button>
        )}
      </form>

      <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 pt-2 border-t border-slate-800/60">
        <select
          defaultValue={searchParams.get("status") || ""}
          onChange={(e) => updateFilter("status", e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:border-sky-500 focus:outline-none w-full sm:w-auto"
        >
          <option value="">All Statuses</option>
          <option value="OPEN">Open</option>
          <option value="ASSIGNED">Assigned</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="RESOLVED">Resolved</option>
          <option value="CLOSED">Closed</option>
        </select>

        <select
          defaultValue={searchParams.get("priority") || ""}
          onChange={(e) => updateFilter("priority", e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:border-sky-500 focus:outline-none w-full sm:w-auto"
        >
          <option value="">All Priorities</option>
          <option value="LOW">Low Priority</option>
          <option value="MEDIUM">Medium Priority</option>
          <option value="HIGH">High Priority</option>
          <option value="CRITICAL">Critical SLA</option>
        </select>

        <select
          defaultValue={searchParams.get("category") || ""}
          onChange={(e) => updateFilter("category", e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:border-sky-500 focus:outline-none w-full sm:w-auto"
        >
          <option value="">All Categories</option>
          <option value="IT_SUPPORT">IT Support</option>
          <option value="FACILITIES">Facilities</option>
          <option value="HR">Human Resources</option>
          <option value="OTHER">Other</option>
        </select>

        {userRole === "MANAGER" && (
          <select
            defaultValue={searchParams.get("assignedTo") || ""}
            onChange={(e) => updateFilter("assignedTo", e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:border-sky-500 focus:outline-none w-full sm:w-auto"
          >
            <option value="">All Engineers</option>
            <option value="unassigned">Unassigned</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>
                {u.name}
              </option>
            ))}
          </select>
        )}

        <select
          defaultValue={searchParams.get("sort") || "newest"}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 focus:border-sky-500 focus:outline-none w-full sm:w-auto sm:ml-auto"
        >
          <option value="newest">Sort: Newest First</option>
          <option value="oldest">Sort: Oldest First</option>
          <option value="priority-high">Sort: Priority High-Low</option>
          <option value="priority-low">Sort: Priority Low-High</option>
          <option value="status">Sort: Status</option>
        </select>
      </div>
    </div>
  );
}
