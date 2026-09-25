export const tailwindTokens = {
  colors: {
    terra: "#1C3812",   // verde floresta profundo (headings, footer bg)
    nevoa: "#4A7C5E",   // verde sálvia / névoa da mata (badges, nav active)
    bruma: "#B8D4C0",   // verde claro / bruma suave (subtítulos, links claros)
    cume: "#F3F6F0",    // quase branco com toque verde quente (fundo claro)
    accent: "#238A44",  // verde esmeralda vibrante (links, foco, detalhes)
    sol: "#C8871A",     // dourado serrano (botões CTA, destaque quente)
    ceu: "#0E1F10",     // verde noturno profundo (fundo dark mode)
  },
  boxShadow: {
    card: "0 14px 40px -18px rgba(28, 56, 18, 0.35)",
    soft: "0 8px 30px -20px rgba(28, 56, 18, 0.22)",
  },
  backgroundImage: {
    "mountain-glow":
      "radial-gradient(circle at 20% 20%, rgba(35, 138, 68, 0.16), transparent 55%), radial-gradient(circle at 80% 0%, rgba(74, 124, 94, 0.20), transparent 42%), linear-gradient(160deg, rgba(243, 246, 240, 0.94), rgba(184, 212, 192, 0.80))",
    "night-fog":
      "radial-gradient(circle at 10% 15%, rgba(35, 138, 68, 0.12), transparent 45%), radial-gradient(circle at 85% 5%, rgba(200, 135, 26, 0.08), transparent 40%), linear-gradient(180deg, rgba(14, 31, 16, 0.98), rgba(28, 56, 18, 0.95))",
  },
} as const;
