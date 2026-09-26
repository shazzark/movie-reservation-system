"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowUpRight, BarChart3, Film, Users, Building2, CalendarClock, Ticket } from "lucide-react";
import { cn } from "@/lib/utils";
import AdminLogo from "./admin-logo";

const adminLinks = [
  { label: "Overview", href: "/admin", icon: BarChart3 },
  { label: "Movies", href: "/admin/movies", icon: Film },
  { label: "Theaters", href: "/admin/theaters", icon: Building2 },
  { label: "Showtimes", href: "/admin/showtimes", icon: CalendarClock },
  { label: "Reservations", href: "/admin/reservations", icon: Ticket },
  { label: "Users", href: "/admin/users", icon: Users },
];

export function AdminSidebar({
  open,
  onNavigate,
}: {
  open: boolean;
  onNavigate: () => void;
}) {
  const pathname = usePathname();

  return (
    <aside
      id="admin-navigation"
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
        open ? "translate-x-0" : "-translate-x-full",
      )}
    >
      <div className="border-b border-sidebar-border px-6 py-5">
        <AdminLogo />
      </div>

      <nav aria-label="Admin navigation" className="flex-1 space-y-2 overflow-y-auto px-4 py-7">
        <p className="px-3 pb-2 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Workspace
        </p>
        {adminLinks.map(({ label, href, icon: Icon }) => {
          const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring",
                active
                  ? "bg-sidebar-accent text-sidebar-foreground before:mr-0.5 before:h-5 before:w-1 before:rounded-full before:bg-sidebar-primary"
                  : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground",
              )}
            >
              <Icon className="size-4" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-sidebar-border p-4">
        <Link
          href="/"
          onClick={onNavigate}
          className="flex items-center justify-between rounded-xl px-3 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
        >
          View customer site
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </aside>
  );
}
