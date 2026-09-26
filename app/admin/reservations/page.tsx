import type { Metadata } from "next";
import { AdminReservations } from "@/component/admin/admin-cms";

export const metadata: Metadata = { title: "Reservations · CineBook Admin" };
export default function AdminReservationsPage() { return <AdminReservations />; }
