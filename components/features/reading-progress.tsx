"use client";

import { useEffect, useState } from "react";

export function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const total = document.body.scrollHeight - window.innerHeight;
      const value = total <= 0 ? 0 : Math.min((window.scrollY / total) * 100, 100);
      setProgress(value);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="fixed left-0 top-0 z-[60] h-[3px] bg-[var(--color-accent)] transition-all duration-100"
      style={{ width: `${progress}%` }}
      aria-hidden
    />
  );
}
