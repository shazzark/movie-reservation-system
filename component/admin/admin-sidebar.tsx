"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Film, BarChart3, Users, Settings, LogOut } from "lucide-react";
import { Button } from "../../component/ui/button";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

import AdminLogo from "./admin-logo";

const adminLinks = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: BarChart3,
  },
  {
    label: "Movies",
    href: "/admin/movies",
    icon: Film,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: Users,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-card border-r border-border h-screen flex flex-col sticky top-0"
    >
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <AdminLogo />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {adminLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <li key={link.href}>
                <Link href={link.href}>
                  <motion.button
                    whileHover={{ x: 4 }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 rounded-md transition-colors",
                      isActive
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    <span className="text-sm font-medium">{link.label}</span>
                  </motion.button>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <Link href="/">
          <Button variant="outline" className="w-full gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Exit Admin
          </Button>
        </Link>
      </div>
    </motion.aside>
  );
}
