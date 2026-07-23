export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    OPEN: "bg-amber-500/15 text-amber-300 border border-amber-500/30",
    ASSIGNED: "bg-sky-500/15 text-sky-300 border border-sky-500/30",
    IN_PROGRESS: "bg-purple-500/15 text-purple-300 border border-purple-500/30",
    RESOLVED: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30",
    CLOSED: "bg-slate-800/60 text-slate-400 border border-slate-700/50",
  };
  return colors[status] || "bg-slate-800/60 text-slate-300 border border-slate-700/50";
}

export function getPriorityColor(priority: string): string {
  const colors: Record<string, string> = {
    LOW: "bg-slate-800/60 text-slate-400 border border-slate-700/50",
    MEDIUM: "bg-blue-500/15 text-blue-300 border border-blue-500/30",
    HIGH: "bg-orange-500/15 text-orange-300 border border-orange-500/30",
    CRITICAL: "bg-rose-500/20 text-rose-300 border border-rose-500/40",
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
