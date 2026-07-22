"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { addComment } from "@/actions/tickets";
import { addCommentSchema, type AddCommentInput } from "@/schemas";
import { Send } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-cyan-400 disabled:opacity-50 transition-all"
    >
      <Send className="h-3.5 w-3.5" />
      {pending ? "Posting..." : "Post Comment"}
    </button>
  );
}

interface CommentFormProps {
  ticketId: string;
}

export function CommentForm({ ticketId }: CommentFormProps) {
  const [state, formAction] = useActionState(addComment, undefined);
  const {
    register,
    formState: { errors },
  } = useForm<AddCommentInput>({
    resolver: zodResolver(addCommentSchema),
  });

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="ticketId" value={ticketId} />
      {state?.success && (
        <p className="text-xs text-emerald-400 font-semibold">{state.success}</p>
      )}
      {state?.error && (
        <p className="text-xs text-rose-400 font-semibold">{state.error}</p>
      )}
      <div>
        <label
          htmlFor="message"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5"
        >
          Add to discussion
        </label>
        <textarea
          {...register("message")}
          id="message"
          rows={3}
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
          placeholder="Type an update or comment..."
        />
        {errors.message && (
          <p className="mt-1 text-xs text-rose-400">{errors.message.message}</p>
        )}
      </div>
      <SubmitButton />
    </form>
  );
}
