"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Card } from "@/components/ui";
import { Toast, type ToastState } from "@/components/forms/toast";

const suggestionSchema = z.object({
  titulo: z.string().min(5, "Informe um título com pelo menos 5 caracteres"),
  categoria: z.enum(["turismo", "gastronomia", "cultura", "aventura", "noticias"]),
  resumo: z.string().min(40, "Descreva a pauta com no mínimo 40 caracteres"),
  relevancia: z.enum(["baixa", "media", "alta"]),
  nome: z.string().min(2, "Informe seu nome"),
  email: z.string().email("E-mail inválido"),
});

type SuggestionValues = z.infer<typeof suggestionSchema>;

const initialToast: ToastState = {
  open: false,
  message: "",
  type: "success",
};

const stepFields: Array<Array<keyof SuggestionValues>> = [
  ["titulo", "categoria"],
  ["resumo", "relevancia"],
  ["nome", "email"],
];

export function StorySuggestionForm() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [toast, setToast] = useState<ToastState>(initialToast);

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = useForm<SuggestionValues>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      categoria: "turismo",
      relevancia: "media",
    },
  });

  const progress = useMemo(() => ((step + 1) / 3) * 100, [step]);

  const goNext = async () => {
    const valid = await trigger(stepFields[step]);
    if (!valid) return;
    setStep((prev) => Math.min(prev + 1, 2));
  };

  const goPrev = () => setStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = async (values: SuggestionValues) => {
    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, tipo: "sugestao-pauta" }),
      });
      if (!response.ok) throw new Error("Falha");
      setStatus("success");
      setToast({
        open: true,
        message: "Sugestão recebida. Obrigado por contribuir com o blog.",
        type: "success",
      });
      reset();
      setStep(0);
      window.setTimeout(() => setStatus("idle"), 2200);
    } catch {
      setStatus("error");
      setToast({
        open: true,
        message: "Não foi possível enviar a sugestão agora.",
        type: "error",
      });
      window.setTimeout(() => setStatus("idle"), 2200);
    }
  };

  return (
    <>
      <Card className="p-6">
        <h2 className="font-display text-3xl text-[var(--color-terra)] dark:text-[var(--color-cume)]">
          Sugira uma pauta
        </h2>
        <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">
          Formulário em 3 etapas para enviar ideias de reportagem.
        </p>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs text-stone-600 dark:text-stone-300">
            <span>Etapa {step + 1} de 3</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 rounded-full bg-black/10 dark:bg-white/10">
            <div
              className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          {step === 0 && (
            <>
              <div>
                <label htmlFor="titulo" className="mb-1 block text-sm font-medium">
                  Título da pauta
                </label>
                <input
                  id="titulo"
                  {...register("titulo")}
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] dark:border-white/10 dark:bg-white/5"
                />
                <p className="mt-1 text-xs text-red-600" aria-live="polite">
                  {errors.titulo?.message}
                </p>
              </div>
              <div>
                <label htmlFor="categoria" className="mb-1 block text-sm font-medium">
                  Categoria
                </label>
                <select
                  id="categoria"
                  {...register("categoria")}
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] dark:border-white/10 dark:bg-white/5"
                >
                  <option value="turismo">Turismo</option>
                  <option value="gastronomia">Gastronomia</option>
                  <option value="cultura">Cultura</option>
                  <option value="aventura">Aventura</option>
                  <option value="noticias">Notícias</option>
                </select>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div>
                <label htmlFor="resumo" className="mb-1 block text-sm font-medium">
                  Descreva a ideia
                </label>
                <textarea
                  id="resumo"
                  rows={5}
                  {...register("resumo")}
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] dark:border-white/10 dark:bg-white/5"
                />
                <p className="mt-1 text-xs text-red-600" aria-live="polite">
                  {errors.resumo?.message}
                </p>
              </div>
              <div>
                <label htmlFor="relevancia" className="mb-1 block text-sm font-medium">
                  Relevância percebida
                </label>
                <select
                  id="relevancia"
                  {...register("relevancia")}
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] dark:border-white/10 dark:bg-white/5"
                >
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                </select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label htmlFor="nome-sugestao" className="mb-1 block text-sm font-medium">
                  Seu nome
                </label>
                <input
                  id="nome-sugestao"
                  {...register("nome")}
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] dark:border-white/10 dark:bg-white/5"
                />
                <p className="mt-1 text-xs text-red-600" aria-live="polite">
                  {errors.nome?.message}
                </p>
              </div>
              <div>
                <label htmlFor="email-sugestao" className="mb-1 block text-sm font-medium">
                  Seu email
                </label>
                <input
                  id="email-sugestao"
                  type="email"
                  {...register("email")}
                  className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[var(--color-accent)] dark:border-white/10 dark:bg-white/5"
                />
                <p className="mt-1 text-xs text-red-600" aria-live="polite">
                  {errors.email?.message}
                </p>
              </div>
            </>
          )}

          <div className="flex flex-wrap gap-2 pt-2">
            {step > 0 && (
              <Button type="button" intent="ghost" onClick={goPrev}>
                Voltar
              </Button>
            )}
            {step < 2 ? (
              <Button type="button" onClick={goNext}>
                Próxima etapa
              </Button>
            ) : (
              <Button type="submit" disabled={status === "loading"}>
                {status === "loading" ? "Enviando..." : "Enviar sugestão"}
              </Button>
            )}
          </div>
        </form>
      </Card>
      <Toast toast={toast} onClose={() => setToast(initialToast)} />
    </>
  );
}
