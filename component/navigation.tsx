"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { Button } from "../component/ui/button";
import { cn } from "../lib/utils";
import Logo from "../component/logo";
import { useSession, signOut } from "next-auth/react";
import type { Session } from "next-auth";

interface NavLinksProps {
  isActive: (href: string) => boolean;
  pathname: string;
  session: Session | null;
  isMobile?: boolean;
}

interface CustomUser {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

export function Navigation() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoading = status === "loading";

  const isActive = (href: string) => pathname === href;
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          <Logo />

          {/* Desktop Navigation */}
          <div className="hidden gap-1 md:flex">
            <NavLinks
              isActive={isActive}
              pathname={pathname}
              session={session}
            />
          </div>

          <div className="flex items-center gap-2">
            {!isLoading && (
              <>
                {session ? (
                  <>
                    {" "}
                    {/* Wrapped in fragment to fix JSX error */}
                    <Link href="/profile">
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "cursor-pointer gap-2 text-foreground",
                          isActive("/profile") && "text-white bg-purple-600/30",
                        )}
                      >
                        <User className="h-4 w-4" />
                        <span className="hidden sm:inline">
                          {session.user?.name}
                        </span>
                      </Button>
                    </Link>
                    {/* Desktop Logout Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="hidden md:flex cursor-pointer text-slate-300 border-red-500/30 hover:bg-red-500/10 gap-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="hidden lg:inline">Logout</span>
                    </Button>
                  </>
                ) : (
                  <div className="hidden sm:flex gap-2">
                    <Link href="/login">
                      <Button variant="outline" size="sm">
                        Sign In
                      </Button>
                    </Link>

                    <Link href="/signup">
                      <Button size="sm" className="hidden sm:flex">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}

                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden text-slate-300"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  {isMenuOpen ? (
                    <X className="h-6 w-6 text-foreground" />
                  ) : (
                    <Menu className="h-6 w-6 text-foreground" />
                  )}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 border-t border-border mt-3 space-y-2 animate-in slide-in-from-top-5">
            <div className="flex flex-col gap-2" onClick={closeMenu}>
              <NavLinks
                isActive={isActive}
                pathname={pathname}
                session={session}
                isMobile
              />

              {session ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full justify-start text-red-400 border-red-500/30 gap-2"
                >
                  <LogOut className="h-4 w-4" /> Logout
                </Button>
              ) : (
                <div className="flex flex-col gap-2 pt-2">
                  <Link href="/login">
                    <Button variant="outline" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full">Sign Up</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLinks({
  isActive,
  pathname,
  session,
  isMobile = false,
}: NavLinksProps) {
  const linkClass = isMobile
    ? "w-full justify-start text-lg px-4 py-6"
    : "cursor-pointer text-slate-300 hover:text-white";

  return (
    <>
      <Link href="/" className={isMobile ? "w-full" : ""}>
        <Button
          variant="ghost"
          className={cn(
            linkClass,
            isActive("/") && "bg-purple-600/30 text-white",
          )}
        >
          Home
        </Button>
      </Link>

      {(session?.user as CustomUser)?.role === "admin" && (
        <Link href="/admin" className={isMobile ? "w-full" : ""}>
          <Button
            variant="ghost"
            className={cn(
              linkClass,
              "text-amber-400 hover:text-amber-300",
              pathname.startsWith("/admin") && "bg-amber-500/20 text-white",
            )}
          >
            <LayoutDashboard className="mr-2 h-4 w-4" /> Admin
          </Button>
        </Link>
      )}

      <Link href="/movies" className={isMobile ? "w-full" : ""}>
        <Button
          variant="ghost"
          className={cn(
            linkClass,
            (isActive("/movies") || pathname.startsWith("/movie/")) &&
              "bg-purple-600/30 text-white",
          )}
        >
          Movies
        </Button>
      </Link>

      <Link href="/about" className={isMobile ? "w-full" : ""}>
        <Button
          variant="ghost"
          className={cn(
            linkClass,
            isActive("/about") && "bg-purple-600/30 text-white",
          )}
        >
          About
        </Button>
      </Link>

      <Link href="/contact" className={isMobile ? "w-full" : ""}>
        <Button
          variant="ghost"
          className={cn(
            linkClass,
            isActive("/contact") && "bg-purple-600/30 text-white",
          )}
        >
          Contact
        </Button>
      </Link>
    </>
  );
}
