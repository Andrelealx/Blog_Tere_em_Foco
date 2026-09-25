"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button, Card } from "@/components/ui";
import { Toast, type ToastState } from "@/components/forms/toast";

const contactSchema = z.object({
  nome: z.string().min(2, "Nome deve ter ao menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  assunto: z.enum(["duvida", "sugestao", "parceria", "outro"]),
  mensagem: z.string().min(20, "Mensagem muito curta (mín. 20 caracteres)"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const initialToast: ToastState = {
  open: false,
  message: "",
  type: "success",
};

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [toast, setToast] = useState<ToastState>(initialToast);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      assunto: "duvida",
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setStatus("loading");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) {
        throw new Error("Erro ao enviar");
      }
      setStatus("success");
      reset();
      setToast({
        open: true,
        message: "Mensagem enviada com sucesso.",
        type: "success",
      });
      window.setTimeout(() => setStatus("idle"), 2200);
    } catch {
      setStatus("error");
      setToast({
        open: true,
        message: "Falha no envio. Tente novamente em alguns instantes.",
        type: "error",
      });
      window.setTimeout(() => setStatus("idle"), 2200);
    }
  };

  return (
    <>
      <Card className="p-6">
        <h2 className="section-heading">Fale com a equipe</h2>
        <p className="mt-2 text-sm text-stone-700 dark:text-stone-300">
          Envie dúvidas, sugestões ou propostas de parceria.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label htmlFor="nome" className="mb-1 block text-sm font-medium">
              Nome
            </label>
            <input
              id="nome"
              {...register("nome")}
              className="form-input"
            />
            <p className="mt-1 text-xs text-red-600" aria-live="polite">
              {errors.nome?.message}
            </p>
          </div>

          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register("email")}
              className="form-input"
            />
            <p className="mt-1 text-xs text-red-600" aria-live="polite">
              {errors.email?.message}
            </p>
          </div>

          <div>
            <label htmlFor="assunto" className="mb-1 block text-sm font-medium">
              Assunto
            </label>
            <select
              id="assunto"
              {...register("assunto")}
              className="form-input"
            >
              <option value="duvida">Dúvida</option>
              <option value="sugestao">Sugestão</option>
              <option value="parceria">Parceria</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div>
            <label htmlFor="mensagem" className="mb-1 block text-sm font-medium">
              Mensagem
            </label>
            <textarea
              id="mensagem"
              rows={5}
              {...register("mensagem")}
              className="form-input"
            />
            <p className="mt-1 text-xs text-red-600" aria-live="polite">
              {errors.mensagem?.message}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? "Enviando..." : "Enviar mensagem"}
            </Button>
            {status === "success" && (
              <svg
                width="32"
                height="32"
                viewBox="0 0 48 48"
                className="text-nevoa"
                aria-label="Envio concluído"
              >
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeDasharray="126"
                  strokeDashoffset="126"
                  style={{ animation: "draw 0.45s ease forwards" }}
                />
                <path
                  d="M16 24.5l5.5 5.5L33 18"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="30"
                  strokeDashoffset="30"
                  style={{ animation: "draw 0.35s ease 0.35s forwards" }}
                />
              </svg>
            )}
          </div>
        </form>
      </Card>
      <Toast toast={toast} onClose={() => setToast(initialToast)} />
      <style jsx>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </>
  );
}
