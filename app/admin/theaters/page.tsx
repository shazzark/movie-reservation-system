import type { Metadata } from "next";
import { AdminTheaters } from "@/component/admin/admin-cms";

export const metadata: Metadata = { title: "Theaters · CineBook Admin" };
export default function AdminTheatersPage() { return <AdminTheaters />; }
