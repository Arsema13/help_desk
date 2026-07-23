import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Card } from "@/components/ui/Card";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { PriorityBadge } from "@/components/ui/PriorityBadge";
import { formatDate, formatCategory, formatRole } from "@/lib/utils";
import { TicketActions } from "./TicketActions";
import { CommentForm } from "../forms/CommentForm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageSquare, Clock, User, ShieldCheck, Activity } from "lucide-react";

interface TicketDetailProps {
  ticketId: string;
}

export async function TicketDetail({ ticketId }: TicketDetailProps) {
  const user = await getCurrentUser();
  if (!user) return null;

  const ticket = await prisma.ticket.findUnique({
    where: { id: ticketId },
    include: {
      createdBy: { select: { id: true, name: true, role: true } },
      assignedTo: { select: { id: true, name: true, role: true } },
      comments: {
        include: { user: { select: { name: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
      activities: {
        include: { user: { select: { name: true } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!ticket) notFound();

  const canView =
    user.role === "MANAGER" ||
    ticket.createdById === user.id ||
    ticket.assignedToId === user.id;

  if (!canView) {
    return (
      <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-12 text-center backdrop-blur-xl">
        <p className="text-rose-400 text-sm">
          You do not have permission to inspect this confidential ticket.
        </p>
        <Link
          href="/tickets"
          className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-sky-400 hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to tickets overview
        </Link>
      </div>
    );
  }

  const technicalUsers =
    user.role === "MANAGER"
      ? await prisma.user.findMany({
          where: { role: "TECHNICAL" },
          select: { id: true, name: true },
        })
      : [];

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <Link
            href="/tickets"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to tickets list
          </Link>
          <div className="mt-2 flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
            <span className="self-start sm:self-auto font-mono text-xs font-bold text-sky-400 px-2 py-0.5 rounded bg-sky-500/10 border border-sky-500/30 shrink-0">
              {ticket.ticketNumber}
            </span>
            <h1 className="text-base sm:text-xl md:text-2xl font-bold text-white">
              {ticket.title}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <PriorityBadge priority={ticket.priority} />
          <StatusBadge status={ticket.status} />
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <Card>
            <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-slate-300">
              Description
            </h2>
            <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
              {ticket.description}
            </p>
          </Card>

          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-sky-400" /> Discussion Thread ({ticket.comments.length})
              </h2>
            </div>
            <div className="space-y-4">
              {ticket.comments.length === 0 ? (
                <p className="text-xs text-slate-500 py-4 text-center">No comments added yet.</p>
              ) : (
                ticket.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 transition-all hover:border-slate-700/80"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-tr from-sky-600 to-cyan-400 text-[10px] font-bold text-white shrink-0">
                          {getInitials(comment.user.name)}
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-200 truncate block">
                            {comment.user.name}
                          </span>
                          <span className="text-[10px] text-sky-400 font-medium">
                            {formatRole(comment.user.role)}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] text-slate-500 shrink-0">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed pl-9">
                      {comment.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>

          <Card>
            <CommentForm ticketId={ticket.id} />
          </Card>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <Card>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-300">
              Ticket Details
            </h2>
            <dl className="space-y-3.5 text-xs">
              <div>
                <dt className="text-[11px] font-medium text-slate-400 uppercase">
                  Created By
                </dt>
                <dd className="mt-1 font-semibold text-slate-100 flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-sky-400" />
                  {ticket.createdBy.name} ({formatRole(ticket.createdBy.role)})
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium text-slate-400 uppercase">
                  Assigned Engineer
                </dt>
                <dd className="mt-1 font-semibold text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
                  {ticket.assignedTo?.name || "Not assigned"}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium text-slate-400 uppercase">
                  Category
                </dt>
                <dd className="mt-1 font-semibold text-slate-100">
                  {formatCategory(ticket.category)}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] font-medium text-slate-400 uppercase">
                  Created Date
                </dt>
                <dd className="mt-1 text-slate-300">
                  {formatDate(ticket.createdAt)}
                </dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-300">
              Manage Incident
            </h2>
            <TicketActions
              ticket={ticket}
              userId={user.id}
              userRole={user.role}
              technicalUsers={technicalUsers}
            />
          </Card>

          <Card>
            <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Activity className="h-4 w-4 text-amber-400" /> Audit Log Timeline
            </h2>
            <div className="space-y-3">
              {ticket.activities.length === 0 ? (
                <p className="text-xs text-slate-500">No activity logged yet.</p>
              ) : (
                ticket.activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-2.5">
                    <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400 shadow-[0_0_8px_#38bdf8]" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-slate-300">
                        <span className="font-bold text-slate-100">
                          {activity.user.name}
                        </span>{" "}
                        {formatActivityAction(activity)}
                      </p>
                      <p className="text-[10px] text-slate-500">
                        {formatDate(activity.createdAt)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function formatActivityAction(activity: {
  action: string;
  oldValue?: string | null;
  newValue?: string | null;
}): string {
  switch (activity.action) {
    case "ASSIGNED":
      return "assigned ticket";
    case "STATUS_CHANGED":
      return `changed status from ${activity.oldValue} to ${activity.newValue}`;
    case "PRIORITY_CHANGED":
      return `changed priority from ${activity.oldValue} to ${activity.newValue}`;
    case "COMMENT_ADDED":
      return "posted a comment";
    default:
      return activity.action;
  }
}
