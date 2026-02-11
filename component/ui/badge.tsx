import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-all duration-200 overflow-hidden backdrop-blur-sm",
  {
    variants: {
      variant: {
        default:
          "border-purple-500/50 bg-gradient-to-r from-purple-600/80 to-pink-600/80 text-white [a&]:hover:border-pink-500/70 [a&]:hover:from-purple-700/90 [a&]:hover:to-pink-700/90",
        secondary:
          "border-slate-500/30 bg-slate-800/60 text-slate-100 [a&]:hover:bg-slate-700/70 [a&]:hover:border-purple-500/50",
        destructive:
          "border-red-500/50 bg-red-600/80 text-white [a&]:hover:bg-red-700/90 [a&]:hover:border-red-600/70 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40",
        outline:
          "border-purple-500/50 text-purple-300 [a&]:hover:bg-purple-500/20 [a&]:hover:text-pink-300 [a&]:hover:border-pink-500/50",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span";

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
