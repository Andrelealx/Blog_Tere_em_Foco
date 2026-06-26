import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const tagVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs transition-colors",
  {
    variants: {
      tone: {
        subtle:
          "border-black/10 text-stone-700 hover:bg-black/5 dark:border-white/10 dark:text-stone-300 dark:hover:bg-white/10",
        accent:
          "border-accent/30 bg-accent/10 text-accent",
      },
    },
    defaultVariants: {
      tone: "subtle",
    },
  },
);

/**
 * Tag para etiquetas de assunto em listas e cards.
 */
export interface TagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof tagVariants> {}

export function Tag({ className, tone, ...props }: TagProps) {
  return <span className={cn(tagVariants({ tone, className }))} {...props} />;
}
