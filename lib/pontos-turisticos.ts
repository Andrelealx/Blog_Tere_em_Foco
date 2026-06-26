export type TourismType =
  | "Natureza"
  | "Gastronomia"
  | "Historico"
  | "Aventura";

export interface TourismPoint {
  id: string;
  name: string;
  description: string;
  type: TourismType;
  image: string;
  lat: number;
  lng: number;
  address: string;
}

export const tourismTypes: Array<TourismType | "Todos"> = [
  "Todos",
  "Natureza",
  "Gastronomia",
  "Historico",
  "Aventura",
];

export const tourismPoints: TourismPoint[] = [
  {
    id: "pnso",
    name: "Parque Nacional da Serra dos Órgãos",
    description:
      "Trilhas icônicas, mirantes e acesso a rotas de montanhismo para diferentes níveis.",
    type: "Natureza",
    image: "/images/explorar/parnaso.jpg",
    lat: -22.4583,
    lng: -42.9975,
    address: "Av. Rotariana, S/N - Soberbo",
  },
  {
    id: "feirinha",
    name: "Feirinha do Alto",
    description:
      "Centro tradicional de artesanato e gastronomia local com programação semanal.",
    type: "Historico",
    image: "/images/explorar/feirinha.jpg",
    lat: -22.4342,
    lng: -42.9755,
    address: "Praça Higino da Silveira - Alto",
  },
  {
    id: "comary",
    name: "Lago Comary",
    description:
      "Paisagem clássica da cidade com caminhadas leves e vista panorâmica da serra.",
    type: "Natureza",
    image: "/images/explorar/comary.jpg",
    lat: -22.4318,
    lng: -42.9818,
    address: "Granja Comary",
  },
  {
    id: "villa",
    name: "Vila St. Gallen",
    description:
      "Polo gastronômico com restaurantes, cervejaria e ambiente de montanha.",
    type: "Gastronomia",
    image: "/images/explorar/vila.jpg",
    lat: -22.4201,
    lng: -42.9904,
    address: "Estr. da Prata, 1250",
  },
  {
    id: "pedra",
    name: "Trilha da Pedra do Sino",
    description:
      "Roteiro para aventureiros com altimetria progressiva e visual premiado.",
    type: "Aventura",
    image: "/images/explorar/pedra-do-sino.jpg",
    lat: -22.434,
    lng: -43.034,
    address: "Entrada pelo PARNASO",
  },
  {
    id: "mercado",
    name: "Mercado Municipal de Teresópolis",
    description:
      "Espaço com produtores locais, empórios artesanais e culinária da serra.",
    type: "Gastronomia",
    image: "/images/explorar/mercado-municipal.jpg",
    lat: -22.4138,
    lng: -42.9665,
    address: "R. Tietê, 211 - Várzea",
  },
];
