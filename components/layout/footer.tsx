import Link from "next/link";

const links = [
  { href: "/categoria/noticias", label: "Notícias" },
  { href: "/categoria/turismo", label: "Turismo" },
  { href: "/newsletter", label: "Newsletter" },
  { href: "/explorar", label: "Mapa Interativo" },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-black/5 bg-[var(--color-terra)] text-[var(--color-cume)] dark:border-white/10">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <p className="font-display text-2xl">Terê em Foco</p>
          <p className="mt-3 text-sm text-stone-200/85">
            Projeto editorial desenvolvido por estudantes de Ciência da Computação
            com foco em turismo, cultura e notícias locais de Teresópolis.
          </p>
        </div>
        <div>
          <p className="font-semibold">Navegação</p>
          <ul className="mt-3 space-y-2 text-sm">
            {links.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-stone-200 transition hover:text-[var(--color-bruma)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-semibold">Créditos</p>
          <p className="mt-3 text-sm text-stone-200/85">
            Blog Terê em Foco • Projeto Web Front End • Turma 2026
          </p>
          <p className="mt-2 text-sm text-stone-200/85">
            Email: contato@tereemfoco.com.br
          </p>
        </div>
      </div>
    </footer>
  );
}
