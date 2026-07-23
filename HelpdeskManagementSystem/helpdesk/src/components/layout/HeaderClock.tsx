"use client";

import { useEffect, useState } from "react";
import { Clock, Calendar } from "lucide-react";

export function HeaderClock() {
  const [timeString, setTimeString] = useState("");
  const [dateString, setDateString] = useState("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
      );
      setDateString(
        now.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
      );
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!timeString) return null;

  return (
    <div className="hidden sm:flex items-center gap-4 rounded-xl border border-slate-800/80 bg-slate-900/60 px-3.5 py-1.5 backdrop-blur-md">
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Calendar className="h-3.5 w-3.5 text-sky-400" />
        <span className="font-medium">{dateString}</span>
      </div>
      <div className="h-3.5 w-px bg-slate-800" />
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
        <Clock className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
        <span>{timeString}</span>
      </div>
    </div>
  );
}
