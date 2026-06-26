import { calculateReadingTime } from "@/lib/utils";

export type CategorySlug =
  | "turismo"
  | "gastronomia"
  | "cultura"
  | "aventura"
  | "noticias"
  | "clima"
  | "lazer";

export type Subcategory =
  | "trilhas"
  | "eventos"
  | "historia"
  | "sabores"
  | "familia"
  | "dicas"
  | "arte"
  | "artesanato"
  | "restaurantes";

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
  {
    slug: "clima",
    title: "Clima",
    icon: "CloudSun",
    description: "Previsões, estações do ano e melhor época para visitar a serra.",
  },
  {
    slug: "lazer",
    title: "Lazer",
    icon: "Activity",
    description: "Parques, praças e roteiros de fim de semana para curtir a cidade.",
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
    slug: "feirinha-do-alto-guia-2026",
    title: "Feirinha do Alto 2026: o que comprar, comer e evitar filas",
    excerpt:
      "Mapa rápido para aproveitar artesanato, moda e gastronomia sem perder tempo.",
    author: "Marina Silva",
    category: "cultura",
    subcategory: "eventos",
    coverImage: "/images/explorar/feirinha.jpg",
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
    coverImage: "/images/explorar/pedra-do-sino.jpg",
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
    slug: "inverno-teresopolis-guia",
    title: "Inverno em Teresópolis: como se preparar para o frio na serra",
    excerpt:
      "Dicas de vestuário, roteiros aconchegantes e o que esperar das temperaturas na estação mais charmosa do ano.",
    author: "Equipe Terê em Foco",
    category: "clima",
    subcategory: "dicas",
    coverImage: "/images/natureza.jpg",
    publishedAt: "2026-03-10T11:00:00-03:00",
    tags: ["Inverno", "Frio", "Dicas", "Previsão"],
    location: "Teresópolis",
    content: [
      {
        id: "vestuario",
        heading: "Vestuário em camadas",
        paragraphs: [
          "O segredo para enfrentar o frio na serra é vestir-se em camadas. As manhãs podem ser muito frias (próximas de 5°C), mas à tarde a temperatura sobe.",
          "Uma boa jaqueta corta-vento e roupas térmicas (segunda pele) são essenciais para quem planeja atividades ao ar livre.",
        ],
      },
      {
        id: "roteiros-frio",
        heading: "Programações para dias gelados",
        paragraphs: [
          "Aproveite as baixas temperaturas para visitar cafeterias locais, provar um fondue e curtir o clima europeu da cidade.",
        ],
      },
    ],
  },
  {
    slug: "parques-praticar-esportes",
    title: "Parques ideais para praticar esportes e lazer em família",
    excerpt:
      "Conheça as áreas verdes de Teresópolis perfeitas para correr, pedalar ou fazer um piquenique.",
    author: "Carlos Machado",
    category: "lazer",
    subcategory: "familia",
    coverImage: "/images/aventura.jpg",
    publishedAt: "2026-03-08T09:15:00-03:00",
    tags: ["Esportes", "Piquenique", "Ar livre"],
    location: "Parques Municipais",
    content: [
      {
        id: "locais",
        heading: "Melhores locais",
        paragraphs: [
          "O Parque Nacional não é o único refúgio verde. Parques municipais menores oferecem pistas planas e seguras para crianças.",
          "Ideal para passeios de bicicleta, caminhadas matinais ou simplesmente deitar na grama e aproveitar o sol de outono.",
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
    slug: "casa-de-cultura-adolpho-bloch",
    title: "Casa de Cultura Adolpho Bloch: teatro, exposições e oficinas gratuitas",
    excerpt:
      "Inaugurada em 1988, é o principal polo cultural de Teresópolis com programação diversa e acesso livre.",
    author: "Carolina Tavares",
    category: "cultura",
    subcategory: "arte",
    coverImage: "/images/explorar/casa-de-cultura.jpg",
    publishedAt: "2026-03-15T09:20:00-03:00",
    tags: ["Casa de Cultura", "Teatro", "Exposições"],
    location: "Centro, Teresópolis",
    content: [
      {
        id: "historia-espaco",
        heading: "Um palácio dedicado às artes",
        paragraphs: [
          "O prédio da Casa de Cultura Adolpho Bloch foi projetado originalmente como residência e depois transformado em centro cultural. A arquitetura preserva elementos originais com jardins que emolduram exposições ao ar livre.",
          "O espaço abriga galeria de exposições temporárias, teatro com capacidade para 180 pessoas e salas multiuso onde acontecem oficinas gratuitas de artes plásticas, capoeira, dança e teatro ao longo do ano.",
        ],
      },
      {
        id: "oficinas-gratuitas",
        heading: "Oficinas e cursos com inscrição aberta ao público",
        paragraphs: [
          "A programação fixa inclui aulas de desenho, pintura em tela, modelagem em argila e iniciação teatral para crianças e adultos. As inscrições abrem no início de cada semestre e costumam esgotar rápido.",
          "Aos sábados, acontecem apresentações de corais, dança contemporânea e saraus literários com entrada franca. A agenda completa é divulgada mensalmente nas redes sociais oficiais da prefeitura.",
        ],
      },
    ],
  },
  {
    slug: "igreja-matriz-santa-teresa",
    title: "Igreja Matriz de Santa Teresa: história, arquitetura e visitação",
    excerpt:
      "Cartão-postal do centro da cidade, a matriz guarda mais de 150 anos de história e fé na serra.",
    author: "Marina Silva",
    category: "cultura",
    subcategory: "historia",
    coverImage: "/images/explorar/igreja-matriz.jpg",
    publishedAt: "2026-03-08T07:30:00-03:00",
    tags: ["Igreja Matriz", "História", "Arquitetura"],
    location: "Centro, Teresópolis",
    content: [
      {
        id: "construcao-estilo",
        heading: "Construção e estilo neogótico",
        paragraphs: [
          "A Paróquia de Santa Teresa d'Ávila foi fundada em 1855, mesmo ano de criação do município. A igreja atual, em estilo neogótico, começou a ser erguida no início do século XX e tornou-se referência arquitetônica na região serrana.",
          "Os vitrais coloridos narram passagens da vida de Santa Teresa e foram restaurados nos últimos dez anos. O altar-mor em madeira entalhada e os afrescos do teto chamam a atenção de visitantes e fiéis.",
        ],
      },
      {
        id: "visita-respeitosa",
        heading: "Como visitar com respeito ao espaço religioso",
        paragraphs: [
          "A igreja fica aberta diariamente para visitação fora dos horários de missa. O silêncio é bem-vindo e fotografias sem flash são permitidas. Guias locais contam a história da construção em tours a pé pelo centro histórico.",
          "A praça em frente é ponto de encontro de moradores e abriga feiras de artesanato em datas comemorativas. A dica é visitar no fim da tarde, quando a luz natural atravessa os vitrais.",
        ],
      },
    ],
  },
  {
    slug: "festival-de-inverno-teresopolis",
    title: "Festival de Inverno de Teresópolis: música, gastronomia e arte na serra",
    excerpt:
      "Evento anual reúne shows, oficinas, feira gastronômica e programação infantil durante as férias de julho.",
    author: "Rafael Mota",
    category: "cultura",
    subcategory: "eventos",
    coverImage: "/images/explorar/festival-inverno.jpg",
    publishedAt: "2026-03-01T13:10:00-03:00",
    tags: ["Festival de Inverno", "Música", "Gastronomia"],
    location: "Teresópolis",
    content: [
      {
        id: "programacao",
        heading: "Programação diversa para todas as idades",
        paragraphs: [
          "O Festival de Inverno acontece tradicionalmente em julho com polos espalhados pelo centro, Alto e bairros. A grade inclui MPB, chorinho, jazz, teatro de rua e oficinas criativas para o público infantil.",
          "Restaurantes parceiros oferecem menus temáticos com ingredientes da estação — fondues, caldos e pratos quentes são os favoritos do público. Algumas edições incluíram mostra de cinema e exposição de arte serrana.",
        ],
      },
      {
        id: "dicas-aproveitar",
        heading: "Dicas para aproveitar o festival",
        paragraphs: [
          "Chegue cedo aos shows mais concorridos — os melhores lugares costumam ser ocupados uma hora antes. Leve agasalho extra: as noites de julho em Teresópolis podem ser bem frias, mesmo com o movimento intenso do festival.",
          "Consulte a programação oficial nas redes da prefeitura e do SESC, que costumam co-organizar o evento. Algumas atividades exigem retirada de ingresso antecipado.",
        ],
      },
    ],
  },
  {
    slug: "artesanato-serrano-atelies",
    title: "Artesanato serrano: conheça os ateliês e mestres de Teresópolis",
    excerpt:
      "Além da Feirinha do Alto, a cidade abriga artesãos que produzem peças únicas em madeira, cerâmica e lã natural.",
    author: "Marina Silva",
    category: "cultura",
    subcategory: "artesanato",
    coverImage: "/images/explorar/artesanato-serrano.jpg",
    publishedAt: "2026-02-25T08:45:00-03:00",
    tags: ["Artesanato", "Ateliês", "Cultura Local"],
    location: "Teresópolis",
    content: [
      {
        id: "perfil-artesaos",
        heading: "Quem são os artesãos da serra",
        paragraphs: [
          "Muitos artesãos de Teresópolis vêm de famílias que produzem há gerações. O trabalho com madeira de demolição, a tecelagem com lã de ovelha e a cerâmica esmaltada são algumas das técnicas preservadas.",
          "Os ateliês ficam espalhados por bairros como Comary, Várzea e Albuquerque. Alguns artesãos abrem seus espaços de trabalho para visitação com hora marcada — uma experiência mais íntima que a feira.",
        ],
      },
      {
        id: "onde-encontrar",
        heading: "Onde encontrar e como comprar",
        paragraphs: [
          "Além da Feirinha do Alto aos sábados e domingos, algumas lojas colaborativas no centro reúnem peças de vários artesãos num só lugar. Na Praça Olímpica, expositores se revezam em calendário rotativo.",
          "Para peças sob encomenda, o ideal é contatar diretamente o artesão pelas redes sociais. Entregas costumam levar de duas a quatro semanas dependendo da complexidade do trabalho.",
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
    slug: "vila-st-gallen-cervejaria-cozinha-alema",
    title: "Vila St. Gallen: a experiência alemã que virou patrimônio de Teresópolis",
    excerpt:
      "Cervejas premiadas, Eisbein assado por horas e um jardim bucólico que atrai turistas do país inteiro.",
    author: "Marina Silva",
    category: "gastronomia",
    subcategory: "restaurantes",
    coverImage: "/images/explorar/vila-st-gallen.jpg",
    publishedAt: "2026-03-13T12:30:00-03:00",
    tags: ["Vila St. Gallen", "Cervejaria", "Cozinha Alemã"],
    location: "Vila St. Gallen, Alto",
    content: [
      {
        id: "cervejas-terroir",
        heading: "Cervejas que nascem da montanha",
        paragraphs: [
          "A Vila St. Gallen é o ponto turístico gastronômico mais visitado de Teresópolis — e com razão. A fábrica produz 14 estilos anuais com água de nascente da própria serra e maltes da Baviera. O tour guiado de 40 minutos mostra moagem, brassagem, fermentação e envase, terminando com degustação harmonizada no salão principal. As leveduras, por conta da altitude, desenvolvem notas cítricas e florais que se tornaram assinatura da casa.",
          "No inverno, edições limitadas maturadas em barris de amburana e carvalho atraem colecionadores. O jardim externo — com mesas sob quaresmeiras centenárias — fica lotado aos fins de semana. A dica é chegar antes das 11h para garantir lugar sem reserva.",
        ],
      },
      {
        id: "cozinha-germanica",
        heading: "Da Bratwurst ao Apfelstrudel: a Alemanha na serra",
        paragraphs: [
          "O restaurante da cervejaria é fiel à tradição germânica sem ser turístico. Salsichas artesanais de produção própria, chucrute fermentado lentamente, joelho de porco com pele crocante e strudel de maçã com sorvete de nata. O carro-chefe é o Eisbein com purê rústico e mostarda escura — receita que não muda desde a inauguração.",
          "A harmonização é feita por sommeliers certificados. O menu degustação de três tempos (entrada + principal + sobremesa com cerveja harmonizada) sai por preço fixo e é a melhor porta de entrada para iniciantes. Aos domingos, o café colonial com pães alemães e geleias artesanais atrai famílias.",
        ],
      },
    ],
  },
  {
    slug: "viva-italia-alta-gastronomia",
    title: "Viva Itália: onde a cozinha italiana encontra a serra fluminense",
    excerpt:
      "Massas frescas abertas à mão, carta de vinhos com 200 rótulos e um salão com vista para o Dedo de Deus.",
    author: "Bruno Xavier",
    category: "gastronomia",
    subcategory: "restaurantes",
    coverImage: "/images/explorar/viva-italia.jpg",
    publishedAt: "2026-03-08T11:15:00-03:00",
    tags: ["Viva Itália", "Italiano", "Alta Gastronomia"],
    location: "Alto",
    content: [
      {
        id: "massas-premium",
        heading: "Massa feita duas vezes ao dia, desde 1998",
        paragraphs: [
          "O Viva Itália é referência em cozinha italiana de alto padrão na serra. O chef Massimo Lorenzetti, formado em Bologna, comanda a cozinha há 25 anos com a mesma equipe. As massas são abertas à mão duas vezes ao dia — ao meio-dia e às sete da noite — com farinha italiana tipo 00 e ovos caipiras da região. O pappardelle com ragu de cordeiro cozido por oito horas no vinho tinto é o prato mais pedido da casa.",
          "A adega climatizada guarda 200 rótulos, com predomínio de Barolos, Brunellos e Chiantis, além de uma seleção rara de vinhos brasileiros de altitude. O sommelier monta harmonizações personalizadas para o menu degustação de cinco tempos — experiência que precisa ser reservada com 48 horas de antecedência.",
        ],
      },
      {
        id: "salao-vista",
        heading: "Janelas que emolduram o Dedo de Deus",
        paragraphs: [
          "O salão principal tem pé-direito duplo e janelas do chão ao teto que miram diretamente o Dedo de Deus. Ao entardecer, a montanha ganha tons rosados e o salão é iluminado apenas por velas e abajures de Murano. O piano ao vivo nas noites de sexta e sábado cria atmosfera de filme italiano.",
          "Para ocasiões especiais, o reservado com lareira acomoda até doze pessoas e tem menu próprio. O tiramisu clássico — com mascarpone italiano e café coado na hora — é apontado por críticos como o melhor da serra.",
        ],
      },
    ],
  },
  {
    slug: "mad-garden-cozinha-contemporanea",
    title: "Mad Garden: o jardim secreto que reinventou a gastronomia serrana",
    excerpt:
      "Cozinha afetiva contemporânea, horta orgânica no terreno e um jardim projetado por paisagista premiado.",
    author: "Marina Silva",
    category: "gastronomia",
    subcategory: "restaurantes",
    coverImage: "/images/explorar/mad-garden.jpg",
    publishedAt: "2026-03-01T18:45:00-03:00",
    tags: ["Mad Garden", "Contemporâneo", "Jardim"],
    location: "Várzea",
    content: [
      {
        id: "cozinha-afetiva",
        heading: "Cozinha afetiva com técnica francesa",
        paragraphs: [
          "O Mad Garden é o restaurante mais comentado de Teresópolis nos últimos dois anos. A chef Isabela Horta — que passou pelo Le Cordon Bleu em Paris e pelo D.O.M. em São Paulo — voltou para a cidade natal e montou o restaurante na casa da avó. O cardápio muda a cada mês e gira em torno do que a horta orgânica de 800 m² entrega: beterrabas baby, flores comestíveis, ervas raras e hortaliças não convencionais como ora-pro-nóbis e capuchinha.",
          "O menu degustação de sete tempos se tornou o mais disputado da cidade — reservas abrem no primeiro dia do mês e esgotam em 24 horas. Cada prato é apresentado pela própria chef, que explica a origem dos ingredientes e a inspiração por trás de cada combinação.",
        ],
      },
      {
        id: "jardim-projetado",
        heading: "Um jardim que vale a visita por si só",
        paragraphs: [
          "O jardim é assinado pelo paisagista carioca Ricardo Carneiro, que criou ilhas de plantas nativas da Mata Atlântica misturadas a roseiras antigas e lavandas. As mesas ficam distribuídas entre os canteiros, com distância generosa entre si, garantindo intimidade. À noite, cordões de luzes minúsculas envolvem as árvores e o ambiente vira cenário de cinema.",
          "O bar do jardim serve coquetéis autorais com ervas colhidas na hora — o Gim-Tônica de lavanda e o Negroni com infusão de jabuticaba lideram. A carta de vinhos prioriza pequenos produtores brasileiros e biodinâmicos, alinhada à filosofia de sustentabilidade da casa.",
        ],
      },
    ],
  },
  {
    slug: "imbuhy-restaurante",
    title: "Imbuhy: gastronomia de montanha com vista para a cascata",
    excerpt:
      "Cozinha contemporânea brasileira em meio à natureza, com varanda debruçada sobre a Cascata do Imbuí.",
    author: "Rafael Mota",
    category: "gastronomia",
    subcategory: "restaurantes",
    coverImage: "/images/explorar/imbuhy.jpg",
    publishedAt: "2026-02-25T13:00:00-03:00",
    tags: ["Imbuhy", "Contemporânea", "Natureza"],
    location: "Imbuí",
    content: [
      {
        id: "cozinha-de-montanha",
        heading: "Ingredientes da serra no prato",
        paragraphs: [
          "O Imbuhy Restaurante conquistou seu lugar entre os endereços mais desejados de Teresópolis apostando em cozinha contemporânea com alma serrana. O cardápio muda conforme a estação: truta fresca da região no outono, cogumelos selvagens no inverno, ervas finas e flores comestíveis na primavera, frutas vermelhas e legumes orgânicos no verão. Tudo abastecido por pequenos produtores da Região Serrana.",
          "O chef proprietário comanda a cozinha aberta com precisão e simplicidade. Seu carro-chefe é o menu de três tempos — entrada, principal e sobremesa — que muda a cada quinze dias conforme o que chega das hortas parceiras. O risoto de truta defumada com alho-poró é o prato que nunca sai do cardápio, a pedido dos clientes.",
        ],
      },
      {
        id: "varanda-cascata",
        heading: "Varanda com vista para a Cascata do Imbuí",
        paragraphs: [
          "O grande diferencial do Imbuhy é a localização: a varanda principal se debruça sobre um vale com vista direta para a Cascata do Imbuí, cartão-postal de Teresópolis. Nos dias mais frios, as lareiras são acesas e o ambiente ganha um clima acolhedor difícil de superar. A carta de vinhos valoriza rótulos brasileiros de altitude, com curadoria focada em vinícolas da Serra Gaúcha e da Serra da Mantiqueira.",
          "Aos fins de semana, o restaurante serve um brunch montanhês das 9h às 13h, com pães artesanais, queijos da serra, geleias caseiras, ovos caipiras e fondues doces. As reservas costumam esgotar com uma semana de antecedência — especialmente as mesas da varanda.",
        ],
      },
    ],
  },
  {
    slug: "paraiso-da-serra",
    title: "Paraíso da Serra: o sabor da roça com toque gourmet a 1.200 metros",
    excerpt:
      "Fogão a lenha, galinha caipira e produtos orgânicos da fazenda com vista panorâmica das montanhas.",
    author: "Lucas Nogueira",
    category: "gastronomia",
    subcategory: "restaurantes",
    coverImage: "/images/explorar/paraiso-da-serra.jpg",
    publishedAt: "2026-02-20T20:00:00-03:00",
    tags: ["Paraíso da Serra", "Comida da Roça", "Panorâmico"],
    location: "Interior",
    content: [
      {
        id: "fogao-a-lenha",
        heading: "Fogão a lenha aceso desde a inauguração",
        paragraphs: [
          "O Paraíso da Serra é aquele lugar onde a estrada de terra já vale a viagem. A 1.200 metros de altitude, o restaurante ocupa uma ampla varanda rústica com mesas de madeira maciça e vista desimpedida para o Dedo de Deus e a Pedra do Sino. O fogão a lenha está sempre aceso — seja no inverno rigoroso ou no verão ameno da serra — e é dele que saem os pratos que fizeram a fama da casa.",
          "A especialidade é a cozinha da roça elevada a outro patamar: galinha caipira ao molho pardo, feijão tropeiro com torresmo pururuca, costelinha de porco assada lentamente por seis horas, tutu de feijão com couve fininha e angu de milho verde. Tudo preparado com ingredientes da horta orgânica que circunda o restaurante.",
        ],
      },
      {
        id: "fazenda-propria",
        heading: "Da horta ao prato, sem sair da fazenda",
        paragraphs: [
          "A propriedade tem criação própria de galinhas caipiras, horta orgânica de 2.000 m², pomar com frutas da estação e produção artesanal de queijos e embutidos. Aos sábados, o restaurante monta um buffet rural completo com mais de 30 itens, incluindo leitoa à pururuca e sobremesas como doce de leite caseiro e goiabada cascão derretida.",
          "A carta de bebidas valoriza cachaças artesanais da Região Serrana, cervejas da Vila St. Gallen e vinhos brasileiros de altitude. O Paraíso da Serra também funciona como espaço de eventos e recebe casamentos e celebrações em meio ao jardim florido. Nos domingos de sol, chegar cedo é obrigatório — as mesas da varanda disputadíssimas.",
        ],
      },
    ],
  },
  {
    slug: "burrata-emporio-e-bistro",
    title: "Burrata Empório e Bistrô: o pedaço da Itália na serra fluminense",
    excerpt:
      "Massas artesanais, burratas cremosas e antepastos em um jardim secreto com despensa gourmet.",
    author: "Bruno Xavier",
    category: "gastronomia",
    subcategory: "restaurantes",
    coverImage: "/images/explorar/burrata.jpg",
    publishedAt: "2026-02-10T12:00:00-03:00",
    tags: ["Burrata", "Italiano", "Empório"],
    location: "Centro",
    content: [
      {
        id: "massas-artesanais",
        heading: "Massas abertas à mão e burratas que derretem na boca",
        paragraphs: [
          "O Burrata Empório e Bistrô é meio restaurante, meio empório italiano — e inteiro apaixonante. A casa produz diariamente suas próprias massas frescas: fettuccine, ravioli, nhoque de batata e a inconfundível lasanha verde à bolonhesa, que assa lentamente e chega à mesa borbulhando. As burratas — que dão nome ao lugar — são feitas artesanalmente com leite fresco da região e servidas com tomates assados, manjericão e azeite trufado.",
          "O cardápio muda a cada estação, mas mantém clássicos que os clientes não deixam tirar: o spaghetti alla carbonara autêntico (com guanciale e sem creme de leite), o risoto de funghi com parmesão maturado 24 meses e a panna cotta de baunilha com calda de frutas vermelhas da serra.",
        ],
      },
      {
        id: "emporio-gourmet",
        heading: "Um empório onde se come e se leva a Itália para casa",
        paragraphs: [
          "Além do restaurante, o Burrata mantém um empório gourmet anexo onde é possível comprar as massas frescas do dia, os molhos artesanais em vidro, antepastos, queijos italianos e brasileiros de altitude, vinhos selecionados e azeites importados. É o lugar ideal para montar um jantar italiano em casa ou encontrar aquele presente gastronômico especial.",
          "O ambiente mescla o rústico e o elegante: mesas de madeira, luz baixa, parede de tijolos aparentes e um jardim interno que funciona como extensão do salão nos dias mais amenos. Aos fins de semana, o brunch italiano — com focaccia, ovos, frios, frutas e espumante — é um dos programas mais concorridos da cidade.",
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

export function getArticleReadingTime(article: Article) {
  return calculateReadingTime(
    article.content
      .map((section) => `${section.heading}\n${section.paragraphs.join(" ")}`)
      .join(" "),
  );
}
