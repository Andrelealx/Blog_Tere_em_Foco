"use client";

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

const assuntos = [
  { value: "duvida", label: "Dúvida" },
  { value: "sugestao", label: "Sugestão de Pauta" },
  { value: "parceria", label: "Parceria Comercial" },
  { value: "correcao", label: "Correção de Conteúdo" },
  { value: "outro", label: "Outro" },
];

const canais = [
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    label: "E-mail",
    value: "contato@tereemfoco.com.br",
    href: "mailto:contato@tereemfoco.com.br",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    label: "Localização",
    value: "Teresópolis, RJ — Serra Fluminense",
    href: "https://maps.google.com/?q=Teresopolis+RJ",
  },
  {
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    label: "Instagram",
    value: "@tereemfoco",
    href: "https://instagram.com/tereemfoco",
  },
];

export default function FaleConoscoPage() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ nome: "", email: "", assunto: "duvida", mensagem: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  function validate() {
    const e: Record<string, string> = {};
    if (form.nome.trim().length < 2) e.nome = "Nome deve ter ao menos 2 caracteres.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "E-mail inválido.";
    if (form.mensagem.trim().length < 20) e.mensagem = "Mensagem muito curta (mínimo 20 caracteres).";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setStatus("success");
      setForm({ nome: "", email: "", assunto: "duvida", mensagem: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="min-h-screen">
      {/* Hero */}
      <section className="bg-terra py-14 px-4">
        <div className="section-container">
          <span className="block text-xs font-semibold uppercase tracking-widest text-bruma mb-2">
            Fale com a gente
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-cume mb-3">
            Contato & Sugestões
          </h1>
          <p className="text-bruma text-base max-w-xl leading-relaxed">
            Tem uma dúvida, sugestão de pauta ou quer propor uma parceria? Nossa equipe lê tudo.
          </p>
        </div>
      </section>

      {/* Conteúdo */}
      <div className="section-container grid gap-10 py-12 md:grid-cols-[1fr_2fr]">

        {/* Coluna esquerda */}
        <aside className="space-y-4">
          <h2 className="section-heading text-xl">Canais de Atendimento</h2>

          {canais.map((canal) => (
            <a
              key={canal.label}
              href={canal.href}
              target={canal.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="list-item-link flex items-start gap-4"
            >
              <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-nevoa/10 text-accent">
                {canal.icon}
              </span>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-0.5">
                  {canal.label}
                </p>
                <p className="text-sm font-medium text-terra dark:text-cume">{canal.value}</p>
              </div>
            </a>
          ))}

          <Card className="bg-nevoa/8 dark:bg-nevoa/15 border-nevoa/20">
            <p className="text-sm font-semibold text-terra dark:text-bruma mb-1">Tempo de resposta</p>
            <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
              Respondemos em até{" "}
              <strong className="text-accent">48 horas úteis</strong>.
              Sugestões de pauta enviadas até quinta-feira podem entrar na pauta da semana seguinte.
            </p>
          </Card>

          <Card className="bg-terra border-white/10 dark:bg-ceu">
            <p className="font-display text-cume mb-1">Sobre o projeto</p>
            <p className="text-sm text-bruma/80 leading-relaxed">
              Desenvolvido por estudantes de Ciência da Computação — 4º/5º período. Blog editorial com foco em turismo, cultura e notícias locais.
            </p>
          </Card>
        </aside>

        {/* Coluna direita — formulário */}
        <Card>
          <h2 className="section-heading text-2xl mb-1">Envie sua mensagem</h2>
          <p className="mb-7 text-sm text-stone-500 dark:text-stone-400">Todos os campos são obrigatórios.</p>

          {status === "success" ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-nevoa/15">
                <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-display text-xl text-terra dark:text-cume mb-2">Mensagem enviada!</h3>
              <p className="mb-6 text-sm text-stone-500">Obrigado pelo contato. Responderemos em até 48 horas úteis.</p>
              <button
                onClick={() => setStatus("idle")}
                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
              >
                Enviar outra mensagem
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-terra dark:text-cume">Nome</label>
                  <input
                    type="text"
                    value={form.nome}
                    onChange={(e) => setForm({ ...form, nome: e.target.value })}
                    placeholder="Seu nome completo"
                    className="form-input"
                  />
                  {errors.nome && <p className="mt-1 text-xs text-red-500">{errors.nome}</p>}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-terra dark:text-cume">E-mail</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="seu@email.com"
                    className="form-input"
                  />
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-terra dark:text-cume">Assunto</label>
                <select
                  value={form.assunto}
                  onChange={(e) => setForm({ ...form, assunto: e.target.value })}
                  className="form-input"
                >
                  {assuntos.map((a) => (
                    <option key={a.value} value={a.value}>{a.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-terra dark:text-cume">Mensagem</label>
                <textarea
                  rows={5}
                  value={form.mensagem}
                  onChange={(e) => setForm({ ...form, mensagem: e.target.value })}
                  placeholder="Escreva sua mensagem aqui..."
                  className="form-input resize-none"
                />
                <div className="mt-1 flex items-center justify-between">
                  {errors.mensagem
                    ? <p className="text-xs text-red-500">{errors.mensagem}</p>
                    : <span />
                  }
                  <span className="text-xs text-stone-400">{form.mensagem.length} caracteres</span>
                </div>
              </div>

              {status === "error" && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600 dark:border-red-700/40 dark:bg-red-900/20 dark:text-red-400">
                  Erro ao enviar. Verifique sua conexão e tente novamente.
                </div>
              )}

              <button
                type="submit"
                disabled={status === "loading"}
                className={cn(
                  "flex w-full items-center justify-center gap-2 rounded-xl bg-accent py-3.5 text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-[0.98]",
                  "disabled:cursor-not-allowed disabled:opacity-60"
                )}
              >
                {status === "loading" ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Enviando...
                  </>
                ) : (
                  "Enviar mensagem"
                )}
              </button>
            </form>
          )}
        </Card>
      </div>
    </main>
  );
}
