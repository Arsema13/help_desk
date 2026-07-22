"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useRef } from "react";
import { useFormStatus } from "react-dom";
import { login } from "@/actions/auth";
import { loginSchema, type LoginInput } from "@/schemas";
import Link from "next/link";
import { Sparkles, Shield, Wrench, User, LogIn } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 py-3 text-sm font-bold text-white shadow-lg shadow-sky-500/25 hover:from-sky-400 hover:to-cyan-400 disabled:opacity-50 transition-all"
    >
      <LogIn className="h-4 w-4" />
      {pending ? "Authenticating..." : "Sign In to Portal"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState(login, undefined);
  const {
    register,
    setValue,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const formRef = useRef<HTMLFormElement>(null);

  const fillQuickLogin = (email: string) => {
    setValue("email", email);
    setValue("password", "password123");
    if (formRef.current) {
      formRef.current.requestSubmit();
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Ethiopian Demo Login Presets */}
      <div className="rounded-2xl border border-sky-500/20 bg-slate-900/60 p-4 backdrop-blur-xl">
        <span className="text-[11px] font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5 mb-2.5">
          <Sparkles className="h-3.5 w-3.5 text-sky-400 animate-pulse" /> 1-Click Demo Ethiopian Logins
        </span>

        <div className="grid gap-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => fillQuickLogin("manager1@company.com")}
            className="flex flex-col items-center justify-center rounded-xl border border-sky-500/30 bg-sky-500/10 p-2.5 hover:bg-sky-500/20 transition-all text-center group"
          >
            <Shield className="h-4 w-4 text-sky-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-white">Eden Hailu</span>
            <span className="text-[10px] text-sky-300">Manager</span>
          </button>

          <button
            type="button"
            onClick={() => fillQuickLogin("tech2@company.com")}
            className="flex flex-col items-center justify-center rounded-xl border border-purple-500/30 bg-purple-500/10 p-2.5 hover:bg-purple-500/20 transition-all text-center group"
          >
            <Wrench className="h-4 w-4 text-purple-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-white">Selamawit</span>
            <span className="text-[10px] text-purple-300">Technical</span>
          </button>

          <button
            type="button"
            onClick={() => fillQuickLogin("emp1@company.com")}
            className="flex flex-col items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-2.5 hover:bg-emerald-500/20 transition-all text-center group"
          >
            <User className="h-4 w-4 text-emerald-400 mb-1 group-hover:scale-110 transition-transform" />
            <span className="text-xs font-bold text-white">Almaz Ayana</span>
            <span className="text-[10px] text-emerald-300">Employee</span>
          </button>
        </div>
      </div>

      <form ref={formRef} action={formAction} className="space-y-4">
        {state?.error && (
          <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
            {state.error}
          </div>
        )}
        <div>
          <label
            htmlFor="email"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1"
          >
            Work Email Address
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            placeholder="e.g. manager1@company.com"
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
            {...register("password")}
            type="password"
            id="password"
            placeholder="••••••••"
            className="w-full rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500/50"
          />
          {errors.password && (
            <p className="mt-1 text-xs text-rose-400">{errors.password.message}</p>
          )}
        </div>
        <SubmitButton />
        <p className="text-center text-xs text-slate-400 pt-2">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="font-semibold text-sky-400 hover:underline"
          >
            Create account
          </Link>
        </p>
      </form>
    </div>
  );
}
