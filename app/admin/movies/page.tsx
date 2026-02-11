import type { Metadata } from "next";
import { AdminSidebar } from "../../../component/admin/admin-sidebar";
import { AdminMovies } from "../../../component/admin/admin-movie";

export const metadata: Metadata = {
  title: "Movies - Admin - CineBook",
  description: "Manage movies in the reservation system",
};

export default function AdminMoviesPage() {
  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          <AdminMovies />
        </div>
      </main>
    </div>
  );
}
