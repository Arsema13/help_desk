import { LoginForm } from "@/components/forms/LoginForm";
import { Card } from "@/components/ui/Card";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-ambient-glow px-4 py-12">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute h-96 w-96 rounded-full bg-sky-500/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-sky-600 to-cyan-400 shadow-lg shadow-sky-500/30 ring-1 ring-white/20 mb-3">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-white">
            Helpdesk Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Operations Management led by Eden Hailu
          </p>
        </div>

        <Card className="w-full">
          <LoginForm />
        </Card>
      </div>
    </div>
  );
}
