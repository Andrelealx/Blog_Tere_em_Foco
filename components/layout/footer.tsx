import Link from "next/link";

const navLinks = [
  { href: "/categoria/noticias", label: "Notícias" },
  { href: "/categoria/turismo", label: "Turismo" },
  { href: "/categoria/gastronomia", label: "Gastronomia" },
  { href: "/categoria/cultura", label: "Cultura" },
  { href: "/explorar", label: "Mapa Interativo" },
  { href: "/newsletter", label: "Newsletter" },
];

const sobreLinks = [
  { href: "/newsletter", label: "Contato" },
  { href: "/explorar", label: "Explorar" },
];

function FooterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-display text-base text-cume">{title}</p>
      <div className="mt-1 h-px w-8 bg-bruma/40" />
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="mt-20 border-t border-black/5 bg-terra text-cume dark:border-white/10 dark:bg-ceu">

      {/* Corpo principal */}
      <div className="section-container grid gap-10 py-12 md:grid-cols-[2fr_1fr_1fr_1fr]">

        {/* Marca */}
        <div>
          <p className="font-display text-2xl">Terê em Foco</p>
          <p className="mt-3 text-sm leading-relaxed text-cume/70">
            Projeto editorial com foco em turismo, cultura e notícias locais
            de Teresópolis e da Serra Fluminense.
          </p>
        </div>

        {/* Navegação */}
        <FooterSection title="Editorias">
          <ul className="space-y-2 text-sm">
            {navLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-cume/70 transition-colors hover:text-bruma"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterSection>

        {/* Sobre */}
        <FooterSection title="Sobre">
          <p className="text-sm leading-relaxed text-cume/70">
            Desenvolvido por estudantes de Ciência da Computação — 4º/5º período.
          </p>
          <ul className="mt-4 space-y-2 text-sm">
            {sobreLinks.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="text-cume/70 transition-colors hover:text-bruma"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </FooterSection>

        {/* Créditos */}
        <FooterSection title="Créditos">
          <p className="text-sm text-cume/70">Andrelealx • 2026</p>
          <p className="mt-2 text-sm text-cume/70">Ccomp@placeholder.com</p>
        </FooterSection>

      </div>

      {/* Barra inferior */}
      <div className="section-container border-t border-cume/15 py-4">
        <p className="text-center text-xs text-cume/45">
          © 2026 Terê em Foco • Blog editorial da Serra Fluminense
        </p>
      </div>

    </footer>
  );
}
