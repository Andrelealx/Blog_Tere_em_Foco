"use client";

import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/ui";

export function NewsletterBanner() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Falha ao enviar");
      }

      setStatus("success");
      setEmail("");
      window.setTimeout(() => setStatus("idle"), 2400);
    } catch {
      setStatus("error");
      window.setTimeout(() => setStatus("idle"), 2600);
    }
  };

  return (
    <section className="rounded-2xl border border-black/10 bg-[var(--color-terra)] p-6 text-[var(--color-cume)] shadow-soft dark:border-white/10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-xl">
          <p className="inline-flex items-center gap-2 text-sm text-[var(--color-bruma)]">
            <Mail size={15} aria-hidden />
            Newsletter semanal
          </p>
          <h2 className="mt-2 font-display text-3xl">
            Receba roteiros e notícias da serra no seu email
          </h2>
          <p className="mt-2 text-sm text-stone-200/90">
            Conteúdo curado com trilhas, eventos, agenda gastronômica e alertas úteis
            para moradores e visitantes.
          </p>
        </div>
        <form onSubmit={onSubmit} className="flex w-full max-w-xl gap-2">
          <label htmlFor="newsletter-email" className="sr-only">
            Digite seu email
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="seuemail@exemplo.com"
            className="h-11 flex-1 rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-stone-300/80 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
          <Button type="submit" intent="primary" className="gap-2">
            <Send size={15} aria-hidden />
            {status === "loading" ? "Enviando..." : "Inscrever"}
          </Button>
        </form>
      </div>
      <p className="mt-3 text-sm text-[var(--color-bruma)]" aria-live="polite">
        {status === "success" && "Inscrição concluída com sucesso."}
        {status === "error" && "Não foi possível concluir. Tente novamente."}
      </p>
    </section>
  );
}
