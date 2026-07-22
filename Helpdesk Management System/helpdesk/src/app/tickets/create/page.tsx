import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { CreateTicketForm } from "@/components/forms/CreateTicketForm";
import { Card } from "@/components/ui/Card";
import { PlusCircle } from "lucide-react";

export default async function CreateTicketPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-ambient-glow text-slate-100">
      <Sidebar user={user} />
      <div className="pl-20 md:pl-64 transition-all duration-300">
        <Header />
        <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
          <div>
            <div className="flex items-center gap-2 text-sky-400">
              <PlusCircle className="h-5 w-5" />
              <span className="text-xs font-mono uppercase tracking-wider font-bold">New Ticket Request</span>
            </div>
            <h1 className="mt-1 text-2xl font-bold text-white">
              Submit Support Ticket
            </h1>
            <p className="text-xs text-slate-400">
              Provide incident details for quick dispatch to IT Lead Eden Hailu and engineering team.
            </p>
          </div>
          <Card>
            <CreateTicketForm />
          </Card>
        </main>
      </div>
    </div>
  );
}
