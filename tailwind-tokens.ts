export const tailwindTokens = {
  colors: {
    terra: "#1E3D14",   // verde floresta profundo (headings, footer bg)
    nevoa: "#4A7C5E",   // verde sálvia / névoa da mata (badges, nav active)
    bruma: "#B8D4C0",   // verde claro / bruma suave (subtítulos, links claros)
    cume: "#EFF4EC",    // quase branco com toque verde (fundo claro, texto no escuro)
    accent: "#2D7D4E",  // verde esmeralda vibrante (botões CTA, destaques)
    ceu: "#0D1F0F",     // verde noturno profundo (fundo dark mode)
  },
  boxShadow: {
    card: "0 14px 40px -18px rgba(30, 61, 20, 0.35)",
    soft: "0 8px 30px -20px rgba(30, 61, 20, 0.25)",
  },
  backgroundImage: {
    "mountain-glow":
      "radial-gradient(circle at 20% 20%, rgba(45, 125, 78, 0.18), transparent 55%), radial-gradient(circle at 80% 0%, rgba(74, 124, 94, 0.22), transparent 42%), linear-gradient(160deg, rgba(239, 244, 236, 0.92), rgba(184, 212, 192, 0.82))",
    "night-fog":
      "radial-gradient(circle at 10% 15%, rgba(45, 125, 78, 0.14), transparent 45%), linear-gradient(180deg, rgba(13, 31, 15, 0.98), rgba(30, 61, 20, 0.95))",
  },
} as const;
