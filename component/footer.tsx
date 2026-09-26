import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import Logo from "./logo";

const footerLinks = [
  { href: "/movies", label: "Movies" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-card/70">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 border-b border-border pb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-md space-y-4">
            <Logo />
            <p className="text-sm leading-6 text-muted-foreground">
              Discover a film, choose a showtime, and find your seat.
            </p>
          </div>
          <Link
            href="/movies"
            className="inline-flex w-fit items-center gap-2 rounded-lg text-sm font-semibold text-primary transition-colors hover:text-[#ff8da3] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Explore movies <ArrowUpRight className="size-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="flex flex-col gap-5 pt-7 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} CineBook.</p>
          <nav aria-label="Footer navigation" className="flex flex-wrap gap-x-6 gap-y-3">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
