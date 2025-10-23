import type React from "react";
import { DashboardHeader } from "@/components/dashboard-header";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardHeader />
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}


