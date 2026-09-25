import { cn } from "@/lib/utils";

/**
 * Separador horizontal para organizar blocos de conteúdo.
 */
export function Divider({ className }: { className?: string }) {
  return (
    <hr
      className={cn("border-0 border-t border-black/10 dark:border-white/10", className)}
    />
  );
}
