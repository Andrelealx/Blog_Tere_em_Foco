import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
  {
    variants: {
      intent: {
        primary: "bg-[var(--color-nevoa)] text-white",
        accent: "bg-[var(--color-accent)] text-white",
        neutral:
          "bg-black/5 text-stone-700 dark:bg-white/10 dark:text-stone-200",
      },
    },
    defaultVariants: {
      intent: "primary",
    },
  },
);

/**
 * Badge compacto para estado, categoria e destaque contextual.
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, intent, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ intent, className }))} {...props} />;
}
