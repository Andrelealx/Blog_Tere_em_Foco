"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { MapPin, Search, Utensils } from "lucide-react";
import { Button, Card, Tag } from "@/components/ui";
import {
  listarEstabelecimentos,
  type EstabelecimentoGastronomico,
} from "@/lib/estabelecimentos";

export function GastronomyEstablishments() {
  const [estabelecimentos, setEstabelecimentos] = useState<
    EstabelecimentoGastronomico[]
  >([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  const carregar = async () => {
    setCarregando(true);
    setErro(null);
    try {
      setEstabelecimentos(await listarEstabelecimentos());
    } catch (error) {
      setErro(
        error instanceof Error
          ? error.message
          : "Não foi possível carregar os estabelecimentos.",
      );
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    void carregar();
  }, []);

  const estabelecimentosFiltrados = useMemo(() => {
    const termo = busca.trim().toLocaleLowerCase("pt-BR");
    if (!termo) return estabelecimentos;
    return estabelecimentos.filter((estabelecimento) =>
      [
        estabelecimento.name,
        estabelecimento.description,
        estabelecimento.address,
      ].some((campo) => campo.toLocaleLowerCase("pt-BR").includes(termo)),
    );
  }, [busca, estabelecimentos]);

  return (
    <section className="section-container py-10" aria-labelledby="onde-comer">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 text-sm text-[var(--color-accent)]">
            <Utensils size={16} aria-hidden />
            Sabores da serra
          </p>
          <h2
            id="onde-comer"
            className="mt-2 font-display text-3xl text-[var(--color-terra)] dark:text-[var(--color-cume)]"
          >
            Estabelecimentos gastronômicos
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-stone-700 dark:text-stone-300">
            Encontre lugares especiais para conhecer a gastronomia de
            Teresópolis.
          </p>
        </div>
        {!carregando && !erro ? (
          <p className="text-sm text-stone-600 dark:text-stone-400">
            {estabelecimentosFiltrados.length}{" "}
            {estabelecimentosFiltrados.length === 1
              ? "estabelecimento"
              : "estabelecimentos"}
          </p>
        ) : null}
      </div>

      <label className="relative mt-6 block max-w-xl">
        <span className="sr-only">Buscar estabelecimentos</span>
        <Search
          size={18}
          aria-hidden
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-stone-500"
        />
        <input
          type="search"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          placeholder="Buscar por nome, endereço ou descrição"
          className="form-input pl-11"
        />
      </label>

      {carregando ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-live="polite">
          {Array.from({ length: 3 }, (_, index) => (
            <Card
              key={index}
              className="h-80 animate-pulse overflow-hidden p-0"
              aria-hidden
            >
              <div className="h-44 bg-stone-200 dark:bg-white/10" />
              <div className="space-y-3 p-5">
                <div className="h-5 w-2/3 rounded bg-stone-200 dark:bg-white/10" />
                <div className="h-4 w-full rounded bg-stone-200 dark:bg-white/10" />
              </div>
            </Card>
          ))}
        </div>
      ) : erro ? (
        <Card className="mt-6 p-6" role="alert">
          <p className="text-sm text-stone-700 dark:text-stone-200">{erro}</p>
          <Button className="mt-4" size="sm" onClick={() => void carregar()}>
            Tentar novamente
          </Button>
        </Card>
      ) : estabelecimentosFiltrados.length > 0 ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {estabelecimentosFiltrados.map((estabelecimento) => (
            <Card
              key={estabelecimento.id}
              className="group overflow-hidden p-0 transition hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="relative h-48 bg-stone-200 dark:bg-white/10">
                {estabelecimento.image ? (
                  <Image
                    src={estabelecimento.image}
                    alt={estabelecimento.name}
                    fill
                    unoptimized
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-nevoa">
                    <Utensils size={36} aria-hidden />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <Tag
                  tone="accent"
                  className="absolute bottom-4 left-4 border-none bg-[var(--color-accent)] text-white"
                >
                  Gastronomia
                </Tag>
              </div>

              <div className="p-5">
                <h3 className="font-display text-xl text-[var(--color-terra)] dark:text-[var(--color-cume)]">
                  {estabelecimento.name}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm text-stone-700 dark:text-stone-300">
                  {estabelecimento.description}
                </p>
                <p className="mt-4 flex items-start gap-2 text-sm text-stone-600 dark:text-stone-400">
                  <MapPin size={16} aria-hidden className="mt-0.5 shrink-0 text-nevoa" />
                  <span>{estabelecimento.address}</span>
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="mt-6 p-8 text-center">
          <p className="font-display text-xl text-[var(--color-terra)] dark:text-[var(--color-cume)]">
            {busca
              ? "Nenhum estabelecimento encontrado"
              : "Ainda não há estabelecimentos cadastrados"}
          </p>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-300">
            {busca
              ? "Tente outro termo de busca."
              : "Volte em breve para descobrir novos sabores da serra."}
          </p>
        </Card>
      )}
    </section>
  );
}
