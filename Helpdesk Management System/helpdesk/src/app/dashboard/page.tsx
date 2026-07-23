import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { ManagerDashboard } from "@/components/dashboard/ManagerDashboard";
import { TechnicalDashboard } from "@/components/dashboard/TechnicalDashboard";
import { EmployeeDashboard } from "@/components/dashboard/EmployeeDashboard";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-ambient-glow text-slate-100">
      <Sidebar user={user} />
      <div className="md:pl-64 transition-all duration-300">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {user.role === "MANAGER" && <ManagerDashboard />}
          {user.role === "TECHNICAL" && <TechnicalDashboard />}
          {user.role === "EMPLOYEE" && <EmployeeDashboard />}
        </main>
      </div>
    </div>
  );
}
