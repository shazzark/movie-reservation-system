"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { ArrowUpRight, Menu } from "lucide-react";
import { AdminSidebar } from "./admin-sidebar";

const titles: Record<string, string> = {
  "/admin": "Overview",
  "/admin/movies": "Movies",
  "/admin/theaters": "Theaters",
  "/admin/showtimes": "Showtimes",
  "/admin/reservations": "Reservations",
  "/admin/users": "Users",
};

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const title = titles[pathname] ?? "Admin";

  useEffect(() => {
    if (!menuOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-background lg:flex">
      <a href="#admin-main" className="sr-only z-[60] rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      {menuOpen && (
        <button
          type="button"
          aria-label="Close admin menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/70 lg:hidden"
        />
      )}
      <AdminSidebar open={menuOpen} onNavigate={() => setMenuOpen(false)} />
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-xl">
          <div className="mx-auto flex h-18 max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
            <div className="flex min-w-0 items-center gap-3">
              <button
                type="button"
                ref={menuButtonRef}
                aria-label="Open admin menu"
                aria-controls="admin-navigation"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(true)}
                className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
              >
                <Menu className="size-5" aria-hidden="true" />
              </button>
              <div className="min-w-0">
                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">CineBook Studio</p>
                <p className="truncate text-base font-semibold text-foreground">{title}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/" className="hidden items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:inline-flex">
                View site <ArrowUpRight className="size-4" aria-hidden="true" />
              </Link>
              <span className="flex size-9 items-center justify-center rounded-full border border-primary/30 bg-primary/15 text-sm font-semibold text-primary" title={session?.user?.name ?? "Admin account"}>
                {(session?.user?.name ?? "A").charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </header>
        <main id="admin-main" className="mx-auto w-full max-w-[1500px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
          {children}
        </main>
      </div>
    </div>
  );
}
