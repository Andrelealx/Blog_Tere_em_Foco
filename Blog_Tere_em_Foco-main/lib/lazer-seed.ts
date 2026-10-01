/**
 * @file lib/lazer-seed.ts
 * @description Dados iniciais das opções de lazer (seed).
 *
 * São os mesmos itens que antes estavam hardcoded em `app/lazer/page.tsx`,
 * agora persistidos no MySQL na primeira execução (ver `lib/db.ts`).
 */

export interface OpcaoLazerSeed {
  slug: string;
  titulo: string;
  categoria: string;
  descricao: string;
  horario: string;
  localizacao: string;
  tags: string[];
  imagens: string[];
}

export const lazerSeedItems: OpcaoLazerSeed[] = [
  {
    slug: "parque-nacional-da-serra-dos-orgaos",
    titulo: "Parque Nacional da Serra dos Órgãos (PARNASO)",
    categoria: "Ecoturismo & Aventura",
    descricao:
      "O terceiro parque nacional mais antigo do Brasil. Abriga o cartão-postal da cidade, o Dedo de Deus, além de diversas cachoeiras, piscinas naturais e a famosa Travessia Petrópolis-Teresópolis.",
    horario: "Diariamente, das 8h às 17h.",
    localizacao: "Avenida Rotariana, s/n - Soberbo",
    tags: ["Trilhas", "Cachoeiras", "Mirantes"],
    imagens: [
      "/images/lazer/parnaso/1.jpg",
      "/images/lazer/parnaso/2.jpg",
      "/images/lazer/parnaso/3.jpg",
    ],
  },
  {
    slug: "feirinha-do-alto",
    titulo: "Feirinha do Alto",
    categoria: "Cultura & Compras",
    descricao:
      "Um dos pontos turísticos mais tradicionais da Serra Fluminense. São mais de 600 barracas oferecendo moda (especialmente tricô e couro), artesanato local e praça de alimentação.",
    horario: "Sábados, Domingos e Feriados, das 10h às 18h.",
    localizacao: "Praça Higino da Silveira - Bairro do Alto",
    tags: ["Artesanato", "Gastronomia", "Moda"],
    imagens: [
      "/images/lazer/feirinha/1.jpg",
      "/images/lazer/feirinha/2.jpg",
      "/images/lazer/feirinha/3.jpg",
    ],
  },
  {
    slug: "mirante-do-soberbo",
    titulo: "Mirante do Soberbo",
    categoria: "Contemplação",
    descricao:
      "A porta de entrada da cidade oferece uma das vistas mais espetaculares do estado. Em dias claros, é possível admirar o pico Dedo de Deus e a Baía de Guanabara.",
    horario: "Acesso livre 24 horas. Melhor horário: pôr do sol.",
    localizacao: "BR-116, km 89 - Entrada da Cidade",
    tags: ["Cartão-Postal", "Fotografia", "Gratuito"],
    imagens: [
      "/images/lazer/mirante/1.jpg",
      "/images/lazer/mirante/2.jpg",
      "/images/lazer/mirante/3.jpg",
    ],
  },
  {
    slug: "vila-st-gallen",
    titulo: "Vila St. Gallen",
    categoria: "Gastronomia & Lazer",
    descricao:
      "Um pedacinho da Alemanha em Teresópolis. A vila reproduz uma charmosa cidade bávara com gastronomia europeia e cervejas artesanais.",
    horario: "Quarta a Domingo (horários variam por estabelecimento).",
    localizacao: "Rua Augusto do Amaral Peixoto, 166 - Alto",
    tags: ["Cervejaria", "Restaurantes", "Arquitetura"],
    imagens: [
      "/images/lazer/vila/1.jpg",
      "/images/lazer/vila/2.jpg",
      "/images/lazer/vila/3.jpg",
    ],
  },
  {
    slug: "lago-da-granja-comary",
    titulo: "Lago da Granja Comary",
    categoria: "Passeio em Família",
    descricao:
      "Vista privilegiada para as montanhas e o Centro de Treinamento da Seleção Brasileira de Futebol (CBF). Ótimo para caminhadas e passeios tranquilos.",
    horario: "Acesso diurno liberado para pedestres.",
    localizacao: "Bairro Carlos Guinle",
    tags: ["Natureza", "Caminhada", "CBF"],
    imagens: [
      "/images/lazer/comary/1.jpg",
      "/images/lazer/comary/2.jpg",
      "/images/lazer/comary/3.jpg",
    ],
  },
  {
    slug: "cachoeira-dos-frades",
    titulo: "Cachoeira dos Frades",
    categoria: "Cachoeiras & Banho",
    descricao:
      "Uma das cachoeiras mais encantadoras da região, com queda d'água de aproximadamente 15 metros e poço natural de águas cristalinas. Ideal para banho refrescante e piquenique em meio à Mata Atlântica preservada.",
    horario: "Aberto diariamente, das 9h às 17h.",
    localizacao: "Estrada da Varginha, s/n - Vargem Grande",
    tags: ["Cachoeira", "Banho Natural", "Piquenique"],
    imagens: [
      "/images/lazer/cachoeira/1.jpg",
      "/images/lazer/cachoeira/2.jpg",
      "/images/lazer/cachoeira/3.jpg",
    ],
  },
];
