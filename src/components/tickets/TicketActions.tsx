"use client";

import { useActionState } from "react";
import {
  assignTicket,
  updateStatus,
  updatePriority,
  deleteTicket,
} from "@/actions/tickets";
import { useRouter } from "next/navigation";
import type { Ticket } from "@prisma/client";
import { UserCheck, RefreshCw, AlertTriangle, Trash2 } from "lucide-react";

type TicketWithUsers = Ticket & {
  assignedTo: { id: string; name: string } | null;
  createdBy: { id: string; name: string };
};

type ActionState = { error?: string; success?: string } | undefined;

function AssignForm({
  ticket,
  technicalUsers,
}: {
  ticket: TicketWithUsers;
  technicalUsers: { id: string; name: string }[];
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    assignTicket,
    undefined
  );

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="ticketId" value={ticket.id} />
      {state?.success && (
        <p className="text-xs text-emerald-400 font-semibold">{state.success}</p>
      )}
      {state?.error && (
        <p className="text-xs text-rose-400 font-semibold">{state.error}</p>
      )}
      <select
        name="assignedToId"
        defaultValue=""
        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
      >
        <option value="" disabled>
          Select engineer...
        </option>
        {technicalUsers.map((u) => (
          <option key={u.id} value={u.id}>
            {u.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-sky-600 py-2 text-xs font-bold text-white hover:bg-sky-500 transition-all shadow-md shadow-sky-600/20"
      >
        <UserCheck className="h-3.5 w-3.5" /> Assign Engineer
      </button>
    </form>
  );
}

function StatusForm({
  ticket,
  userRole,
}: {
  ticket: TicketWithUsers;
  userRole: string;
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    updateStatus,
    undefined
  );

  const getStatusOptions = () => {
    switch (userRole) {
      case "MANAGER":
        return ["OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED"];
      case "TECHNICAL":
        return ["IN_PROGRESS", "RESOLVED"];
      case "EMPLOYEE":
        return ["CLOSED"];
      default:
        return [];
    }
  };

  const options = getStatusOptions();

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="ticketId" value={ticket.id} />
      {state?.success && (
        <p className="text-xs text-emerald-400 font-semibold">{state.success}</p>
      )}
      {state?.error && (
        <p className="text-xs text-rose-400 font-semibold">{state.error}</p>
      )}
      <select
        name="status"
        defaultValue=""
        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
      >
        <option value="" disabled>
          Select new status...
        </option>
        {options.map((s) => (
          <option key={s} value={s}>
            {s.replace("_", " ")}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-800 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all"
      >
        <RefreshCw className="h-3.5 w-3.5 text-sky-400" /> Update Status
      </button>
    </form>
  );
}

function PriorityForm({ ticket }: { ticket: TicketWithUsers }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    updatePriority,
    undefined
  );

  return (
    <form action={formAction} className="space-y-2">
      <input type="hidden" name="ticketId" value={ticket.id} />
      {state?.success && (
        <p className="text-xs text-emerald-400 font-semibold">{state.success}</p>
      )}
      {state?.error && (
        <p className="text-xs text-rose-400 font-semibold">{state.error}</p>
      )}
      <select
        name="priority"
        defaultValue=""
        className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3 py-2 text-xs text-white focus:border-sky-500 focus:outline-none"
      >
        <option value="" disabled>
          Select new priority...
        </option>
        {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((p) => (
          <option key={p} value={p}>
            {p}
          </option>
        ))}
      </select>
      <button
        type="submit"
        className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-slate-800 py-2 text-xs font-bold text-slate-200 hover:bg-slate-700 transition-all"
      >
        <AlertTriangle className="h-3.5 w-3.5 text-amber-400" /> Update Priority
      </button>
    </form>
  );
}

function DeleteForm({ ticket }: { ticket: TicketWithUsers }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (confirm("Are you sure you want to permanently purge this ticket?")) {
      await deleteTicket(ticket.id);
      router.push("/tickets");
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-rose-600/20 border border-rose-500/40 py-2 text-xs font-bold text-rose-400 hover:bg-rose-600 hover:text-white transition-all"
    >
      <Trash2 className="h-3.5 w-3.5" /> Purge Ticket
    </button>
  );
}

interface TicketActionsProps {
  ticket: TicketWithUsers;
  userId: string;
  userRole: string;
  technicalUsers: { id: string; name: string }[];
}

export function TicketActions({
  ticket,
  userId,
  userRole,
  technicalUsers,
}: TicketActionsProps) {
  return (
    <div className="space-y-4 text-xs">
      {userRole === "MANAGER" && (
        <>
          <div>
            <h3 className="mb-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
              Assign Engineer
            </h3>
            <AssignForm ticket={ticket} technicalUsers={technicalUsers} />
          </div>
          <div>
            <h3 className="mb-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
              Update Status
            </h3>
            <StatusForm ticket={ticket} userRole={userRole} />
          </div>
          <div>
            <h3 className="mb-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
              Change Priority
            </h3>
            <PriorityForm ticket={ticket} />
          </div>
          <div className="pt-2 border-t border-slate-800">
            <h3 className="mb-1.5 font-semibold text-rose-400 uppercase tracking-wider text-[11px]">
              Danger Zone
            </h3>
            <DeleteForm ticket={ticket} />
          </div>
        </>
      )}

      {userRole === "TECHNICAL" && ticket.assignedToId === userId && (
        <div>
          <h3 className="mb-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
            Update Status
          </h3>
          <StatusForm ticket={ticket} userRole={userRole} />
        </div>
      )}

      {userRole === "EMPLOYEE" && ticket.createdById === userId && (
        <div>
          <h3 className="mb-1.5 font-semibold text-slate-400 uppercase tracking-wider text-[11px]">
            Close Ticket
          </h3>
          <StatusForm ticket={ticket} userRole={userRole} />
        </div>
      )}
    </div>
  );
}
