/**
 * @file lib/config.ts
 * @description Configuração estática de UI do front-end (Blog Terê em Foco).
 *
 * São dados de apresentação (não de conteúdo editorial) que ficam no
 * front-end, separados do backforge.
 */

export const tickerItems = [
  "Feirinha do Alto terá programação estendida no próximo fim de semana.",
  "PARNASO reforça orientações para trilhas com neblina durante a madrugada.",
  "Linha especial de ônibus para o Alto passa a operar aos domingos.",
  "Festival gastronômico da serra confirma participação de 18 restaurantes.",
];

export const categoryHighlights = [
  {
    slug: "turismo" as const,
    title: "Roteiros de Altitude",
    description: "Trilhas leves, mirantes e caminhos para curtir a serra com calma.",
    image: "/images/parnaso.jpg",
  },
  {
    slug: "gastronomia" as const,
    title: "Sabores da Serra",
    description: "Da cozinha afetiva aos cafés autorais com ingredientes locais.",
    image: "/images/gastronomia.jpg",
  },
  {
    slug: "cultura" as const,
    title: "Memória e Arte",
    description: "Feiras, oficinas e tradições que moldam a identidade de Terê.",
    image: "/images/feirinha.jpg",
  },
];
