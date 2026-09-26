import type { Metadata } from "next";
import { AdminUsers } from "../../../component/admin/admin-user";

export const metadata: Metadata = {
  title: "Users - Admin - CineBook",
  description: "Manage users in the reservation system",
};

export default function AdminUsersPage() {
  return <AdminUsers />;
}
