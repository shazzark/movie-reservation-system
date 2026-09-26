import type { Metadata } from "next";
import { AdminMovies } from "../../../component/admin/admin-movie";

export const metadata: Metadata = {
  title: "Movies - Admin - CineBook",
  description: "Manage movies in the reservation system",
};

export default function AdminMoviesPage() {
  return <AdminMovies />;
}
