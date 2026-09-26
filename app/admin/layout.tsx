import type { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AdminShell } from "@/component/admin/admin-shell";
import { authOptions } from "@/lib/auth";
import { getAdminAccessState } from "@/lib/admin-access";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);
  const access = getAdminAccessState(session?.user);
  if (access === "unauthenticated") {
    redirect("/login?callbackUrl=%2Fadmin");
  }
  if (access === "forbidden") {
    redirect("/");
  }

  return <AdminShell>{children}</AdminShell>;
}
