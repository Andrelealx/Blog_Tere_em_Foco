import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      intent: {
        primary:
          "bg-[var(--color-accent)] text-white shadow-soft hover:translate-y-[-1px] hover:opacity-95",
        secondary:
          "border border-[var(--color-nevoa)] bg-transparent text-[var(--color-nevoa)] hover:bg-[var(--color-nevoa)]/10",
        ghost:
          "bg-transparent text-[var(--color-terra)] dark:text-[var(--color-cume)] hover:bg-[var(--color-bruma)]/20 dark:hover:bg-white/10",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  },
);

/**
 * Botão reutilizável com variantes de estilo e tamanho para o design system.
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ intent, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
