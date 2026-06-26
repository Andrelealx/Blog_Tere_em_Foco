import Link from "next/link";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl flex-col items-center justify-center px-4 text-center">
      <p className="text-sm uppercase tracking-[0.2em] text-[var(--color-nevoa)]">
        404
      </p>
      <h1 className="mt-3 font-display text-5xl text-[var(--color-terra)] dark:text-[var(--color-cume)]">
        Página não encontrada
      </h1>
      <p className="mt-3 text-stone-700 dark:text-stone-300">
        O conteúdo que você tentou acessar não existe ou foi movido.
      </p>
      <Link href="/" className="mt-6">
        <Button>Voltar ao início</Button>
      </Link>
    </div>
  );
}
