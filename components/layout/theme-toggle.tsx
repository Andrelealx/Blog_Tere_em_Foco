"use client";

import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";
import { useAppTheme } from "@/lib/hooks/use-app-theme";
import { cn } from "@/lib/utils";

export function ThemeToggle() {
  const { isDark, toggleTheme } = useAppTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Ativar modo claro" : "Ativar modo escuro"}
      className={cn(
        "relative grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white/80 text-[var(--color-terra)] shadow-sm transition hover:border-[var(--color-accent)] dark:border-white/20 dark:bg-white/10 dark:text-[var(--color-cume)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]",
      )}
    >
      <motion.span
        key={isDark ? "moon" : "sun"}
        initial={{ opacity: 0, rotate: -90, scale: 0.8 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, rotate: 90, scale: 0.8 }}
        transition={{ duration: 0.22 }}
      >
        {isDark ? <Moon size={16} /> : <Sun size={16} />}
      </motion.span>
    </button>
  );
}
