import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { formatDate, formatCategory } from "@/lib/utils";
import { ChevronRight, User, Calendar, Tag } from "lucide-react";

interface TicketTableProps {
  searchParams: Record<string, string | string[] | undefined>;
}

export async function TicketTable({ searchParams }: TicketTableProps) {
  const user = await getCurrentUser();
  if (!user) return null;

  const search = typeof searchParams.search === "string" ? searchParams.search : "";
  const status = typeof searchParams.status === "string" ? searchParams.status : "";
  const priority = typeof searchParams.priority === "string" ? searchParams.priority : "";
  const category = typeof searchParams.category === "string" ? searchParams.category : "";
  const assignedTo = typeof searchParams.assignedTo === "string" ? searchParams.assignedTo : "";
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "newest";

  const where: any = {};

  if (user.role === "EMPLOYEE") {
    where.createdById = user.id;
  }

  if (user.role === "TECHNICAL") {
    where.assignedToId = user.id;
  }

  if (search) {
    where.title = { contains: search, mode: "insensitive" };
  }

  if (status) {
    where.status = status;
  }

  if (priority) {
    where.priority = priority;
  }

  if (category) {
    where.category = category;
  }

  if (assignedTo === "unassigned") {
    where.assignedToId = null;
  } else if (assignedTo) {
    where.assignedToId = assignedTo;
  }

  let orderBy: any = { createdAt: "desc" };
  if (sort === "oldest") orderBy = { createdAt: "asc" };
  if (sort === "priority-high") orderBy = { priority: "asc" };
  if (sort === "priority-low") orderBy = { priority: "desc" };
  if (sort === "status") orderBy = { status: "asc" };

  const tickets = await prisma.ticket.findMany({
    where,
    orderBy,
    include: {
      createdBy: { select: { name: true } },
      assignedTo: { select: { name: true } },
    },
  });

  if (tickets.length === 0) {
    return (
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-12 text-center backdrop-blur-xl">
        <p className="text-slate-400 text-sm">No tickets found matching your query criteria.</p>
        {user.role === "EMPLOYEE" && (
          <Link
            href="/tickets/create"
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:underline"
          >
            Create a new support ticket
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-800/80 text-left text-xs">
          <thead className="bg-slate-950/80 uppercase font-mono tracking-wider text-slate-400">
            <tr>
              <th className="px-5 py-4">Ticket ID</th>
              <th className="px-5 py-4">Title & Details</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Priority</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Assignee</th>
              <th className="px-5 py-4">Created Date</th>
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {tickets.map((ticket) => (
              <tr
                key={ticket.id}
                className="group transition-colors hover:bg-slate-800/40"
              >
                <td className="whitespace-nowrap px-5 py-4 font-mono font-bold text-sky-400">
                  <Link href={`/tickets/${ticket.id}`} className="hover:underline">
                    {ticket.ticketNumber}
                  </Link>
                </td>
                <td className="px-5 py-4 max-w-xs">
                  <Link
                    href={`/tickets/${ticket.id}`}
                    className="font-semibold text-slate-100 group-hover:text-sky-300 transition-colors line-clamp-1"
                  >
                    {ticket.title}
                  </Link>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    By: {ticket.createdBy.name}
                  </p>
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <StatusBadge status={ticket.status} />
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <PriorityBadge priority={ticket.priority} />
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-400">
                  {formatCategory(ticket.category)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-300">
                  {ticket.assignedTo?.name ? (
                    <span className="inline-flex items-center gap-1">
                      <User className="h-3 w-3 text-cyan-400" />
                      {ticket.assignedTo.name}
                    </span>
                  ) : (
                    <span className="text-slate-500 font-mono italic">Unassigned</span>
                  )}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-slate-400 text-[11px]">
                  {formatDate(ticket.createdAt)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-right">
                  <Link
                    href={`/tickets/${ticket.id}`}
                    className="inline-flex items-center gap-1 text-xs text-sky-400 hover:text-sky-300 font-semibold"
                  >
                    View <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
