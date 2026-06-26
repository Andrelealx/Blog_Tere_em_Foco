import { Newspaper } from "lucide-react";
import { tickerItems } from "@/lib/mock-data";

export function NewsTicker() {
  const loopItems = [...tickerItems, ...tickerItems];

  return (
    <section
      aria-label="Ticker de notícias"
      className="ticker-mask overflow-hidden rounded-xl border border-black/5 bg-white/70 py-3 text-sm shadow-soft dark:border-white/10 dark:bg-white/5"
    >
      <div className="flex animate-ticker whitespace-nowrap">
        {loopItems.map((item, index) => (
          <p key={`${item}-${index}`} className="mx-5 inline-flex items-center gap-2">
            <Newspaper size={14} className="text-[var(--color-accent)]" aria-hidden />
            <span>{item}</span>
          </p>
        ))}
      </div>
    </section>
  );
}
