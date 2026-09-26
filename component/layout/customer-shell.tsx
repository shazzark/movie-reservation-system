import type { ReactNode } from "react";
import { Navigation } from "@/component/navigation";
import { Footer } from "@/component/footer";
import { cn } from "@/lib/utils";

export function CustomerShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Navigation />
      <main id="main-content" className={cn("flex-1", className)}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
