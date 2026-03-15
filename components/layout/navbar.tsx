"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Início" },
  { href: "/categoria/clima", label: "Clima" },
  { href: "/categoria/cultura", label: "Cultura" },
  { href: "/categoria/gastronomia", label: "Gastronomia" },
  { href: "/categoria/lazer", label: "Lazer" },
  { href: "/categoria/noticias", label: "Notícias" },
  { href: "/explorar", label: "Explorar" },
  { href: "/newsletter", label: "Contato" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav aria-label="Navegação principal">
      <ul className="flex flex-wrap items-center gap-2 text-sm md:gap-3">
        {navItems.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "rounded-full px-3 py-2 text-stone-700 transition hover:bg-black/5 hover:text-[var(--color-accent)] dark:text-stone-200 dark:hover:bg-white/10",
                  active &&
                  "bg-nevoa/15 font-semibold text-nevoa dark:bg-nevoa/25 dark:text-bruma",
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
