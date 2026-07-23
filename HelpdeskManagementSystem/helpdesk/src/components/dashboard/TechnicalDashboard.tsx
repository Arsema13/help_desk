import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import Link from "next/link";
import { Wrench, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react";

export async function TechnicalDashboard() {
  const user = await getCurrentUser();
  if (!user) return null;

  const assignedTickets = await prisma.ticket.findMany({
    where: { assignedToId: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const openAssigned = assignedTickets.filter(
    (t) => t.status === "OPEN" || t.status === "ASSIGNED" || t.status === "IN_PROGRESS"
  ).length;

  const resolvedCount = assignedTickets.filter((t) => t.status === "RESOLVED").length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="rounded-2xl border border-sky-500/20 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-xl shadow-xl">
        <div className="flex items-center gap-3 text-sky-400">
          <Wrench className="h-6 w-6" />
          <span className="text-xs font-mono uppercase tracking-wider font-bold">Technical Operations</span>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-white">
          Welcome back, {user.name}
        </h1>
        <p className="mt-1 text-xs text-slate-400">
          You currently have {openAssigned} active tickets waiting for resolution.
        </p>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3">
        <StatCard title="Assigned Queue" value={assignedTickets.length} accent="blue" iconType="total" />
        <StatCard title="Active In-Progress" value={openAssigned} accent="amber" iconType="open" />
        <StatCard title="Resolved Solved" value={resolvedCount} accent="emerald" iconType="success" />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            My Work Queue
          </h2>
          <Link href="/tickets" className="text-xs text-sky-400 hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {assignedTickets.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            No active tickets currently assigned to you.
          </div>
        ) : (
          <div className="space-y-3">
            {assignedTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/tickets/${ticket.id}`}
                className="block group rounded-xl border border-slate-800/80 bg-slate-950/40 p-4 transition-all hover:border-sky-500/40 hover:bg-slate-900/60"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-sky-400">
                      {ticket.ticketNumber}
                    </span>
                    <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                      {ticket.title}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PriorityBadge priority={ticket.priority} />
                    <StatusBadge status={ticket.status} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
