import { prisma } from "@/lib/prisma";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import {
  ArrowUpRight,
  TrendingUp,
  CheckCircle2,
  Clock,
  Users,
  ShieldCheck,
  Zap,
  Activity,
  Flame,
  ChevronRight,
} from "lucide-react";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { formatDate } from "@/lib/utils";

export async function ManagerDashboard() {
  const [totalTickets, ticketsByPriority, ticketsByStatus, techUsers, recentTickets] =
    await Promise.all([
      prisma.ticket.count(),
      prisma.ticket.groupBy({ by: ["priority"], _count: true }),
      prisma.ticket.groupBy({ by: ["status"], _count: true }),
      prisma.user.findMany({
        where: { role: "TECHNICAL" },
        select: {
          id: true,
          name: true,
          email: true,
          _count: { select: { assignedTickets: true } },
        },
      }),
      prisma.ticket.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          createdBy: { select: { name: true } },
          assignedTo: { select: { name: true } },
        },
      }),
    ]);

  const getPriorityValue = (p: string) => {
    const ticket = ticketsByPriority.find((t) => t.priority === p);
    return ticket?._count ?? 0;
  };

  const getStatusValue = (s: string) => {
    const ticket = ticketsByStatus.find((t) => t.status === s);
    return ticket?._count ?? 0;
  };

  const resolvedCount = getStatusValue("RESOLVED") + getStatusValue("CLOSED");
  const resolutionPercentage =
    totalTickets > 0 ? Math.round((resolvedCount / totalTickets) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Card inspired by the screenshot */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Welcome Card with Activity Wave Chart */}
        <div className="relative overflow-hidden lg:col-span-2 rounded-2xl border border-sky-500/30 bg-gradient-to-br from-slate-900/90 via-slate-900/70 to-slate-950/90 p-4 sm:p-6 md:p-8 backdrop-blur-2xl shadow-2xl">
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-500/15 px-3 py-1 text-xs font-semibold text-sky-400 ring-1 ring-sky-500/30">
                  Operations Manager Portal
                </span>
                <span className="text-xs font-mono text-slate-400 border border-slate-800 rounded-lg px-2.5 py-1 bg-slate-950/50">
                  SLA Health: 98.4%
                </span>
              </div>

              <h1 className="mt-3 text-xl sm:text-2xl md:text-4xl font-extrabold tracking-tight text-white">
                Good Evening, <span className="bg-gradient-to-r from-sky-400 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">Eden Hailu</span>
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Stay focused and make it happen. 12 active tickets monitoring across 3 departments.
              </p>
            </div>

            {/* Glowing SVG Wave Line Chart inspired by screenshot */}
            <div className="mt-8">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
                <span>Weekly Incident Resolution Trend</span>
                <span className="text-sky-400 font-semibold flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5" /> +24% Performance
                </span>
              </div>
              <div className="h-24 w-full">
                <svg className="h-full w-full overflow-visible" viewBox="0 0 500 100">
                  <defs>
                    <linearGradient id="gradientWave" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <g stroke="rgba(148,163,184,0.08)" strokeWidth="1">
                    <line x1="0" y1="25" x2="500" y2="25" />
                    <line x1="0" y1="50" x2="500" y2="50" />
                    <line x1="0" y1="75" x2="500" y2="75" />
                  </g>
                  <path
                    d="M 0,80 Q 50,40 100,70 T 200,30 T 300,50 T 400,20 T 500,45"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                  />
                  <path
                    d="M 0,80 Q 50,40 100,70 T 200,30 T 300,50 T 400,20 T 500,45 L 500,100 L 0,100 Z"
                    fill="url(#gradientWave)"
                  />
                  <circle cx="200" cy="30" r="3" fill="#38bdf8" />
                  <circle cx="400" cy="20" r="3" fill="#38bdf8" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Circular Resolution Gauge Widget inspired by Focus Timer in screenshot */}
        <div className="relative flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-xl shadow-2xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              System Resolution Rate
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/30">
              <Zap className="h-4 w-4" />
            </div>
          </div>

          {/* SVG Glowing Radial Ring Chart */}
          <div className="my-6 flex flex-col items-center justify-center">
            <div className="relative flex h-28 w-28 sm:h-36 sm:w-36 items-center justify-center">
              <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-800"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="url(#purpleBlueGrad)"
                  strokeWidth="8"
                  strokeDasharray="264"
                  strokeDashoffset={264 - (264 * resolutionPercentage) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                  className="transition-all duration-1000"
                />
                <defs>
                  <linearGradient id="purpleBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="100%" stopColor="#a855f7" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {resolutionPercentage}%
                </span>
                <span className="text-[10px] font-medium uppercase text-slate-400 tracking-wider">
                  Target Met
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-around rounded-xl border border-slate-800/80 bg-slate-950/50 p-3 text-center text-xs">
            <div>
              <p className="text-slate-500 font-medium">Resolved</p>
              <p className="text-sm font-bold text-emerald-400">{resolvedCount}</p>
            </div>
            <div className="h-6 w-px bg-slate-800" />
            <div>
              <p className="text-slate-500 font-medium">Total Tickets</p>
              <p className="text-sm font-bold text-sky-400">{totalTickets}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stat Cards Row */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Tickets" value={totalTickets} accent="blue" iconType="total" trend="+14% this week" />
        <StatCard title="Critical SLA" value={getPriorityValue("CRITICAL")} accent="rose" iconType="critical" trend="Immediate Action" />
        <StatCard title="High Priority" value={getPriorityValue("HIGH")} accent="amber" iconType="high" trend="Active queue" />
        <StatCard title="Open Backlog" value={getStatusValue("OPEN")} accent="emerald" iconType="open" trend="Optimal flow" />
      </div>

      {/* Main Grid: Priority & Status Breakdown + Team Workload */}
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        {/* Left Column: Workload & Priority Gauges */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {/* Priority & Status Glass Cards */}
          <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Flame className="h-4 w-4 text-amber-400" /> Tickets by Priority
                </h2>
                <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">Live</span>
              </div>
              <div className="space-y-3.5">
                {[
                  { name: "CRITICAL", count: getPriorityValue("CRITICAL"), color: "bg-rose-500", text: "text-rose-400" },
                  { name: "HIGH", count: getPriorityValue("HIGH"), color: "bg-orange-500", text: "text-orange-400" },
                  { name: "MEDIUM", count: getPriorityValue("MEDIUM"), color: "bg-blue-500", text: "text-blue-400" },
                  { name: "LOW", count: getPriorityValue("LOW"), color: "bg-slate-500", text: "text-slate-400" },
                ].map((p) => (
                  <div key={p.name} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className={p.text}>{p.name}</span>
                      <span className="text-slate-200">{p.count} tickets</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-slate-800/80 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${p.color} transition-all duration-500`}
                        style={{
                          width: `${totalTickets > 0 ? (p.count / totalTickets) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Activity className="h-4 w-4 text-sky-400" /> Tickets by Status
                </h2>
                <span className="text-[11px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded-md">Realtime</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: "OPEN", label: "Open", count: getStatusValue("OPEN"), color: "text-amber-400" },
                  { name: "ASSIGNED", label: "Assigned", count: getStatusValue("ASSIGNED"), color: "text-sky-400" },
                  { name: "IN_PROGRESS", label: "In Progress", count: getStatusValue("IN_PROGRESS"), color: "text-purple-400" },
                  { name: "RESOLVED", label: "Resolved", count: getStatusValue("RESOLVED"), color: "text-emerald-400" },
                  { name: "CLOSED", label: "Closed", count: getStatusValue("CLOSED"), color: "text-slate-400" },
                ].map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center justify-between rounded-xl border border-slate-800/60 bg-slate-950/40 px-3 py-2 text-xs"
                  >
                    <span className="flex items-center gap-2 text-slate-300">
                      <span className={`h-2 w-2 rounded-full ${s.color}`} />
                      {s.label}
                    </span>
                    <span className={`font-bold ${s.color}`}>{s.count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Ethiopian Technical Staff Team Workload */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Users className="h-4 w-4 text-cyan-400" /> Technical Team Workload
                </h2>
                <p className="text-xs text-slate-400">Assigned engineers managed by Eden Hailu</p>
              </div>
              <span className="text-xs font-semibold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded-lg">
                3 Engineers Active
              </span>
            </div>

            <div className="grid gap-3 sm:gap-4 sm:grid-cols-3">
              {techUsers.map((tech) => {
                const assigned = tech._count.assignedTickets;
                const capacity = 10;
                const percentage = Math.min(100, Math.round((assigned / capacity) * 100));

                return (
                  <div
                    key={tech.id}
                    className="flex flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 transition-all hover:border-sky-500/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-600 to-sky-400 text-xs font-bold text-white shadow-md">
                        {tech.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-xs font-bold text-slate-100">{tech.name}</p>
                        <p className="text-[10px] text-slate-500">Technical Support</p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-400">Current Load</span>
                        <span className="font-semibold text-sky-400">{assigned} / {capacity}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-slate-800/80 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column: Recent Ticket Feed */}
        <div className="space-y-4 sm:space-y-6">
          <Card className="h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-400" /> Recent Activity Log
                </h2>
                <Link
                  href="/tickets"
                  className="flex items-center gap-1 text-xs font-semibold text-sky-400 hover:text-sky-300"
                >
                  View All <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="space-y-3">
                {recentTickets.map((ticket) => (
                  <Link
                    key={ticket.id}
                    href={`/tickets/${ticket.id}`}
                    className="block group rounded-xl border border-slate-800/60 bg-slate-950/40 p-3 transition-all hover:border-sky-500/40 hover:bg-slate-900/60"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono font-bold text-sky-400 group-hover:underline">
                        {ticket.ticketNumber}
                      </span>
                      <StatusBadge status={ticket.status} />
                    </div>
                    <p className="mt-1 text-xs font-semibold text-slate-200 line-clamp-1 group-hover:text-white">
                      {ticket.title}
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[10px] text-slate-400">
                      <span>By: {ticket.createdBy.name}</span>
                      <PriorityBadge priority={ticket.priority} />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <Link
                href="/tickets/create"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-cyan-400 transition-all active:scale-95"
              >
                + Create New Ticket
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
