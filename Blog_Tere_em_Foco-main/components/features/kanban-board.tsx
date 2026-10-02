"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  CalendarClock,
  Eye,
  FileText,
  GripVertical,
  Loader2,
  PenSquare,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { Toast, type ToastState } from "@/components/forms/toast";
import { cn } from "@/lib/utils";
import {
  noticiaStatusLabels,
  noticiaStatusValues,
  type NoticiaStatus,
} from "@/backforge/noticias-seed";
import type { NoticiaDTO } from "@/backforge/tipos";

/** Metadados visuais de cada coluna do Kanban. */
const COLUNAS: Array<{
  status: NoticiaStatus;
  descricao: string;
  icone: typeof FileText;
  accent: string;
  barra: string;
}> = [
  {
    status: "rascunho",
    descricao: "Ideias e textos em produção",
    icone: PenSquare,
    accent: "text-stone-500 dark:text-stone-400",
    barra: "bg-stone-400",
  },
  {
    status: "revisao",
    descricao: "Aguardando revisão editorial",
    icone: Eye,
    accent: "text-accent",
    barra: "bg-accent",
  },
  {
    status: "agendado",
    descricao: "Prontas para publicação",
    icone: CalendarClock,
    accent: "text-sol",
    barra: "bg-sol",
  },
  {
    status: "publicado",
    descricao: "No ar para o público",
    icone: FileText,
    accent: "text-nevoa",
    barra: "bg-nevoa",
  },
];

const STATUS_ORDEM: NoticiaStatus[] = [...noticiaStatusValues];

function statusValido(valor: string): valor is NoticiaStatus {
  return (STATUS_ORDEM as string[]).includes(valor);
}

interface KanbanBoardProps {
  className?: string;
}

/**
 * Quadro Kanban do fluxo editorial de notícias.
 *
 * Carrega as notícias do backend (`/api/noticias`), distribui nas colunas
 * por status e permite arrastar (drag & drop) um card para outra coluna,
 * persistindo a mudança via PATCH `/api/noticias/[slug]`.
 */
export function KanbanBoard({ className }: KanbanBoardProps) {
  const [noticias, setNoticias] = useState<NoticiaDTO[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [arrastando, setArrastando] = useState<number | null>(null);
  const [colunaAlvo, setColunaAlvo] = useState<NoticiaStatus | null>(null);
  const [salvando, setSalvando] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState>({
    open: false,
    message: "",
    type: "success",
  });

  const carregar = useCallback(async () => {
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch("/api/noticias?limite=50");
      const json = await res.json();
      if (!res.ok || !json.ok) {
        throw new Error(json.error?.message ?? "Falha ao carregar notícias.");
      }
      setNoticias(json.data.items as NoticiaDTO[]);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Falha ao carregar notícias.");
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregar();
  }, [carregar]);

  const porStatus = useMemo(() => {
    const mapa: Record<NoticiaStatus, NoticiaDTO[]> = {
      rascunho: [],
      revisao: [],
      agendado: [],
      publicado: [],
    };
    for (const noticia of noticias) {
      mapa[noticia.status]?.push(noticia);
    }
    return mapa;
  }, [noticias]);

  const avisar = useCallback((message: string, type: "success" | "error") => {
    setToast({ open: true, message, type });
    window.setTimeout(
      () => setToast({ open: false, message: "", type: "success" }),
      2600,
    );
  }, []);

  const moverPara = useCallback(
    async (noticia: NoticiaDTO, destino: NoticiaStatus) => {
      if (noticia.status === destino) return;
      const anterior = noticia.status;

      // Atualização otimista.
      setNoticias((atual) =>
        atual.map((item) =>
          item.id === noticia.id ? { ...item, status: destino } : item,
        ),
      );
      setSalvando(noticia.slug);

      try {
        const res = await fetch(`/api/noticias/${noticia.slug}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: destino }),
        });
        const json = await res.json();
        if (!res.ok || !json.ok) {
          throw new Error(json.error?.message ?? "Falha ao mover a notícia.");
        }
        const atualizada = json.data as NoticiaDTO;
        setNoticias((atual) =>
          atual.map((item) => (item.id === atualizada.id ? atualizada : item)),
        );
        avisar(
          `“${noticia.title}” movida para ${noticiaStatusLabels[destino]}.`,
          "success",
        );
      } catch (error) {
        // Reverte em caso de falha.
        setNoticias((atual) =>
          atual.map((item) =>
            item.id === noticia.id ? { ...item, status: anterior } : item,
          ),
        );
        avisar(
          error instanceof Error ? error.message : "Falha ao mover a notícia.",
          "error",
        );
      } finally {
        setSalvando(null);
      }
    },
    [avisar],
  );

  const totalGeral = noticias.length;

  if (carregando) {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-2 py-16 text-sm text-stone-500 dark:text-stone-400",
          className,
        )}
      >
        <Loader2 className="animate-spin" size={18} aria-hidden />
        Carregando o quadro editorial...
      </div>
    );
  }

  if (erro) {
    return (
      <Card className={cn("p-6 text-center", className)}>
        <p className="text-sm text-red-600 dark:text-red-400">{erro}</p>
        <button
          type="button"
          onClick={carregar}
          className="mt-3 text-sm font-semibold text-accent underline"
        >
          Tentar novamente
        </button>
      </Card>
    );
  }

  return (
    <section className={className} aria-label="Quadro editorial Kanban">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="section-heading">Fluxo editorial</h2>
          <p className="text-sm text-stone-600 dark:text-stone-300">
            Arraste os cards entre as colunas para atualizar o status da notícia.
          </p>
        </div>
        <Badge intent="neutral">{totalGeral} notícia(s) no quadro</Badge>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {COLUNAS.map((coluna) => {
          const Icone = coluna.icone;
          const itens = porStatus[coluna.status];
          const isAlvo = colunaAlvo === coluna.status;

          return (
            <div
              key={coluna.status}
              onDragOver={(event) => {
                event.preventDefault();
                if (colunaAlvo !== coluna.status) setColunaAlvo(coluna.status);
              }}
              onDragLeave={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node)) {
                  setColunaAlvo((atual) =>
                    atual === coluna.status ? null : atual,
                  );
                }
              }}
              onDrop={(event) => {
                event.preventDefault();
                const id = Number(event.dataTransfer.getData("text/plain"));
                setColunaAlvo(null);
                setArrastando(null);
                const noticia = noticias.find((item) => item.id === id);
                if (noticia) void moverPara(noticia, coluna.status);
              }}
              className={cn(
                "flex min-h-[200px] flex-col rounded-2xl border bg-cume/60 p-3 transition-colors dark:bg-white/5",
                isAlvo
                  ? "border-accent bg-accent/5"
                  : "border-black/5 dark:border-white/10",
              )}
            >
              <div className="mb-3 flex items-center gap-2 px-1">
                <span className={cn("h-2.5 w-2.5 rounded-full", coluna.barra)} />
                <Icone className={coluna.accent} size={16} aria-hidden />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-terra dark:text-cume">
                    {noticiaStatusLabels[coluna.status]}
                  </p>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {coluna.descricao}
                  </p>
                </div>
                <span className="rounded-full bg-black/5 px-2 py-0.5 text-xs font-semibold text-stone-600 dark:bg-white/10 dark:text-stone-300">
                  {itens.length}
                </span>
              </div>

              <div className="flex flex-1 flex-col gap-3">
                {itens.length === 0 ? (
                  <p className="rounded-xl border border-dashed border-black/10 px-3 py-6 text-center text-xs text-stone-400 dark:border-white/10 dark:text-stone-500">
                    Solte uma notícia aqui
                  </p>
                ) : (
                  itens.map((noticia) => {
                    const arrastandoEste = arrastando === noticia.id;
                    return (
                      <motion.article
                        key={noticia.id}
                        layout
                        draggable
                        onDragStart={(event) => {
                          const dragEvent = event as unknown as React.DragEvent;
                          dragEvent.dataTransfer?.setData(
                            "text/plain",
                            String(noticia.id),
                          );
                          setArrastando(noticia.id);
                        }}
                        onDragEnd={() => {
                          setArrastando(null);
                          setColunaAlvo(null);
                        }}
                        className={cn(
                          "cursor-grab rounded-xl border border-black/5 bg-white p-3 shadow-soft transition active:cursor-grabbing dark:border-white/10 dark:bg-ceu/80",
                          arrastandoEste && "opacity-50",
                          salvando === noticia.slug && "ring-2 ring-accent/40",
                        )}
                      >
                        <div className="flex items-start gap-2">
                          <GripVertical
                            className="mt-0.5 shrink-0 text-stone-300 dark:text-stone-600"
                            size={16}
                            aria-hidden
                          />
                          <div className="min-w-0 flex-1">
                            <p className="line-clamp-2 text-sm font-semibold leading-snug text-terra dark:text-cume">
                              {noticia.title}
                            </p>
                            <p className="mt-1 line-clamp-2 text-xs text-stone-500 dark:text-stone-400">
                              {noticia.excerpt}
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                              <Badge intent="neutral" className="text-[10px]">
                                {noticia.category}
                              </Badge>
                              {noticia.featured && (
                                <Badge intent="warm" className="text-[10px]">
                                  Destaque
                                </Badge>
                              )}
                            </div>

                            <div className="mt-2 flex flex-wrap gap-1">
                              {noticia.tags.slice(0, 2).map((tag) => (
                                <Tag key={tag} className="text-[10px]">
                                  {tag}
                                </Tag>
                              ))}
                            </div>

                            <div className="mt-2 flex items-center gap-1.5 text-[11px] text-stone-400 dark:text-stone-500">
                              {salvando === noticia.slug && (
                                <Loader2 className="animate-spin" size={12} />
                              )}
                              <span className="truncate">{noticia.author}</span>
                            </div>

                            <MoverSelect
                              atual={noticia.status}
                              onSelecionar={(destino) =>
                                void moverPara(noticia, destino)
                              }
                            />
                          </div>
                        </div>
                      </motion.article>
                    );
                  })
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Toast toast={toast} onClose={() => setToast({ ...toast, open: false })} />
    </section>
  );
}

/**
 * Alternativa acessível ao drag & drop: um seletor para mover o card
 * entre as colunas sem uso do mouse.
 */
function MoverSelect({
  atual,
  onSelecionar,
}: {
  atual: NoticiaStatus;
  onSelecionar: (status: NoticiaStatus) => void;
}) {
  return (
    <label className="mt-2 block">
      <span className="sr-only">Mover notícia para outra coluna</span>
      <select
        value={atual}
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => {
          const valor = event.target.value;
          if (statusValido(valor)) onSelecionar(valor);
        }}
        className="w-full rounded-lg border border-black/10 bg-white/70 px-2 py-1 text-xs text-stone-600 outline-none focus:ring-2 focus:ring-accent dark:border-white/10 dark:bg-white/5 dark:text-stone-300"
      >
        {STATUS_ORDEM.map((status) => (
          <option key={status} value={status}>
            Mover para: {noticiaStatusLabels[status]}
          </option>
        ))}
      </select>
    </label>
  );
}
