import { Film } from "lucide-react";
import Link from "next/link";

function AdminLogo() {
  return (
    <div>
      <Link href="/admin" className="flex items-center gap-2">
        <Film className="h-6 w-6 text-pink-500 drop-shadow-lg drop-shadow-pink-500/50" />
        <span className="text-lg font-bold text-foreground">
          CineBook Admin
        </span>
      </Link>
    </div>
  );
}

export default AdminLogo;
