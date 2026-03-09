"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TocItem {
  id: string;
  title: string;
}

interface TableOfContentsProps {
  items: TocItem[];
}

export function TableOfContents({ items }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((node): node is HTMLElement => Boolean(node));

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0.1, 0.6, 1],
      },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="Índice do artigo" className="rounded-2xl border border-black/5 bg-white/80 p-4 dark:border-white/10 dark:bg-white/5">
      <p className="text-sm font-semibold uppercase tracking-wide text-stone-600 dark:text-stone-300">
        Neste artigo
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block rounded-md px-2 py-1 text-stone-700 transition hover:text-[var(--color-accent)] dark:text-stone-300",
                activeId === item.id &&
                  "bg-[var(--color-nevoa)]/15 font-semibold text-[var(--color-nevoa)] dark:bg-[var(--color-nevoa)]/20 dark:text-[var(--color-bruma)]",
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
