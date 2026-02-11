import * as React from "react";

import { cn } from "../../lib/utils";

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-slate-500 selection:bg-purple-600 selection:text-white dark:bg-slate-900/50 border-purple-500/30 h-9 w-full min-w-0 rounded-lg border bg-transparent px-3 py-1 text-base shadow-md shadow-purple-500/5 transition-all duration-200 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-pink-500/60 focus-visible:ring-pink-500/30 focus-visible:ring-[3px] focus-visible:shadow-lg focus-visible:shadow-pink-500/20",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Input };
