import { cn } from "@/lib/utils";

/**
 * Skeleton para carregamentos assíncronos com shimmer simples.
 */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl bg-stone-200/70 dark:bg-stone-700/60",
        "before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.6s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/40 before:to-transparent dark:before:via-white/10",
        className,
      )}
    />
  );
}
