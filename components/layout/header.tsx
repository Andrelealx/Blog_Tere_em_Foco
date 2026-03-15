"use client";

import Image from "next/image";
import Link from "next/link";
import { Navbar } from "@/components/layout/navbar";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-black/5 bg-cume/95 backdrop-blur-md dark:border-white/10 dark:bg-nevoa/70">
      <div className="section-container flex flex-col gap-4 py-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/images/logo.png"
              alt="Logo Terê em Foco"
              width={46}
              height={46}
              className="h-11 w-11 object-cover dark:grayscale dark:invert"
            />
            <div className="leading-none">
              <span className="block font-display text-xl text-terra dark:text-cume">
                Terê em Foco
              </span>
              <span className="text-xs tracking-wide text-stone-600 dark:text-stone-300">
                Guia da Serra Fluminense
              </span>
            </div>
          </Link>
          <div className="lg:hidden">
            <ThemeToggle />
          </div>
        </div>
        <div className="flex items-center justify-between gap-4">
          <Navbar />
          <div className="hidden lg:block">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
