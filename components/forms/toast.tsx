"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, CircleAlert } from "lucide-react";

export type ToastType = "success" | "error";

export interface ToastState {
  open: boolean;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toast: ToastState;
  onClose: () => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {toast.open && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-5 right-5 z-[70] w-[min(92vw,360px)] rounded-xl border border-black/10 bg-white p-4 shadow-2xl dark:border-white/15 dark:bg-[var(--color-ceu)]"
          role="status"
          aria-live="polite"
        >
          <div className="flex items-start gap-3">
            {toast.type === "success" ? (
              <CheckCircle2 className="mt-0.5 text-[var(--color-nevoa)]" size={18} />
            ) : (
              <CircleAlert className="mt-0.5 text-[var(--color-accent)]" size={18} />
            )}
            <div className="flex-1">
              <p className="text-sm font-medium text-stone-800 dark:text-stone-100">
                {toast.message}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-2 py-1 text-xs text-stone-500 transition hover:bg-black/5 dark:text-stone-300 dark:hover:bg-white/10"
            >
              fechar
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
