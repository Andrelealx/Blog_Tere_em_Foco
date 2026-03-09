import { calculateReadingTime } from "@/lib/utils";

export type CategorySlug =
  | "turismo"
  | "gastronomia"
  | "cultura"
  | "aventura"
  | "noticias";

export type Subcategory =
  | "trilhas"
  | "eventos"
  | "historia"
  | "sabores"
  | "familia"
  | "dicas";

export interface ArticleSection {
  id: string;
  heading: string;
  paragraphs: string[];
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: ArticleSection[];
  author: string;
  category: CategorySlug;
  subcategory: Subcategory;
  coverImage: string;
  publishedAt: string;
  tags: string[];
  location: string;
}

export interface CategoryInfo {
  slug: CategorySlug;
  title: string;
  icon: string;
  description: string;
}

export const categories: CategoryInfo[] = [
  {
    slug: "turismo",
    title: "Turismo",
    icon: "Mountain",
    description: "Roteiros, natureza e experiências essenciais da serra.",
  },
  {
    slug: "gastronomia",
    title: "Gastronomia",
    icon: "Utensils",
    description: "Sabores locais, cafés autorais e restaurantes de montanha.",
  },
  {
    slug: "cultura",
    title: "Cultura",
    icon: "Theater",
    description: "História, artesanato, memória e agenda cultural de Terê.",
  },
  {
    slug: "aventura",
    title: "Aventura",
    icon: "Compass",
    description: "Escalada, trilhas longas e esportes ao ar livre.",
  },
  {
    slug: "noticias",
    title: "Notícias",
    icon: "Newspaper",
    description: "Atualizações locais com foco em mobilidade e clima.",
  },
];

const articlesBase: Omit<Article, "id">[] = [
  {
    slug: "nascer-do-sol-no-parnaso",
    title: "Nascer do Sol no PARNASO: roteiro para primeira trilha em Terê",
    excerpt:
      "Um guia prático para aproveitar a madrugada na serra com segurança, vista limpa e pausas certas.",
    author: "Ana Beatriz Gomes",
    category: "turismo",
    subcategory: "trilhas",
    coverImage: "/images/parnaso.jpg",
    publishedAt: "2026-03-06T09:30:00-03:00",
    tags: ["Parque Nacional", "Trilhas", "Ecoturismo"],
    location: "Parque Nacional da Serra dos Órgãos",
    content: [
      {
        id: "preparo",
        heading: "Preparação para sair antes das 5h",
        paragraphs: [
          "O percurso mais procurado para iniciantes em Teresópolis combina trilha curta, mirante amplo e sinalização consistente. Mesmo assim, o início cedo exige atenção com camada térmica, lanterna de cabeça e hidratação.",
          "A dica é separar o kit na noite anterior com casaco corta-vento, snack energético e documento pessoal. Levar itens compactos reduz fadiga e acelera o ritmo nos primeiros 40 minutos.",
        ],
      },
      {
        id: "trajeto",
        heading: "Trajeto e ritmo ideal para quem está começando",
        paragraphs: [
          "O trecho inicial alterna subida e pequenas travessias de pedra, por isso o passo mais eficiente é constante. Pausas curtas a cada quinze minutos funcionam melhor do que grandes paradas.",
          "Ao longo do caminho, os guarda-parques orientam sobre áreas de descanso e variações climáticas. Em dias de neblina, o melhor é manter o plano original e evitar atalhos.",
        ],
      },
      {
        id: "retorno",
        heading: "Retorno seguro e opções de almoço no centro",
        paragraphs: [
          "Depois do mirante, o retorno costuma levar menos tempo. Ainda assim, os trechos úmidos pedem atenção, principalmente após chuvas da noite anterior.",
          "No fim da manhã, o centro de Teresópolis reúne restaurantes com menu executivo e opções vegetarianas. Isso fecha o roteiro com conforto para famílias e grupos mistos.",
        ],
      },
    ],
  },
  {
    slug: "cafes-autorais-vila-st-gallen",
    title: "Cafés autorais na Vila St. Gallen: quatro paradas essenciais",
    excerpt:
      "Uma curadoria para quem busca torra local, ambiente acolhedor e sobremesas serranas.",
    author: "Lucas Nogueira",
    category: "gastronomia",
    subcategory: "sabores",
    coverImage: "/images/gastronomia.jpg",
    publishedAt: "2026-03-04T14:20:00-03:00",
    tags: ["Café", "Vila St. Gallen", "Doçaria"],
    location: "Vila St. Gallen",
    content: [
      {
        id: "torra-local",
        heading: "Torra local em micro lotes",
        paragraphs: [
          "Os cafés da região vêm investindo em torra própria com perfil sensorial mais limpo. Para quem gosta de acidez equilibrada, os grãos de média torra têm sido o destaque do mês.",
          "Baristas consultados pelo Terê em Foco recomendam pedir métodos filtrados no primeiro contato. Assim, é possível perceber notas florais sem interferência de leite.",
        ],
      },
      {
        id: "doces-serra",
        heading: "Doces da serra que combinam com o clima",
        paragraphs: [
          "As vitrines misturam receitas clássicas e releituras com frutas de estação. Torta de maçã com especiarias e brownie com castanha são os pedidos mais frequentes.",
          "Quem prefere reduzir açúcar encontra opções com cacau intenso e farinhas integrais. O importante é perguntar o cardápio do dia, que muda bastante no fim de semana.",
        ],
      },
    ],
  },
  {
    slug: "feirinha-do-alto-guia-2026",
    title: "Feirinha do Alto 2026: o que comprar, comer e evitar filas",
    excerpt:
      "Mapa rápido para aproveitar artesanato, moda e gastronomia sem perder tempo.",
    author: "Marina Silva",
    category: "cultura",
    subcategory: "eventos",
    coverImage: "/images/feirinha.jpg",
    publishedAt: "2026-03-02T10:05:00-03:00",
    tags: ["Feirinha do Alto", "Artesanato", "Fim de semana"],
    location: "Alto, Teresópolis",
    content: [
      {
        id: "horarios",
        heading: "Melhores horários para circular com calma",
        paragraphs: [
          "A movimentação cresce rápido após as dez da manhã. Para quem quer comparar preços e conversar com expositores, chegar até nove e meia faz diferença.",
          "No domingo, o pico costuma ser mais cedo por causa do fluxo de turistas de bate-volta. Sábado tende a distribuir melhor o público ao longo do dia.",
        ],
      },
      {
        id: "compras",
        heading: "Itens com melhor custo-benefício",
        paragraphs: [
          "Peças em couro, tricô e madeira seguem entre os itens mais procurados. Vale olhar acabamento interno e perguntar sobre origem do material antes de fechar compra.",
          "Na alimentação, pratos quentes vendidos nas extremidades da feira costumam ter filas menores no horário de almoço.",
        ],
      },
    ],
  },
  {
    slug: "pedra-do-sino-preparo-fisico",
    title: "Pedra do Sino: preparo físico e equipamentos para subida longa",
    excerpt:
      "Checklist objetivo para quem vai encarar uma das trilhas mais tradicionais da Serra dos Órgãos.",
    author: "Rafael Mota",
    category: "aventura",
    subcategory: "trilhas",
    coverImage: "/images/aventura.jpg",
    publishedAt: "2026-02-28T08:15:00-03:00",
    tags: ["Pedra do Sino", "Montanhismo", "Segurança"],
    location: "Serra dos Órgãos",
    content: [
      {
        id: "condicionamento",
        heading: "Condicionamento mínimo recomendado",
        paragraphs: [
          "Especialistas locais sugerem treinos leves de subida por pelo menos quatro semanas antes da trilha completa. O foco deve ser resistência, não velocidade.",
          "Treinos com mochila de peso progressivo ajudam a simular o esforço real sem sobrecarregar articulações nos primeiros dias.",
        ],
      },
      {
        id: "equipamentos",
        heading: "Equipamentos que realmente importam",
        paragraphs: [
          "Bota com aderência, bastão retrátil e jaqueta impermeável entram na lista de prioridade. O restante pode variar conforme a previsão do tempo.",
          "Em dias de vento forte no cume, luva e segunda camada térmica aumentam conforto e reduzem risco de queda de rendimento.",
        ],
      },
    ],
  },
  {
    slug: "comary-visita-com-criancas",
    title: "Granja Comary com crianças: roteiro leve para uma manhã inteira",
    excerpt:
      "Percurso acessível, pausas estratégicas e atividades para família em uma das áreas mais bonitas da cidade.",
    author: "Juliana Prado",
    category: "turismo",
    subcategory: "familia",
    coverImage: "/images/comary.jpg",
    publishedAt: "2026-02-24T16:45:00-03:00",
    tags: ["Comary", "Família", "Passeio"],
    location: "Granja Comary",
    content: [
      {
        id: "entrada",
        heading: "Como organizar a chegada sem pressa",
        paragraphs: [
          "A região da Comary costuma ter trânsito moderado em feriados e sábados de manhã. Sair cedo reduz estresse e garante melhores vagas de estacionamento.",
          "Para famílias com crianças pequenas, vale levar lanche rápido e reservar tempo para pausas em áreas com sombra.",
        ],
      },
      {
        id: "atividades",
        heading: "Atividades para diferentes idades",
        paragraphs: [
          "Caminhadas curtas e observação da paisagem funcionam bem para todas as idades. Adolescentes costumam aproveitar mais os trechos fotográficos próximos ao lago.",
          "No encerramento, cafeterias na rota de saída ajudam a transformar o passeio em programa de meio período.",
        ],
      },
    ],
  },
  {
    slug: "agenda-cultural-marco",
    title: "Agenda cultural de março em Teresópolis: shows, teatro e oficinas",
    excerpt:
      "Seleção semanal com eventos para moradores e visitantes, incluindo atividades gratuitas.",
    author: "Carolina Tavares",
    category: "cultura",
    subcategory: "eventos",
    coverImage: "/images/historia.jpg",
    publishedAt: "2026-02-21T11:40:00-03:00",
    tags: ["Agenda", "Teatro", "Oficinas"],
    location: "Centro e Alto",
    content: [
      {
        id: "eventos-gratis",
        heading: "Programas gratuitos para o fim de semana",
        paragraphs: [
          "A agenda deste mês destaca oficinas de fotografia urbana e apresentações em praças centrais. A maioria dos eventos começa no fim da tarde.",
          "Como algumas atividades têm vagas limitadas, a recomendação é confirmar inscrição pelo perfil oficial dos organizadores.",
        ],
      },
      {
        id: "teatro-local",
        heading: "Cenas autorais no circuito local",
        paragraphs: [
          "Grupos independentes da cidade estão apostando em sessões curtas com debates após o espetáculo. Isso aproxima o público do processo criativo.",
          "Para quem visita Teresópolis por poucos dias, encaixar uma sessão noturna é uma boa forma de viver a cidade além dos pontos turísticos.",
        ],
      },
    ],
  },
  {
    slug: "frente-fria-serra-alerta",
    title: "Frente fria na serra: o que muda na rotina da cidade nesta semana",
    excerpt:
      "Previsão de temperatura, impacto no trânsito e recomendações para visitantes.",
    author: "Equipe Terê em Foco",
    category: "noticias",
    subcategory: "dicas",
    coverImage: "/images/natureza.jpg",
    publishedAt: "2026-02-19T07:55:00-03:00",
    tags: ["Clima", "Mobilidade", "Serviços"],
    location: "Teresópolis",
    content: [
      {
        id: "previsao",
        heading: "Queda de temperatura e chuva intermitente",
        paragraphs: [
          "Boletins meteorológicos indicam queda de temperatura durante a madrugada e pancadas rápidas no período da tarde. Isso afeta principalmente bairros mais altos.",
          "Para quem está de viagem marcada, casaco impermeável e planejamento de deslocamento evitam atrasos em passeios abertos.",
        ],
      },
      {
        id: "transito",
        heading: "Trechos com maior lentidão em horários de pico",
        paragraphs: [
          "As vias de acesso ao Alto e ao centro concentram maior fluxo entre sete e nove da manhã. Em dias de chuva, o tempo de deslocamento pode subir até trinta por cento.",
          "Aplicativos de mobilidade e rotas alternativas ajudam a manter o cronograma, especialmente para quem chega da capital.",
        ],
      },
    ],
  },
  {
    slug: "restaurantes-com-vista",
    title: "5 restaurantes com vista de montanha para jantar em Teresópolis",
    excerpt:
      "Endereços para uma noite especial com cozinha autoral e clima serrano.",
    author: "Bruno Xavier",
    category: "gastronomia",
    subcategory: "sabores",
    coverImage: "/images/gastronomia.jpg",
    publishedAt: "2026-02-16T19:10:00-03:00",
    tags: ["Restaurantes", "Jantar", "Vista"],
    location: "Bairros panorâmicos",
    content: [
      {
        id: "escolha",
        heading: "Como escolher o melhor horário",
        paragraphs: [
          "Reservar entre dezoito e dezenove horas aumenta a chance de pegar pôr do sol e evitar filas. Em noites frias, áreas internas costumam esgotar primeiro.",
          "Alguns restaurantes trabalham com menu sazonal e harmonização local, por isso consultar o cardápio da semana vale a pena.",
        ],
      },
      {
        id: "faixa-preco",
        heading: "Faixa de preço e proposta de cada casa",
        paragraphs: [
          "Há opções para ocasiões especiais e também bistrôs mais acessíveis, com pratos executivos no jantar durante a semana.",
          "O principal diferencial é a vista contínua da serra, que muda bastante conforme o clima e a luminosidade.",
        ],
      },
    ],
  },
];

export const articles: Article[] = articlesBase
  .map((article, index) => ({
    ...article,
    id: `art-${index + 1}`,
  }))
  .sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );

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

export function getAllArticles() {
  return articles;
}

export function getFeaturedArticles() {
  return articles.slice(0, 3);
}

export function getLatestArticles(limit = 6) {
  return articles.slice(0, limit);
}

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getRelatedArticles(slug: string, category: CategorySlug, limit = 3) {
  return articles
    .filter((article) => article.slug !== slug && article.category === category)
    .slice(0, limit);
}

export function getCategoryInfo(slug: string) {
  return categories.find((category) => category.slug === slug as CategorySlug);
}

export function getArticlesByCategory(slug: string) {
  return articles.filter((article) => article.category === slug);
}

export function getSubcategoriesForCategory(slug: string) {
  const values = new Set(
    getArticlesByCategory(slug).map((article) => article.subcategory),
  );
  return ["todas", ...Array.from(values)];
}

export function getArticleReadingTime(article: Article) {
  return calculateReadingTime(
    article.content
      .map((section) => `${section.heading}\n${section.paragraphs.join(" ")}`)
      .join(" "),
  );
}
