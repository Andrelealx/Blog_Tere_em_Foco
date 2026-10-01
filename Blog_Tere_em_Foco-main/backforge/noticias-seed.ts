/**
 * @file backforge/noticias-seed.ts
 * @description Dados iniciais das notícias (seed).
 *
 * São os itens que antes estavam hardcoded em `app/noticias/page.tsx`,
 * agora persistidos no MySQL na primeira execução (ver `backforge/db.ts`).
 */

export interface NoticiaSeed {
  slug: string;
  titulo: string;
  resumo: string;
  categoria: string;
  autor: string;
  publicadoEm: string;
  imagem: string;
  tags: string[];
  destaque: boolean;
  tempoLeitura: string;
}

export const noticiasSeedItems: NoticiaSeed[] = [
  {
    slug: "prefeitura-amplia-transporte",
    titulo: "Prefeitura amplia linhas de transporte público em Teresópolis",
    resumo:
      "Novas rotas serão implementadas a partir de julho, atendendo bairros como Várzea e Granja Comary com maior frequência nos horários de pico.",
    categoria: "Mobilidade",
    autor: "Redação Terê em Foco",
    publicadoEm: "2026-06-18T08:00:00-03:00",
    imagem: "/images/natureza.jpg",
    tags: ["Transporte", "Prefeitura", "Mobilidade"],
    destaque: true,
    tempoLeitura: "3 min",
  },
  {
    slug: "alerta-chuvas-serra",
    titulo: "Defesa Civil emite alerta para chuvas fortes na Serra Fluminense",
    resumo:
      "Sistema de baixa pressão previsto para o fim de semana pode trazer precipitações acima de 80mm/h. Moradores de áreas de risco devem ficar atentos.",
    categoria: "Clima",
    autor: "Redação Terê em Foco",
    publicadoEm: "2026-06-17T14:30:00-03:00",
    imagem: "/images/hero-serra.jpg",
    tags: ["Clima", "Defesa Civil", "Chuvas"],
    destaque: true,
    tempoLeitura: "4 min",
  },
  {
    slug: "festival-gastronomico-julho",
    titulo: "Festival Gastronômico de Verão acontece em julho",
    resumo:
      "Evento reúne mais de 40 restaurantes locais e chefs convidados durante três fins de semana no centro histórico da cidade.",
    categoria: "Eventos",
    autor: "Redação Terê em Foco",
    publicadoEm: "2026-06-16T10:00:00-03:00",
    imagem: "/images/gastronomia.jpg",
    tags: ["Gastronomia", "Eventos", "Turismo"],
    destaque: false,
    tempoLeitura: "2 min",
  },
  {
    slug: "obras-av-rotariana",
    titulo: "Obras na Avenida Rotariana causam interdições temporárias",
    resumo:
      "Trabalhos de recapeamento e melhoria do sistema de drenagem pluvial previstos para durar 45 dias. Vias alternativas indicadas pela SETRAN.",
    categoria: "Obras & Infraestrutura",
    autor: "Redação Terê em Foco",
    publicadoEm: "2026-06-15T09:15:00-03:00",
    imagem: "/images/historia.jpg",
    tags: ["Obras", "Trânsito", "Infraestrutura"],
    destaque: false,
    tempoLeitura: "3 min",
  },
  {
    slug: "parnaso-premio-ambiental",
    titulo: "PARNASO recebe prêmio nacional de conservação ambiental",
    resumo:
      "O Parque Nacional da Serra dos Órgãos foi reconhecido pelo Ministério do Meio Ambiente por suas iniciativas de ecoturismo sustentável.",
    categoria: "Meio Ambiente",
    autor: "Redação Terê em Foco",
    publicadoEm: "2026-06-14T11:00:00-03:00",
    imagem: "/images/parnaso.jpg",
    tags: ["PARNASO", "Meio Ambiente", "Prêmio"],
    destaque: false,
    tempoLeitura: "5 min",
  },
  {
    slug: "projeto-leitura-escolas",
    titulo: "Escolas municipais lançam projeto de incentivo à leitura",
    resumo:
      "Programa 'Ler para Crescer' distribui livros e cria bibliotecas comunitárias em 12 unidades escolares, beneficiando mais de 5 mil alunos.",
    categoria: "Educação",
    autor: "Redação Terê em Foco",
    publicadoEm: "2026-06-13T08:30:00-03:00",
    imagem: "/images/cultura.jpg",
    tags: ["Educação", "Leitura", "Escolas"],
    destaque: false,
    tempoLeitura: "4 min",
  },
  {
    slug: "feira-artesanato-agosto",
    titulo: "Feira de Artesanato Serra tem edição especial em agosto",
    resumo:
      "Edição especial de inverno promete reunir mais de 200 expositores de toda a região serrana.",
    categoria: "Eventos",
    autor: "Redação Terê em Foco",
    publicadoEm: "2026-06-12T07:00:00-03:00",
    imagem: "/images/natureza.jpg",
    tags: ["Artesanato", "Cultura", "Eventos"],
    destaque: false,
    tempoLeitura: "2 min",
  },
  {
    slug: "nova-upa-bairro-alto",
    titulo: "Nova UPA do Bairro Alto inicia atendimentos",
    resumo:
      "Unidade de Pronto Atendimento amplia a capacidade de saúde pública com 80 leitos e atendimento 24 horas.",
    categoria: "Saúde",
    autor: "Redação Terê em Foco",
    publicadoEm: "2026-06-11T10:00:00-03:00",
    imagem: "/images/historia.jpg",
    tags: ["Saúde", "UPA", "Prefeitura"],
    destaque: false,
    tempoLeitura: "3 min",
  },
];
