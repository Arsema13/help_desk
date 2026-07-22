import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { TicketFilters } from "@/components/tickets/TicketFilters";
import { TicketTable } from "@/components/tickets/TicketTable";
import Link from "next/link";
import { PlusCircle, Ticket as TicketIcon } from "lucide-react";

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const resolvedParams = await searchParams;

  const users =
    user.role === "MANAGER"
      ? await prisma.user.findMany({
          where: { role: "TECHNICAL" },
          select: { id: true, name: true },
        })
      : [];

  return (
    <div className="min-h-screen bg-ambient-glow text-slate-100">
      <Sidebar user={user} />
      <div className="pl-20 md:pl-64 transition-all duration-300">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-sky-400">
                <TicketIcon className="h-5 w-5" />
                <span className="text-xs font-mono uppercase tracking-wider font-bold">Ticket Management</span>
              </div>
              <h1 className="mt-1 text-2xl font-bold text-white">
                All Incidents & Requests
              </h1>
            </div>
            {user.role === "EMPLOYEE" && (
              <Link
                href="/tickets/create"
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-cyan-500 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-sky-500/20 hover:from-sky-400 hover:to-cyan-400 transition-all active:scale-95 shrink-0"
              >
                <PlusCircle className="h-4 w-4" /> Create Ticket
              </Link>
            )}
          </div>

          <Suspense fallback={<div className="text-xs text-slate-400">Loading filters...</div>}>
            <TicketFilters userRole={user.role} users={users} />
          </Suspense>

          <div className="mt-6">
            <Suspense
              fallback={
                <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-12 text-center backdrop-blur-xl">
                  <p className="text-slate-400 text-xs animate-pulse">Loading tickets database...</p>
                </div>
              }
            >
              <TicketTable searchParams={resolvedParams} />
            </Suspense>
          </div>
        </main>
      </div>
    </div>
  );
}
