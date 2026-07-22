import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { TicketDetail } from "@/components/tickets/TicketDetail";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { id } = await params;

  return (
    <div className="min-h-screen bg-ambient-glow text-slate-100">
      <Sidebar user={user} />
      <div className="pl-20 md:pl-64 transition-all duration-300">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Suspense
            fallback={
              <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-12 text-center backdrop-blur-xl">
                <p className="text-slate-400 text-xs animate-pulse">Loading incident details...</p>
              </div>
            }
          >
            <TicketDetail ticketId={id} />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
