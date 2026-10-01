"use client";

import { useCallback, useEffect, useState } from "react";
import { Button, Card } from "@/components/ui";
import type { ComentarioDTO } from "@/backforge/tipos";

export function Comentarios({ slug }: { slug: string }) {
  const [comentarios, setComentarios] = useState<ComentarioDTO[]>([]);
  const [autor, setAutor] = useState("");
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const res = await fetch(`/api/noticias/${slug}/comentarios`);
      const json = await res.json();
      if (json.ok) setComentarios(json.data.items);
    } catch {
      /* mantém a lista atual em caso de falha */
    }
  }, [slug]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function enviar(event: React.FormEvent) {
    event.preventDefault();
    if (!autor.trim() || !texto.trim()) return;
    setEnviando(true);
    try {
      const res = await fetch(`/api/noticias/${slug}/comentarios`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autor, texto }),
      });
      if (res.ok) {
        setAutor("");
        setTexto("");
        await carregar();
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <section className="mt-10">
      <h2 className="mb-4 font-display text-2xl text-terra dark:text-cume">
        Comentários ({comentarios.length})
      </h2>

      <form onSubmit={enviar} className="mb-6 space-y-3">
        <input
          type="text"
          value={autor}
          onChange={(e) => setAutor(e.target.value)}
          placeholder="Seu nome"
          className="form-input"
        />
        <textarea
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escreva um comentário..."
          className="form-input resize-none"
          rows={3}
        />
        <Button type="submit" disabled={enviando}>
          {enviando ? "Enviando..." : "Comentar"}
        </Button>
      </form>

      <div className="space-y-4">
        {comentarios.map((comentario) => (
          <Card key={comentario.id} className="p-4">
            <p className="text-sm font-semibold text-terra dark:text-cume">
              {comentario.autor}
            </p>
            <p className="mt-1 text-sm text-stone-600 dark:text-stone-400">
              {comentario.texto}
            </p>
          </Card>
        ))}
        {comentarios.length === 0 && (
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Seja o primeiro a comentar.
          </p>
        )}
      </div>
    </section>
  );
}
