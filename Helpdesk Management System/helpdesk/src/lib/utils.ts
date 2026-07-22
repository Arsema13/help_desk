export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    OPEN: "bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.2)]",
    ASSIGNED: "bg-sky-500/15 text-sky-300 border border-sky-500/30 shadow-[0_0_10px_rgba(56,189,248,0.2)]",
    IN_PROGRESS: "bg-purple-500/15 text-purple-300 border border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]",
    RESOLVED: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]",
    CLOSED: "bg-slate-800/60 text-slate-400 border border-slate-700/50",
  };
  return colors[status] || "bg-slate-800/60 text-slate-300 border border-slate-700/50";
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    LOW: "bg-slate-800/60 text-slate-400 border border-slate-700/50",
    MEDIUM: "bg-blue-500/15 text-blue-300 border border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]",
    HIGH: "bg-orange-500/15 text-orange-300 border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]",
    CRITICAL: "bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_12px_rgba(244,63,94,0.3)] animate-pulse",
  };
  return colors[priority] || "bg-slate-800/60 text-slate-300 border border-slate-700/50";
}

export function formatRole(role: string): string {
  const roles: Record<string, string> = {
    MANAGER: "Manager",
    TECHNICAL: "Technical Support",
    EMPLOYEE: "Employee",
  };
  return roles[role] || role;
}

export function formatCategory(category: string): string {
  const categories: Record<string, string> = {
    IT_SUPPORT: "IT Support",
    FACILITIES: "Facilities",
    HR: "Human Resources",
    OTHER: "Other",
  };
  return categories[category] || category;
}

export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
