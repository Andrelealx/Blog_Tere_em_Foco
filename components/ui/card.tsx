import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "rounded-2xl border border-black/5 bg-white/90 p-6 shadow-card backdrop-blur-sm dark:border-white/10 dark:bg-ceu/70",
  {
    variants: {
      tone: {
        default: "",
        elevated: "shadow-xl",
        muted: "bg-cume/75 dark:bg-white/5",
      },
    },
    defaultVariants: {
      tone: "default",
    },
  },
);

/**
 * Card base com variações leves de fundo e elevação.
 */
export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {}

export function Card({ className, tone, ...props }: CardProps) {
  return <div className={cn(cardVariants({ tone, className }))} {...props} />;
}

export function CardHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("mb-3 space-y-1", className)} {...props} />;
}

export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-display text-xl leading-tight text-[var(--color-terra)] dark:text-[var(--color-cume)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-stone-600 dark:text-stone-300", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("space-y-4", className)} {...props} />;
}
