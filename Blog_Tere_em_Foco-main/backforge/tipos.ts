/**
 * @file backforge/tipos.ts
 * @description DTOs compartilhados do backend (backforge).
 *
 * Arquivo apenas de tipos (sem import de runtime), para que possa ser
 * importado também pelo front-end sem puxar dependências de servidor.
 */

export interface ArtigoSecao {
  id: string;
  heading: string;
  paragraphs: string[];
}

export interface ArtigoDTO {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  author: string;
  category: string;
  subcategory: string;
  coverImage: string;
  publishedAt: string;
  location: string;
  tags: string[];
  content: ArtigoSecao[];
}

export interface CategoriaDTO {
  slug: string;
  title: string;
  icon: string;
  description: string;
}

export interface OpcaoLazerDTO {
  id: number;
  slug: string;
  title: string;
  category: string;
  description: string;
  schedule: string;
  location: string;
  tags: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface UsuarioDTO {
  id: number;
  nome: string;
  email: string;
  papel: string;
}

export interface NoticiaDTO {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  publishedAt: string;
  image: string;
  tags: string[];
  featured: boolean;
  readTime: string;
}

export interface ComentarioDTO {
  id: number;
  noticiaId: number;
  autor: string;
  texto: string;
  criadoEm: string;
}

/** Resultado padrão de listagem paginada. */
export interface ListaResult<T> {
  items: T[];
  total: number;
  pagina: number;
  limite: number;
  totalPaginas: number;
  filtros?: Record<string, string[]>;
}
