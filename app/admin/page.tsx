import type { Metadata } from "next";
import { AdminDashboard } from "../../component/admin/admin-dashboard";

// @/components/admin/admin-dashboard
export const metadata: Metadata = {
  title: "Admin Dashboard - CineBook",
  description: "Movie reservation system admin dashboard",
};

export default function AdminPage() {
  return <AdminDashboard />;
}
