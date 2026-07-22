import { Card } from "./Card";
import { TrendingUp, Activity, AlertCircle, Clock, CheckCircle2 } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  trend?: string;
  accent?: "blue" | "amber" | "emerald" | "rose" | "purple";
  iconType?: "total" | "critical" | "high" | "open" | "success";
}

export function StatCard({
  title,
  value,
  description,
  trend = "+12% this week",
  accent = "blue",
  iconType = "total",
}: StatCardProps) {
  const accentStyles = {
    blue: {
      border: "border-sky-500/20 hover:border-sky-500/40",
      glow: "text-sky-400 drop-shadow-[0_0_12px_rgba(56,189,248,0.5)]",
      iconBg: "bg-sky-500/10 text-sky-400 ring-1 ring-sky-500/30",
    },
    amber: {
      border: "border-amber-500/20 hover:border-amber-500/40",
      glow: "text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)]",
      iconBg: "bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30",
    },
    emerald: {
      border: "border-emerald-500/20 hover:border-emerald-500/40",
      glow: "text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.5)]",
      iconBg: "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30",
    },
    rose: {
      border: "border-rose-500/20 hover:border-rose-500/40",
      glow: "text-rose-400 drop-shadow-[0_0_12px_rgba(251,113,133,0.5)]",
      iconBg: "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/30",
    },
    purple: {
      border: "border-purple-500/20 hover:border-purple-500/40",
      glow: "text-purple-400 drop-shadow-[0_0_12px_rgba(192,132,252,0.5)]",
      iconBg: "bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/30",
    },
  }[accent];

  const renderIcon = () => {
    switch (iconType) {
      case "critical":
        return <AlertCircle className="h-5 w-5" />;
      case "high":
        return <Activity className="h-5 w-5" />;
      case "open":
        return <Clock className="h-5 w-5" />;
      case "success":
        return <CheckCircle2 className="h-5 w-5" />;
      default:
        return <TrendingUp className="h-5 w-5" />;
    }
  };

  return (
    <Card className={`relative overflow-hidden ${accentStyles.border} transition-all duration-300`}>
      {/* Background soft radial light */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-sky-500/5 blur-2xl" />

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {title}
        </span>
        <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${accentStyles.iconBg}`}>
          {renderIcon()}
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <p className={`text-4xl font-extrabold tracking-tight ${accentStyles.glow}`}>
          {value}
        </p>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
          <TrendingUp className="h-3 w-3" />
          {trend}
        </span>
        {description && (
          <span className="text-[11px] text-slate-500">• {description}</span>
        )}
      </div>
    </Card>
  );
}
