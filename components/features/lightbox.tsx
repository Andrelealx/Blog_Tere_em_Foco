"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface LightboxItem {
  src: string;
  alt: string;
  title: string;
}

interface LightboxProps {
  open: boolean;
  item: LightboxItem | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Lightbox({ open, item, onClose, onPrev, onNext }: LightboxProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
      if (event.key === "Tab" && dialogRef.current) {
        const focusable = dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);
    const firstButton = dialogRef.current?.querySelector<HTMLElement>("button");
    firstButton?.focus();

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, onNext, onPrev, open]);

  return (
    <AnimatePresence>
      {open && item && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-black/85 p-4"
          onClick={onClose}
        >
          <div
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label={item.title}
            className="mx-auto flex h-full w-full max-w-6xl flex-col"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
                aria-label="Fechar galeria"
              >
                <X size={18} />
              </button>
            </div>
            <div className="relative mt-2 flex-1 overflow-hidden rounded-2xl">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="100vw"
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-4 flex items-center justify-between text-white">
              <button
                type="button"
                onClick={onPrev}
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 transition hover:bg-white/20"
                aria-label="Imagem anterior"
              >
                <ChevronLeft size={16} /> Anterior
              </button>
              <p className="px-4 text-center text-sm">{item.title}</p>
              <button
                type="button"
                onClick={onNext}
                className="inline-flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 transition hover:bg-white/20"
                aria-label="Próxima imagem"
              >
                Próxima <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
