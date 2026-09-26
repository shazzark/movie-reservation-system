"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { LogOut, Menu, X } from "lucide-react";
import Logo from "./logo";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/movies", label: "Movies" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

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

  const isActive = (href: string) =>
    href === "/movies"
      ? pathname === href || pathname.startsWith("/movie/") || pathname.startsWith("/seats/")
      : pathname === href;

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-background/95 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo />

        <nav aria-label="Primary navigation" className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                isActive(item.href) ? "bg-secondary text-foreground" : "text-muted-foreground",
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {status === "authenticated" && session ? (
            <>
              {session.user.role === "admin" && (
                <Link href="/admin" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  Admin
                </Link>
              )}
              <Link href="/profile" className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                My bookings
              </Link>
              <Button variant="ghost" size="sm" onClick={() => void signOut({ callbackUrl: "/" })} aria-label="Sign out">
                <LogOut className="size-4" aria-hidden="true" />
                Sign out
              </Button>
            </>
          ) : status === "unauthenticated" ? (
            <>
              <Button asChild variant="ghost" size="sm"><Link href="/login">Sign in</Link></Button>
              <Button asChild size="sm"><Link href="/signup">Create account</Link></Button>
            </>
          ) : null}
        </div>

        <button
          type="button"
          ref={menuButtonRef}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          onClick={() => setMenuOpen((open) => !open)}
          className="inline-flex size-10 items-center justify-center rounded-xl border border-border text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring md:hidden"
        >
          {menuOpen ? <X className="size-5" aria-hidden="true" /> : <Menu className="size-5" aria-hidden="true" />}
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-border bg-card px-4 py-4 md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "rounded-xl px-4 py-3 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  isActive(item.href) ? "bg-primary/15 text-primary" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                {item.label}
              </Link>
            ))}
            <div className="my-2 border-t border-border" />
            {status === "authenticated" && session ? (
              <>
                <Link href="/profile" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary">My bookings</Link>
                {session.user.role === "admin" && <Link href="/admin" onClick={() => setMenuOpen(false)} className="rounded-xl px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary">Admin</Link>}
                <button type="button" onClick={() => void signOut({ callbackUrl: "/" })} className="rounded-xl px-4 py-3 text-left text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">Sign out</button>
              </>
            ) : status === "unauthenticated" ? (
              <div className="grid grid-cols-2 gap-3 pt-1">
                <Button asChild variant="outline"><Link href="/login" onClick={() => setMenuOpen(false)}>Sign in</Link></Button>
                <Button asChild><Link href="/signup" onClick={() => setMenuOpen(false)}>Create account</Link></Button>
              </div>
            ) : null}
          </div>
        </nav>
      )}
    </header>
  );
}
