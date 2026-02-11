import type { Metadata } from "next";
import { AdminSidebar } from "../../component/admin/admin-sidebar";
import { AdminDashboard } from "../../component/admin/admin-dashboard";

// @/components/admin/admin-dashboard
export const metadata: Metadata = {
  title: "Admin Dashboard - CineBook",
  description: "Movie reservation system admin dashboard",
};

export default function AdminPage() {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <AdminDashboard />
        </div>
      </main>
    </div>
  );
}
