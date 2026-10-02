import { randomUUID } from "crypto";
import type { RowDataPacket } from "mysql2/promise";
import { z } from "zod";
import type { EstabelecimentoGastronomico } from "@/lib/estabelecimentos";
import { getDb } from "./db";

interface EstabelecimentoRow extends RowDataPacket {
  id: string;
  name: string;
  description: string;
  type: "Gastronomia";
  image: string;
  lat: number | string;
  lng: number | string;
  address: string;
}

const establishmentFields = {
  name: z.string().trim().min(1, "Nome é obrigatório.").max(255),
  description: z.string().trim().min(1, "Descrição é obrigatória."),
  image: z.string().trim().max(512).optional().default(""),
  lat: z.number().finite().min(-90).max(90),
  lng: z.number().finite().min(-180).max(180),
  address: z.string().trim().min(1, "Endereço é obrigatório.").max(512),
};

export const estabelecimentoSchema = z.object(establishmentFields);

export const estabelecimentoUpdateSchema = z
  .object({
    name: establishmentFields.name.optional(),
    description: establishmentFields.description.optional(),
    image: z.string().trim().max(512).optional(),
    lat: establishmentFields.lat.optional(),
    lng: establishmentFields.lng.optional(),
    address: establishmentFields.address.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Informe ao menos um campo para atualizar.",
  });

export type EstabelecimentoCreateInput = z.infer<typeof estabelecimentoSchema>;
export type EstabelecimentoUpdateInput = z.infer<
  typeof estabelecimentoUpdateSchema
>;

function mapRow(row: EstabelecimentoRow): EstabelecimentoGastronomico {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    type: "Gastronomia",
    image: row.image,
    lat: Number(row.lat),
    lng: Number(row.lng),
    address: row.address,
  };
}

export async function listarEstabelecimentos(): Promise<
  EstabelecimentoGastronomico[]
> {
  const db = await getDb();
  const [rows] = await db.query<EstabelecimentoRow[]>(
    "SELECT * FROM estabelecimentos_gastronomicos ORDER BY name ASC",
  );
  return rows.map(mapRow);
}

export async function getEstabelecimentoPorId(
  id: string,
): Promise<EstabelecimentoGastronomico | null> {
  const db = await getDb();
  const [rows] = await db.query<EstabelecimentoRow[]>(
    "SELECT * FROM estabelecimentos_gastronomicos WHERE id = ?",
    [id],
  );
  return rows[0] ? mapRow(rows[0]) : null;
}

export async function criarEstabelecimento(
  data: EstabelecimentoCreateInput,
): Promise<EstabelecimentoGastronomico> {
  const db = await getDb();
  const id = randomUUID();

  await db.query(
    `INSERT INTO estabelecimentos_gastronomicos
      (id, name, description, type, image, lat, lng, address)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      data.name,
      data.description,
      "Gastronomia",
      data.image ?? "",
      data.lat,
      data.lng,
      data.address,
    ],
  );

  const estabelecimento = await getEstabelecimentoPorId(id);
  if (!estabelecimento) {
    throw new Error("Falha ao recuperar o estabelecimento recém-criado.");
  }
  return estabelecimento;
}

export async function atualizarEstabelecimento(
  id: string,
  data: EstabelecimentoUpdateInput,
): Promise<EstabelecimentoGastronomico | null> {
  const db = await getDb();
  const existente = await getEstabelecimentoPorId(id);
  if (!existente) return null;

  const campos: string[] = [];
  const valores: unknown[] = [];

  if (data.name !== undefined) {
    campos.push("name = ?");
    valores.push(data.name);
  }
  if (data.description !== undefined) {
    campos.push("description = ?");
    valores.push(data.description);
  }
  if (data.image !== undefined) {
    campos.push("image = ?");
    valores.push(data.image);
  }
  if (data.lat !== undefined) {
    campos.push("lat = ?");
    valores.push(data.lat);
  }
  if (data.lng !== undefined) {
    campos.push("lng = ?");
    valores.push(data.lng);
  }
  if (data.address !== undefined) {
    campos.push("address = ?");
    valores.push(data.address);
  }

  valores.push(id);
  await db.query(
    `UPDATE estabelecimentos_gastronomicos SET ${campos.join(", ")} WHERE id = ?`,
    valores,
  );
  return getEstabelecimentoPorId(id);
}

export async function excluirEstabelecimento(id: string): Promise<boolean> {
  const db = await getDb();
  const existente = await getEstabelecimentoPorId(id);
  if (!existente) return false;

  await db.query("DELETE FROM estabelecimentos_gastronomicos WHERE id = ?", [
    id,
  ]);
  return true;
}
