import type { Config } from "tailwindcss";
import { tailwindTokens } from "./tailwind-tokens";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: tailwindTokens.colors,
      boxShadow: tailwindTokens.boxShadow,
      backgroundImage: tailwindTokens.backgroundImage,
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        ticker: "ticker 28s linear infinite",
        fadeUp: "fadeUp 0.7s ease forwards",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "72ch",
            color: "rgb(55 72 48)",
            h2: {
              color: "rgb(28 56 18)",
              fontFamily: "var(--font-display)",
            },
            h3: {
              color: "rgb(28 56 18)",
              fontFamily: "var(--font-display)",
            },
            a: {
              color: "rgb(35 138 68)",
              textDecoration: "none",
              fontWeight: "600",
            },
            strong: {
              color: "rgb(28 56 18)",
            },
            blockquote: {
              borderLeftColor: "rgb(74 124 94)",
              color: "rgb(72 82 62)",
            },
          },
        },
        invert: {
          css: {
            color: "rgb(229 231 235)",
            h2: { color: "rgb(243 246 240)" },
            h3: { color: "rgb(243 246 240)" },
            strong: { color: "rgb(243 246 240)" },
            a: { color: "rgb(184 212 192)" },
            blockquote: { color: "rgb(209 213 219)" },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
