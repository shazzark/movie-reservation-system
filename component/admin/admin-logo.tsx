import { Film } from "lucide-react";
import Link from "next/link";

function AdminLogo() {
  return (
    <div>
      <Link href="/admin" className="inline-flex items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <Film className="size-5" aria-hidden="true" />
        </span>
        <span className="flex flex-col leading-tight">
          <span className="text-lg font-bold tracking-tight text-foreground">Cine<span className="text-primary">Book</span></span>
          <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Studio</span>
        </span>
      </Link>
    </div>
  );
}

export default AdminLogo;
