export const tailwindTokens = {
  colors: {
    terra: "#2D1B0E",
    nevoa: "#6B8F71",
    bruma: "#C8D8C4",
    cume: "#F5EFE6",
    accent: "#D4621A",
    ceu: "#1A2F3A",
  },
  boxShadow: {
    card: "0 14px 40px -18px rgba(26, 47, 58, 0.45)",
    soft: "0 8px 30px -20px rgba(45, 27, 14, 0.35)",
  },
  backgroundImage: {
    "mountain-glow":
      "radial-gradient(circle at 20% 20%, rgba(212, 98, 26, 0.22), transparent 55%), radial-gradient(circle at 80% 0%, rgba(107, 143, 113, 0.25), transparent 42%), linear-gradient(160deg, rgba(245, 239, 230, 0.9), rgba(200, 216, 196, 0.8))",
    "night-fog":
      "radial-gradient(circle at 10% 15%, rgba(212, 98, 26, 0.16), transparent 45%), linear-gradient(180deg, rgba(26, 47, 58, 0.98), rgba(45, 27, 14, 0.95))",
  },
} as const;
