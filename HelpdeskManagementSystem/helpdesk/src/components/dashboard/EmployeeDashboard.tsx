import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { StatCard } from "@/components/ui/StatCard";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import Link from "next/link";
import { PlusCircle, LifeBuoy, CheckCircle2, ArrowRight } from "lucide-react";

export async function EmployeeDashboard() {
  const user = await getCurrentUser();
  if (!user) return null;

  const myTickets = await prisma.ticket.findMany({
    where: { createdById: user.id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  const activeCount = myTickets.filter(
    (t) => t.status !== "RESOLVED" && t.status !== "CLOSED"
  ).length;

  const resolvedCount = myTickets.filter(
    (t) => t.status === "RESOLVED" || t.status === "CLOSED"
  ).length;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-2xl border border-sky-500/20 bg-slate-900/60 p-4 sm:p-6 backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-sky-400">
            <LifeBuoy className="h-5 w-5" />
            <span className="text-xs font-mono uppercase tracking-wider font-bold">Employee Support Desk</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold text-white">
            Hello, {user.name}
          </h1>
          <p className="mt-1 text-xs text-slate-400">
            Need technical support or assistance? Managed by IT Lead Eden Hailu.
          </p>
        </div>
        <Link
          href="/tickets/create"
          className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-cyan-400 transition-all active:scale-95 shrink-0"
        >
          <PlusCircle className="h-4 w-4" /> Submit Support Ticket
        </Link>
      </div>

      <div className="grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3">
        <StatCard title="My Total Requests" value={myTickets.length} accent="blue" iconType="total" />
        <StatCard title="Active In-Progress" value={activeCount} accent="amber" iconType="open" />
        <StatCard title="Resolved Requests" value={resolvedCount} accent="emerald" iconType="success" />
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
            My Submitted Tickets
          </h2>
          <Link href="/tickets" className="text-xs text-sky-400 hover:underline flex items-center gap-1">
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {myTickets.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-slate-400 text-xs">You haven't submitted any helpdesk requests yet.</p>
            <Link
              href="/tickets/create"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:underline"
            >
              <PlusCircle className="h-4 w-4" /> Create your first ticket
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {myTickets.map((ticket) => (
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
