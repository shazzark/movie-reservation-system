import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold transition-colors focus-visible:ring-2 focus-visible:ring-ring [&>svg]:size-3 [&>svg]:pointer-events-none",
  {
    variants: {
      variant: {
        default:
          "border-primary/40 bg-primary/15 text-[#ff9caf] [a&]:hover:bg-primary/25",
        secondary:
          "border-border bg-secondary text-secondary-foreground [a&]:hover:bg-muted",
        destructive:
          "border-destructive/40 bg-destructive/15 text-[#ff9ca8] [a&]:hover:bg-destructive/25",
        outline:
          "border-border text-muted-foreground [a&]:hover:border-primary/50 [a&]:hover:text-foreground",
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
