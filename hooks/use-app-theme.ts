"use client";

import { useMemo } from "react";
import { useTheme } from "next-themes";

export function useAppTheme() {
  const { theme, setTheme, resolvedTheme, systemTheme } = useTheme();

  return useMemo(
    () => ({
      theme,
      resolvedTheme,
      systemTheme,
      isDark: (resolvedTheme ?? theme) === "dark",
      setTheme,
      toggleTheme: () => setTheme((resolvedTheme ?? theme) === "dark" ? "light" : "dark"),
    }),
    [resolvedTheme, setTheme, systemTheme, theme],
  );
}
