"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { register } from "@/actions/auth";
import { registerSchema, type RegisterInput } from "@/schemas";
import Link from "next/link";
import { UserPlus } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-cyan-400 disabled:opacity-50 transition-all"
    >
      <UserPlus className="h-4 w-4" />
      {pending ? "Registering account..." : "Create Account"}
    </button>
  );
}

export function RegisterForm() {
  const [state, formAction] = useActionState(register, undefined);
  const {
    register: registerField,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          {state.error}
        </div>
      )}
      <div>
        <label
          htmlFor="name"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1"
        >
          Full Name
        </label>
        <input
          {...registerField("name")}
          type="text"
          id="name"
          placeholder="e.g. Eden Hailu"
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
        />
        {errors.name && (
          <p className="mt-1 text-xs text-rose-400">{errors.name.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="email"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1"
        >
          Email Address
        </label>
        <input
          {...registerField("email")}
          type="email"
          id="email"
          placeholder="eden.hailu@company.com"
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
        />
        {errors.email && (
          <p className="mt-1 text-xs text-rose-400">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="password"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1"
        >
          Password
        </label>
        <input
          {...registerField("password")}
          type="password"
          id="password"
          placeholder="••••••••"
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
        />
        {errors.password && (
          <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="role"
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1"
        >
          Account Role
        </label>
        <select
          {...registerField("role")}
          id="role"
          className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white focus:border-sky-500 focus:outline-none"
        >
          <option value="EMPLOYEE">Employee</option>
          <option value="TECHNICAL">Technical Support</option>
          <option value="MANAGER">Operations Manager</option>
        </select>
        {errors.role && (
          <p className="mt-1 text-xs text-rose-400">{errors.role.message}</p>
        )}
      </div>
      <SubmitButton />
      <p className="text-center text-xs text-slate-400 pt-2">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-sky-400 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
