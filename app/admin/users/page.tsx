import type { Metadata } from "next";
import { AdminSidebar } from "../../../component/admin/admin-sidebar";
import { AdminUsers } from "../../../component/admin/admin-user";

export const metadata: Metadata = {
  title: "Users - Admin - CineBook",
  description: "Manage users in the reservation system",
};

export default function AdminUsersPage() {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <AdminUsers />
        </div>
      </main>
    </div>
  );
}
