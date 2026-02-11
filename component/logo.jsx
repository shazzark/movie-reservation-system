import { Film } from "lucide-react";
import Link from "next/link";

function Logo() {
  return (
    <div>
      <Link
        href="/"
        className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
      >
        <Film className="h-6 w-6 text-pink-500 drop-shadow-lg drop-shadow-pink-500/50" />
        <span className="text-xl font-bold bg-linear-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          CineBook
        </span>
      </Link>
    </div>
  );
}

export default Logo;
