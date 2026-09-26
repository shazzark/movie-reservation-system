import type { Metadata } from "next";
import { AdminShowtimes } from "@/component/admin/admin-cms";

export const metadata: Metadata = { title: "Showtimes · CineBook Admin" };
export default function AdminShowtimesPage() { return <AdminShowtimes />; }
