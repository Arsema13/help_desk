"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createTicket } from "@/actions/tickets";
import { createTicketSchema, type CreateTicketInput } from "@/schemas";
import { Send, AlertCircle } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
    >
      <Send className="h-4 w-4" />
      {pending ? "Submitting Incident..." : "Submit Ticket"}
    </button>
  );
}

export function CreateTicketForm() {
  const [state, formAction] = useActionState(createTicket, undefined);
  const {
    register,
    formState: { errors },
  } = useForm<CreateTicketInput>({
    resolver: zodResolver(createTicketSchema),
  });

  return (
    <form action={formAction} className="space-y-5">
      {state?.error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{state.error}</span>
        </div>
      )}

      <div>
        <label
          htmlFor="title"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
        >
          Incident Title
        </label>
        <input
          {...register("title")}
          type="text"
          id="title"
          placeholder="Brief summary of the issue..."
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-rose-400">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
        >
          Detailed Description
        </label>
        <textarea
          {...register("description")}
          id="description"
          rows={4}
          placeholder="Provide step-by-step detail or error logs..."
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
        />
        {errors.description && (
          <p className="mt-1 text-xs text-rose-400">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="category"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
          >
            Category
          </label>
          <select
            {...register("category")}
            id="category"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none"
          >
            <option value="IT_SUPPORT">IT Support</option>
            <option value="FACILITIES">Facilities</option>
            <option value="HR">Human Resources</option>
            <option value="OTHER">Other</option>
          </select>
          {errors.category && (
            <p className="mt-1 text-xs text-rose-400">
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="priority"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
          >
            Priority Level
          </label>
          <select
            {...register("priority")}
            id="priority"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none"
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="CRITICAL">Critical SLA</option>
          </select>
          {errors.priority && (
            <p className="mt-1 text-xs text-rose-400">
              {errors.priority.message}
            </p>
          )}
        </div>
      </div>

      <SubmitButton />
    </form>
  );
}
