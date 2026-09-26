import { Film } from "lucide-react";
import Link from "next/link";

function Logo() {
  return (
    <Link
      href="/"
      aria-label="CineBook home"
      className="inline-flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_8px_24px_rgba(243,81,112,0.18)]">
        <Film className="size-5" aria-hidden="true" />
      </span>
      <span className="text-xl font-bold tracking-tight text-foreground">
        Cine<span className="text-primary">Book</span>
      </span>
    </Link>
  );
}

export default Logo;
